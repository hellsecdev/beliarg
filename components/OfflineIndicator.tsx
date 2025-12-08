
import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface OfflineIndicatorProps {
  isOnline: boolean;
  isSyncing: boolean;
  lang: Language;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ isOnline, isSyncing, lang }) => {
  const t = translations[lang];

  if (isOnline && !isSyncing) {
    return null; // Don't show anything when online and not syncing
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`
        bg-bg-panel border px-4 py-2 rounded-sm shadow-lg
        ${isOnline ? 'border-hell-gold' : 'border-red-500'}
        flex items-center gap-2
      `}>
        {isSyncing ? (
          <>
            <div className="animate-spin text-hell-gold">⚙</div>
            <span className="text-xs text-hell-gold">
              {lang === 'ru' ? 'Синхронизация...' : lang === 'he' ? 'מסנכרן...' : 'Syncing...'}
            </span>
          </>
        ) : (
          <>
            <div className="text-red-500">⚠</div>
            <span className="text-xs text-red-500">
              {lang === 'ru' ? 'Офлайн режим' : lang === 'he' ? 'מצב לא מקוון' : 'Offline mode'}
            </span>
          </>
        )}
      </div>
    </div>
  );
};



