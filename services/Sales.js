const model = require('../models/Sales');

const validateSale = (sale) => {
  sale.forEach((item) => {
    if (item.quantity < 1 || typeof item.quantity !== 'number') {
      const error = new Error();
      error.statusCode = 'invalidSale';
      throw error;
    }
  });
};

const isValidSale = (sale) => {
  if (!sale) {
    const error = new Error();
    error.statusCode = 'saleNotFound';
    throw error;
  }
};

const getAll = () => model.getAll();

const getById = async (id) => {
  const result = await model.getById(id);
  isValidSale(result);
  return result;
};

const newSale = async (sale) => {
  validateSale(sale);
  const result = await model.newSale(sale);
  return result;
};

const updateSale = async (id, sale) => {
  validateSale(sale);
  const result = await model.updateSale(id, sale);
  return result;
};

module.exports = {
  getAll,
  getById,
  newSale,
  updateSale,
};
