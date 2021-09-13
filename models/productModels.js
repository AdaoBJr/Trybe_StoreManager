// const connection = require('./connection');
const { ObjectId } = require('mongodb');
const mongoConnection = require('./connection');

const createProduct = async (name, quantity) => {
  const db = await mongoConnection.connection();
  const { insertedId: id } = await db.collection('products').insertOne({ name, quantity });
  return { 
    id,
    name,
    quantity };
};

const findByName = async (name, collection) => {
  const db = await mongoConnection.connection();
  const registeredProduct = db.collection(collection).findOne({ name });
  return registeredProduct;
};

const getAll = async (collection) => {
  const db = await mongoConnection.connection();
  const resultQuery = await db.collection(collection).find().toArray();
  return { products: [...resultQuery] };
};

const getById = async (id, collection) => {
  const db = await mongoConnection.connection();
  const resulQuery = await db.collection(collection).findOne({ _id: ObjectId(id) });
  return resulQuery;
};

module.exports = {
  createProduct,
  findByName,
  getAll,
  getById,
};