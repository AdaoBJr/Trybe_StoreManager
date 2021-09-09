const connection = require('../models/mongoConnection');

const productIsValid = async (req, res, next) => {
  const db = await connection();
  const { name } = req.body;
  const productExists = await db.collection('products').findOne({ name });
  if (productExists) {
  return res.status(422).json({
    err: { code: 'invalid_data', message: 'Product already exists' } });
  }
  next();
};

const isValidName = async (req, res, next) => {
  const { name } = req.body;

  if (name.length < 5) {
    return res.status(422).json({
      err: { code: 'invalid_data', message: '"name" length must be at least 5 characters long' } });
  }

  next();
};

const isValidQuantity = async (req, res, next) => {
  const { quantity } = req.body;

  if (typeof quantity !== 'number') {
    return res.status(422).json({
      err: { code: 'invalid_data', message: '"quantity" must be a number' } });
  }

  if (quantity <= 0) {
    return res.status(422).json({
      err: { code: 'invalid_data', message: '"quantity" must be larger than or equal to 1' } });
  }

  next();
};

module.exports = { productIsValid, isValidName, isValidQuantity };
