#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🔄 Iniciando rollback para 2025-09-02_17-18-18-390Z...');

// Check if backup exists
const backupFile = path.join(process.cwd(), 'backups', 'backup_2025-09-02_17-18-18-390Z.zip');
if (!fs.existsSync(backupFile)) {
  console.error('❌ Backup não encontrado:', backupFile);
  process.exit(1);
}

try {
  // Create temporary restore directory
  const tempDir = path.join(process.cwd(), 'temp_restore');
  
  // Extract backup
  console.log('📦 Extraindo backup...');
  execSync(`unzip -q "${backupFile}" -d "${tempDir}"`);
  
  // Stop current workflow
  console.log('⏹️ Parando workflow...');
  
  // Backup current state
  const currentBackup = path.join(process.cwd(), 'backups', `before_rollback_${Date.now()}.zip`);
  execSync(`zip -r "${currentBackup}" client server shared package.json`);
  
  // Restore files
  console.log('🔄 Restaurando ficheiros...');
  execSync(`cp -r "${tempDir}"/* .`);
  
  // Reinstall dependencies
  console.log('📦 Reinstalando dependências...');
  execSync('npm install');
  
  // Clean up
  execSync(`rm -rf "${tempDir}"`);
  
  console.log('✅ Rollback concluído!');
  console.log('⚠️ Verifique as variáveis de ambiente no ficheiro env-info.json');
  
} catch (error) {
  console.error('❌ Erro durante rollback:', error.message);
  process.exit(1);
}
