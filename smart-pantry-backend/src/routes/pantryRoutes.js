const express = require('express');
const router = express.Router();
const multer = require('multer');
const pantryController = require('../controllers/pantryController');

// Configure multer for image uploads (store in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PNG, JPG, JPEG, and WEBP images are allowed'));
    }
  },
});

// ── CRUD Routes ──
router.get('/',          pantryController.getAllItems);
router.get('/low-stock', pantryController.getLowStockItems);
router.get('/expiring',  pantryController.getExpiringItems);
router.get('/:id',       pantryController.getItemById);
router.post('/',         pantryController.addItem);
router.put('/:id',       pantryController.updateItem);
router.delete('/:id',    pantryController.deleteItem);

// ── Upload Routes ──
router.post('/upload/text',  pantryController.uploadTextList);
router.post('/upload/image', upload.single('image'), pantryController.uploadImage);

module.exports = router;