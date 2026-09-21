import React, { useState } from 'react';
import { Plus, Settings, Edit, Trash2, X } from 'lucide-react';
import { KanbanColumn } from '../../../types/crm';
import { ColumnModal } from './ColumnModal';

interface ColumnManagerProps {
  columns: KanbanColumn[];
  onUpdateColumns: (columns: KanbanColumn[]) => void;
  onClose: () => void;
}

export const ColumnManager: React.FC<ColumnManagerProps> = ({ 
  columns, 
  onUpdateColumns,
  onClose 
}) => {
  
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<KanbanColumn | null>(null);
  const [localColumns, setLocalColumns] = useState<KanbanColumn[]>([...columns]);
  
  const handleAddColumn = () => {
    setSelectedColumn(null);
    setShowColumnModal(true);
  };
  
  const handleEditColumn = (column: KanbanColumn) => {
    setSelectedColumn(column);
    setShowColumnModal(true);
  };
  
  const handleSaveColumn = (column: KanbanColumn) => {
    const existingIndex = localColumns.findIndex(c => c.id === column.id);
    
    if (existingIndex !== -1) {
      // Editar
      const updated = [...localColumns];
      updated[existingIndex] = column;
      setLocalColumns(updated);
    } else {
      // Adicionar
      setLocalColumns([...localColumns, column]);
    }
    
    setShowColumnModal(false);
  };
  
  const handleDeleteColumn = (columnId: string) => {
    const updated = localColumns.filter(c => c.id !== columnId);
    setLocalColumns(updated);
    setShowColumnModal(false);
  };
  
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...localColumns];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    // Atualiza order
    updated.forEach((col, i) => col.order = i + 1);
    setLocalColumns(updated);
  };
  
  const handleMoveDown = (index: number) => {
    if (index === localColumns.length - 1) return;
    const updated = [...localColumns];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    // Atualiza order
    updated.forEach((col, i) => col.order = i + 1);
    setLocalColumns(updated);
  };
  
  const handleSave = () => {
    onUpdateColumns(localColumns);
    onClose();
  };
  
  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <Settings size={24} className="text-blue-500" />
              <div>
                <h2 className="text-xl font-bold text-slate-900">Gerir Colunas do Kanban</h2>
                <p className="text-sm text-slate-600">Personaliza as colunas desta campanha</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-9 h-9 hover:bg-slate-100 rounded-lg flex items-center justify-center transition-all"
            >
              <X size={20} className="text-slate-600" />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            
            {/* Add Column Button */}
            <button
              onClick={handleAddColumn}
              className="w-full p-4 border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 rounded-xl text-slate-600 hover:text-blue-600 font-semibold transition-all flex items-center justify-center gap-2 mb-6"
            >
              <Plus size={20} />
              Adicionar Nova Coluna
            </button>
            
            {/* Columns List */}
            <div className="space-y-3">
              {localColumns.map((column, index) => (
                <div
                  key={column.id}
                  className="bg-slate-50 rounded-xl border-2 border-slate-200 p-4 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center gap-3">
                    
                    {/* Drag Handle */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="w-8 h-6 flex items-center justify-center hover:bg-slate-200 rounded disabled:opacity-30 transition-all text-xs"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === localColumns.length - 1}
                        className="w-8 h-6 flex items-center justify-center hover:bg-slate-200 rounded disabled:opacity-30 transition-all text-xs"
                      >
                        ▼
                      </button>
                    </div>
                    
                    {/* Color */}
                    <div 
                      className="w-4 h-16 rounded-lg"
                      style={{ backgroundColor: column.color }}
                    />
                    
                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-900">{column.label}</h4>
                        {column.isDefault && (
                          <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-xs font-bold uppercase">
                            Padrão
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">
                        Status: <span className="font-semibold">{column.status}</span> · 
                        Ordem: <span className="font-semibold">{column.order}</span>
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditColumn(column)}
                        className="w-9 h-9 bg-white hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-300 rounded-lg flex items-center justify-center text-slate-600 hover:text-blue-600 transition-all"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      
                      {!column.isDefault && (
                        <button
                          onClick={() => {
                            if (confirm(`Apagar coluna "${column.label}"?`)) {
                              handleDeleteColumn(column.id);
                            }
                          }}
                          className="w-9 h-9 bg-white hover:bg-red-50 border-2 border-slate-200 hover:border-red-300 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-600 transition-all"
                          title="Apagar"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {localColumns.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <Settings size={48} className="mx-auto mb-4 opacity-50" />
                <p>Ainda não há colunas configuradas</p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-5 border-t border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-600">
              {localColumns.length} {localColumns.length === 1 ? 'coluna configurada' : 'colunas configuradas'}
            </p>
            
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-white hover:bg-slate-100 border-2 border-slate-200 text-slate-700 rounded-xl font-bold transition-all"
              >
                Cancelar
              </button>
              
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg"
              >
                Guardar Configuração
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Column Modal */}
      {showColumnModal && (
        <ColumnModal
          column={selectedColumn}
          existingColumns={localColumns}
          onSave={handleSaveColumn}
          onDelete={handleDeleteColumn}
          onClose={() => setShowColumnModal(false)}
        />
      )}
    </>
  );
};