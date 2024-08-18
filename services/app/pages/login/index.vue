<script>
import { ref } from "vue";
import ky from "ky";
import {
    // useCodeClient,
    useOneTap,
} from "vue3-google-signin";
import { client } from "@passwordless-id/webauthn";
import { useAuthStore } from '@/composables/auth';

export default {
    setup() {
        const authStore = useAuthStore();
        const email = ref("");
        const isLoading = ref(false);

        const isDev =
            typeof process !== "undefined" && process.env.NODE_ENV === "development";

        const endpoint = isDev
            ? "http://localhost:8787/auth"
            : "https://ethos.lulz.workers.dev/auth";

        if (authStore.isAuthenticated) {
            navigateTo('/dashboard');
        } else {
            useOneTap({
                onSuccess: async (credentialData) => {

                    const { credential } = credentialData;

                    const response = await verify(credential);

                    const {
                        profile,
                        isVerified,
                        apiKey,
                        email,
                        message
                    } = response;

                    if (message) {
                        alert(message);
                        return;
                    }

                    if (isVerified === true) {
                        authStore.setAuthenticated(true);
                        authStore.setProfile(profile);
                        authStore.setApiKey(apiKey);
                        authStore.setEmail(email);

                        navigateTo('/dashboard');
                    } else {
                        console.error("User is not legit");
                    }
                },
                onError: () => console.error("Error with One Tap Login"),
                use_fedcm_for_prompt: true
            });
        }

        async function verify(credential) {
            try {
                const url = endpoint + '/verify';
                try {
                    const response = await ky.post(url, {
                        headers: {
                            credential,
                        },
                    }).json();

                    return response;
                } catch (error) {
                    console.error(error);
                }
            } catch (error) {
                console.error("Error communicating with backend:", error);
            }
        }


        // const handleOnSuccess = async (response) => {
        //     // console.log("Code: ", response.code);
        //     // handleGoogleSignInCallback(response.code);
        //     console.log("Handle the response", response);
        // };

        // const handleOnError = (errorResponse) => {
        //     console.log("Error: ", errorResponse);
        // };

        // const { isReady, login } = useCodeClient({
        //     onSuccess: handleOnSuccess,
        //     onError: handleOnError,
        //     // other options
        // });


        const loading = {
            start: () => {
                isLoading.value = true;
            },
            stop: () => {
                isLoading.value = false;
            },
        };

        const isValidEmail = (email) => {
            return email.match(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        };


        const api = ky.create({ prefixUrl: endpoint });

        async function registerChallenge(email) {
            try {
                const response = await api
                    .post("register/challenge", { json: { username: email } })
                    .json();
                return response;
            } catch (error) {
                console.error("Error registering challenge:", error);
                throw error;
            }
        }

        async function registerVerify(registration) {
            try {
                const response = await api
                    .post("register/verify", { json: { registration } })
                    .json();
                return response;
            } catch (error) {
                console.error("Error verifying registration:", error);
                throw error;
            }
        }

        async function loginChallenge(email) {
            try {
                const response = await api
                    .post("login/challenge", { json: { username: email } })
                    .json();
                return response;
            } catch (error) {
                console.error("Error getting login challenge:", error);
                throw error;
            }
        }

        async function loginVerify(email, authentication) {
            try {
                const response = await api
                    .post("login/verify", { json: { username: email, authentication } })
                    .json();
                return response;
            } catch (error) {
                console.error("Error verifying login:", error);
                throw error;
            }
        }

        const register = async () => {
            loading.start();
            if (!isValidEmail(email.value)) {
                loading.stop();
                return;
            }

            try {
                const { challenge, message } = await registerChallenge(email.value.toLowerCase());
                console.log(challenge);

                if (message) {
                    alert(message);
                    loading.stop();
                    return;
                }

                const registration = await client.register(email.value.toLowerCase(), challenge);
                console.log(registration);

                await registerVerify(registration);

                loading.stop();
                alert("Registration successful!");
            } catch (error) {
                console.error("Registration failed:", error);
                loading.stop();
                alert("Registration failed, please try again");
            }
        };

        const authenticate = async () => {
            loading.start();
            if (!isValidEmail(email.value)) {
                loading.stop();
                return;
            }

            try {
                const { challenge, credentialIds, message } = await loginChallenge(
                    email.value.toLowerCase()
                );
                console.log(challenge, credentialIds);

                if (message) {
                    alert(message);
                    loading.stop();
                    return;
                }

                const authentication = await client.authenticate(credentialIds, challenge);

                console.log(authentication);

                const { profile, apiKey,
                    isVerified, message: verificationMessage } = await loginVerify(email.value.toLowerCase(), authentication);

                if (verificationMessage) {
                    if (isVerified === true) {
                        authStore.setAuthenticated(true);
                        authStore.setProfile(profile);
                        authStore.setApiKey(apiKey);
                        authStore.setEmail(email.value.toLowerCase());

                        navigateTo('/dashboard');
                    } else {
                        console.error("User is not legit");
                        alert(verificationMessage);
                    }

                    loading.stop();
                    return;
                }
            } catch (error) {
                console.error("Authentication failed:", error);
                loading.stop();
                alert("Authentication failed, please try again");
            }
        };

        return {
            email,
            register,
            authenticate,
            // isReady,
            // login,
            isLoading,
        };
    },
};
</script>

<template>
    <div class="relative bg-gradient-to-bl from-blue-100 via-transparent dark:from-blue-950 dark:via-transparent">
        <Header />
        <div class="max-w-full px-12 py-10 sm:px-6 lg:px-24 lg:py-32 mx-auto flex items-center justify-center">
            <div class="grid items-center md:grid-cols-2 gap-8 lg:gap-12">
                <div>
                    <div class="mt-4 md:mb-12 max-w-2xl">
                        <h2 class="mb-4 font-semibold text-gray-800 text-4xl lg:text-4xl dark:text-gray-200">
                            Get started with Ethos AI
                        </h2>
                        <!-- <p class="text-gray-600 dark:text-gray-400">
                            misson statement
                        </p> -->
                    </div>
                </div>

                <div>
                    <form>
                        <div class="lg:max-w-lg lg:mx-auto lg:me-0 ms-auto">
                            <div
                                class="p-4 sm:p-7 flex flex-col max-w-md bg-white rounded-2xl shadow-lg dark:bg-dark-400">

                                <div class="mt-3">

                                    <!-- <button type="button" :disabled="!isReady" @click="() => login()"
                                        class="w-full py-3 px-4 mb-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-dark-200 dark:border-dark dark:text-white dark:hover:bg-dark-300 dark:focus:outline-none dark:focus:ring-none dark:focus:ring-none">
                                        <svg class="w-4 h-auto" width="46" height="47" viewBox="0 0 46 47" fill="none">
                                            <path
                                                d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
                                                fill="#4285F4"></path>
                                            <path
                                                d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
                                                fill="#34A853"></path>
                                            <path
                                                d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
                                                fill="#FBBC05"></path>
                                            <path
                                                d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
                                                fill="#EB4335"></path>
                                        </svg>
                                        Sign in with Google
                                    </button> -->

                                    <div v-if="isLoading" class="mb-4 min-w-xs">
                                        <div class="text-center mt-5">
                                            <div class="lds-ripple">
                                                <div></div>
                                                <div></div>
                                            </div>
                                        </div>
                                        <div class="animate-pulse text-center py-4">please wait...</div>
                                    </div>
                                    <div v-else>
                                        <form>
                                            <input type="email" v-model="email" placeholder="your best email" autofocus
                                                required autocomplete="username webauthn"
                                                class="mb-4 min-w-xs w-full px-3 py-2 border dark:bg-gray-300 dark:text-black border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-dark" />

                                            <button type="submit"
                                                class="bg-dark text-light hover:bg-dark-200 dark:bg-dark-100 dark:text-light hover:dark:bg-dark-200 font-semibold py-2 px-4 rounded-full mb-4 w-full"
                                                @click="register">
                                                Sign up
                                            </button>

                                            <div class="text-center text-dark dark:text-light">OR</div>

                                            <button @click="authenticate"
                                                class="bg-violet-700 hover:bg-violet-600 w-full text-white font-semibold py-2 px-4 rounded-full mt-4">
                                                Sign in with passkey
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <Footer />
    </div>
</template>

<style>
.lds-ripple {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
}

.lds-ripple div {
    position: absolute;
    border: 4px solid lightslategray;
    opacity: 1;
    border-radius: 50%;
    animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

.lds-ripple div:nth-child(2) {
    animation-delay: -0.5s;
}

@keyframes lds-ripple {
    0% {
        top: 36px;
        left: 36px;
        width: 0;
        height: 0;
        opacity: 0;
    }

    4.9% {
        top: 36px;
        left: 36px;
        width: 0;
        height: 0;
        opacity: 0;
    }

    5% {
        top: 36px;
        left: 36px;
        width: 0;
        height: 0;
        opacity: 1;
    }

    100% {
        top: 0px;
        left: 0px;
        width: 72px;
        height: 72px;
        opacity: 0;
    }
}
</style>