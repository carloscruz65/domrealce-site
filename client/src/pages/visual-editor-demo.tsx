import { EditableElement, InlineTextEditor, VisualEditorToolbar } from '@/components/visual-editor';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';

export default function VisualEditorDemo() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />
      <VisualEditorToolbar />
      
      <main className="pt-16">
        {/* Hero Section - Editável */}
        <EditableElement 
          id="hero-section" 
          className="relative py-24 px-40a0a0a]1a1a1a]"
        >
          <div className="container mx-auto text-center">
            <EditableElement 
              id="hero-title"
              tag="h1" 
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <InlineTextEditor
                elementId="hero-title"
                initialText="Editor Visual DOMREALCE"
                className="FFD700]FFA500] bg-clip-text text-transparent"
              />
            </EditableElement>
            
            <EditableElement 
              id="hero-subtitle"
              tag="div" 
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              <InlineTextEditor
                elementId="hero-subtitle"
                initialText="Edite qualquer elemento do seu site diretamente no navegador - como o Plasmic!"
                multiline={true}
              />
            </EditableElement>
            
            <EditableElement 
              id="hero-cta"
              className="inline-block"
            >
              <button className="bg-[#FFD700] text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#FFC700] transition-colors">
                <InlineTextEditor
                  elementId="hero-cta"
                  initialText="Começar a Editar"
                />
              </button>
            </EditableElement>
          </div>
        </EditableElement>

        {/* Features Grid - Editável */}
        <EditableElement 
          id="features-section" 
          className="py-24 px-4"
        >
          <div className="container mx-auto">
            <EditableElement 
              id="features-title"
              tag="h2" 
              className="text-4xl font-bold text-center mb-16"
            >
              <InlineTextEditor
                elementId="features-title"
                initialText="Funcionalidades do Editor Visual"
                className="text-[#FFD700]"
              />
            </EditableElement>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <EditableElement 
                id="feature-1" 
                className="bg-[#111111] p-8 rounded-lg border border-[#333]"
              >
                <EditableElement 
                  id="feature-1-title"
                  tag="h3" 
                  className="text-xl font-semibold mb-4"
                >
                  <InlineTextEditor
                    elementId="feature-1-title"
                    initialText="✏️ Edição Inline"
                    className="text-[#FFD700]"
                  />
                </EditableElement>
                <EditableElement 
                  id="feature-1-desc"
                  tag="div" 
                  className="text-gray-300"
                >
                  <InlineTextEditor
                    elementId="feature-1-desc"
                    initialText="Edite textos diretamente no site com duplo clique. Sem formulários complicados!"
                    multiline={true}
                  />
                </EditableElement>
              </EditableElement>

              {/* Feature 2 */}
              <EditableElement 
                id="feature-2" 
                className="bg-[#111111] p-8 rounded-lg border border-[#333]"
              >
                <EditableElement 
                  id="feature-2-title"
                  tag="h3" 
                  className="text-xl font-semibold mb-4"
                >
                  <InlineTextEditor
                    elementId="feature-2-title"
                    initialText="📐 Redimensionar Visual"
                    className="text-[#FFD700]"
                  />
                </EditableElement>
                <EditableElement 
                  id="feature-2-desc"
                  tag="div" 
                  className="text-gray-300"
                >
                  <InlineTextEditor
                    elementId="feature-2-desc"
                    initialText="Arraste os cantos para redimensionar elementos. Controles visuais intuitivos."
                    multiline={true}
                  />
                </EditableElement>
              </EditableElement>

              {/* Feature 3 */}
              <EditableElement 
                id="feature-3" 
                className="bg-[#111111] p-8 rounded-lg border border-[#333]"
              >
                <EditableElement 
                  id="feature-3-title"
                  tag="h3" 
                  className="text-xl font-semibold mb-4"
                >
                  <InlineTextEditor
                    elementId="feature-3-title"
                    initialText="📱 Design Responsivo"
                    className="text-[#FFD700]"
                  />
                </EditableElement>
                <EditableElement 
                  id="feature-3-desc"
                  tag="div" 
                  className="text-gray-300"
                >
                  <InlineTextEditor
                    elementId="feature-3-desc"
                    initialText="Teste e edite para mobile, tablet e desktop. Visualização em tempo real."
                    multiline={true}
                  />
                </EditableElement>
              </EditableElement>
            </div>
          </div>
        </EditableElement>

        {/* Demo Section */}
        <EditableElement 
          id="demo-section" 
          className="py-24 px-4 bg-[#111111]"
        >
          <div className="container mx-auto text-center">
            <EditableElement 
              id="demo-title"
              tag="h2" 
              className="text-4xl font-bold mb-8"
            >
              <InlineTextEditor
                elementId="demo-title"
                initialText="Experimente Agora!"
                className="text-[#FFD700]"
              />
            </EditableElement>
            
            <EditableElement 
              id="demo-desc"
              tag="div" 
              className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
            >
              <InlineTextEditor
                elementId="demo-desc"
                initialText="Clique no botão 'Editar' no canto inferior esquerdo para ativar o modo de edição. Depois pode editar qualquer elemento desta página!"
                multiline={true}
              />
            </EditableElement>

            <div className="bg-[#0a0a0a] p-8 rounded-lg border-2 border-dashed border-[#FFD700] max-w-md mx-auto">
              <EditableElement 
                id="demo-box-title"
                tag="h3" 
                className="text-2xl font-bold mb-4"
              >
                <InlineTextEditor
                  elementId="demo-box-title"
                  initialText="Caixa de Demonstração"
                  className="text-[#FFD700]"
                />
              </EditableElement>
              
              <EditableElement 
                id="demo-box-text"
                tag="div" 
                className="text-gray-300"
              >
                <InlineTextEditor
                  elementId="demo-box-text"
                  initialText="Esta caixa pode ser editada, movida e redimensionada quando o modo de edição estiver ativo."
                  multiline={true}
                />
              </EditableElement>
            </div>
          </div>
        </EditableElement>

        {/* Instructions Section */}
        <EditableElement 
          id="instructions-section" 
          className="py-24 px-4"
        >
          <div className="container mx-auto">
            <EditableElement 
              id="instructions-title"
              tag="h2" 
              className="text-3xl font-bold text-center mb-16"
            >
              <InlineTextEditor
                elementId="instructions-title"
                initialText="Como Usar o Editor"
                className="text-[#FFD700]"
              />
            </EditableElement>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#FFD700] text-black rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-[#FFD700]">Ativar Modo de Edição</h3>
                      <p className="text-gray-300">Clique no botão "✏️ Editar" no canto inferior esquerdo</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#FFD700] text-black rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-[#FFD700]">Editar Texto</h3>
                      <p className="text-gray-300">Duplo clique em qualquer texto para editá-lo inline</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#FFD700] text-black rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-[#FFD700]">Mover Elementos</h3>
                      <p className="text-gray-300">Clique e arraste elementos para reposicioná-los</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#FFD700] text-black rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-[#FFD700]">Redimensionar</h3>
                      <p className="text-gray-300">Use os handles nos cantos para redimensionar elementos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#FFD700] text-black rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">5</div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-[#FFD700]">Menu de Contexto</h3>
                      <p className="text-gray-300">Clique com o botão direito para copiar, duplicar ou eliminar</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#FFD700] text-black rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">6</div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-[#FFD700]">Preview e Guardar</h3>
                      <p className="text-gray-300">Use o botão "Preview" para ver as mudanças sem editar</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </EditableElement>
      </main>
      
      <Footer />
    </div>
  );
}
