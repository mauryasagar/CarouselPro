export type TemplateType = 
  | 'minimalist' | 'bold' | 'professional' | 'creative' | 'corporate' 
  | 'elegant' | 'vibrant' | 'nature' | 'dark' | 'retro' | 'tech' | 'warm' | 'luxury'
  | 'sunset' | 'ocean' | 'forest' | 'berry' | 'slate' | 'midnight' | 'dawn' | 'dusk' | 'neon' | 'pastel' | 'earth' | 'sky' | 'fire' | 'ice' | 'sand' | 'stone' | 'cloud' | 'leaf' | 'rose' | 'gold' | 'silver' | 'bronze' | 'copper' | 'steel' | 'iron' | 'coal' | 'snow' | 'rain' | 'storm' | 'mist' | 'fog' | 'haze' | 'smoke' | 'ash' | 'dust' | 'clay' | 'mud' | 'dirt' | 'grass' | 'moss' | 'fern' | 'pine' | 'oak' | 'maple' | 'birch' | 'cedar' | 'willow' | 'palm' | 'cactus' | 'bamboo' | 'reed' | 'lotus' | 'lily' | 'tulip' | 'daisy' | 'poppy' | 'sunflower' | 'violet' | 'orchid' | 'iris' | 'jasmine' | 'lavender' | 'mint' | 'basil' | 'sage' | 'thyme' | 'rosemary' | 'dill' | 'cumin' | 'curry' | 'chili' | 'pepper' | 'salt' | 'sugar' | 'honey' | 'lemon' | 'lime' | 'orange' | 'apple' | 'pear' | 'peach' | 'plum' | 'grape' | 'cherry' | 'melon' | 'mango' | 'kiwi' | 'papaya' | 'guava' | 'fig' | 'date' | 'nut' | 'seed' | 'grain'
  | 'cyberpunk' | 'minimal_dark' | 'royal' | 'eco' | 'brutalist' | 'gradient_mesh'
  | 'aurora' | 'cosmic' | 'candy' | 'ocean_deep' | 'forest_mist';

export type AspectRatio = 
  | 'ratio_1_1' | 'ratio_4_5' | 'ratio_9_16' | 'ratio_16_9' 
  | 'ratio_2_3' | 'ratio_3_2' | 'ratio_3_4' | 'ratio_4_3'
  | 'ratio_1_2' | 'ratio_2_1' | 'ratio_21_9' | 'ratio_19_5_9' | 'ratio_2_39_1';

export type TextLayout = 'center' | 'left' | 'right';
export type SlideType = 'title' | 'point' | 'cta';

export interface TextStyle {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
}

export interface SlideContent {
  id: string;
  type: SlideType;
  title: string;
  titleStyle?: TextStyle;
  body: string;
  bodyStyle?: TextStyle;
  image?: string;
  imagePosition?: { x: number; y: number };
  imageScale?: number;
  imageLayer?: 'front' | 'back';
  titlePosition?: { x: number; y: number };
  bodyPosition?: { x: number; y: number };
}

export interface DesignSettings {
  template: TemplateType;
  ratio: AspectRatio;
  alignment: Record<SlideType, TextLayout>;
}

export const DIMENSIONS: Record<AspectRatio, { width: number; height: number; label: string }> = {
  ratio_1_1: { width: 1080, height: 1080, label: '1:1' },
  ratio_4_5: { width: 1080, height: 1350, label: '4:5' },
  ratio_9_16: { width: 1080, height: 1920, label: '9:16' },
  ratio_16_9: { width: 1920, height: 1080, label: '16:9' },
  ratio_2_3: { width: 1080, height: 1620, label: '2:3' },
  ratio_3_2: { width: 1620, height: 1080, label: '3:2' },
  ratio_3_4: { width: 1080, height: 1440, label: '3:4' },
  ratio_4_3: { width: 1440, height: 1080, label: '4:3' },
  ratio_1_2: { width: 1080, height: 2160, label: '1:2' },
  ratio_2_1: { width: 2160, height: 1080, label: '2:1' },
  ratio_21_9: { width: 2560, height: 1080, label: '21:9' },
  ratio_19_5_9: { width: 1080, height: 2340, label: '19.5:9' },
  ratio_2_39_1: { width: 2048, height: 858, label: '2.39:1' },
};

export const TEMPLATES: Record<TemplateType, { label: string; bg: string; text: string; accent: string; font: string }> = {
  minimalist: { label: 'Minimalist', bg: '#ffffff', text: '#000000', accent: '#9ca3af', font: 'font-sans' },
  bold: { label: 'Bold', bg: '#000000', text: '#ffffff', accent: '#fbbf24', font: 'font-sans' },
  professional: { label: 'Professional', bg: '#f8fafc', text: '#0f172a', accent: '#334155', font: 'font-serif' },
  creative: { label: 'Creative', bg: '#fff1f2', text: '#881337', accent: '#f43f5e', font: 'font-mono' },
  corporate: { label: 'Corporate', bg: '#1e3a8a', text: '#ffffff', accent: '#60a5fa', font: 'font-sans' },
  elegant: { label: 'Elegant', bg: '#1c1917', text: '#e7e5e4', accent: '#d6d3d1', font: 'font-serif' },
  vibrant: { label: 'Vibrant', bg: '#7c3aed', text: '#ffffff', accent: '#fbbf24', font: 'font-sans' },
  nature: { label: 'Nature', bg: '#f0fdf4', text: '#14532d', accent: '#166534', font: 'font-sans' },
  dark: { label: 'Dark Mode', bg: '#09090b', text: '#e4e4e7', accent: '#71717a', font: 'font-sans' },
  retro: { label: 'Retro', bg: '#fef3c7', text: '#78350f', accent: '#d97706', font: 'font-serif' },
  tech: { label: 'Tech', bg: '#0f172a', text: '#38bdf8', accent: '#0ea5e9', font: 'font-mono' },
  warm: { label: 'Warm', bg: '#fff7ed', text: '#9a3412', accent: '#fdba74', font: 'font-serif' },
  luxury: { label: 'Luxury', bg: '#27272a', text: '#fef08a', accent: '#eab308', font: 'font-serif' },
  sunset: { label: 'Sunset', bg: 'linear-gradient(to bottom, #ff7e5f, #feb47b)', text: '#ffffff', accent: '#ffe4b5', font: 'font-sans' },
  ocean: { label: 'Ocean', bg: 'linear-gradient(to bottom, #2b5876, #4e4376)', text: '#ffffff', accent: '#a5d8ff', font: 'font-sans' },
  forest: { label: 'Forest', bg: '#1a2e1a', text: '#e2e8f0', accent: '#4ade80', font: 'font-serif' },
  berry: { label: 'Berry', bg: '#4a044e', text: '#fbcfe8', accent: '#f472b6', font: 'font-sans' },
  slate: { label: 'Slate', bg: '#334155', text: '#f1f5f9', accent: '#94a3b8', font: 'font-mono' },
  midnight: { label: 'Midnight', bg: '#0f172a', text: '#e2e8f0', accent: '#38bdf8', font: 'font-sans' },
  dawn: { label: 'Dawn', bg: 'linear-gradient(to bottom, #f3e7e9, #e3eeff)', text: '#475569', accent: '#94a3b8', font: 'font-serif' },
  dusk: { label: 'Dusk', bg: 'linear-gradient(to bottom, #2c3e50, #fd746c)', text: '#ffffff', accent: '#ffcccb', font: 'font-sans' },
  neon: { label: 'Neon', bg: '#000000', text: '#00ff00', accent: '#ff00ff', font: 'font-mono' },
  pastel: { label: 'Pastel', bg: '#fdf2f8', text: '#831843', accent: '#fbcfe8', font: 'font-sans' },
  earth: { label: 'Earth', bg: '#3f2e3e', text: '#efe1d1', accent: '#a78295', font: 'font-serif' },
  sky: { label: 'Sky', bg: '#e0f2fe', text: '#0369a1', accent: '#7dd3fc', font: 'font-sans' },
  fire: { label: 'Fire', bg: '#7f1d1d', text: '#fca5a5', accent: '#f87171', font: 'font-sans' },
  ice: { label: 'Ice', bg: '#ecfeff', text: '#164e63', accent: '#67e8f9', font: 'font-sans' },
  sand: { label: 'Sand', bg: '#fffbeb', text: '#78350f', accent: '#fcd34d', font: 'font-serif' },
  stone: { label: 'Stone', bg: '#57534e', text: '#fafaf9', accent: '#d6d3d1', font: 'font-mono' },
  cloud: { label: 'Cloud', bg: '#f8fafc', text: '#334155', accent: '#94a3b8', font: 'font-sans' },
  leaf: { label: 'Leaf', bg: '#ecfccb', text: '#365314', accent: '#84cc16', font: 'font-sans' },
  rose: { label: 'Rose', bg: '#fff1f2', text: '#881337', accent: '#fda4af', font: 'font-serif' },
  gold: { label: 'Gold', bg: '#422006', text: '#fef08a', accent: '#eab308', font: 'font-serif' },
  silver: { label: 'Silver', bg: '#f3f4f6', text: '#111827', accent: '#9ca3af', font: 'font-mono' },
  bronze: { label: 'Bronze', bg: '#78350f', text: '#ffedd5', accent: '#fdba74', font: 'font-serif' },
  copper: { label: 'Copper', bg: '#451a03', text: '#fed7aa', accent: '#fb923c', font: 'font-serif' },
  steel: { label: 'Steel', bg: '#1e293b', text: '#e2e8f0', accent: '#94a3b8', font: 'font-mono' },
  iron: { label: 'Iron', bg: '#171717', text: '#d4d4d4', accent: '#737373', font: 'font-mono' },
  coal: { label: 'Coal', bg: '#0a0a0a', text: '#525252', accent: '#262626', font: 'font-mono' },
  snow: { label: 'Snow', bg: '#ffffff', text: '#1e293b', accent: '#e2e8f0', font: 'font-sans' },
  rain: { label: 'Rain', bg: '#1e3a8a', text: '#bfdbfe', accent: '#60a5fa', font: 'font-sans' },
  storm: { label: 'Storm', bg: '#1e1b4b', text: '#c7d2fe', accent: '#818cf8', font: 'font-sans' },
  mist: { label: 'Mist', bg: '#f0f9ff', text: '#0c4a6e', accent: '#7dd3fc', font: 'font-serif' },
  fog: { label: 'Fog', bg: '#f1f5f9', text: '#475569', accent: '#94a3b8', font: 'font-sans' },
  haze: { label: 'Haze', bg: '#fff7ed', text: '#9a3412', accent: '#fdba74', font: 'font-serif' },
  smoke: { label: 'Smoke', bg: '#404040', text: '#d4d4d4', accent: '#a3a3a3', font: 'font-mono' },
  ash: { label: 'Ash', bg: '#525252', text: '#e5e5e5', accent: '#a3a3a3', font: 'font-mono' },
  dust: { label: 'Dust', bg: '#78716c', text: '#fafaf9', accent: '#d6d3d1', font: 'font-serif' },
  clay: { label: 'Clay', bg: '#7c2d12', text: '#ffedd5', accent: '#fdba74', font: 'font-serif' },
  mud: { label: 'Mud', bg: '#451a03', text: '#fed7aa', accent: '#fb923c', font: 'font-serif' },
  dirt: { label: 'Dirt', bg: '#3f2e3e', text: '#efe1d1', accent: '#a78295', font: 'font-serif' },
  grass: { label: 'Grass', bg: '#14532d', text: '#dcfce7', accent: '#4ade80', font: 'font-sans' },
  moss: { label: 'Moss', bg: '#365314', text: '#ecfccb', accent: '#84cc16', font: 'font-sans' },
  fern: { label: 'Fern', bg: '#166534', text: '#dcfce7', accent: '#22c55e', font: 'font-sans' },
  pine: { label: 'Pine', bg: '#064e3b', text: '#d1fae5', accent: '#10b981', font: 'font-serif' },
  oak: { label: 'Oak', bg: '#78350f', text: '#fef3c7', accent: '#d97706', font: 'font-serif' },
  maple: { label: 'Maple', bg: '#7f1d1d', text: '#fee2e2', accent: '#ef4444', font: 'font-serif' },
  birch: { label: 'Birch', bg: '#fefce8', text: '#854d0e', accent: '#eab308', font: 'font-serif' },
  cedar: { label: 'Cedar', bg: '#451a03', text: '#ffedd5', accent: '#fb923c', font: 'font-serif' },
  willow: { label: 'Willow', bg: '#f0fdf4', text: '#15803d', accent: '#4ade80', font: 'font-serif' },
  palm: { label: 'Palm', bg: '#ecfccb', text: '#3f6212', accent: '#84cc16', font: 'font-sans' },
  cactus: { label: 'Cactus', bg: '#14532d', text: '#dcfce7', accent: '#22c55e', font: 'font-sans' },
  bamboo: { label: 'Bamboo', bg: '#f0fdf4', text: '#166534', accent: '#4ade80', font: 'font-sans' },
  reed: { label: 'Reed', bg: '#fefce8', text: '#a16207', accent: '#eab308', font: 'font-serif' },
  lotus: { label: 'Lotus', bg: '#fdf2f8', text: '#be185d', accent: '#f472b6', font: 'font-serif' },
  lily: { label: 'Lily', bg: '#ffffff', text: '#be185d', accent: '#fbcfe8', font: 'font-serif' },
  tulip: { label: 'Tulip', bg: '#fff1f2', text: '#be123c', accent: '#fb7185', font: 'font-sans' },
  daisy: { label: 'Daisy', bg: '#ffffff', text: '#facc15', accent: '#fef08a', font: 'font-sans' },
  poppy: { label: 'Poppy', bg: '#7f1d1d', text: '#fecaca', accent: '#f87171', font: 'font-serif' },
  sunflower: { label: 'Sunflower', bg: '#fefce8', text: '#854d0e', accent: '#eab308', font: 'font-sans' },
  violet: { label: 'Violet', bg: '#2e1065', text: '#ddd6fe', accent: '#a78bfa', font: 'font-serif' },
  orchid: { label: 'Orchid', bg: '#4c1d95', text: '#e9d5ff', accent: '#c084fc', font: 'font-serif' },
  iris: { label: 'Iris', bg: '#1e1b4b', text: '#c7d2fe', accent: '#818cf8', font: 'font-serif' },
  jasmine: { label: 'Jasmine', bg: '#ffffff', text: '#15803d', accent: '#86efac', font: 'font-serif' },
  lavender: { label: 'Lavender', bg: '#f3e8ff', text: '#6b21a8', accent: '#d8b4fe', font: 'font-serif' },
  mint: { label: 'Mint', bg: '#ecfdf5', text: '#047857', accent: '#34d399', font: 'font-sans' },
  basil: { label: 'Basil', bg: '#f0fdf4', text: '#15803d', accent: '#4ade80', font: 'font-sans' },
  sage: { label: 'Sage', bg: '#f0fdfa', text: '#0f766e', accent: '#2dd4bf', font: 'font-serif' },
  thyme: { label: 'Thyme', bg: '#ecfccb', text: '#3f6212', accent: '#84cc16', font: 'font-serif' },
  rosemary: { label: 'Rosemary', bg: '#eff6ff', text: '#1d4ed8', accent: '#60a5fa', font: 'font-serif' },
  dill: { label: 'Dill', bg: '#f0fdf4', text: '#166534', accent: '#4ade80', font: 'font-sans' },
  cumin: { label: 'Cumin', bg: '#fff7ed', text: '#9a3412', accent: '#fdba74', font: 'font-serif' },
  curry: { label: 'Curry', bg: '#fefce8', text: '#854d0e', accent: '#eab308', font: 'font-serif' },
  chili: { label: 'Chili', bg: '#7f1d1d', text: '#fee2e2', accent: '#ef4444', font: 'font-sans' },
  pepper: { label: 'Pepper', bg: '#000000', text: '#ffffff', accent: '#ef4444', font: 'font-sans' },
  salt: { label: 'Salt', bg: '#ffffff', text: '#000000', accent: '#d1d5db', font: 'font-sans' },
  sugar: { label: 'Sugar', bg: '#ffffff', text: '#ec4899', accent: '#fbcfe8', font: 'font-sans' },
  honey: { label: 'Honey', bg: '#fffbeb', text: '#b45309', accent: '#fcd34d', font: 'font-serif' },
  lemon: { label: 'Lemon', bg: '#fefce8', text: '#a16207', accent: '#facc15', font: 'font-sans' },
  lime: { label: 'Lime', bg: '#f7fee7', text: '#3f6212', accent: '#84cc16', font: 'font-sans' },
  orange: { label: 'Orange', bg: '#fff7ed', text: '#c2410c', accent: '#fb923c', font: 'font-sans' },
  apple: { label: 'Apple', bg: '#fef2f2', text: '#b91c1c', accent: '#f87171', font: 'font-sans' },
  pear: { label: 'Pear', bg: '#f7fee7', text: '#3f6212', accent: '#a3e635', font: 'font-serif' },
  peach: { label: 'Peach', bg: '#fff1f2', text: '#be123c', accent: '#fda4af', font: 'font-sans' },
  plum: { label: 'Plum', bg: '#fdf4ff', text: '#701a75', accent: '#e879f9', font: 'font-serif' },
  grape: { label: 'Grape', bg: '#f3e8ff', text: '#6b21a8', accent: '#c084fc', font: 'font-serif' },
  cherry: { label: 'Cherry', bg: '#450a0a', text: '#fecaca', accent: '#f87171', font: 'font-serif' },
  melon: { label: 'Melon', bg: '#ecfdf5', text: '#047857', accent: '#34d399', font: 'font-sans' },
  mango: { label: 'Mango', bg: '#fff7ed', text: '#c2410c', accent: '#fdba74', font: 'font-sans' },
  kiwi: { label: 'Kiwi', bg: '#f0fdf4', text: '#15803d', accent: '#86efac', font: 'font-sans' },
  papaya: { label: 'Papaya', bg: '#fff7ed', text: '#c2410c', accent: '#fb923c', font: 'font-sans' },
  guava: { label: 'Guava', bg: '#fdf2f8', text: '#be185d', accent: '#f472b6', font: 'font-sans' },
  fig: { label: 'Fig', bg: '#4a044e', text: '#fbcfe8', accent: '#f472b6', font: 'font-serif' },
  date: { label: 'Date', bg: '#451a03', text: '#fed7aa', accent: '#fb923c', font: 'font-serif' },
  nut: { label: 'Nut', bg: '#78350f', text: '#fef3c7', accent: '#d97706', font: 'font-serif' },
  seed: { label: 'Seed', bg: '#fefce8', text: '#854d0e', accent: '#eab308', font: 'font-sans' },
  grain: { label: 'Grain', bg: '#fffbeb', text: '#b45309', accent: '#fcd34d', font: 'font-serif' },
  cyberpunk: { label: 'Cyberpunk', bg: '#000000', text: '#fdfa00', accent: '#ff003c', font: 'font-mono' },
  minimal_dark: { label: 'Minimal Dark', bg: '#18181b', text: '#fafafa', accent: '#3f3f46', font: 'font-sans' },
  royal: { label: 'Royal', bg: '#1e1b4b', text: '#fbbf24', accent: '#4338ca', font: 'font-serif' },
  eco: { label: 'Eco Friendly', bg: '#f0fdf4', text: '#166534', accent: '#86efac', font: 'font-sans' },
  brutalist: { label: 'Brutalist', bg: '#ffffff', text: '#000000', accent: '#000000', font: 'font-mono' },
  gradient_mesh: { label: 'Mesh Gradient', bg: 'radial-gradient(at 0% 0%, #ff9a9e 0%, transparent 50%), radial-gradient(at 50% 0%, #fad0c4 0%, transparent 50%), radial-gradient(at 100% 0%, #fad0c4 0%, transparent 50%)', text: '#2d3436', accent: '#636e72', font: 'font-sans' },
  aurora: { label: 'Aurora', bg: 'linear-gradient(to bottom right, #00c6ff, #0072ff)', text: '#ffffff', accent: '#e0f2fe', font: 'font-sans' },
  cosmic: { label: 'Cosmic', bg: 'linear-gradient(to bottom right, #8e2de2, #4a00e0)', text: '#ffffff', accent: '#e9d5ff', font: 'font-serif' },
  candy: { label: 'Candy', bg: 'linear-gradient(to bottom right, #ff9a9e, #fecfef)', text: '#831843', accent: '#fbcfe8', font: 'font-sans' },
  ocean_deep: { label: 'Ocean Deep', bg: 'linear-gradient(to bottom right, #2b5876, #4e4376)', text: '#ffffff', accent: '#a5d8ff', font: 'font-sans' },
  forest_mist: { label: 'Forest Mist', bg: 'linear-gradient(to bottom right, #134e5e, #71b280)', text: '#ffffff', accent: '#dcfce7', font: 'font-serif' },
};
