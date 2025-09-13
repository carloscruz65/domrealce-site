import { useEffect, useRef } from 'react';
import { useVisualEditor } from '@/contexts/VisualEditorContext';
import { Copy, Trash2, Edit, Move, Layers } from 'lucide-react';

interface ContextMenuProps {
  position: { x: number; y: number };
  elementId: string;
  onClose: () => void;
}

export function ContextMenu({ position, elementId, onClose }: ContextMenuProps) {
  const {
    deleteElement,
    duplicateElement,
    copyElement,
    selectElement,
  } = useVisualEditor();
  
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  const menuItems = [
    {
      label: 'Editar',
      icon: Edit,
      action: () => selectElement(elementId),
      shortcut: '',
    },
    {
      label: 'Copiar',
      icon: Copy,
      action: () => copyElement(elementId),
      shortcut: 'Ctrl+C',
    },
    {
      label: 'Duplicar',
      icon: Layers,
      action: () => duplicateElement(elementId),
      shortcut: 'Ctrl+D',
    },
    {
      label: 'Mover',
      icon: Move,
      action: () => {}, // Move will be handled by drag
      shortcut: '',
      disabled: true,
    },
    {
      label: 'Eliminar',
      icon: Trash2,
      action: () => deleteElement(elementId),
      shortcut: 'Del',
      danger: true,
    },
  ];

  // Adjust position to keep menu within viewport
  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - 200),
    y: Math.min(position.y, window.innerHeight - 200),
  };

  return (
    <div
      ref={menuRef}
      className="fixed bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl z-[100] py-2 min-w-[180px]"
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
      }}
      data-testid="context-menu"
    >
      {menuItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            key={index}
            onClick={() => !item.disabled && handleAction(item.action)}
            disabled={item.disabled}
            className={`
              w-full px-4 py-2 text-left flex items-center gap-3 text-sm transition-colors
              ${item.disabled 
                ? 'text-gray-500 cursor-not-allowed' 
                : item.danger
                  ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300'
                  : 'text-gray-300 hover:bg-[#FFD700]/10 hover:text-[#FFD700]'
              }
            `}
            data-testid={`context-menu-${item.label.toLowerCase()}`}
          >
            <Icon className="h-4 w-4" />
            <span className="flex-1">{item.label}</span>
            {item.shortcut && (
              <span className="text-xs text-gray-500">{item.shortcut}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}