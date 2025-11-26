
import { Task, Transaction, Note, Ritual, Sigil, Theme, Language } from '../types';
import { authService } from './authService';

const USE_BACKEND = true; 
const API_URL = '/api';

// Custom error class for authentication errors
export class AuthenticationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthenticationError';
    }
}

const getHeaders = () => {
    const token = authService.getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

// Helper function to handle API responses and check for auth errors
const handleResponse = async (res: Response): Promise<any> => {
    if (res.status === 401 || res.status === 403) {
        // Clear token on authentication error
        authService.clearToken();
        throw new AuthenticationError('Authentication failed. Please login again.');
    }
    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Server error' }));
        throw new Error(error.error || 'Server error');
    }
    return await res.json();
};

export const storageService = {
    async loadAllData() {
        if (USE_BACKEND) {
            try {
                const token = authService.getToken();
                if (!token) throw new AuthenticationError("No token");

                const res = await fetch(`${API_URL}/sync`, { headers: getHeaders() });
                return await handleResponse(res);
            } catch (e) {
                console.error("Sync failed", e);
                // Re-throw authentication errors so they can be handled by the app
                if (e instanceof AuthenticationError) {
                    throw e;
                }
                // For other errors, return empty data
                return { tasks: [], transactions: [], rituals: [], notes: [], sigils: [] };
            }
        }
        // Fallback (should normally not be used in auth mode)
        return {
            tasks: JSON.parse(localStorage.getItem('beliarg_tasks') || '[]'),
            transactions: JSON.parse(localStorage.getItem('beliarg_trans') || '[]'),
            rituals: JSON.parse(localStorage.getItem('beliarg_rituals') || '[]'),
            notes: JSON.parse(localStorage.getItem('beliarg_notes') || '[]'),
            sigils: JSON.parse(localStorage.getItem('beliarg_sigils') || '[]'),
            stats: JSON.parse(localStorage.getItem('beliarg_stats') || '{}'),
            theme: localStorage.getItem('beliarg_theme') as Theme || 'dark',
            lang: localStorage.getItem('beliarg_lang') as Language || 'ru',
        };
    },

    async saveTask(task: Task) {
        if (USE_BACKEND) {
            try {
                const res = await fetch(`${API_URL}/tasks`, {
                    method: 'POST',
                    headers: getHeaders(),
                    body: JSON.stringify(task)
                });
                await handleResponse(res);
            } catch (e) {
                console.error('Error saving task:', e);
                throw e;
            }
        }
    },

    async deleteTask(id: string) {
        if (USE_BACKEND) {
            try {
                const res = await fetch(`${API_URL}/tasks/${id}`, { 
                    method: 'DELETE',
                    headers: getHeaders()
                });
                await handleResponse(res);
            } catch (e) {
                console.error('Error deleting task:', e);
                throw e;
            }
        }
    },

    async saveTransaction(trans: Transaction) {
        if (USE_BACKEND) {
            try {
                const res = await fetch(`${API_URL}/transactions`, {
                    method: 'POST',
                    headers: getHeaders(),
                    body: JSON.stringify(trans)
                });
                await handleResponse(res);
            } catch (e) {
                console.error('Error saving transaction:', e);
                throw e;
            }
        }
    },

    async deleteTransaction(id: string) {
        if (USE_BACKEND) {
            try {
                const res = await fetch(`${API_URL}/transactions/${id}`, { 
                    method: 'DELETE',
                    headers: getHeaders() 
                });
                await handleResponse(res);
            } catch (e) {
                console.error('Error deleting transaction:', e);
                throw e;
            }
        }
    },

    async saveNote(note: Note) {
        if (USE_BACKEND) {
            try {
                const res = await fetch(`${API_URL}/notes`, {
                    method: 'POST',
                    headers: getHeaders(),
                    body: JSON.stringify(note)
                });
                await handleResponse(res);
            } catch (e) {
                console.error('Error saving note:', e);
                throw e;
            }
        }
    },

    async deleteNote(id: string) {
        if (USE_BACKEND) {
            try {
                const res = await fetch(`${API_URL}/notes/${id}`, { 
                    method: 'DELETE',
                    headers: getHeaders()
                });
                await handleResponse(res);
            } catch (e) {
                console.error('Error deleting note:', e);
                throw e;
            }
        }
    },

    async saveRitual(ritual: Ritual) {
        if (USE_BACKEND) {
            try {
                const res = await fetch(`${API_URL}/rituals`, {
                    method: 'POST',
                    headers: getHeaders(),
                    body: JSON.stringify(ritual)
                });
                await handleResponse(res);
            } catch (e) {
                console.error('Error saving ritual:', e);
                throw e;
            }
        }
    },

    async saveSigil(sigil: Sigil) {
        if (USE_BACKEND) {
            try {
                const res = await fetch(`${API_URL}/sigils`, {
                    method: 'POST',
                    headers: getHeaders(),
                    body: JSON.stringify(sigil)
                });
                await handleResponse(res);
            } catch (e) {
                console.error('Error saving sigil:', e);
                throw e;
            }
        }
    },
};
