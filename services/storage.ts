
import { Task, Transaction, Note, Ritual, Sigil, Theme, Language } from '../types';
import { authService } from './authService';

const USE_BACKEND = true; 
const API_URL = 'http://localhost:3000/api';

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
            await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(task)
            });
        }
    },

    async deleteTask(id: string) {
        if (USE_BACKEND) {
            await fetch(`${API_URL}/tasks/${id}`, { 
                method: 'DELETE',
                headers: getHeaders()
            });
        }
    },

    async saveTransaction(trans: Transaction) {
        if (USE_BACKEND) {
            await fetch(`${API_URL}/transactions`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(trans)
            });
        }
    },

    async deleteTransaction(id: string) {
        if (USE_BACKEND) {
            await fetch(`${API_URL}/transactions/${id}`, { 
                method: 'DELETE',
                headers: getHeaders() 
            });
        }
    },

    async saveNote(note: Note) {
        if (USE_BACKEND) {
             await fetch(`${API_URL}/notes`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(note)
            });
        }
    },

    async deleteNote(id: string) {
        if (USE_BACKEND) {
             await fetch(`${API_URL}/notes/${id}`, { 
                 method: 'DELETE',
                 headers: getHeaders()
             });
        }
    },

    async saveRitual(ritual: Ritual) {
        if (USE_BACKEND) {
            await fetch(`${API_URL}/rituals`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(ritual)
            });
        }
    },

    async saveSigil(sigil: Sigil) {
        if (USE_BACKEND) {
            await fetch(`${API_URL}/sigils`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(sigil)
            });
        }
    },
};
