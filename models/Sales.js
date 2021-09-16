const { ObjectId } = require('mongodb');
const connection = require('./connection');

const getAllSalesList = async () => {
  const db = await connection();

  return db.collection('sales').find().toArray();
};

const getSaleById = async (id) => {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const db = await connection();

  return db.collection('sales').findOne(ObjectId(id));
};

const deleteSaleById = async (id) => {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const db = await connection();

  const { _id, name, quantity } = await db.collection('sales').findOne(ObjectId(id));

  await db.collection('sales').deleteOne({ _id: ObjectId(id) });

  return { _id, name, quantity };
};

module.exports = {
  getAllSalesList,
  getSaleById,
  deleteSaleById,
};
