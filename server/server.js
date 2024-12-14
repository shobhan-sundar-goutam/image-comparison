import cors from 'cors';
import express, { json, urlencoded } from 'express';
import { writeFileSync } from 'fs';
import multer, { memoryStorage } from 'multer';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import sharp from 'sharp';

const app = express();

const storage = memoryStorage();
const upload = multer({ storage });

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5173', 'https://image-comparison.netlify.app'],
  })
);

async function processImage(buffer, width, height) {
  return sharp(buffer).resize(width, height).png().toBuffer();
}

function decodePNG(buffer) {
  return PNG.sync.read(buffer);
}

function compareImages(img1, img2) {
  const { width, height } = img1;
  const diff = new PNG({ width, height });

  const diffPixelCount = pixelmatch(
    img1.data,
    img2.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 }
  );

  const totalPixels = width * height;
  const similarity = ((1 - diffPixelCount / totalPixels) * 100).toFixed(2);
  return { similarity, diff };
}

app.post(
  '/compare',
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const files = req.files;
      if (!files.image1 || !files.image2) {
        return res.status(400).send({ error: 'Both images are required' });
      }

      const imageBuffer = req.files.image1[0].buffer;

      const image1Metadata = await sharp(imageBuffer).metadata();

      const [img1Buffer, img2Buffer] = await Promise.all([
        processImage(
          files.image1[0].buffer,
          image1Metadata.width,
          image1Metadata.height
        ),
        processImage(
          files.image2[0].buffer,
          image1Metadata.width,
          image1Metadata.height
        ),
      ]);

      const img1 = decodePNG(img1Buffer);
      const img2 = decodePNG(img2Buffer);

      const { similarity, diff } = compareImages(img1, img2);

      const diffPath = './diff.png';
      writeFileSync(diffPath, PNG.sync.write(diff));

      res.status(200).json({ similarity });
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: 'Internal server error' });
    }
  }
);

app.listen(4000, () => console.log('Server running on http://localhost:4000'));
