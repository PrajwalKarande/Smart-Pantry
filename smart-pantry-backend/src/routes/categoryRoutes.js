const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.post('/auto-map',           categoryController.autoCategorize);
router.get('/storage-suggestion',  categoryController.getStorageSuggestion);

module.exports = router;