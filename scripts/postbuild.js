import fs from 'fs';
import path from 'path';

const src = path.resolve(process.cwd(), 'dist', 'public');
const dest = path.resolve(process.cwd(), 'dist', 'server', 'public');

async function copyDir(srcDir, destDir) {
  await fs.promises.mkdir(destDir, { recursive: true });
  const entries = await fs.promises.readdir(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

(async () => {
  try {
    if (!fs.existsSync(src)) {
      console.warn(`Source client build not found at ${src}, skipping copy`);
      process.exit(0);
    }
    await copyDir(src, dest);
    console.log(`Copied client build from ${src} to ${dest}`);
    process.exit(0);
  } catch (err) {
    console.error('postbuild copy failed', err);
    process.exit(1);
  }
})();
