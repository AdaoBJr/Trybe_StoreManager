const { ObjectId } = require('mongodb');
const connection = require('./connection');

const create = async (product) => {
  const db = await connection();
  const { ops } = await db.collection('products').insertOne(product);

  return ops[0];
};

const findByName = async (name) => {
  const db = await connection();

  return db.collection('products').findOne({ name });
};

const findById = async (id) => {
  if (!ObjectId.isValid(id)) return null;

  const db = await connection();

  return db.collection('products').findOne(ObjectId(id));
};

const getAll = async () => {
  const db = await connection();

  return db.collection('products').find().toArray();
};

const update = async (id, data) => {
  if (!ObjectId.isValid(id)) return null;

  const db = await connection();

  await db.collection('products').updateOne({ _id: ObjectId(id) }, { $set: data });

  return findById(id);
};

const remove = async (id) => {
  if (!ObjectId.isValid(id)) return null;

  const db = await connection();
  const product = await findById(id);

  db.collection('products').deleteOne({ _id: ObjectId(id) });

  return product;
};

const validateQuantity = async ({ productId, quantity: amount }) => {
  const db = await connection();

  return db.collection('products').findOne({
    _id: ObjectId(productId),
    quantity: { $gte: amount },
  });
};

const ensuresQuantity = async ({ productId, quantity: amount }) => {
  const NUMBER_TWO = 2;
  const quantityAmount = amount - amount * NUMBER_TWO;
  const db = await connection();

  const { modifiedCount } = await db.collection('products')
    .updateOne({
      _id: ObjectId(productId),
      quantity: { $gte: amount },
    }, { $inc: { quantity: quantityAmount } });

  return modifiedCount;
};

const updateQuantity = async ({ productId, quantity: amount }) => {
  const db = await connection();

  return db.collection('products')
    .updateOne({ _id: ObjectId(productId) }, { $inc: { quantity: amount } });
};

module.exports = {
  create,
  findByName,
  findById,
  getAll,
  update,
  remove,
  validateQuantity,
  updateQuantity,
  ensuresQuantity,
};
