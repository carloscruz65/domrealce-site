import { useState, useEffect } from 'react';
import { useVisualEditorSafe } from '@/contexts/VisualEditorContext';
import { cn } from '@/lib/utils';

interface EditableConfigTextProps {
  value: string;
  onSave: (newValue: string) => Promise<any>;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
  multiline?: boolean;
  placeholder?: string;
  dataTestId?: string;
}

export function EditableConfigText({ 
  value, 
  onSave,
  className,
  tag: Tag = 'span',
  multiline = false,
  placeholder = 'Duplo clique para editar...',
  dataTestId
}: EditableConfigTextProps) {
  // Usar hook seguro que nunca falha, mesmo sem provider
  const context = useVisualEditorSafe();
  const isEditMode = context.isEditMode;
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setText(value);
  }, [value]);

  const handleDoubleClick = () => {
    if (isEditMode) {
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (text !== value) {
      setIsSaving(true);
      try {
        await onSave(text);
      } catch (error) {
        console.error('Error saving:', error);
        setText(value); // Revert on error
      } finally {
        setIsSaving(false);
      }
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setText(value);
      setIsEditing(false);
    }
  };

  if (isEditing && isEditMode) {
    const InputComponent = multiline ? 'textarea' : 'input';
    return (
      <InputComponent
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleSave}
        className={cn(
          'w-full bg-transparent border-2 border-[#FFD700] rounded px-2 py-1 outline-none',
          'text-inherit font-inherit resize-none',
          isSaving && 'opacity-60',
          className
        )}
        placeholder={placeholder}
        autoFocus
        data-testid={dataTestId ? `edit-${dataTestId}` : undefined}
        {...(multiline && { rows: 3 })}
      />
    );
  }

  return (
    <Tag
      onDoubleClick={handleDoubleClick}
      className={cn(
        'cursor-text transition-all duration-200',
        isEditMode && 'hover:bg-[#FFD700]/10 hover:border hover:border-[#FFD700]/30 rounded px-1',
        !value && isEditMode && 'text-gray-400 italic',
        className
      )}
      data-testid={dataTestId}
    >
      {value || (isEditMode ? placeholder : '')}
      {isSaving && (
        <span className="ml-2 text-xs text-[#FFD700]">Guardando...</span>
      )}
    </Tag>
  );
}