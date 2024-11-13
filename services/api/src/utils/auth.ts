import { Hono, Context } from "hono";
import { server } from "@passwordless-id/webauthn";
import {
  RegistrationJSON,
  AuthenticationJSON,
  RegistrationInfo,
} from "@passwordless-id/webauthn/dist/esm/types";
import * as jose from "jose";

type Bindings = {
  ethosdb: KVNamespace;
};

interface RequestData {
  username: string;
}

interface RegisterRequest extends RequestData {
  registration: RegistrationJSON;
}

interface LoginRequest extends RequestData {
  authentication: AuthenticationJSON;
}

interface UserProfile {
  id?: string;
  name?: string;
  picture?: string;
  email?: string;
}

interface User {
  profile?: UserProfile;
  isVerified?: boolean;
  apiKey?: string;
  email?: string;
  challenge?: string;
  credentials?: RegistrationInfo[];
}

const isDev = false;
const googleSecret = {
  client_id: "xxx",
  client_secret: "xxx",
};

const authRouter = new Hono<{ Bindings: Bindings }>();

async function extractRequestData<T>(
  c: Context
): Promise<T | null> {
  try {
    const data: T = await c.req.json();
    return data;
  } catch (error) {
    console.error("Error parsing request data:", error);
    return null;
  }
}

authRouter.post("/verify", async (c) => {
  try {
    const credential = c.req.header("credential");
    if (!credential) return c.json({ message: "Missing credential" });

    const JWKS = jose.createRemoteJWKSet(
      new URL("https://www.googleapis.com/oauth2/v3/certs")
    );
    const { payload } = await jose.jwtVerify(credential, JWKS, {
      issuer: "https://accounts.google.com",
      audience: googleSecret.client_id,
    });

    if (!payload) return c.json({ message: "Invalid credential" });

    const {
      sub: id,
      given_name: name,
      picture,
      email,
      email_verified: isVerified,
    } = payload as any;
    const profile: UserProfile = { id, name, picture, email: email as string };

    const userJson = await c.env.ethosdb.get(email as string, { type: "json" });
    const user = userJson as User | null;
    if (user) return c.json(user);

    const apiKey = crypto.randomUUID();
    const newUser: User = { profile, isVerified, apiKey, email };
    await c.env.ethosdb.put(email as string, JSON.stringify(newUser));

    return c.json(newUser);
  } catch (error) {
    return c.json({ message: "Error verifying token", error });
  }
});

authRouter.post("/register/challenge", async (c) => {
  const data = await extractRequestData<RequestData>(c);
  const username = data?.username;
  if (!username) return c.json({ message: "Missing email" });

  const userJson = await c.env.ethosdb.get(username, { type: "json" });
  const user = userJson as User | null;
  if (user && Array.isArray(user.credentials) && user.credentials.length > 0) {
    return c.json({ message: "An account with this email already exists." });
  }

  const challenge = crypto.randomUUID();
  const newUser: User = { ...user, challenge };
  await c.env.ethosdb.put(username, JSON.stringify(newUser));

  return c.json({ challenge });
});

authRouter.post("/register/verify", async (c) => {
  const data = await extractRequestData<RegisterRequest>(c);
  if (!data || !data.registration)
    return c.json({ message: "Missing registration data" });

  const userJson = await c.env.ethosdb.get(data.registration.user.name, {
    type: "json",
  });
  const user = userJson as User | null;
  if (!user || !user.challenge)
    return c.json({ message: "Challenge expired or not found" });

  try {
    const registrationInfo: RegistrationInfo =
      await server.verifyRegistration(data.registration, {
        challenge: user.challenge,
        origin: isDev ? "http://localhost:3000" : "https://ethosai.one"
      });

    user.credentials = user.credentials || [];
    user.credentials.push(registrationInfo);
    delete user.challenge;

    await c.env.ethosdb.put(
      data.registration.user.name,
      JSON.stringify(user)
    );
    return c.json({ message: "Registration successful" });
  } catch (error) {
    console.error("Registration verification error:", error);
    return c.json({ error: "Registration failed" });
  }
});

authRouter.post("/login/challenge", async (c) => {
  const data = await extractRequestData<RequestData>(c);
  const username = data?.username;
  if (!username) return c.json({ message: "Missing username" });

  const userJson = await c.env.ethosdb.get(username, { type: "json" });
  const user = userJson as User | null;
  if (!user || !user.credentials || user.credentials.length === 0) {
    return c.json({ message: "User not found" });
  }

  const challenge = crypto.randomUUID();
  user.challenge = challenge;
  await c.env.ethosdb.put(username, JSON.stringify(user));

  return c.json({
    challenge,
    credentialIds: user.credentials.map(
      (cred) => cred.credential.id as string
    ),
  });
});

authRouter.post("/login/verify", async (c) => {
  const data = await extractRequestData<LoginRequest>(c);
  if (!data || !data.authentication)
    return c.json({ message: "Missing authentication data" });

  const userJson = await c.env.ethosdb.get(data.username, { type: "json" });
  const user = userJson as User | null;
  if (
    !user ||
    !user.challenge ||
    !user.credentials ||
    user.credentials.length === 0
  ) {
    return c.json({ message: "Challenge expired or user not found" });
  }

  const credential = user.credentials.find(
    (cred) => cred.credential.id === data.authentication.id
  );
  if (!credential) return c.json({ message: "Invalid credential ID" });

  try {
    await server.verifyAuthentication(
      data.authentication,
      credential.credential,
      {
        challenge: user.challenge,
        origin: isDev ? "http://localhost:3000" : "https://ethosai.one",
        userVerified: true,
      }
    );

    const { profile, isVerified, apiKey, email } = user;
    return c.json({
      message: "Login successful",
      profile,
      isVerified,
      apiKey,
      email,
    });
  } catch (error) {
    console.error("Authentication verification error:", error);
    return c.json({ error: "Authentication failed" });
  }
});

export default authRouter;