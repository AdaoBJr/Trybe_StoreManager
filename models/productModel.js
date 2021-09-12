const { ObjectId } = require('mongodb');
const connection = require('./connection');

const modelCreateProduct = async (name, quantity) => {
  const db = await connection();
  const products = await db.collection('products').insertOne({ name, quantity });
  return { code: 201, prod: { _id: products.insertedId, name, quantity } };
};

const modelListById = async (id) => {
  if (!ObjectId.isValid(id)) return null;

  const db = await connection();
  const products = await db.collection('products').findOne(ObjectId(id));
  console.log(products, 'id');
  return { code: 200, prod: products };
};

const modelListProducts = async () => {
  const db = await connection();
  const products = await db.collection('products').find().toArray();
  return { code: 200, prod: { products } };
};

module.exports = {
  modelCreateProduct,
  modelListProducts,
  modelListById,
};