import React, { useRef, useEffect, useState } from 'react';
import { SlideContent, DesignSettings, DIMENSIONS, TEMPLATES } from '../lib/types';

interface SlideProps {
  slide: SlideContent;
  index: number;
  settings: DesignSettings;
  scale?: number;
  isActive?: boolean;
  onUpdate?: (id: string, updates: Partial<SlideContent>) => void;
  onUpdateSettings?: (updates: Partial<DesignSettings>) => void;
}

export function Slide({ slide, index, settings, scale: propScale, isActive, onUpdate, onUpdateSettings }: SlideProps) {
  const { width, height } = DIMENSIONS[settings.ratio];
  const template = TEMPLATES[settings.template];
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingText, setIsDraggingText] = useState<'title' | 'body' | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [textDragStart, setTextDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, scale: 1 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [pinchStartDist, setPinchStartDist] = useState<number | null>(null);
  const [pinchStartScale, setPinchStartScale] = useState<number>(1);
  const [activeGuides, setActiveGuides] = useState<{ x?: number; y?: number }[]>([]);

  // Calculate scale if not provided (default to preview size)
  const previewWidth = 400;
  const computedScale = propScale || (previewWidth / width);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageSize({
      width: e.currentTarget.naturalWidth,
      height: e.currentTarget.naturalHeight
    });
  };

  const handleImageMouseDown = (e: React.MouseEvent) => {
    if (!onUpdate) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - (slide.imagePosition?.x || 0) * computedScale,
      y: e.clientY - (slide.imagePosition?.y || 0) * computedScale
    });
  };

  const handleTextMouseDown = (e: React.MouseEvent, type: 'title' | 'body') => {
    if (!onUpdate) return;
    // Only drag if not editing (or if clicking the edge)
    // Actually, let's allow dragging if Alt key is pressed or just by default if not focused?
    // User said "clicking and dragging", so let's make it work.
    // To allow both editing and dragging, we can use a small handle or just drag if not focused.
    // But contentEditable makes it tricky. Let's try dragging if we click and move.
    
    // If the element is already focused, we might want to allow text selection.
    // But the user wants to move it. Let's use a simple heuristic: 
    // if it's a drag (mouse down + move), move it.
    
    setIsDraggingText(type);
    const pos = type === 'title' ? slide.titlePosition : slide.bodyPosition;
    const defaultPos = type === 'title' ? { x: width / 2, y: height * 0.3 } : { x: width / 2, y: height * 0.5 };
    const currentPos = pos || defaultPos;
    
    setTextDragStart({
      x: e.clientX - currentPos.x * computedScale,
      y: e.clientY - currentPos.y * computedScale
    });
    // Don't preventDefault here so focus still works on click
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!onUpdate) return;
    
    if (e.touches.length === 2) {
      // Pinch start
      const dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      setPinchStartDist(dist);
      setPinchStartScale(slide.imageScale || 1);
      setIsDragging(false); // Stop dragging if pinching
    } else if (e.touches.length === 1) {
      // Drag start
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - (slide.imagePosition?.x || 0) * computedScale,
        y: touch.clientY - (slide.imagePosition?.y || 0) * computedScale
      });
    }
  };

  const handleTextTouchStart = (e: React.TouchEvent, type: 'title' | 'body') => {
    if (!onUpdate || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setIsDraggingText(type);
    const pos = type === 'title' ? slide.titlePosition : slide.bodyPosition;
    const defaultPos = type === 'title' ? { x: width / 2, y: height * 0.3 } : { x: width / 2, y: height * 0.5 };
    const currentPos = pos || defaultPos;

    setTextDragStart({
      x: touch.clientX - currentPos.x * computedScale,
      y: touch.clientY - currentPos.y * computedScale
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey && onUpdate) {
        e.preventDefault();
        const delta = -e.deltaY;
        const factor = 1.05;
        const currentScale = slide.imageScale || 1;
        const newScale = delta > 0 ? currentScale * factor : currentScale / factor;
        onUpdate(slide.id, { imageScale: Math.max(0.01, newScale) });
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [slide.imageScale, slide.id, onUpdate]);

  useEffect(() => {
    if (!isDragging && !isResizing && !isDraggingText && pinchStartDist === null) return;

    const handleMove = (clientX: number, clientY: number) => {
      if (!onUpdate) return;
      
      const guides: { x?: number; y?: number }[] = [];
      const threshold = 15;
      const margin = 60;
      const snapPointsX = [margin, width / 2, width - margin];
      const snapPointsY = [margin, height / 2, height - margin];

      if (isDragging) {
        const x = (clientX - dragStart.x) / computedScale;
        const y = (clientY - dragStart.y) / computedScale;
        
        const imgWidth = (imageSize.width * (slide.imageScale || 1));
        const imgHeight = (imageSize.height * (slide.imageScale || 1));
        const centerX = x + imgWidth / 2;
        const centerY = y + imgHeight / 2;
        
        snapPointsX.forEach(point => {
          if (Math.abs(centerX - point) < threshold) guides.push({ x: point });
        });
        snapPointsY.forEach(point => {
          if (Math.abs(centerY - point) < threshold) guides.push({ y: point });
        });

        onUpdate(slide.id, { imagePosition: { x, y } });
      } else if (isDraggingText) {
        const x = (clientX - textDragStart.x) / computedScale;
        const y = (clientY - textDragStart.y) / computedScale;
        
        snapPointsX.forEach(point => {
          if (Math.abs(x - point) < threshold) guides.push({ x: point });
        });
        snapPointsY.forEach(point => {
          if (Math.abs(y - point) < threshold) guides.push({ y: point });
        });

        if (isDraggingText === 'title') {
          onUpdate(slide.id, { titlePosition: { x, y } });
        } else {
          onUpdate(slide.id, { bodyPosition: { x, y } });
        }
      } else if (isResizing) {
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect) return;

        const mouseXInSlide = (clientX - containerRect.left);
        const imageTopLeftX = (slide.imagePosition?.x || 0) * computedScale;
        const targetWidth = Math.max(5, mouseXInSlide - imageTopLeftX);
        const naturalWidth = imageSize.width || (imageRef.current?.naturalWidth) || 100;
        const newScale = targetWidth / (naturalWidth * computedScale);
        
        onUpdate(slide.id, { imageScale: newScale });
      }
      
      setActiveGuides(guides);
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!onUpdate) return;

      if (e.touches.length === 2 && pinchStartDist !== null) {
        e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        const scaleChange = dist / pinchStartDist;
        onUpdate(slide.id, { imageScale: pinchStartScale * scaleChange });
      } else if (e.touches.length === 1) {
        // Prevent scrolling while dragging
        e.preventDefault();
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
      setIsResizing(false);
      setIsDraggingText(null);
      setPinchStartDist(null);
      setActiveGuides([]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('touchcancel', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
  }, [isDragging, isResizing, isDraggingText, pinchStartDist, dragStart, textDragStart, resizeStart, computedScale, onUpdate, slide.id, width, height, imageSize, slide.imageScale, pinchStartScale]);

  const renderImage = (layer: 'front' | 'back') => {
    if (!slide.image || slide.imageLayer !== layer) return null;

    const imgWidth = imageSize.width * (slide.imageScale || 1) * computedScale;
    const imgHeight = imageSize.height * (slide.imageScale || 1) * computedScale;

    return (
      <div 
        className={`absolute pointer-events-auto group/img ${isDragging ? 'opacity-80' : ''} transition-shadow`}
        style={{
          left: `${(slide.imagePosition?.x || 0) * computedScale}px`,
          top: `${(slide.imagePosition?.y || 0) * computedScale}px`,
          zIndex: (isDragging || isResizing || pinchStartDist !== null) ? 50 : (layer === 'back' ? 5 : 15),
        }}
        onTouchStart={handleTouchStart}
      >
        <img 
          ref={imageRef}
          src={slide.image} 
          alt=""
          className="cursor-move select-none max-w-none"
          draggable={false}
          style={{
            width: `${imgWidth}px`,
            height: `${imgHeight}px`,
            display: 'block'
          }}
          onLoad={handleImageLoad}
          onMouseDown={handleImageMouseDown}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  };

  const getAlignmentClasses = (type: 'title' | 'body') => {
    const alignment = settings.alignment[slide.type];
    switch (alignment) {
      case 'left': return 'text-left';
      case 'right': return 'text-right';
      case 'center': 
      default: return 'text-center';
    }
  };

  const getTextStyle = (style?: any) => {
    if (!style) return {};
    return {
      fontFamily: style.fontFamily,
      fontSize: style.fontSize ? `${style.fontSize}px` : undefined,
      fontWeight: style.fontWeight,
      fontStyle: style.fontStyle,
      textDecoration: style.textDecoration,
      textAlign: style.textAlign,
      color: style.color,
    };
  };

  return (
    <div 
      ref={containerRef}
      className={`relative shadow-sm transition-all duration-300 overflow-hidden bg-white ${isActive ? 'ring-2 ring-black ring-offset-2' : ''}`}
      style={{
        width: `${width * computedScale}px`,
        height: `${height * computedScale}px`,
        background: template.bg,
      }}
    >
      {/* Image Layer - Back */}
      {renderImage('back')}

      {/* Full Grid Overlay */}
      {(isDragging || isDraggingText || isResizing) && (
        <div 
          className="absolute inset-0 pointer-events-none z-[90] opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: `${40 * computedScale}px ${40 * computedScale}px`
          }}
        />
      )}

      {/* Alignment Guides */}
      {activeGuides.map((guide, i) => (
        <div 
          key={i}
          className={`absolute border-dashed border-blue-400 z-[100] pointer-events-none ${guide.x !== undefined ? 'top-0 bottom-0 border-l' : 'left-0 right-0 border-t'}`}
          style={{ 
            left: guide.x !== undefined ? `${guide.x * computedScale}px` : 0,
            top: guide.y !== undefined ? `${guide.y * computedScale}px` : 0,
            boxShadow: '0 0 4px rgba(59, 130, 246, 0.5)'
          }}
        />
      ))}

      {/* Scaling Container */}
      <div 
        id={slide.id}
        className={`absolute top-0 left-0 origin-top-left ${template.font} pointer-events-none`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${computedScale})`,
          background: slide.image && slide.imageLayer === 'back' ? 'transparent' : template.bg,
          color: template.text,
          zIndex: 10,
        }}
      >
          {/* Title */}
          <div
          className={`
            absolute text-[60px] leading-[1.1] font-black pointer-events-auto
            max-w-[85%] outline-none border-2 border-transparent rounded-xl p-3
            ${onUpdate ? 'hover:border-white/30 cursor-move touch-none' : ''}
            ${getAlignmentClasses('title')}
            empty:before:content-['Title'] empty:before:opacity-30
            z-10 drop-shadow-2xl
          `}
          contentEditable={!!onUpdate}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate && onUpdate(slide.id, { title: e.currentTarget.innerText })}
          onMouseDown={(e) => handleTextMouseDown(e, 'title')}
          onTouchStart={(e) => handleTextTouchStart(e, 'title')}
          style={{ 
            whiteSpace: 'pre-wrap',
            left: slide.titlePosition ? `${slide.titlePosition.x}px` : '50%',
            top: slide.titlePosition ? `${slide.titlePosition.y}px` : '30%',
            transform: 'translate(-50%, -50%)',
            zIndex: isDraggingText === 'title' ? 100 : 10,
            ...getTextStyle(slide.titleStyle)
          }}
          >
            {slide.title}
          </div>

          {/* Body */}
          <div
          className={`
            absolute text-[40px] leading-[1.4] font-semibold opacity-95 pointer-events-auto
            max-w-[85%] outline-none border-2 border-transparent rounded-xl p-3
            ${onUpdate ? 'hover:border-white/30 cursor-move touch-none' : ''}
            ${getAlignmentClasses('body')}
            empty:before:content-['Body_Text'] empty:before:opacity-30
            z-10 drop-shadow-xl
          `}
          contentEditable={!!onUpdate}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate && onUpdate(slide.id, { body: e.currentTarget.innerText })}
          onMouseDown={(e) => handleTextMouseDown(e, 'body')}
          onTouchStart={(e) => handleTextTouchStart(e, 'body')}
          style={{ 
            whiteSpace: 'pre-wrap',
            left: slide.bodyPosition ? `${slide.bodyPosition.x}px` : '50%',
            top: slide.bodyPosition ? `${slide.bodyPosition.y}px` : '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: isDraggingText === 'body' ? 100 : 10,
            ...getTextStyle(slide.bodyStyle)
          }}
          >
            {slide.body}
          </div>
      </div>

      {/* Image Layer - Front */}
      {renderImage('front')}
    </div>
  );
}
