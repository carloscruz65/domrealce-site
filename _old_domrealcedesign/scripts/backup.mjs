#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
                   new Date().toISOString().replace(/[:.]/g, '-').split('T')[1].split('.')[0];
  
  const backupDir = path.join(process.cwd(), 'backups');
  const backupFile = path.join(backupDir, `backup_${timestamp}.zip`);
  
  // Ensure backup directory exists
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // Create zip archive
  const output = fs.createWriteStream(backupFile);
  const archive = archiver('zip', { zlib: { level: 9 } });

  archive.pipe(output);

  // Add essential files
  const filesToBackup = [
    'client/',
    'server/',
    'shared/',
    'package.json',
    'package-lock.json',
    'tsconfig.json',
    'vite.config.ts',
    'tailwind.config.ts',
    'drizzle.config.ts',
    'replit.md'
  ];

  filesToBackup.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      if (fs.statSync(fullPath).isDirectory()) {
        archive.directory(fullPath, file);
      } else {
        archive.file(fullPath, { name: file });
      }
    }
  });

  // Save environment variables info (without actual values)
  const envInfo = {
    timestamp,
    requiredSecrets: [
      'OBJECT_STORAGE_ENDPOINT',
      'OBJECT_STORAGE_BUCKET', 
      'OBJECT_STORAGE_ACCESS_KEY',
      'OBJECT_STORAGE_SECRET_KEY',
      'OBJECT_STORAGE_PUBLIC_URL_BASE',
      'IFTHENPAY_MBWAY_KEY',
      'IFTHENPAY_MB_KEY',
      'IFTHENPAY_PAYSHOP_KEY',
      'IFTHENPAY_ANTI_PHISHING_KEY',
      'VITE_GA_MEASUREMENT_ID'
    ],
    availableSecrets: Object.keys(process.env).filter(key => 
      key.includes('OBJECT_STORAGE') || 
      key.includes('IFTHENPAY') || 
      key.includes('ADMIN') ||
      key.includes('JWT') ||
      key.includes('GA_MEASUREMENT')
    )
  };

  archive.append(JSON.stringify(envInfo, null, 2), { name: 'env-info.json' });

  await archive.finalize();

  return new Promise((resolve, reject) => {
    output.on('close', () => {
      console.log(`✅ Backup criado: ${backupFile}`);
      console.log(`📦 Tamanho: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
      resolve(backupFile);
    });

    archive.on('error', reject);
  });
}

// Generate rollback script
function generateRollbackScript(timestamp) {
  const rollbackScript = `#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🔄 Iniciando rollback para ${timestamp}...');

// Check if backup exists
const backupFile = path.join(process.cwd(), 'backups', 'backup_${timestamp}.zip');
if (!fs.existsSync(backupFile)) {
  console.error('❌ Backup não encontrado:', backupFile);
  process.exit(1);
}

try {
  // Create temporary restore directory
  const tempDir = path.join(process.cwd(), 'temp_restore');
  
  // Extract backup
  console.log('📦 Extraindo backup...');
  execSync(\`unzip -q "\${backupFile}" -d "\${tempDir}"\`);
  
  // Stop current workflow
  console.log('⏹️ Parando workflow...');
  
  // Backup current state
  const currentBackup = path.join(process.cwd(), 'backups', \`before_rollback_\${Date.now()}.zip\`);
  execSync(\`zip -r "\${currentBackup}" client server shared package.json\`);
  
  // Restore files
  console.log('🔄 Restaurando ficheiros...');
  execSync(\`cp -r "\${tempDir}"/* .\`);
  
  // Reinstall dependencies
  console.log('📦 Reinstalando dependências...');
  execSync('npm install');
  
  // Clean up
  execSync(\`rm -rf "\${tempDir}"\`);
  
  console.log('✅ Rollback concluído!');
  console.log('⚠️ Verifique as variáveis de ambiente no ficheiro env-info.json');
  
} catch (error) {
  console.error('❌ Erro durante rollback:', error.message);
  process.exit(1);
}
`;

  const scriptPath = path.join(process.cwd(), 'scripts', `rollback_${timestamp}.mjs`);
  fs.writeFileSync(scriptPath, rollbackScript);
  fs.chmodSync(scriptPath, '755');
  
  console.log(`📜 Script de rollback criado: ${scriptPath}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  createBackup()
    .then(backupFile => {
      const timestamp = path.basename(backupFile, '.zip').replace('backup_', '');
      generateRollbackScript(timestamp);
    })
    .catch(console.error);
}

export { createBackup };