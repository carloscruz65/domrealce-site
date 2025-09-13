import { useRef, useCallback, useState, useEffect } from 'react';
import { useVisualEditor, type EditableElement as ElementType } from '@/contexts/VisualEditorContext';
import { cn } from '@/lib/utils';
import { ResizeHandle } from './ResizeHandle';
import { ContextMenu } from './ContextMenu';

interface EditableElementProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
  contentEditable?: boolean;
}

export function EditableElement({ 
  id, 
  children, 
  className,
  tag: Tag = 'div',
  contentEditable = false 
}: EditableElementProps) {
  const {
    isEditMode,
    selectedElementId,
    hoveredElementId,
    elements,
    selectElement,
    hoverElement,
    moveElement,
    updateElement,
    updateElementContent,
    deleteElement,
    duplicateElement,
    copyElement,
  } = useVisualEditor();

  const elementRef = useRef<HTMLElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  const isSelected = selectedElementId === id;
  const isHovered = hoveredElementId === id;
  const element = elements[id];

  // Register element in context if it doesn't exist
  useEffect(() => {
    if (!element) {
      const rect = elementRef.current?.getBoundingClientRect();
      const newElement: ElementType = {
        id,
        type: Tag === 'img' ? 'image' : Tag === 'button' ? 'button' : contentEditable ? 'text' : 'container',
        content: contentEditable ? (elementRef.current?.textContent || '') : {},
        styles: {},
        position: { x: rect?.left || 0, y: rect?.top || 0 },
        size: { width: rect?.width || 'auto', height: rect?.height || 'auto' }
      };
      updateElement(id, newElement);
    }
  }, [id, element, updateElement, Tag, contentEditable]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isEditMode) return;
    
    e.stopPropagation();
    selectElement(id);

    if (e.button === 0) { // Left click for dragging
      setIsDragging(true);
      setDragStart({
        x: e.clientX - (elementRef.current?.offsetLeft || 0),
        y: e.clientY - (elementRef.current?.offsetTop || 0),
      });
    }
  }, [isEditMode, selectElement, id]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !isEditMode || !element) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Update element position
    updateElement(id, { 
      ...element, 
      position: { x: Math.max(0, newX), y: Math.max(0, newY) } 
    });
  }, [isDragging, isEditMode, dragStart, updateElement, id, element]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (isEditMode) {
      hoverElement(id);
    }
  }, [isEditMode, hoverElement, id]);

  const handleMouseLeave = useCallback(() => {
    if (isEditMode) {
      hoverElement(null);
    }
  }, [isEditMode, hoverElement]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if (!isEditMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setIsContextMenuOpen(true);
    selectElement(id);
  }, [isEditMode, selectElement, id]);

  const handleContentEdit = useCallback((e: React.FormEvent) => {
    if (!contentEditable || !isEditMode || !element) return;
    
    const target = e.target as HTMLElement;
    updateElement(id, { 
      ...element, 
      content: target.textContent || '' 
    });
  }, [contentEditable, isEditMode, updateElement, id, element]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isEditMode || !isSelected) return;

    switch (e.key) {
      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        deleteElement(id);
        break;
      case 'c':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          copyElement(id);
        }
        break;
      case 'd':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          duplicateElement(id);
        }
        break;
    }
  }, [isEditMode, isSelected, deleteElement, copyElement, duplicateElement, id]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (isSelected) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isSelected, handleKeyDown]);

  // Apply visual styles based on element state  
  const elementStyles = element && isEditMode ? {
    position: 'absolute' as const,
    left: element.position.x,
    top: element.position.y,
    width: element.size.width,
    height: element.size.height,
    ...element.styles,
  } : {};

  const editorStyles = isEditMode ? {
    cursor: isDragging ? 'grabbing' : 'grab',
    outline: isSelected ? '2px solid #FFD700' : isHovered ? '1px dashed #FFD700' : 'none',
    outlineOffset: '2px',
    ...elementStyles,
  } : {};

  return (
    <>
      <Tag
        ref={elementRef}
        className={cn(
          className,
          isEditMode && 'transition-all duration-200',
          isSelected && 'z-50',
          isHovered && !isSelected && 'z-40'
        )}
        style={editorStyles}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onContextMenu={handleContextMenu}
        onInput={contentEditable ? handleContentEdit : undefined}
        contentEditable={isEditMode && contentEditable}
        suppressContentEditableWarning={true}
        data-testid={`editable-element-${id}`}
      >
        {children}
        
        {/* Resize handles for selected elements */}
        {isEditMode && isSelected && (
          <ResizeHandle elementId={id} />
        )}
        
        {/* Element label when hovered */}
        {isEditMode && isHovered && !isSelected && (
          <div className="absolute -top-6 left-0 bg-[#FFD700] text-black text-xs px-2 py-1 rounded pointer-events-none z-60">
            {Tag} #{id}
          </div>
        )}
      </Tag>

      {/* Context menu */}
      {isContextMenuOpen && (
        <ContextMenu
          position={contextMenuPosition}
          elementId={id}
          onClose={() => setIsContextMenuOpen(false)}
        />
      )}
    </>
  );
}