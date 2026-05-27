import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsSiteRoot = path.resolve(__dirname, '..');
const workspaceRoot = path.resolve(docsSiteRoot, '..');
const frontendRoot = path.join(workspaceRoot, 'lost-last-frontend');
const backendRoot = path.join(workspaceRoot, 'lost-last');

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run('npm', ['run', 'docs'], frontendRoot);
run('go', ['run', './cmd/docs'], backendRoot);
