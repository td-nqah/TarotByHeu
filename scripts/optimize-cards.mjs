import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE_DIR = 'C:\\Users\\ADMIN\\Downloads\\Tarot_Card';
const TARGET_DIR = path.resolve('public/cards');
const TARGET_WIDTH = 480;
const TARGET_HEIGHT = 918;

async function main() {
  await fs.mkdir(TARGET_DIR, { recursive: true });
  const entries = await fs.readdir(SOURCE_DIR, { withFileTypes: true });
  const pngFiles = entries.filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.png'));

  if (pngFiles.length === 0) {
    throw new Error(`No PNG files found in ${SOURCE_DIR}`);
  }

  console.log(`Converting ${pngFiles.length} card images to WebP (${TARGET_WIDTH}x${TARGET_HEIGHT})...`);

  const concurrency = 6;
  let index = 0;
  let converted = 0;

  async function worker() {
    while (index < pngFiles.length) {
      const current = pngFiles[index++];
      const srcPath = path.join(SOURCE_DIR, current.name);
      const outName =
        current.name === 'the-fool-card-donghua-2k.png'
          ? 'major-00-the-fool.webp'
          : current.name.replace(/\.png$/i, '.webp');
      const outPath = path.join(TARGET_DIR, outName);

      await sharp(srcPath)
        .resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: 'cover' })
        .webp({ quality: 82, effort: 4 })
        .toFile(outPath);

      converted++;
      if (converted % 20 === 0 || converted === pngFiles.length) {
        console.log(`Processed ${converted}/${pngFiles.length}`);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  const finalFiles = (await fs.readdir(TARGET_DIR)).filter((f) => f.endsWith('.webp'));
  console.log(`Done! Total WebP files in public/cards: ${finalFiles.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
