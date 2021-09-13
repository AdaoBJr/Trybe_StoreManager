const express = require('express');

const router = express.Router();
const productController = require('../controllers/productController');

router.post('/', productController.createProduct);
router.get('/', productController.getAll);
router.get('/:id', productController.getProductById);

// router.put('/:id', productController.put);
// router.delete('/:id', productController.delete);

module.exports = router;