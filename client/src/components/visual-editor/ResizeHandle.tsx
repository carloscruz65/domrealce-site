import { useCallback, useState } from 'react';
import { useVisualEditor } from '@/contexts/VisualEditorContext';
import { cn } from '@/lib/utils';

interface ResizeHandleProps {
  elementId: string;
}

type ResizeDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

export function ResizeHandle({ elementId }: ResizeHandleProps) {
  const { resizeElement } = useVisualEditor();
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<ResizeDirection>('se');

  const handleMouseDown = useCallback((direction: ResizeDirection) => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    setIsResizing(true);
    setResizeDirection(direction);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const element = document.querySelector(`[data-testid="editable-element-${elementId}"]`) as HTMLElement;
    if (!element) return;
    
    const startWidth = element.offsetWidth;
    const startHeight = element.offsetHeight;
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      
      // Calculate new dimensions based on resize direction
      if (direction.includes('e')) newWidth = startWidth + deltaX;
      if (direction.includes('w')) newWidth = startWidth - deltaX;
      if (direction.includes('s')) newHeight = startHeight + deltaY;
      if (direction.includes('n')) newHeight = startHeight - deltaY;
      
      // Apply minimum size constraints
      newWidth = Math.max(20, newWidth);
      newHeight = Math.max(20, newHeight);
      
      resizeElement(elementId, { width: newWidth, height: newHeight });
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [elementId, resizeElement]);

  const handles: { direction: ResizeDirection; className: string; cursor: string }[] = [
    { direction: 'n', className: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2', cursor: 'n-resize' },
    { direction: 'ne', className: 'top-0 right-0 -translate-y-1/2 translate-x-1/2', cursor: 'ne-resize' },
    { direction: 'e', className: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2', cursor: 'e-resize' },
    { direction: 'se', className: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2', cursor: 'se-resize' },
    { direction: 's', className: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2', cursor: 's-resize' },
    { direction: 'sw', className: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2', cursor: 'sw-resize' },
    { direction: 'w', className: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2', cursor: 'w-resize' },
    { direction: 'nw', className: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2', cursor: 'nw-resize' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {handles.map(({ direction, className, cursor }) => (
        <div
          key={direction}
          className={cn(
            'absolute w-3 h-3 bg-[#FFD700] border border-white rounded-full pointer-events-auto z-50 transition-all duration-200',
            'hover:scale-125 hover:bg-[#FFC700]',
            isResizing && resizeDirection === direction && 'scale-125 bg-[#FFC700]',
            className
          )}
          style={{ cursor }}
          onMouseDown={handleMouseDown(direction)}
          data-testid={`resize-handle-${direction}`}
        />
      ))}
    </div>
  );
}