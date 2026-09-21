
import React from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = [
  { name: 'Slate', hex: '#64748b' },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Orange', hex: '#f59e0b' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Green', hex: '#10b981' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Teal', hex: '#14b8a6' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'Pink', hex: '#ec4899' },
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        Cor da Coluna
      </label>
      
      {/* Cor Atual */}
      <div className="flex items-center gap-3 mb-3 p-3 bg-slate-50 rounded-lg">
        <div 
          className="w-12 h-12 rounded-lg border-2 border-slate-200"
          style={{ backgroundColor: value }}
        />
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-500 uppercase">Cor Selecionada</p>
          <p className="text-sm font-bold text-slate-900">{value}</p>
        </div>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-12 rounded-lg cursor-pointer"
        />
      </div>
      
      {/* Cores Pré-definidas */}
      <p className="text-xs font-bold text-slate-500 uppercase mb-2">Cores Sugeridas</p>
      <div className="grid grid-cols-6 gap-2">
        {PRESET_COLORS.map(color => (
          <button
            key={color.hex}
            onClick={() => onChange(color.hex)}
            className={`w-full h-10 rounded-lg border-2 transition-all hover:scale-110 ${
              value === color.hex ? 'border-slate-900 ring-2 ring-slate-900/20' : 'border-slate-200'
            }`}
            style={{ backgroundColor: color.hex }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
};
