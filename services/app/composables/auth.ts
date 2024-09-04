import ky from 'ky'
import { acceptHMRUpdate, defineStore } from 'pinia'

const isDev = typeof process !== "undefined" && process.env.NODE_ENV === "development";

const BACKEND = isDev ? "http://localhost:8787" : "https://ethos.lulz.workers.dev";

export const useAuthStore = defineStore('auth', {
    state: () => {
        return {
            authenticated: false,
            profile: {},
            passkey: '',
            email: '',
            apiKey: '',
            sessions: [],
        }
    },
    persist: {
        storage: persistedState.localStorage,
    },
    getters: {
        isAuthenticated: (state) => {
            return state.authenticated;
        },
        getProfile: (state) => {
            return state.profile;
        },
        getEmail: (state) => {
            return state.email;
        },
        getPassKey: (state) => {
            return state.passkey;
        },
        getApiKey: (state) => {
            return state.apiKey;
        },
        getSessions: (state) => {
            return state.sessions;
        }
    },
    actions: {
        setProfile(profile: object) {
            this.profile = profile;
        },
        setEmail(email: string) {
            this.email = email;
        },
        setPassKey(passkey: string) {
            this.passkey = passkey;
        },
        setApiKey(apiKey: string) {
            this.apiKey = apiKey;
        },
        setAuthenticated(status: boolean) {
            this.authenticated = status;
        },
        setSessions(sessions: []) {
            this.sessions = sessions;
        },
        async fetchDataFromBackend() {
            try {
              const response: any = await ky.get(`${BACKEND}/profile?email=${this.email}&apiKey=${this.apiKey}`).json()
              const { sessions } = response;
              this.setSessions(sessions);
            } catch (error) {
              console.error('Error fetching data from backend:', error)
            }
          },      
        logout() {
            this.authenticated = false;
            this.profile = {};
            this.apiKey = '';
            this.email = '';
            this.sessions = [];
        },
    },
})

if (import.meta.hot) { import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot)) }