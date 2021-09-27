const { ObjectId } = require('mongodb');
const Sales = require('../models/sales');

const ZERO_QUANTITY = 0;

const errWrongSaleIdFormat = { err: {
  code: 'invalid_data',
  message: 'Wrong sale ID format',
} };
const errSaleNotFound = { err: {
  code: 'not_found',
  message: 'Sale not found',
} };
const errWrongIdOrInvalidQuantity = { err: {
  code: 'invalid_data',
  message: 'Wrong product ID or invalid quantity',
} };
const errWrongIdFormat = { err: {
  code: 'invalid_data',
  message: 'Wrong id format',
} };
const itensSold = (salesData) => {
  const itensArr = [];
  itensArr.push(...salesData);
  return {
    itensSold: itensArr,
  };
};
const verifyQuantity = (quantity) => {
  if (!quantity || quantity <= ZERO_QUANTITY) return false;

  return true;
};
const verifyTypeOfQuantity = (quantity) => {
  if (!quantity || typeof quantity !== 'number') return false;

  return true;
};
const isValid = (quantity) => {
  if (!verifyQuantity(quantity)) return errWrongIdOrInvalidQuantity;

  if (!verifyTypeOfQuantity(quantity)) return errWrongIdOrInvalidQuantity;

  return true;
};
const getAll = async () => {
  const sales = await Sales.getAll();
  return { sales };
};

const findById = async (id) => {
  if (!ObjectId.isValid(id)) {
    return errSaleNotFound;
  }
  const result = await Sales.findById(id);

  if (result === null) return errSaleNotFound;

  return result;
};
const deleteSale = async (id) => {
  if (!ObjectId.isValid(id)) {
    return errWrongSaleIdFormat;
  }
  const result = await Sales.findById(id);

  if (result === null) return errWrongSaleIdFormat;

  await Sales.deleteById(id);

  return result;
};

const create = async (arr) => {
  const ZEROINDEX = 0;
  let index;
/*
  for (index of arr) {
    const productValid = await isValid(index.quantity);
    if (typeof productValid === 'object') return productValid;
  }
  https://www.techiediaries.com/promise-all-map-async-await-example/ 

  https://www.techiediaries.com/promise-all-map-async-await-example/ 
*/
  // Promise.all.map(arr).then(() => {}
  for (index = ZEROINDEX; index < arr.length; index += 1) {
    const productValid = isValid(arr[index].quantity);

    if (typeof productValid === 'object') return productValid;
  }
  
  const resultItensSold = itensSold(arr);

  const { insertedId } = await Sales.create(resultItensSold);

  const result = await findById(insertedId);

  return result;
};
const updateById = async (arr, id) => {
  const arrayProducts = arr;
  if (!ObjectId.isValid(id)) {
    return errWrongIdFormat;
  }

  const ZEROINDEX = 0;
  let index;

  for (index = ZEROINDEX; index < arrayProducts.length; index += 1) {
    const productValid = isValid(arrayProducts[index].quantity);

    if (typeof productValid === 'object') return productValid;

    Sales.updateById(arrayProducts[index].quantity, id, index);
  }

  const result = await findById(id);

  return result;
};

module.exports = {
  updateById,
  deleteSale,
  getAll,
  findById,
  create,
};