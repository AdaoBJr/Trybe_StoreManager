const express = require('express');
const productService = require('../services/productService');

const productRouter = express.Router();

productRouter.post('/', async (req, res) => {
  const { name, quantity } = req.body;
  const { status, messageResult } = await productService.createProduct({ name, quantity });

  return res.status(status).json(messageResult);
});

module.exports = {
  productRouter,
};
