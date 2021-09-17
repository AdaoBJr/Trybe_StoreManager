const express = require('express');
const { StatusCodes } = require('http-status-codes');
const salesService = require('../services/salesService');

const salesRouter = express.Router();

salesRouter.post('/', async (req, res) => {
  const { body } = req;
  const result = await salesService.createSale(body);

  if (result.err) {
    if (result.err.code === 'stock_problem') {
      return res.status(StatusCodes.NOT_FOUND).json(result);
    }

    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(result);
  }
  
  return res.status(StatusCodes.OK).json(result);
});

salesRouter.get('/', async (_req, res) => {
  const result = await salesService.getAllSales();
  return res.status(StatusCodes.OK).json(result);
});

salesRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await salesService.getSaleById(id);

  if (result.err) {
    return res.status(StatusCodes.NOT_FOUND).json(result);
  }

  return res.status(StatusCodes.OK).json(result);
});

salesRouter.put('/:id', async (req, res) => {
  const { params: { id }, body } = req;
  const result = await salesService.updateSaleById(id, body);

  if (result.err) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(result);
  }

  return res.status(StatusCodes.OK).json(result);
});

salesRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await salesService.excludeSaleById(id);

  if (result.err) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(result);
  }

  return res.status(StatusCodes.OK).json(result);
});

module.exports = salesRouter;
