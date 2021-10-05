const salesModel = require('../models/sales');
const productsModel = require('../models/products');

const validateProductQuantityUpdate = async (productId, delta) => {
  const product = await productsModel.getProductByIdFromDB(productId);
  return product.quantity + delta >= 0;
};

const updateProductQuantity = async (productId, delta) => {
  const mayIUpdate = await productsModel.getProductByIdFromDB(productId);
  if (mayIUpdate) productsModel.updateProductQuantityInDB(productId, delta);
  return mayIUpdate;
};

const validateSaleQuantity = (quantity) => {
  if (typeof quantity !== 'number' || quantity < 1) {
    return ({
      err: {
        code: 'invalid_data',
        message: 'Wrong product ID or invalid quantity',
      },
      wasAnError: true,
    });
  }
};

const validateSales = (data) => (
  data.reduce((acc, { quantity }) => (
    validateSaleQuantity(quantity) || acc
  ), undefined)
);

const createSale = async (data) => (
  validateSales(data) || salesModel.createSales(data)
);

module.exports = {
  validateProductQuantityUpdate,
  updateProductQuantity,
  createSale,
};
