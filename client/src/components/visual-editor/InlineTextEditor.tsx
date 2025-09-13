import { useState, useRef, useEffect } from 'react';
import { useVisualEditor } from '@/contexts/VisualEditorContext';
import { cn } from '@/lib/utils';

interface InlineTextEditorProps {
  elementId: string;
  initialText: string;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
}

export function InlineTextEditor({
  elementId,
  initialText,
  className,
  placeholder = 'Clique para editar...',
  multiline = false
}: InlineTextEditorProps) {
  const { isEditMode, updateElement, selectedElementId, elements } = useVisualEditor();
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  
  const isSelected = selectedElementId === elementId;
  const element = elements[elementId];
  const currentText = typeof element?.content === 'string' ? element.content : initialText;

  // Register element if it doesn't exist
  useEffect(() => {
    if (!element) {
      const newElement = {
        id: elementId,
        type: 'text' as const,
        content: initialText,
        styles: {},
        position: { x: 0, y: 0 },
        size: { width: 'auto', height: 'auto' }
      };
      updateElement(elementId, newElement);
    }
  }, [elementId, element, updateElement, initialText]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    if (isEditMode) {
      setIsEditing(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    const InputComponent = multiline ? 'textarea' : 'input';
    return (
      <InputComponent
        ref={inputRef as any}
        value={currentText}
        onChange={(e) => {
          if (element) {
            updateElement(elementId, { ...element, content: e.target.value });
          }
        }}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={cn(
          'w-full bg-transparent border-2 border-[#FFD700] rounded px-2 py-1 outline-none',
          'text-inherit font-inherit resize-none',
          className
        )}
        placeholder={placeholder}
        data-testid={`inline-editor-${elementId}`}
        {...(multiline && { rows: 3 })}
      />
    );
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={cn(
        'cursor-text min-h-[1.5em] transition-all duration-200',
        isEditMode && 'hover:bg-[#FFD700]/10 hover:border hover:border-[#FFD700]/30 rounded px-1',
        isSelected && 'ring-2 ring-[#FFD700]/50',
        !currentText && 'text-gray-400',
        className
      )}
      data-testid={`text-element-${elementId}`}
    >
      {currentText || (isEditMode ? placeholder : '')}
      {isEditMode && !currentText && (
        <span className="absolute inset-0 pointer-events-none text-gray-500 italic">
          Duplo clique para editar
        </span>
      )}
    </div>
  );
}