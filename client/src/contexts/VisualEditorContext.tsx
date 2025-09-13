import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface EditableElement {
  id: string;
  type: 'text' | 'image' | 'container' | 'button';
  content: any;
  styles: Record<string, any>;
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
}

export interface ResponsiveStyles {
  mobile: Record<string, any>;
  tablet: Record<string, any>;
  desktop: Record<string, any>;
}

export interface VisualEditorState {
  isEditMode: boolean;
  selectedElementId: string | null;
  hoveredElementId: string | null;
  currentBreakpoint: 'mobile' | 'tablet' | 'desktop';
  elements: Record<string, EditableElement>;
  history: Record<string, EditableElement>[];
  historyIndex: number;
  clipboard: EditableElement | null;
}

interface VisualEditorContextType extends VisualEditorState {
  // Mode management
  toggleEditMode: () => void;
  exitEditMode: () => void;
  
  // Element selection
  selectElement: (id: string | null) => void;
  hoverElement: (id: string | null) => void;
  
  // Element management
  updateElement: (id: string, updates: Partial<EditableElement>) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  moveElement: (id: string, newPosition: { x: number; y: number }) => void;
  resizeElement: (id: string, newSize: { width: number | string; height: number | string }) => void;
  
  // Responsive design
  setBreakpoint: (breakpoint: 'mobile' | 'tablet' | 'desktop') => void;
  
  // History management
  undo: () => void;
  redo: () => void;
  
  // Clipboard
  copyElement: (id: string) => void;
  pasteElement: () => void;
  
  // Content editing
  updateElementContent: (id: string, content: any) => void;
  updateElementStyles: (id: string, styles: Record<string, any>) => void;
}

const initialState: VisualEditorState = {
  isEditMode: false,
  selectedElementId: null,
  hoveredElementId: null,
  currentBreakpoint: 'desktop',
  elements: {},
  history: [{}],
  historyIndex: 0,
  clipboard: null,
};

const VisualEditorContext = createContext<VisualEditorContextType | null>(null);

export function VisualEditorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VisualEditorState>(initialState);

  const addToHistory = useCallback((elements: Record<string, EditableElement>) => {
    setState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(elements);
      return {
        ...prev,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        elements,
      };
    });
  }, []);

  const toggleEditMode = useCallback(() => {
    console.log('🎨 Toggle Edit Mode chamado!');
    setState(prev => {
      console.log('🎨 Estado anterior:', { isEditMode: prev.isEditMode });
      const newState = { ...prev, isEditMode: !prev.isEditMode };
      console.log('🎨 Novo estado:', { isEditMode: newState.isEditMode });
      return newState;
    });
  }, []);

  const exitEditMode = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isEditMode: false, 
      selectedElementId: null,
      hoveredElementId: null,
    }));
  }, []);

  const selectElement = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedElementId: id }));
  }, []);

  const hoverElement = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, hoveredElementId: id }));
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<EditableElement>) => {
    setState(prev => {
      const newElements = {
        ...prev.elements,
        [id]: { ...prev.elements[id], ...updates }
      };
      addToHistory(newElements);
      return { ...prev, elements: newElements };
    });
  }, [addToHistory]);

  const deleteElement = useCallback((id: string) => {
    setState(prev => {
      const newElements = { ...prev.elements };
      delete newElements[id];
      addToHistory(newElements);
      return { 
        ...prev, 
        elements: newElements,
        selectedElementId: prev.selectedElementId === id ? null : prev.selectedElementId
      };
    });
  }, [addToHistory]);

  const duplicateElement = useCallback((id: string) => {
    const element = state.elements[id];
    if (!element) return;

    const newId = `${id}-copy-${Date.now()}`;
    const newElement: EditableElement = {
      ...element,
      id: newId,
      position: {
        x: element.position.x + 20,
        y: element.position.y + 20,
      }
    };

    setState(prev => {
      const newElements = { ...prev.elements, [newId]: newElement };
      addToHistory(newElements);
      return { ...prev, elements: newElements, selectedElementId: newId };
    });
  }, [state.elements, addToHistory]);

  const moveElement = useCallback((id: string, newPosition: { x: number; y: number }) => {
    updateElement(id, { position: newPosition });
  }, [updateElement]);

  const resizeElement = useCallback((id: string, newSize: { width: number | string; height: number | string }) => {
    updateElement(id, { size: newSize });
  }, [updateElement]);

  const setBreakpoint = useCallback((breakpoint: 'mobile' | 'tablet' | 'desktop') => {
    setState(prev => ({ ...prev, currentBreakpoint: breakpoint }));
  }, []);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex > 0) {
        const newIndex = prev.historyIndex - 1;
        return {
          ...prev,
          elements: prev.history[newIndex],
          historyIndex: newIndex,
        };
      }
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex < prev.history.length - 1) {
        const newIndex = prev.historyIndex + 1;
        return {
          ...prev,
          elements: prev.history[newIndex],
          historyIndex: newIndex,
        };
      }
      return prev;
    });
  }, []);

  const copyElement = useCallback((id: string) => {
    const element = state.elements[id];
    if (element) {
      setState(prev => ({ ...prev, clipboard: element }));
    }
  }, [state.elements]);

  const pasteElement = useCallback(() => {
    if (!state.clipboard) return;

    const newId = `${state.clipboard.id}-paste-${Date.now()}`;
    const newElement: EditableElement = {
      ...state.clipboard,
      id: newId,
      position: {
        x: state.clipboard.position.x + 20,
        y: state.clipboard.position.y + 20,
      }
    };

    setState(prev => {
      const newElements = { ...prev.elements, [newId]: newElement };
      addToHistory(newElements);
      return { ...prev, elements: newElements, selectedElementId: newId };
    });
  }, [state.clipboard, addToHistory]);

  const updateElementContent = useCallback((id: string, content: any) => {
    updateElement(id, { content });
  }, [updateElement]);

  const updateElementStyles = useCallback((id: string, styles: Record<string, any>) => {
    setState(prev => {
      const element = prev.elements[id];
      if (!element) return prev;

      const newStyles = { ...element.styles, ...styles };
      const newElements = {
        ...prev.elements,
        [id]: { ...element, styles: newStyles }
      };
      
      addToHistory(newElements);
      return { ...prev, elements: newElements };
    });
  }, [addToHistory]);

  const value: VisualEditorContextType = {
    ...state,
    toggleEditMode,
    exitEditMode,
    selectElement,
    hoverElement,
    updateElement,
    deleteElement,
    duplicateElement,
    moveElement,
    resizeElement,
    setBreakpoint,
    undo,
    redo,
    copyElement,
    pasteElement,
    updateElementContent,
    updateElementStyles,
  };

  return (
    <VisualEditorContext.Provider value={value}>
      {children}
    </VisualEditorContext.Provider>
  );
}

export function useVisualEditor() {
  const context = useContext(VisualEditorContext);
  if (!context) {
    throw new Error('useVisualEditor must be used within a VisualEditorProvider');
  }
  return context;
}