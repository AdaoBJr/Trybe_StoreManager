const saleModel = require('../models/saleModel');

const getAllService = async () => {
  const allSales = await saleModel.getAll();
  return allSales;
};

const createService = async (itensSold) => {
  const sale = await saleModel.create(itensSold);
  return sale;
};

module.exports = {
  getAllService,
  createService,
};
