import { defineStore } from 'pinia';
import axios from 'axios';

interface AuthState {
  token: string | null;
  userId: number | null;
  userName: string | null;
  isInitialized: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('auth_token'),
    userId: null,
    userName: null,
    isInitialized: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    async initAuth(): Promise<void> {
      if (this.token) {
        // Token exists, set it in axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        this.isInitialized = true;
        return;
      }

      // No token, get a new one
      await this.getToken();
    },

    async getToken(): Promise<void> {
      try {
        // Generate a unique device ID
        const deviceId = this.getOrCreateDeviceId();
        
        const response = await axios.post<{ token: string; user: { id: number; name: string } }>(
          '/api/auth/token',
          {},
          {
            headers: {
              'X-Device-Id': deviceId
            }
          }
        );

        this.token = response.data.token;
        this.userId = response.data.user.id;
        this.userName = response.data.user.name;

        // Store token
        localStorage.setItem('auth_token', this.token);

        // Set token in axios defaults
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        
        this.isInitialized = true;
      } catch (error) {
        console.error('Failed to get auth token:', error);
        this.isInitialized = true; // Still mark as initialized even on error
      }
    },

    getOrCreateDeviceId(): string {
      let deviceId = localStorage.getItem('device_id');
      
      if (!deviceId) {
        deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem('device_id', deviceId);
      }
      
      return deviceId;
    },

    clearAuth(): void {
      this.token = null;
      this.userId = null;
      this.userName = null;
      localStorage.removeItem('auth_token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }
});
