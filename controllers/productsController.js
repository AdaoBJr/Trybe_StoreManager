const express = require('express');
const { StatusCode } = require('http-status-codes');
const productsService = require('../services/productsService');

const productsRouter = express.Router();

productsRouter.post('/', (req, res) => {
  const { body } = req;
  const result = productsService.createProduct(body);
  return res.StatusCode(StatusCode.OK).json(result);
});

module.exports = { productsRouter };
