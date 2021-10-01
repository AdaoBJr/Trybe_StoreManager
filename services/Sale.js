const Sale = require('../models/Sale');
const Product = require('../models/Product');

const validateSoldProducts = async (soldProducts) => {
  const err = {
    error: { code: 'invalid_data', message: 'Wrong product ID or invalid quantity' },
  };
  // const err2 = {
  //   error: { code: 'stock_problem', message: 'Such amount is not permitted to sell' }
  // };
  let invalid = false;
  // let noStock = false;
  soldProducts.forEach(async (soldProduct) => {
    if (soldProduct.quantity < 1
      || typeof soldProduct.quantity === 'string'
      || !Product.findById(soldProduct.id)) {
      invalid = true;
    }
    // const product = await Product.findById(soldProduct.productId);
    // if (soldProduct.quantity > product.quantity) {
    //   noStock = true;
    // }
    // console.log('soldProduct.quantity is: ' + soldProduct.quantity);
    // console.log('product.quantity is: ' + product.quantity);
    // console.log('noStock is: ' + noStock);
  });
  if (invalid) return err;
  // console.log('noStock out is: ' + noStock);
  // if (noStock) return err2;
  return null;
};

const create = async (soldProducts) => {
  const invalid = await validateSoldProducts(soldProducts);
  if (invalid) return invalid;
  return Sale.create(soldProducts);
};

const getAll = async () => {
  const sales = await Sale.getAll();
  return { sales };
};

const findById = async (id) => {
  const sale = await Sale.findById(id);
  if (!sale) return { error: { code: 'not_found', message: 'Sale not found' } };
  return sale;
};

const edit = async (id, itens) => {
  const invalid = await validateSoldProducts(itens);
  if (invalid) return invalid;
  const existSale = await Sale.findById(id);
  if (!existSale) {
    return { error:
    { code: 'invalid_data', message: 'Wrong id format' },
    };
  }
  return Sale.edit(id, itens);
};

const deleteOne = async (id) => {
  const existSale = await Sale.findById(id);
  if (!existSale) {
    return { error:
    { code: 'invalid_data', message: 'Wrong sale ID format' },
    };
  }
  return Sale.deleteOne(id);
};

module.exports = { create, getAll, findById, edit, deleteOne };
