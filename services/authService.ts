
import { User } from '../types';

const API_URL = '/api';

export const authService = {
    getToken(): string | null {
        return localStorage.getItem('beliarg_token');
    },

    setToken(token: string) {
        localStorage.setItem('beliarg_token', token);
    },

    clearToken() {
        localStorage.removeItem('beliarg_token');
    },

    async register(email: string, password: string): Promise<{ user: User, token: string }> {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Registration failed');
        }

        const data = await res.json();
        this.setToken(data.token);
        return data;
    },

    async login(email: string, password: string): Promise<{ user: User, token: string }> {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Login failed');
        }

        const data = await res.json();
        this.setToken(data.token);
        return data;
    },

    async loginWithTelegram(): Promise<{ user: User, token: string }> {
        // Check if Telegram Web App is available
        if (typeof window === 'undefined' || !(window as any).Telegram?.WebApp) {
            throw new Error('Telegram Web App is not available. Please open this app from Telegram.');
        }

        const tg = (window as any).Telegram.WebApp;
        
        // Initialize Telegram Web App if not already initialized
        if (!tg.isReady) {
            tg.ready();
        }

        // Get initData from Telegram Web App
        const initData = tg.initData;
        
        if (!initData) {
            throw new Error('Telegram initData is not available');
        }

        // Send to backend for validation and authentication
        const res = await fetch(`${API_URL}/auth/telegram`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ initData })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Telegram authentication failed');
        }

        const data = await res.json();
        this.setToken(data.token);
        return data;
    },

    logout() {
        this.clearToken();
        window.location.reload();
    }
};
