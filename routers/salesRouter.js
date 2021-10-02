const express = require('express');

const router = express.Router();

const salesController = require('../controllers/salesController');

router.post('/',
salesController.validateQuantity,
salesController.registerSale);

module.exports = router;