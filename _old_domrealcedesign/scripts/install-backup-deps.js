#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('📦 Instalando dependências para sistema de backup...');

try {
  execSync('npm install archiver --save-dev', { stdio: 'inherit' });
  console.log('✅ Dependência archiver instalada');
} catch (error) {
  console.error('❌ Erro ao instalar dependências:', error.message);
  process.exit(1);
}