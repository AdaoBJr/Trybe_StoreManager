const { ObjectId } = require('mongodb');
const connection = require('./connection');

const getAll = async () => {
  const db = await connection();
  return db.collection('products').find().toArray();
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

const create = async (product) => {
  const db = await connection();
  const { ops } = await db.collection('products').insertOne(product);
  return ops[0];
};

const update = async (id, updates) => {
  if (!ObjectId.isValid(id)) return null;
  const db = await connection();
  await db.collection('products').updateOne({ _id: ObjectId(id) }, { $set: updates });
  return findById(id);
};

const excluse = async (id) => {
  if (!ObjectId.isValid(id)) return null;
  const db = await connection();
  const product = await findById(id);
  db.collection('products').deleteOne({ _id: ObjectId(id) });
  return product;
};

const checkQuantity = async ({ productId, quantity: quantUpdate }) => {
  const db = await connection();
  return db.collection('products').findOne({
    _id: ObjectId(productId),
    quantity: { $gte: quantUpdate },
  });
};

const updateQuantity = async ({ productId, quantity: quantUpdate }) => {
  const MAGIC = 2;
  const db = await connection();
  const { modifiedCount } = await db.collection('products').updateOne(
    {
      _id: ObjectId(productId),
      quantity: { $gte: quantUpdate },
    },
    { $inc: { quantity: quantUpdate - quantUpdate * MAGIC } },
  );
  return modifiedCount;
};

const updateDelete = async ({ productId, quantity: quantUpdate }) => {
  const db = await connection();
  return db
    .collection('products')
    .updateOne({ _id: ObjectId(productId) }, { $inc: { quantity: quantUpdate } });
};

module.exports = {
  create,
  findByName,
  getAll,
  findById,
  update,
  excluse,
  checkQuantity,
  updateQuantity,
  updateDelete,
};
