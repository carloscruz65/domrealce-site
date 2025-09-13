import { useVisualEditor } from '@/contexts/VisualEditorContext';
import { cn } from '@/lib/utils';

interface EditablePageProps {
  children: React.ReactNode;
  className?: string;
}

export function EditablePage({ children, className }: EditablePageProps) {
  const { isEditMode } = useVisualEditor();
  
  // Verificar se o modo de edição está ativo via URL
  const isUrlEditMode = typeof window !== 'undefined' && 
    new URLSearchParams(window.location.search).get('edit') === 'true';

  // Só aplicar estilos de edição se o modo estiver ativo
  const shouldShowEditMode = isEditMode || isUrlEditMode;

  return (
    <div 
      className={cn(
        className,
        shouldShowEditMode && 'visual-editor-active'
      )}
      data-editable-page={shouldShowEditMode}
    >
      {children}
    </div>
  );
}