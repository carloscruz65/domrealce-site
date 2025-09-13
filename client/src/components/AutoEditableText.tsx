import { useVisualEditor } from '@/contexts/VisualEditorContext';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AutoEditableTextProps {
  children: string;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
  multiline?: boolean;
}

export function AutoEditableText({ 
  children, 
  className,
  tag: Tag = 'span',
  multiline = false 
}: AutoEditableTextProps) {
  const { isEditMode } = useVisualEditor();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(children);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(children);
  }, [children]);

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
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setText(children);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  if (isEditing && isEditMode) {
    const InputComponent = multiline ? 'textarea' : 'input';
    return (
      <InputComponent
        ref={inputRef as any}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={cn(
          'w-full bg-transparent border-2 border-[#FFD700] rounded px-2 py-1 outline-none',
          'text-inherit font-inherit resize-none',
          className
        )}
        {...(multiline && { rows: 3 })}
      />
    );
  }

  return (
    <Tag
      onDoubleClick={handleDoubleClick}
      className={cn(
        className,
        isEditMode && 'cursor-text hover:bg-[#FFD700]/10 hover:border hover:border-[#FFD700]/30 rounded px-1 transition-all duration-200',
        isEditMode && !text && 'text-gray-400'
      )}
    >
      {text || (isEditMode ? 'Duplo clique para editar' : children)}
    </Tag>
  );
}