
import React from 'react';
import { Note, Sigil } from '../types';
import { translations, Language } from '../translations';

interface GrimoireCardProps {
  note: Note;
  sigil?: Sigil;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  lang: Language;
}

export const GrimoireCard: React.FC<GrimoireCardProps> = ({ note, sigil, onEdit, onDelete, lang }) => {
  const t = translations[lang];
  return (
    <div className="group relative bg-bg-panel border border-hell-700 p-4 transition-all hover:border-hell-gold hover:bg-hell-800/20 shadow-sm flex flex-col h-full">
      {/* Decorative 'Paper' feel */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-hell-600 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-hell-600 opacity-50"></div>

      <div className="flex justify-between items-start mb-2">
        <h3 className="font-cinzel text-lg text-hell-gold tracking-wide truncate pr-2 flex-1">{note.title}</h3>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={(e) => { e.stopPropagation(); onEdit(note); }} className="text-text-muted hover:text-text-primary transition-colors">✏️</button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(note.id); }} className="text-red-800 hover:text-red-500 transition-colors">✖</button>
        </div>
      </div>
      
      {sigil && (
          <div className="mb-3">
            <span className="text-[10px] px-1.5 py-0.5 rounded text-bg-app font-bold uppercase tracking-wider" style={{backgroundColor: sigil.color}}>
                {sigil.title}
            </span>
          </div>
      )}

      <div className="flex-1 overflow-hidden">
         <p className="font-serif text-sm text-text-secondary whitespace-pre-wrap line-clamp-[8] leading-relaxed opacity-90">
             {note.content}
         </p>
      </div>

      <div className="mt-4 pt-2 border-t border-hell-700/30 flex justify-between items-center">
          <span className="text-[9px] text-text-muted font-mono uppercase">
              {new Date(note.updatedAt).toLocaleDateString()}
          </span>
      </div>
    </div>
  );
};
