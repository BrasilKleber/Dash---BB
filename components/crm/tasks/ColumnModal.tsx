
import React, { useState } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { KanbanColumn, TaskStatus } from '../../../types/crm';
import { ColorPicker } from '../shared/ColorPicker';

interface ColumnModalProps {
  column: KanbanColumn | null;
  existingColumns: KanbanColumn[];
  onSave: (column: KanbanColumn) => void;
  onDelete?: (columnId: string) => void;
  onClose: () => void;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'doing', label: 'Em Progresso' },
  { value: 'review', label: 'Revisão Interna' },
  { value: 'client-review', label: 'Revisão Cliente' },
  { value: 'approved', label: 'Aprovado' },
  { value: 'done', label: 'Concluído' },
];

export const ColumnModal: React.FC<ColumnModalProps> = ({ 
  column, 
  existingColumns,
  onSave, 
  onDelete,
  onClose 
}) => {
  
  const [formData, setFormData] = useState<KanbanColumn>({
    id: column?.id || Date.now().toString(),
    label: column?.label || '',
    status: column?.status || 'todo',
    color: column?.color || '#3b82f6',
    order: column?.order || existingColumns.length + 1,
    isDefault: column?.isDefault || false
  });
  
  const handleSave = () => {
    if (!formData.label.trim()) {
      alert('O nome da coluna é obrigatório');
      return;
    }
    
    onSave(formData);
  };
  
  const handleDelete = () => {
    if (formData.isDefault) {
      alert('Não podes apagar uma coluna padrão');
      return;
    }
    
    if (confirm(`Tens a certeza que queres apagar a coluna "${formData.label}"?`)) {
      onDelete?.(formData.id);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            {column ? 'Editar Coluna' : 'Nova Coluna'}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 hover:bg-slate-100 rounded-lg flex items-center justify-center transition-all"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Nome da Coluna */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Nome da Coluna *
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="Ex: Em Desenvolvimento"
              disabled={formData.isDefault}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all disabled:opacity-50"
            />
            {formData.isDefault && (
              <p className="text-xs text-slate-500 mt-2">
                ⓘ Colunas padrão não podem ter o nome alterado
              </p>
            )}
          </div>
          
          {/* Status Mapeado */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Status Mapeado *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
              disabled={formData.isDefault}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-400 transition-all disabled:opacity-50"
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-2">
              ⓘ Define qual estado da tarefa esta coluna representa
            </p>
          </div>
          
          {/* Color Picker */}
          <ColorPicker
            value={formData.color}
            onChange={(color) => setFormData({ ...formData, color })}
          />
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-5 border-t border-slate-200 bg-slate-50">
          
          {/* Delete Button (se não for coluna padrão) */}
          {column && !formData.isDefault && onDelete && (
            <button
              onClick={handleDelete}
              className="px-6 py-3 bg-red-50 hover:bg-red-100 border-2 border-red-200 text-red-700 rounded-xl font-bold transition-all flex items-center gap-2"
            >
              <Trash2 size={18} />
              Apagar Coluna
            </button>
          )}
          
          {(!column || formData.isDefault) && <div />}
          
          {/* Save Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white hover:bg-slate-100 border-2 border-slate-200 text-slate-700 rounded-xl font-bold transition-all"
            >
              Cancelar
            </button>
            
            <button
              onClick={handleSave}
              disabled={!formData.label.trim()}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
            >
              <Save size={20} />
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
