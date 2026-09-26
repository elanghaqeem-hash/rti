import { exec } from 'child_process';
import fs from 'fs';

let timeout = null;
const DEBOUNCE_MS = 3000;

function sync() {
  console.log('\n[Auto-Push] Menemukan perubahan file, melakukan commit & push...');
  exec('git add -A && git commit -m "Auto sync: ' + new Date().toLocaleString() + '" && git push origin main', (err, stdout, stderr) => {
    if (err) {
      if ((stdout && stdout.includes('nothing to commit')) || (stderr && stderr.includes('nothing to commit'))) {
        console.log('[Auto-Push] Tidak ada file baru yang perlu di-commit.');
      } else {
        console.error('[Auto-Push] Gagal push:', stderr || err.message);
      }
    } else {
      console.log('[Auto-Push] Berhasil ter-push ke GitHub!\n' + stdout);
    }
  });
}

function onChange(eventType, filename) {
  if (!filename) return;
  if (
    filename.startsWith('.git') ||
    filename.includes('node_modules') ||
    filename.includes('.next') ||
    filename.includes('.swp') ||
    filename.includes('.log') ||
    filename.endsWith('.tmp')
  ) {
    return;
  }

  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(sync, DEBOUNCE_MS);
}

fs.watch(process.cwd(), { recursive: true }, onChange);
console.log('>>> [Auto-Push] File watcher aktif! Setiap kali Anda menyimpan file, perubahan akan otomatis di-commit & di-push ke GitHub (https://github.com/elanghaqeem-hash/rti).');
