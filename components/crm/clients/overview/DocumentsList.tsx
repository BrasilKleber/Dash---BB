
import React from 'react';
import { FileText, Upload, Download } from 'lucide-react';
import { ClientDocument } from '../../../../types/clientHub';

interface Props {
  documents: ClientDocument[];
  clientId: string;
  onRefresh: () => void;
}

export const DocumentsList = ({ documents, clientId, onRefresh }: Props) => {
  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word')) return '📝';
    if (type.includes('excel')) return '📊';
    if (type.includes('presentation')) return '📽️';
    return '📎';
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Documentos ({documents.length})</h2>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all text-xs font-bold uppercase tracking-wider">
          <Upload className="w-3 h-3" />
          Upload
        </button>
      </div>
      
      {documents.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8 font-medium">Nenhum documento</p>
      ) : (
        <div className="space-y-2">
          {documents.map(doc => (
            <div
              key={doc.id}
              className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:shadow-sm hover:border-blue-300 transition-all bg-white group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{getFileIcon(doc.file_type)}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate text-slate-900">{doc.name}</p>
                <p className="text-[10px] text-slate-500 font-medium">
                  {formatDate(doc.uploaded_at)}
                </p>
              </div>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-all">
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
