const { ObjectId } = require('mongodb');
const connection = require('./mongoConnection');

const createNewProduct = async ({ name, quantity }) => {
  const db = await connection();
  const newProduct = await db.collection('products').insertOne({ name, quantity });
  const { insertedId } = JSON.parse(newProduct);
  return { _id: insertedId, name, quantity };
};

const getAllProducts = async () => {
  const db = await connection();
  const allProducts = await db.collection('products').find().toArray();
  return allProducts;
};

const getProductById = async (id) => {
  const db = await connection();
  const product = await db.collection('products').findOne(ObjectId(id));
  if (product) {
    return { status: 200, product };
  }
  return {
    status: 422,
    err: {
      code: 'invalid_data',
      message: 'Wrong id format',
    },
  };
};

const updateProduct = async ({ id, name, quantity }) => {
  const db = await connection();
  const product = await db.collection('products').updateOne({ _id: ObjectId(id) },
  { $set: { name, quantity } });

  return product;
};

const deleteProductById = async (id) => {
  const db = await connection();
  const product = await db.collection('products').deleteOne({ _id: ObjectId(id) });
  return product;
};

module.exports = {
  createNewProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProductById,
};