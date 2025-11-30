
interface PendingOperation {
  id: string;
  type: 'task' | 'transaction' | 'ritual' | 'note';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
}

const DB_NAME = 'beliarg_offline';
const DB_VERSION = 1;
const STORE_NAME = 'pending_operations';

let db: IDBDatabase | null = null;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const offlineStorage = {
  async addPendingOperation(operation: Omit<PendingOperation, 'id' | 'timestamp'>): Promise<string> {
    try {
      const database = await openDB();
      const transaction = database.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const pendingOp: PendingOperation = {
        id,
        ...operation,
        timestamp: Date.now()
      };

      return new Promise((resolve, reject) => {
        const request = store.add(pendingOp);
        request.onsuccess = () => resolve(id);
        request.onerror = () => reject(new Error('Failed to add pending operation'));
      });
    } catch (error) {
      console.error('Error adding pending operation:', error);
      throw error;
    }
  },

  async getPendingOperations(): Promise<PendingOperation[]> {
    try {
      const database = await openDB();
      const transaction = database.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);

      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(new Error('Failed to get pending operations'));
      });
    } catch (error) {
      console.error('Error getting pending operations:', error);
      return [];
    }
  },

  async removePendingOperation(id: string): Promise<void> {
    try {
      const database = await openDB();
      const transaction = database.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      return new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error('Failed to remove pending operation'));
      });
    } catch (error) {
      console.error('Error removing pending operation:', error);
      throw error;
    }
  },

  async clearPendingOperations(): Promise<void> {
    try {
      const database = await openDB();
      const transaction = database.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error('Failed to clear pending operations'));
      });
    } catch (error) {
      console.error('Error clearing pending operations:', error);
      throw error;
    }
  }
};

