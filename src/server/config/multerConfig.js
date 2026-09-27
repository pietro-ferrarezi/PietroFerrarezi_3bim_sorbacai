// multerConfig.js
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(), // não salva em disco, fica em req.file.buffer
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas!'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;