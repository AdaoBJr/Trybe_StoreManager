const Joi = require('@hapi/joi');
const { StatusCodes } = require('http-status-codes');

const productModel = require('../models/productModel');

const validateProduct = Joi.object({
  name: Joi.string().min(5).required(),
  quantity: Joi.number().min(1).required(),
});

const createProduct = async (name, quantity) => {
  const { error } = validateProduct.validate({ name, quantity });

  if (error) {
    return { status: StatusCodes.UNPROCESSABLE_ENTITY, code: 'invalid_data', error };
  }

  const allProducts = await productModel.getAll();
  const isNameUsed = allProducts.some((product) => product.name === name);

  if (isNameUsed) {
    return {
      status: StatusCodes.UNPROCESSABLE_ENTITY,
      code: 'invalid_data',
      error: { message: 'Product already exists' },
    };
  }

  const newProduct = productModel.createProduct(name, quantity);

  return newProduct;
};

const getAll = async () => {
  const products = await productModel.getAll();

  return products;
};

module.exports = {
  createProduct,
  getAll,
};
