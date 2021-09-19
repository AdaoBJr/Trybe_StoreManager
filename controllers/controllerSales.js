const express = require('express');
const rescue = require('express-rescue');
const { validateSales } = require('../validate/validateSales');
const { insertSales } = require('../services/servicesSales');

const route = express.Router();

route.post('/', validateSales, rescue(async (req, res) => {
  const result = await insertSales(req.body);
  const newSales = {
    _id: result.insertedId,
    itensSold: req.body,
  };
  res.status(200).json(newSales);
}));

route.get('/', rescue(async (_req, res) => {
  res.status(200).json('right');
}));

module.exports = route;
