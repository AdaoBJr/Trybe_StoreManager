const { ObjectId } = require('mongodb');
const connection = require('./connection');

const createProduct = async (name, quantity) =>
  connection()
    .then((db) => db.collection('products').insertOne({ name, quantity }))
    .then((result) => ({ _id: result.insertedId, name, quantity }));

const findByName = async (name) => {
  const product = await connection()
    .then((db) => db.collection('products').findOne({ name }));
  if (!product) return null;
  return product;
};

const getAll = async () =>
  connection()
    .then((db) => db.collection('products').find().toArray());

const findById = async (id) => {
  if (!ObjectId.isValid(id)) return null;
  return connection()
    .then((db) => db.collection('products').findOne({ _id: ObjectId(id) }));
};

const updateProduct = async (id, name, quantity) => {
  if (!ObjectId.isValid(id)) return null;
  await connection()
    .then((db) => db
      .collection('products').updateOne({ _id: ObjectId(id) }, { $set: { name, quantity } }));
  return {
    id, name, quantity,
  };
};

module.exports = {
  createProduct,
  findByName,
  getAll,
  findById,
  updateProduct,
};
