import { Hono, Context } from "hono";
import { server } from "@passwordless-id/webauthn";
import {
  AuthenticationEncoded,
  RegistrationEncoded,
  RegistrationParsed,
} from "@passwordless-id/webauthn/src/types";
import * as jose from "jose";

type Bindings = {
  ethosdb: KVNamespace;
};

interface RequestData {
  username: string;
}

interface RegisterRequest extends RequestData {
  registration: RegistrationEncoded;
}

interface LoginRequest extends RequestData {
  authentication: AuthenticationEncoded;
}

const isDev = false;
const googleSecret = {
  client_id: "xxx",
  client_secret: "xxx"
};

const app = new Hono<{ Bindings: Bindings }>();

app.post("/verify", async (c) => {
  try {
    const credential = c.req.header("credential");
    if (!credential) return c.json({ message: "Missing credential" });

    const JWKS = jose.createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));
    const { payload } = await jose.jwtVerify(credential, JWKS, {
      issuer: 'https://accounts.google.com',
      audience: googleSecret.client_id,
    });

    if (!payload) return c.json({ message: "Invalid credential" });

    const { sub: id, given_name: name, picture, email, email_verified: isVerified } = payload;
    const profile = { id, name, picture, email };

    const user = await c.env.ethosdb.get(email, { type: "json" });
    if (user) {
      return c.json(user);
    }

    const apiKey = crypto.randomUUID();
    await c.env.ethosdb.put(email, JSON.stringify({ profile, isVerified, apiKey }));

    return c.json({ profile, isVerified, apiKey });
  } catch (error) {
    return c.json({ message: "Error verifying token", error });
  }
});

async function extractRequestData<T extends RegisterRequest | LoginRequest>(
  c: Context,
  requestType: "register" | "login"
): Promise<T | null> {
  try {
    const data = await c.req.json();
    if (!data) return null;

    if (requestType === "register" && data.registration) {
      return data as T;
    }

    if (requestType === "login" && data.authentication) {
      return data as T;
    }

    return null;
  } catch (error) {
    console.error("Error parsing request data:", error);
    return null;
  }
}

app.post("/register/challenge", async (c) => {
  const { username } = await c.req.json<RequestData>() || {};
  if (!username) return c.json({ message: "Missing email" });

  const user = await c.env.ethosdb.get(username, { type: "json" });
  if (user?.credentials?.length > 0) {
    return c.json({ message: "An account with this email already exists." });
  }

  const challenge = crypto.randomUUID();
  await c.env.ethosdb.put(username, JSON.stringify({ challenge }));

  return c.json({ challenge });
});

app.post("/register/verify", async (c) => {
  const data = await extractRequestData<RegisterRequest>(c, "register");
  if (!data) return c.json({ message: "Missing registration data" });

  const user = await c.env.ethosdb.get(data.registration.username, { type: "json" });
  if (!user || !user.challenge) return c.json({ message: "Challenge expired or not found" });

  try {
    const registrationParsed: RegistrationParsed = await server.verifyRegistration(data.registration, {
      challenge: user.challenge,
      origin: isDev ? "http://localhost:3000" : "https://ethosai.one",
    });

    user.credentials = user.credentials || [];
    user.credentials.push(registrationParsed);
    delete user.challenge;

    await c.env.ethosdb.put(data.registration.username, JSON.stringify(user));
    return c.json({ message: "Registration successful" });
  } catch (error) {
    console.error("Registration verification error:", error);
    return c.json({ error: "Registration failed" });
  }
});

app.post("/login/challenge", async (c) => {
  const { username } = await c.req.json<RequestData>() || {};
  if (!username) return c.json({ message: "Missing username" });

  const user = await c.env.ethosdb.get(username, { type: "json" });
  if (!user || !user.credentials || user.credentials.length === 0) {
    return c.json({ message: "User not found" });
  }

  const challenge = crypto.randomUUID();
  await c.env.ethosdb.put(username, JSON.stringify({ ...user, challenge }));

  return c.json({
    challenge,
    credentialIds: user.credentials.map((cred) => cred.credential.id),
  });
});

app.post("/login/verify", async (c) => {
  const data = await extractRequestData<LoginRequest>(c, "login");
  if (!data) return c.json({ message: "Missing authentication data" });

  const user = await c.env.ethosdb.get(data.username, { type: "json" });
  if (!user || !user.challenge || !user.credentials || user.credentials.length === 0) {
    return c.json({ message: "Challenge expired or user not found" });
  }

  const credential = user.credentials.find((cred) => cred.credential.id === data.authentication.credentialId);
  if (!credential) return c.json({ message: "Invalid credential ID" });

  try {
    await server.verifyAuthentication(data.authentication, credential.credential, {
      challenge: user.challenge,
      origin: isDev ? "http://localhost:3000" : "https://ethosai.one",
      userVerified: true,
    });

    const { profile, email_verified: isVerified, apiKey, email } = user;
    return c.json({ message: "Login successful", profile, isVerified, apiKey, email });
  } catch (error) {
    console.error("Authentication verification error:", error);
    return c.json({ error: "Authentication failed" });
  }
});

export default app;
