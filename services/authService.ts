
import { User } from '../types';

const API_URL = '/api';
const DEMO_MODE_KEY = 'beliarg_demo_mode';

// Check if we're in demo mode
export const isDemoMode = (): boolean => {
    return localStorage.getItem(DEMO_MODE_KEY) === 'true';
};

// Set demo mode
export const setDemoMode = (enabled: boolean) => {
    if (enabled) {
        localStorage.setItem(DEMO_MODE_KEY, 'true');
    } else {
        localStorage.removeItem(DEMO_MODE_KEY);
    }
};

// Generate a simple demo token (not a real JWT, just for demo)
const generateDemoToken = (): string => {
    const payload = {
        id: 'demo-user',
        email: 'admin@demo.local',
        demo: true
    };
    // Simple base64 encoding (not secure, just for demo)
    return 'demo.' + btoa(JSON.stringify(payload)) + '.token';
};

export const authService = {
    getToken(): string | null {
        return localStorage.getItem('beliarg_token');
    },

    setToken(token: string) {
        localStorage.setItem('beliarg_token', token);
    },

    clearToken() {
        localStorage.removeItem('beliarg_token');
        setDemoMode(false);
    },

    async register(email: string, password: string): Promise<{ user: User, token: string }> {
        // In demo mode, registration is not available
        if (isDemoMode()) {
            throw new Error('Registration is not available in demo mode');
        }

        let data;
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                const contentType = res.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const err = await res.json();
                    throw new Error(err.error || 'Registration failed');
                } else {
                    const errorText = await res.text();
                    throw new Error(`Registration failed: ${res.status}. ${errorText.substring(0, 100)}`);
                }
            }

            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await res.text();
                throw new Error(`Expected JSON but got: ${text.substring(0, 100)}`);
            }
            
            data = await res.json();
        } catch (error: any) {
            // If fetch fails (network error, CORS, etc.), provide helpful message
            if (error.message && error.message.includes('fetch')) {
                throw new Error('Cannot connect to server. Please check your connection.');
            }
            throw error;
        }
        this.setToken(data.token);
        setDemoMode(false);
        return data;
    },

    async login(email: string, password: string): Promise<{ user: User, token: string }> {
        // Check for demo mode (admin/admin or admin@demo.local/admin)
        if ((email === 'admin' || email === 'admin@demo.local') && password === 'admin') {
            const demoToken = generateDemoToken();
            const demoUser: User = {
                id: 'demo-user',
                email: 'admin@demo.local',
                name: 'Demo Admin'
            };
            this.setToken(demoToken);
            setDemoMode(true);
            return { user: demoUser, token: demoToken };
        }

        // Regular login
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                const contentType = res.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const err = await res.json();
                    throw new Error(err.error || 'Login failed');
                } else {
                    const errorText = await res.text();
                    throw new Error(`Login failed: ${res.status}. ${errorText.substring(0, 100)}`);
                }
            }
        } catch (error: any) {
            // If fetch fails (network error, CORS, etc.), provide helpful message
            if (error.message && error.message.includes('fetch')) {
                throw new Error('Cannot connect to server. Are you using demo mode? Try: admin@demo.local / admin');
            }
            throw error;
        }

        const data = await res.json();
        this.setToken(data.token);
        setDemoMode(false);
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
