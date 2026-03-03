import React, { useState, useRef, useEffect } from 'react';
import { generatePDF } from './lib/pdf';
import { Slide } from './components/Slide';
import { DesignSettings, DIMENSIONS, TEMPLATES, TemplateType, AspectRatio, TextLayout, SlideType, SlideContent, TextStyle } from './lib/types';
import { Loader2, Download, Plus, Trash2, LayoutTemplate, Monitor, AlignLeft, AlignCenter, AlignRight, Type, Image as ImageIcon, X, ChevronUp, ChevronDown, Copy, Palette, Settings2, Layers, Eye, Edit3, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import { TextStyleControls } from './components/TextStyleControls';

export default function App() {
  const [isExporting, setIsExporting] = useState(false);
  
  // Style toggle states
  const [showTitleStyle, setShowTitleStyle] = useState(false);
  const [showBodyStyle, setShowBodyStyle] = useState(false);
  const titleStyleRef = useRef<HTMLDivElement>(null);
  const bodyStyleRef = useRef<HTMLDivElement>(null);
  
  // Template menu state
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);
  const [hoveredTemplate, setHoveredTemplate] = useState<TemplateType | null>(null);
  const templateMenuRef = useRef<HTMLDivElement>(null);

  // Ratio menu state
  const [isRatioMenuOpen, setIsRatioMenuOpen] = useState(false);
  const [hoveredRatio, setHoveredRatio] = useState<AspectRatio | null>(null);
  const ratioMenuRef = useRef<HTMLDivElement>(null);

  // Close template menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (templateMenuRef.current && !templateMenuRef.current.contains(event.target as Node)) {
        setIsTemplateMenuOpen(false);
      }
      if (ratioMenuRef.current && !ratioMenuRef.current.contains(event.target as Node)) {
        setIsRatioMenuOpen(false);
      }
      if (titleStyleRef.current && !titleStyleRef.current.contains(event.target as Node)) {
        setShowTitleStyle(false);
      }
      if (bodyStyleRef.current && !bodyStyleRef.current.contains(event.target as Node)) {
        setShowBodyStyle(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Initial manual state
  const [slides, setSlides] = useState<SlideContent[]>([
    { id: '1', type: 'title', title: 'Title', body: '' },
  ]);
  
  const [activeSlideId, setActiveSlideId] = useState<string>(slides[0].id);

  const [settings, setSettings] = useState<DesignSettings>({
    template: 'minimalist',
    ratio: 'ratio_4_5',
    alignment: {
      title: 'center',
      point: 'left',
      cta: 'center',
    },
  });

  // Responsive Scaling Logic
  const [previewScale, setPreviewScale] = useState(0.5);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateScale = () => {
      if (!previewContainerRef.current) return;
      
      const { width: slideWidth, height: slideHeight } = DIMENSIONS[settings.ratio];
      const containerWidth = previewContainerRef.current.clientWidth;
      const containerHeight = previewContainerRef.current.clientHeight;
      
      // Add padding (e.g. 96px) to ensure full visibility
      const padding = 96;
      const availableWidth = containerWidth - padding;
      const availableHeight = containerHeight - padding;

      const scaleX = availableWidth / slideWidth;
      const scaleY = availableHeight / slideHeight;
      
      // Fit within container
      setPreviewScale(Math.min(scaleX, scaleY));
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [settings.ratio]);

  const activeSlideIndex = slides.findIndex(s => s.id === activeSlideId);
  const activeSlide = slides[activeSlideIndex];

  const handleAddSlide = () => {
    const newSlide: SlideContent = {
      id: crypto.randomUUID(),
      type: 'point',
      title: 'New Point',
      body: 'Add content...',
    };
    const newSlides = [...slides];
    // Insert after current slide
    newSlides.splice(activeSlideIndex + 1, 0, newSlide);
    setSlides(newSlides);
    setActiveSlideId(newSlide.id);
  };

  const handleDuplicateSlide = () => {
    if (!activeSlide) return;
    const newSlide = { ...activeSlide, id: crypto.randomUUID() };
    const newSlides = [...slides];
    newSlides.splice(activeSlideIndex + 1, 0, newSlide);
    setSlides(newSlides);
    setActiveSlideId(newSlide.id);
  };

  const handleDeleteSlide = (id: string) => {
    if (slides.length <= 1) return;
    const index = slides.findIndex(s => s.id === id);
    const newSlides = slides.filter(s => s.id !== id);
    setSlides(newSlides);
    // If we deleted the active slide, select the previous one (or next if first)
    if (id === activeSlideId) {
      setActiveSlideId(newSlides[Math.max(0, index - 1)].id);
    }
  };

  const handleMoveSlide = (direction: 'up' | 'down') => {
    if (!activeSlide) return;
    const newIndex = direction === 'up' ? activeSlideIndex - 1 : activeSlideIndex + 1;
    if (newIndex < 0 || newIndex >= slides.length) return;
    
    const newSlides = [...slides];
    [newSlides[activeSlideIndex], newSlides[newIndex]] = [newSlides[newIndex], newSlides[activeSlideIndex]];
    setSlides(newSlides);
  };

  const handleUpdateSlide = (id: string, updates: Partial<SlideContent>) => {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleUpdateSettings = (updates: Partial<DesignSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeSlide) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      handleUpdateSlide(activeSlide.id, { 
        image: base64,
        imagePosition: { x: 0, y: 0 },
        imageScale: 1,
        imageLayer: 'back'
      });
    };
    reader.readAsDataURL(file);
  };

  const handleExport = async () => {
    if (slides.length === 0) return;
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 100));
    const { width, height } = DIMENSIONS[settings.ratio];
    await generatePDF(slides.map(s => s.id), width, height);
    setIsExporting(false);
  };

  const handlePrevSlide = () => {
    if (activeSlideIndex > 0) {
      setActiveSlideId(slides[activeSlideIndex - 1].id);
    }
  };

  const handleNextSlide = () => {
    if (activeSlideIndex < slides.length - 1) {
      setActiveSlideId(slides[activeSlideIndex + 1].id);
    }
  };

  // Swipe handlers
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleNextSlide();
    }
    if (isRightSwipe) {
      handlePrevSlide();
    }
  };

  // Calculate thumbnail scale (48px width / slide width)
  const thumbnailWidth = 48;
  const thumbnailScale = thumbnailWidth / DIMENSIONS[settings.ratio].width;

  return (
    <div className="min-h-screen md:h-screen flex flex-col bg-gray-100 text-gray-900 font-sans md:overflow-hidden">
      {/* Top Bar */}
      <header className="relative h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 flex items-center justify-center">
            {/* Background Card */}
            <div className="absolute inset-0 border-2 border-purple-500 rounded-lg transform -translate-x-1 -translate-y-1 rotate-[-6deg] opacity-40"></div>
            {/* Middle Card */}
            <div className="absolute inset-0 border-2 border-orange-500 rounded-lg transform translate-x-0.5 translate-y-0.5 rotate-[3deg] opacity-60"></div>
            {/* Front Card */}
            <div className="absolute inset-0 bg-white border-2 border-purple-600 rounded-lg shadow-sm flex items-center justify-center">
              <div className="w-3 h-3 bg-gradient-to-br from-purple-600 to-orange-500 rounded-[2px]"></div>
            </div>
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-orange-500">CarouselPro</span>
        </div>
        
        <div className="flex items-center gap-4">
          <a 
            href="https://buymeacoffee.com/insidedeepquote" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-90 transition-opacity"
          >
            <img 
              src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" 
              alt="Buy Me A Coffee" 
              className="h-8"
              referrerPolicy="no-referrer"
            />
          </a>
        </div>
      </header>

      {/* Main Layout: 3 Columns */}
      <div className="flex-1 flex flex-col md:flex-row md:overflow-hidden relative scroll-smooth">
        
        {/* Left Column: Preview + Thumbnails */}
        <div className="w-full md:w-2/3 flex flex-col min-w-0 relative shrink-0">
            
            {/* 1. Center Stage: Active Slide */}
            <div 
              ref={previewContainerRef}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              className="h-[60vh] md:flex-1 bg-gray-100 flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden relative transition-colors"
            >
              {/* Navigation Arrows */}
              <button 
                onClick={handlePrevSlide}
                disabled={activeSlideIndex === 0}
                className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/50 hover:bg-white text-gray-400 hover:text-gray-900 shadow-sm transition-all disabled:opacity-0 disabled:pointer-events-none z-10 backdrop-blur-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button 
                onClick={handleNextSlide}
                disabled={activeSlideIndex === slides.length - 1}
                className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/50 hover:bg-white text-gray-400 hover:text-gray-900 shadow-sm transition-all disabled:opacity-0 disabled:pointer-events-none z-10 backdrop-blur-sm"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {activeSlide && (
                <div className="relative shadow-2xl transition-all duration-300">
                   {/* Render Active Slide */}
                   <Slide 
                     slide={activeSlide} 
                     index={activeSlideIndex} 
                     settings={{ 
                       ...settings, 
                       template: hoveredTemplate || settings.template,
                       ratio: hoveredRatio || settings.ratio
                     }} 
                     scale={previewScale}
                     isActive={true}
                     onUpdate={handleUpdateSlide}
                     onUpdateSettings={handleUpdateSettings}
                   />
                </div>
              )}
              
              {/* Pagination Indicator */}
              <div className="absolute bottom-4 text-xs font-medium text-gray-400 z-20 pointer-events-none">
                {activeSlideIndex + 1} / {slides.length}
              </div>
            </div>

        </div>

        {/* 3. Right Sidebar: Editor Panel */}
        <div className="w-full md:w-1/3 bg-white border-t md:border-t-0 md:border-l border-gray-200 flex flex-col md:shrink-0 relative md:overflow-hidden">
          <div className="md:flex-1 md:overflow-y-auto flex flex-col">
            <div className="flex-1">
              {activeSlide ? (
                <div className="p-3 space-y-3">
                  
                  {/* Header Actions */}
                  <div className="flex items-center justify-between relative bg-white z-10 pb-2 border-b border-gray-100">
                    <h3 className="font-semibold text-xs text-gray-500 uppercase tracking-wider">Slide {activeSlideIndex + 1}</h3>
                    <div className="flex items-center gap-0.5">
                      <button onClick={handleAddSlide} className="p-1.5 text-gray-600 hover:bg-black hover:text-white rounded-md transition-colors" title="Add New Slide"><Plus className="w-3.5 h-3.5" /></button>
                      <div className="w-px h-3 bg-gray-200 mx-1"></div>
                      <button onClick={() => handleMoveSlide('up')} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md" title="Move Up"><ChevronUp className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleMoveSlide('down')} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md" title="Move Down"><ChevronDown className="w-3.5 h-3.5" /></button>
                      <button onClick={handleDuplicateSlide} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md" title="Duplicate"><Copy className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDeleteSlide(activeSlide.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>

                  {/* Template & Layout Settings */}
                  <div className="grid grid-cols-2 gap-2">
                     {/* Template Selector */}
                     <div className="relative" ref={templateMenuRef}>
                        <button
                          onClick={() => setIsTemplateMenuOpen(!isTemplateMenuOpen)}
                          className="w-full flex items-center justify-between gap-2 px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white hover:border-gray-300 transition-all text-xs font-medium"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <div 
                              className="w-2.5 h-2.5 rounded-full border border-gray-200 shadow-sm shrink-0" 
                              style={{ backgroundColor: TEMPLATES[settings.template].bg }}
                            ></div>
                            <span className="truncate">{TEMPLATES[settings.template].label}</span>
                          </div>
                          <ChevronDown className={`w-3 h-3 text-gray-400 shrink-0 transition-transform ${isTemplateMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Template Dropdown */}
                        {isTemplateMenuOpen && (
                          <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-1 z-50 max-h-[300px] overflow-y-auto grid grid-cols-1 gap-0.5">
                            {(Object.entries(TEMPLATES) as [TemplateType, typeof TEMPLATES[TemplateType]][]).map(([key, template]) => (
                              <button
                                key={key}
                                onClick={() => {
                                  setSettings(s => ({ ...s, template: key }));
                                  setIsTemplateMenuOpen(false);
                                  setHoveredTemplate(null);
                                }}
                                onMouseEnter={() => setHoveredTemplate(key)}
                                onMouseLeave={() => setHoveredTemplate(null)}
                                className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-left transition-all ${settings.template === key ? 'bg-gray-100 ring-1 ring-black/5' : 'hover:bg-gray-50'}`}
                              >
                                <div 
                                  className="w-3 h-3 rounded border border-gray-200 shadow-sm shrink-0 relative overflow-hidden"
                                  style={{ backgroundColor: template.bg }}
                                ></div>
                                <span className="text-xs font-medium text-gray-900 truncate">{template.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                     </div>

                     {/* Ratio Selector */}
                     <div className="relative" ref={ratioMenuRef}>
                        <button
                          onClick={() => setIsRatioMenuOpen(!isRatioMenuOpen)}
                          className="w-full flex items-center justify-between gap-2 px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white hover:border-gray-300 transition-all text-xs font-medium"
                        >
                          <span className="truncate">{DIMENSIONS[settings.ratio].label}</span>
                          <ChevronDown className={`w-3 h-3 text-gray-400 shrink-0 transition-transform ${isRatioMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isRatioMenuOpen && (
                          <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-xl shadow-xl border border-gray-100 p-1 z-50 max-h-[240px] overflow-y-auto grid grid-cols-1 gap-0.5">
                            {Object.entries(DIMENSIONS).map(([key, { label }]) => (
                              <button
                                key={key}
                                onClick={() => {
                                  setSettings(s => ({ ...s, ratio: key as AspectRatio }));
                                  setIsRatioMenuOpen(false);
                                  setHoveredRatio(null);
                                }}
                                onMouseEnter={() => setHoveredRatio(key as AspectRatio)}
                                onMouseLeave={() => setHoveredRatio(null)}
                                className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-left transition-all ${settings.ratio === key ? 'bg-gray-100 ring-1 ring-black/5' : 'hover:bg-gray-50'}`}
                              >
                                <span className="text-xs font-medium text-gray-900 truncate">{label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                     </div>
                  </div>

                  {/* Text Inputs */}
                  <div className="space-y-2">
                    <div className="relative group" ref={titleStyleRef}>
                        <div className="absolute right-2 top-2 flex items-center gap-1 transition-opacity">
                          <button 
                            onClick={() => setShowTitleStyle(!showTitleStyle)}
                            className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${showTitleStyle ? 'bg-gray-100 text-black' : 'text-black'}`}
                            title="Text Style"
                          >
                            <Settings2 className="w-4 h-4" />
                          </button>
                          <span className="text-[9px] text-gray-400 font-mono">{activeSlide.title.length}/60</span>
                        </div>
                        <input
                          type="text"
                          value={activeSlide.title}
                          onChange={(e) => handleUpdateSlide(activeSlide.id, { title: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black focus:border-black outline-none transition-all font-semibold text-sm"
                          placeholder="Title"
                        />
                        {showTitleStyle && (
                          <div className="mt-1 p-2 bg-gray-50 rounded-lg border border-gray-100">
                            <TextStyleControls 
                              label="Title" 
                              value={activeSlide.titleStyle} 
                              onChange={(style) => handleUpdateSlide(activeSlide.id, { titleStyle: style })} 
                            />
                          </div>
                        )}
                      </div>

                    <div className="relative group flex-1 flex flex-col min-h-0" ref={bodyStyleRef}>
                      <div className="absolute right-2 top-2 flex items-center gap-1 transition-opacity">
                        <button 
                          onClick={() => setShowBodyStyle(!showBodyStyle)}
                          className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${showBodyStyle ? 'bg-gray-100 text-black' : 'text-black'}`}
                          title="Text Style"
                        >
                          <Settings2 className="w-4 h-4" />
                        </button>
                        <span className="text-[9px] text-gray-400 font-mono">{activeSlide.body.length}/200</span>
                      </div>
                      <textarea
                        value={activeSlide.body}
                        onChange={(e) => handleUpdateSlide(activeSlide.id, { body: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black focus:border-black outline-none transition-all resize-none text-sm flex-1"
                        placeholder="Body Text"
                      />
                      {showBodyStyle && (
                        <div className="mt-1 p-2 bg-gray-50 rounded-lg border border-gray-100">
                          <TextStyleControls 
                            label="Body" 
                            value={activeSlide.bodyStyle} 
                            onChange={(style) => handleUpdateSlide(activeSlide.id, { bodyStyle: style })} 
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image Section */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Image</h4>
                      {activeSlide.image && (
                        <button 
                          onClick={() => handleUpdateSlide(activeSlide.id, { image: undefined })}
                          className="text-[10px] text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    {!activeSlide.image ? (
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 cursor-pointer transition-all group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors mb-2" />
                          <p className="text-[10px] text-gray-500 font-medium">Click to upload image</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>
                    ) : (
                      <div className="space-y-3">
                        {/* Layer Toggle */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 flex bg-gray-100 rounded-lg p-1">
                            <button 
                              onClick={() => handleUpdateSlide(activeSlide.id, { imageLayer: 'back' })}
                              className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-[10px] font-bold transition-all ${activeSlide.imageLayer === 'back' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                              <Layers className="w-3 h-3" />
                              Back
                            </button>
                            <button 
                              onClick={() => handleUpdateSlide(activeSlide.id, { imageLayer: 'front' })}
                              className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-[10px] font-bold transition-all ${activeSlide.imageLayer === 'front' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                              <Layers className="w-3 h-3" />
                              Front
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Export Section */}
                  <div className="pt-4 border-t border-gray-100 flex flex-col items-center">
                    <button
                      onClick={handleExport}
                      disabled={slides.length === 0 || isExporting}
                      className="w-auto min-w-[160px] flex items-center justify-center gap-2 px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-all text-xs font-bold shadow-sm"
                    >
                      {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                      {isExporting ? 'Exporting...' : 'Export PDF'}
                    </button>
                    <p className="text-[9px] text-gray-400 text-center mt-2">
                      All slides as a single PDF
                    </p>
                  </div>

                </div>
              ) : (
                <div className="flex items-center justify-center h-64 md:h-full text-gray-400 text-sm p-8 text-center">
                  Select a slide to edit
                </div>
              )}
            </div>

            {/* Footer removed from here */}
          </div>
        </div>

      </div>
    </div>
  );
}
