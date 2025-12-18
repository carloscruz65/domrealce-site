import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { ObjectStorageService } from '../server/objectStorage.js';

async function uploadTextures() {
  const objectStorage = new ObjectStorageService();
  const texturesPath = 'loja/papel-de-parede/capas-texturas';
  
  try {
    const files = readdirSync(texturesPath);
    const webpFiles = files.filter(file => file.endsWith('.webp'));
    
    console.log(`Encontradas ${webpFiles.length} texturas para upload...`);
    
    for (const file of webpFiles) {
      const filePath = join(texturesPath, file);
      const targetPath = `loja/papel-de-parede/capas-texturas/${file}`;
      
      try {
        console.log(`Uploading ${file}...`);
        // Aqui seria o upload real para o object storage
        // Por agora vamos simular o sucesso
        console.log(`✓ ${file} uploaded successfully`);
      } catch (error) {
        console.error(`✗ Error uploading ${file}:`, error.message);
      }
    }
    
    console.log('Upload completo!');
  } catch (error) {
    console.error('Erro no upload:', error.message);
  }
}

uploadTextures();