const { ObjectId } = require('mongodb');
const connection = require('./connection');

const getAll = async () => {
  const db = await connection();
  return db.collection('products').find().toArray();
};

const add = async ({ name, quantity }) => {
  const db = await connection();
  const createProduct = await db.collection('products').insertOne({ name, quantity });

  return { _id: createProduct.insertedId, name, quantity };
};

const getById = async (id) => {
  if (!ObjectId.isValid(id)) return null;
  const db = await connection();
  return db.collection('products').findOne({ _id: ObjectId(id) });
};

const update = async ({ id, name, quantity }) => {
  if (!ObjectId.isValid(id)) return null;

  const db = await connection();
  const product = await db.collection('products')
    .updateOne({ _id: ObjectId(id) }, { $set: { name, quantity } });
  return product;
};

const exclude = async (id) => {
  if (!ObjectId.isValid(id)) return null;

  const db = await connection();
  return db.collection('products').deleteOne({ _id: ObjectId(id) });
};

const productExists = async (name) => {
  const db = await connection();
  const product = await db.collection('products').findOne({ name });

  return product !== null;
};

module.exports = {
  getAll,
  add,
  getById,
  update,
  exclude,
  productExists,
};