import { useState } from 'react';
import { useVisualEditor } from '@/contexts/VisualEditorContext';
import { 
  Edit3, 
  Eye, 
  Undo, 
  Redo, 
  Monitor, 
  Tablet, 
  Smartphone,
  Save,
  Settings,
  Layers,
  Copy,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function VisualEditorToolbar() {
  const {
    isEditMode,
    toggleEditMode,
    exitEditMode,
    currentBreakpoint,
    setBreakpoint,
    undo,
    redo,
    selectedElementId,
    copyElement,
    pasteElement,
    deleteElement,
    duplicateElement,
    clipboard,
  } = useVisualEditor();


  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(false);

  if (!isEditMode) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={toggleEditMode}
          className="bg-[#FFD700] text-black hover:bg-[#FFC700] shadow-lg"
          data-testid="enter-edit-mode"
        >
          <Edit3 className="h-4 w-4 mr-2" />
          Editar Página
        </Button>
      </div>
    );
  }

  const breakpoints = [
    { key: 'desktop' as const, icon: Monitor, label: 'Desktop', width: '≥ 1024px' },
    { key: 'tablet' as const, icon: Tablet, label: 'Tablet', width: '768px - 1023px' },
    { key: 'mobile' as const, icon: Smartphone, label: 'Mobile', width: '< 768px' },
  ];

  return (
    <>
      {/* Main toolbar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl z-50 p-2">
        <div className="flex items-center gap-2">
          {/* Mode toggle */}
          <Button
            onClick={exitEditMode}
            variant="outline"
            size="sm"
            className="border-[#333] hover:bg-[#222]"
            data-testid="exit-edit-mode"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>

          <div className="w-px h-6 bg-[#333]" />

          {/* History */}
          <Button
            onClick={undo}
            variant="outline"
            size="sm"
            className="border-[#333] hover:bg-[#222]"
            data-testid="undo-button"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            onClick={redo}
            variant="outline"
            size="sm"
            className="border-[#333] hover:bg-[#222]"
            data-testid="redo-button"
          >
            <Redo className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-[#333]" />

          {/* Responsive design controls */}
          <div className="flex items-center gap-1 bg-[#111] rounded p-1">
            {breakpoints.map((bp) => {
              const Icon = bp.icon;
              return (
                <Button
                  key={bp.key}
                  onClick={() => setBreakpoint(bp.key)}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-8 w-8 p-0',
                    currentBreakpoint === bp.key
                      ? 'bg-[#FFD700] text-black'
                      : 'text-gray-400 hover:text-white hover:bg-[#222]'
                  )}
                  title={`${bp.label} (${bp.width})`}
                  data-testid={`breakpoint-${bp.key}`}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              );
            })}
          </div>

          <div className="w-px h-6 bg-[#333]" />

          {/* Element actions (when element is selected) */}
          {selectedElementId && (
            <>
              <Button
                onClick={() => copyElement(selectedElementId)}
                variant="outline"
                size="sm"
                className="border-[#333] hover:bg-[#222]"
                data-testid="copy-element"
              >
                <Copy className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={() => duplicateElement(selectedElementId)}
                variant="outline"
                size="sm"
                className="border-[#333] hover:bg-[#222]"
                data-testid="duplicate-element"
              >
                <Layers className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={() => deleteElement(selectedElementId)}
                variant="outline"
                size="sm"
                className="border-red-600 text-red-400 hover:bg-red-900/20"
                data-testid="delete-element"
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              <div className="w-px h-6 bg-[#333]" />
            </>
          )}

          {/* Paste (when clipboard has content) */}
          {clipboard && (
            <>
              <Button
                onClick={pasteElement}
                variant="outline"
                size="sm"
                className="border-[#333] hover:bg-[#222]"
                data-testid="paste-element"
              >
                Colar
              </Button>
              <div className="w-px h-6 bg-[#333]" />
            </>
          )}

          {/* Properties panel toggle */}
          <Button
            onClick={() => setIsPropertiesPanelOpen(!isPropertiesPanelOpen)}
            variant="outline"
            size="sm"
            className={cn(
              'border-[#333] hover:bg-[#222]',
              isPropertiesPanelOpen && 'bg-[#FFD700] text-black'
            )}
            data-testid="properties-panel-toggle"
          >
            <Settings className="h-4 w-4" />
          </Button>

          {/* Save */}
          <Button
            onClick={() => {
              // TODO: Implement save functionality
              console.log('Saving...');
            }}
            className="bg-[#FFD700] text-black hover:bg-[#FFC700]"
            size="sm"
            data-testid="save-button"
          >
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
        </div>
      </div>

      {/* Breakpoint indicator */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-[#1a1a1a] border border-[#333] rounded px-3 py-1 z-40">
        <span className="text-sm text-gray-400">
          {breakpoints.find(bp => bp.key === currentBreakpoint)?.label} 
          <span className="text-[#FFD700] ml-2">
            {breakpoints.find(bp => bp.key === currentBreakpoint)?.width}
          </span>
        </span>
      </div>

      {/* Properties panel overlay */}
      {isPropertiesPanelOpen && selectedElementId && (
        <div className="fixed inset-y-0 right-0 w-80 bg-[#1a1a1a] border-l border-[#333] z-40 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#FFD700]">Propriedades</h3>
            <Button
              onClick={() => setIsPropertiesPanelOpen(false)}
              variant="ghost"
              size="sm"
              data-testid="close-properties-panel"
            >
              ✕
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ID do Elemento
              </label>
              <input
                type="text"
                value={selectedElementId}
                readOnly
                className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-sm text-gray-400"
              />
            </div>
            
            {/* TODO: Add more property controls based on element type */}
            <div className="text-sm text-gray-500">
              Mais controlos de propriedades serão adicionados aqui...
            </div>
          </div>
        </div>
      )}
    </>
  );
}