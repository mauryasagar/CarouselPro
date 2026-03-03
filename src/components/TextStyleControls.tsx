import React from 'react';
import { TextStyle } from '../lib/types';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type } from 'lucide-react';

interface TextStyleControlsProps {
  label: string;
  value?: TextStyle;
  onChange: (style: TextStyle) => void;
}

export function TextStyleControls({ label, value = {}, onChange }: TextStyleControlsProps) {
  const updateStyle = (updates: Partial<TextStyle>) => {
    onChange({ ...value, ...updates });
  };

  return (
    <div className="space-y-3 border-t border-gray-100 pt-3 mt-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label} Style</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {/* Font Size */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
           <Type className="w-4 h-4 text-gray-400" />
           <input 
             type="number" 
             value={value.fontSize || ''} 
             placeholder="Auto"
             onChange={(e) => updateStyle({ fontSize: e.target.value ? Number(e.target.value) : undefined })}
             className="w-full bg-transparent text-sm outline-none font-mono"
           />
           <span className="text-[10px] text-gray-400 select-none">px</span>
        </div>

        {/* Color */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all relative group">
           <div 
             className="w-4 h-4 rounded-full border border-gray-300 shadow-sm cursor-pointer" 
             style={{ backgroundColor: value.color || 'transparent' }}
             onClick={() => document.getElementById(`color-picker-${label}`)?.click()}
           ></div>
           <input 
             type="text" 
             value={value.color || ''} 
             placeholder="Font Colors"
             onChange={(e) => updateStyle({ color: e.target.value })}
             className="w-full bg-transparent text-sm outline-none font-mono"
           />
           <input 
             id={`color-picker-${label}`}
             type="color" 
             value={value.color?.startsWith('#') ? value.color : '#000000'} 
             onChange={(e) => updateStyle({ color: e.target.value })}
             className="absolute opacity-0 w-0 h-0 pointer-events-none"
           />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        {/* Style Toggles */}
        <div className="flex bg-gray-50 rounded-lg border border-gray-200 p-1 gap-1 flex-1 justify-center">
          <button 
            onClick={() => updateStyle({ fontWeight: value.fontWeight === 'bold' ? 'normal' : 'bold' })}
            className={`p-1.5 rounded-md flex-1 flex justify-center hover:bg-white hover:shadow-sm transition-all ${value.fontWeight === 'bold' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button 
            onClick={() => updateStyle({ fontStyle: value.fontStyle === 'italic' ? 'normal' : 'italic' })}
            className={`p-1.5 rounded-md flex-1 flex justify-center hover:bg-white hover:shadow-sm transition-all ${value.fontStyle === 'italic' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button 
            onClick={() => updateStyle({ textDecoration: value.textDecoration === 'underline' ? 'none' : 'underline' })}
            className={`p-1.5 rounded-md flex-1 flex justify-center hover:bg-white hover:shadow-sm transition-all ${value.textDecoration === 'underline' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </button>
        </div>

        {/* Alignment Toggles */}
        <div className="flex bg-gray-50 rounded-lg border border-gray-200 p-1 gap-1 flex-1 justify-center">
          <button 
            onClick={() => updateStyle({ textAlign: 'left' })}
            className={`p-1.5 rounded-md flex-1 flex justify-center hover:bg-white hover:shadow-sm transition-all ${value.textAlign === 'left' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => updateStyle({ textAlign: 'center' })}
            className={`p-1.5 rounded-md flex-1 flex justify-center hover:bg-white hover:shadow-sm transition-all ${value.textAlign === 'center' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button 
            onClick={() => updateStyle({ textAlign: 'right' })}
            className={`p-1.5 rounded-md flex-1 flex justify-center hover:bg-white hover:shadow-sm transition-all ${value.textAlign === 'right' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Font Family Selection */}
      <div className="relative">
        <select
          value={value.fontFamily || ''}
          onChange={(e) => updateStyle({ fontFamily: e.target.value || undefined })}
          className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-black focus:ring-1 focus:ring-black appearance-none"
        >
          <option value="">Default Font</option>
          <option value="Inter, sans-serif">Inter</option>
          <option value="Times New Roman, serif">Times New Roman</option>
          <option value="Courier New, monospace">Courier New</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="Verdana, sans-serif">Verdana</option>
          <option value="Arial, sans-serif">Arial</option>
          <option value="Impact, sans-serif">Impact</option>
          <option value="Comic Sans MS, cursive">Comic Sans MS</option>
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>
    </div>
  );
}
