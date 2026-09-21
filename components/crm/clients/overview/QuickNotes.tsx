
import React, { useState } from 'react';
import { StickyNote, Plus, Pin } from 'lucide-react';
import { QuickNote } from '../../../../types/clientHub';

interface Props {
  notes: QuickNote[];
  clientId: string;
  onRefresh: () => void;
}

export const QuickNotes = ({ notes, clientId, onRefresh }: Props) => {
  const [newNote, setNewNote] = useState('');
  
  const handleAddNote = () => {
    if (!newNote.trim()) return;
    // Em produção chamaria a API
    console.log('Adicionar nota:', newNote);
    setNewNote('');
    onRefresh();
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
          <StickyNote className="w-4 h-4 text-yellow-600" />
        </div>
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Notas Rápidas</h3>
      </div>
      
      {/* Nova Nota */}
      <div className="mb-4">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Escrever nota rápida..."
          className="w-full text-xs font-medium border-2 border-slate-200 rounded-lg p-3 focus:outline-none focus:border-blue-400 transition-all bg-slate-50 focus:bg-white resize-none"
          rows={3}
        />
        <button
          onClick={handleAddNote}
          className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-xs font-bold uppercase tracking-wide shadow-sm active:scale-95"
        >
          <Plus className="w-3 h-3" />
          Adicionar Nota
        </button>
      </div>
      
      {/* Lista de Notas */}
      <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
        {notes.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4 font-medium">Nenhuma nota ainda</p>
        ) : (
          notes.map(note => (
            <div
              key={note.id}
              className={`p-3 rounded-lg border ${
                note.pinned 
                  ? 'bg-yellow-50 border-yellow-200' 
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs text-slate-700 font-medium leading-relaxed flex-1">{note.content}</p>
                {note.pinned && <Pin className="w-3 h-3 text-yellow-600 flex-shrink-0 mt-0.5" />}
              </div>
              <p className="text-[10px] text-slate-400 font-bold mt-2 border-t border-slate-100 pt-1 uppercase tracking-wider">
                {formatDate(note.created_at)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
