const { ObjectId } = require('mongodb');
const connection = require('./connection');

const createProd = async (name, quantity) => {
  const { insertedId } = await connection().then((db) =>
    db.collection('products').insertOne({ name, quantity }));

  return {
    _id: insertedId,
    name,
    quantity,
  };
};

const getAllProds = async () => {
  const result = await connection()
    .then((db) => db.collection('products').find().toArray());

  return {
    products: result,
  };
};

const getProdById = async (id) => {
  const product = await connection()
    .then((db) => db.collection('products').findOne(ObjectId(id)))
    .then((result) => result);

  return product;
};

const updateProdQuantity = async (id, newQuant, value) => {
  const newValue = value === 'increase' ? +newQuant : -newQuant;
  await connection().then((db) =>
    db.collection('products')
      .updateOne({ _id: ObjectId(id) }, { $inc: { quantity: newValue } }));
};

const getProdByName = async (name) => {
  const product = await connection()
    .then((db) => db.collection('products').findOne({ name }))
    .then((result) => result);

  return product;
};

const updateProd = async (id, name, quantity) => {
  const { insertedId } = await connection().then((db) =>
    db.collection('products')
      .updateOne({ _id: ObjectId(id) }, { $set: { name, quantity } }));

  return {
    _id: insertedId,
    name,
    quantity,
  };
};

const deleteProduct = async (id) => {
  const { value } = await connection().then((db) =>
    db.collection('products').findOneAndDelete({ _id: ObjectId(id) }));
  return value;
};

module.exports = {
  createProd,
  getAllProds,
  getProdById,
  updateProd,
  deleteProduct,
  updateProdQuantity,
  getProdByName,
};
