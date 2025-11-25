
import { Task, Transaction, Note, Ritual, Sigil, Theme, Language } from '../types';
import { authService } from './authService';

const USE_BACKEND = true; 
const API_URL = '/api';

const getHeaders = () => {
    const token = authService.getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

export const storageService = {
    async loadAllData() {
        if (USE_BACKEND) {
            try {
                const token = authService.getToken();
                if (!token) throw new Error("No token");

                const res = await fetch(`${API_URL}/sync`, { headers: getHeaders() });
                if (!res.ok) throw new Error('Server error');
                return await res.json();
            } catch (e) {
                console.error("Sync failed", e);
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
                if (!res.ok) {
                    const error = await res.json().catch(() => ({ error: 'Failed to save task' }));
                    console.error('Failed to save task:', error);
                    throw new Error(error.error || 'Failed to save task');
                }
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
                if (!res.ok) {
                    const error = await res.json().catch(() => ({ error: 'Failed to delete task' }));
                    console.error('Failed to delete task:', error);
                    throw new Error(error.error || 'Failed to delete task');
                }
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
                if (!res.ok) {
                    const error = await res.json().catch(() => ({ error: 'Failed to save transaction' }));
                    console.error('Failed to save transaction:', error);
                    throw new Error(error.error || 'Failed to save transaction');
                }
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
                if (!res.ok) {
                    const error = await res.json().catch(() => ({ error: 'Failed to delete transaction' }));
                    console.error('Failed to delete transaction:', error);
                    throw new Error(error.error || 'Failed to delete transaction');
                }
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
                if (!res.ok) {
                    const error = await res.json().catch(() => ({ error: 'Failed to save note' }));
                    console.error('Failed to save note:', error);
                    throw new Error(error.error || 'Failed to save note');
                }
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
                if (!res.ok) {
                    const error = await res.json().catch(() => ({ error: 'Failed to delete note' }));
                    console.error('Failed to delete note:', error);
                    throw new Error(error.error || 'Failed to delete note');
                }
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
                if (!res.ok) {
                    const error = await res.json().catch(() => ({ error: 'Failed to save ritual' }));
                    console.error('Failed to save ritual:', error);
                    throw new Error(error.error || 'Failed to save ritual');
                }
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
                if (!res.ok) {
                    const error = await res.json().catch(() => ({ error: 'Failed to save sigil' }));
                    console.error('Failed to save sigil:', error);
                    throw new Error(error.error || 'Failed to save sigil');
                }
            } catch (e) {
                console.error('Error saving sigil:', e);
                throw e;
            }
        }
    },
};
