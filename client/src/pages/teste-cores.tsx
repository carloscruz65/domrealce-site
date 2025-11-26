import ScrollToTop from "@/components/scroll-to-top";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export default function TesteCores() {
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [borderColor, setBorderColor] = useState('#000000');
  const [customCSS, setCustomCSS] = useState('');

  const testarToast = () => {
    const toastStyle = {
      backgroundColor: bgColor,
      color: textColor,
      border: `2px solid ${borderColor}`,
      ...parseCustomCSS(customCSS)
    };

    toast({
      title: "✅ Referência Multibanco gerada",
      description: `🏦 Entidade: 11249 | 🔢 Referência: 123456789 | 💰 Valor: €43,05`,
      style: toastStyle,
      duration: 8000,
    });
  };

  const parseCustomCSS = (css: string) => {
    const styles: any = {};
    if (!css) return styles;
    
    const rules = css.split(';').filter(rule => rule.trim());
    rules.forEach(rule => {
      const [property, value] = rule.split(':').map(s => s.trim());
      if (property && value) {
        const camelCase = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        styles[camelCase] = value;
      }
    });
    return styles;
  };

  const copiarCSS = () => {
    const cssCompleto = `
backgroundColor: '${bgColor}',
color: '${textColor}',
border: '2px solid ${borderColor}',
${customCSS ? Object.entries(parseCustomCSS(customCSS)).map(([k, v]) => `${k}: '${v}'`).join(',\n') : ''}
    `.trim();
    navigator.clipboard.writeText(cssCompleto);
    alert('CSS copiado!');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🎨 Teste de Cores para Toasts</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Controlos */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Controlos de Cor</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Cor de Fundo:</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={bgColor} 
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-12 h-10 rounded border"
                  />
                  <input 
                    type="text" 
                    value={bgColor} 
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cor do Texto:</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={textColor} 
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-12 h-10 rounded border"
                  />
                  <input 
                    type="text" 
                    value={textColor} 
                    onChange={(e) => setTextColor(e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cor da Borda:</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={borderColor} 
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="w-12 h-10 rounded border"
                  />
                  <input 
                    type="text" 
                    value={borderColor} 
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">CSS Personalizado:</label>
                <textarea 
                  value={customCSS}
                  onChange={(e) => setCustomCSS(e.target.value)}
                  className="w-full p-2 border rounded h-24"
                  placeholder="font-weight: bold; font-size: 16px; text-shadow: 1px 1px 1px #000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formato: propriedade: valor; (ex: font-weight: bold; font-size: 18px;)
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button onClick={testarToast} className="flex-1">
                🧪 Testar Toast
              </Button>
              <Button onClick={copiarCSS} variant="outline">
                📋 Copiar CSS
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Pré-visualização</h2>
            
            <div 
              className="p-4 rounded border-2 mb-4"
              style={{
                backgroundColor: bgColor,
                color: textColor,
                border: `2px solid ${borderColor}`,
                ...parseCustomCSS(customCSS)
              }}
            >
              <div className="font-semibold mb-2">✅ Referência Multibanco gerada</div>
              <div>🏦 Entidade: 11249 | 🔢 Referência: 123456789 | 💰 Valor: €43,05</div>
            </div>

            <div className="bg-gray-50 p-3 rounded text-sm">
              <strong>CSS Actual:</strong>
              <pre className="mt-2 text-xs overflow-auto">
{`style: {
  backgroundColor: '${bgColor}',
  color: '${textColor}',
  border: '2px solid ${borderColor}',
${customCSS ? Object.entries(parseCustomCSS(customCSS)).map(([k, v]) => `  ${k}: '${v}'`).join(',\n') + ',' : ''}
}`}
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 p-4 rounded">
          <h3 className="font-semibold mb-2">💡 Dicas:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Usa <code>!important</code> no CSS personalizado se as cores não aparecerem</li>
            <li>Exemplo: <code>color: #000000 !important; background-color: #ffffff !important</code></li>
            <li>Testa com diferentes combinações até encontrares a que funciona</li>
            <li>Copia o CSS final e aplica no código</li>
          </ul>
        </div>
      </div>
          <ScrollToTop />
</div>
  );
}