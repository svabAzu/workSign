import fs from 'fs';
import multer from 'multer';
import path from 'path';

const uploadDir = path.join(__dirname, '../../uploads/sketches');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const uploadSketch = multer({ storage });

export default uploadSketch;
