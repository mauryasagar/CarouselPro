import React from 'react';
import { TextStyle } from '../lib/types';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type, ChevronDown } from 'lucide-react';

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
    <div className="space-y-4 border-t border-gray-100 pt-4 mt-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{label} Style</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Font Size */}
        <div className="flex items-center gap-2 bg-white/50 rounded-xl px-3 py-2.5 border border-gray-200 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all shadow-sm">
           <Type className="w-4 h-4 text-purple-500" />
           <input 
             type="number" 
             value={value.fontSize || ''} 
             placeholder="Auto"
             onChange={(e) => updateStyle({ fontSize: e.target.value ? Number(e.target.value) : undefined })}
             className="w-full bg-transparent text-sm outline-none font-bold"
           />
           <span className="text-[10px] text-gray-400 font-bold select-none">PX</span>
        </div>

        {/* Color */}
        <div className="flex items-center gap-2 bg-white/50 rounded-xl px-3 py-2.5 border border-gray-200 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all shadow-sm relative group">
           <div 
             className="w-5 h-5 rounded-full border-2 border-white shadow-md cursor-pointer shrink-0" 
             style={{ backgroundColor: value.color || '#000000' }}
             onClick={() => document.getElementById(`color-picker-${label}`)?.click()}
           ></div>
           <input 
             type="text" 
             value={value.color || ''} 
             placeholder="#000000"
             onChange={(e) => updateStyle({ color: e.target.value })}
             className="w-full bg-transparent text-sm outline-none font-mono font-bold"
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

      <div className="flex flex-col gap-3">
        {/* Style Toggles */}
        <div className="flex bg-gray-100/50 rounded-xl border border-gray-200/50 p-1 gap-1">
          <button 
            onClick={() => updateStyle({ fontWeight: value.fontWeight === 'bold' ? 'normal' : 'bold' })}
            className={`p-2.5 rounded-lg flex-1 flex justify-center hover:bg-white transition-all ${value.fontWeight === 'bold' ? 'bg-white shadow-md text-purple-600' : 'text-gray-500'}`}
            title="Bold"
          >
            <Bold className="w-5 h-5" />
          </button>
          <button 
            onClick={() => updateStyle({ fontStyle: value.fontStyle === 'italic' ? 'normal' : 'italic' })}
            className={`p-2.5 rounded-lg flex-1 flex justify-center hover:bg-white transition-all ${value.fontStyle === 'italic' ? 'bg-white shadow-md text-purple-600' : 'text-gray-500'}`}
            title="Italic"
          >
            <Italic className="w-5 h-5" />
          </button>
          <button 
            onClick={() => updateStyle({ textDecoration: value.textDecoration === 'underline' ? 'none' : 'underline' })}
            className={`p-2.5 rounded-lg flex-1 flex justify-center hover:bg-white transition-all ${value.textDecoration === 'underline' ? 'bg-white shadow-md text-purple-600' : 'text-gray-500'}`}
            title="Underline"
          >
            <Underline className="w-5 h-5" />
          </button>
        </div>

        {/* Alignment Toggles */}
        <div className="flex bg-gray-100/50 rounded-xl border border-gray-200/50 p-1 gap-1">
          <button 
            onClick={() => updateStyle({ textAlign: 'left' })}
            className={`p-2.5 rounded-lg flex-1 flex justify-center hover:bg-white transition-all ${value.textAlign === 'left' ? 'bg-white shadow-md text-purple-600' : 'text-gray-500'}`}
            title="Align Left"
          >
            <AlignLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => updateStyle({ textAlign: 'center' })}
            className={`p-2.5 rounded-lg flex-1 flex justify-center hover:bg-white transition-all ${value.textAlign === 'center' ? 'bg-white shadow-md text-purple-600' : 'text-gray-500'}`}
            title="Align Center"
          >
            <AlignCenter className="w-5 h-5" />
          </button>
          <button 
            onClick={() => updateStyle({ textAlign: 'right' })}
            className={`p-2.5 rounded-lg flex-1 flex justify-center hover:bg-white transition-all ${value.textAlign === 'right' ? 'bg-white shadow-md text-purple-600' : 'text-gray-500'}`}
            title="Align Right"
          >
            <AlignRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Font Family Selection */}
      <div className="relative">
        <select
          value={value.fontFamily || ''}
          onChange={(e) => updateStyle({ fontFamily: e.target.value || undefined })}
          className="w-full bg-white/50 border border-gray-200 text-sm font-bold rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 appearance-none shadow-sm transition-all"
        >
          <option value="">Default Font</option>
          <option value="Inter, sans-serif">Inter (Sans)</option>
          <option value="Georgia, serif">Georgia (Serif)</option>
          <option value="JetBrains Mono, monospace">JetBrains Mono (Mono)</option>
          <option value="Playfair Display, serif">Playfair Display</option>
          <option value="Space Grotesk, sans-serif">Space Grotesk</option>
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
