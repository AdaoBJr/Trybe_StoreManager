const { ObjectId } = require('mongodb');

const connection = require('./connection');

const includeSales = async (sales) => {
  const db = await connection();
  const insertedSales = await db.collection('sales').insertOne({ itensSold: sales });
  
  return insertedSales.ops[0];
};

const getAllSales = async () => {
  const db = await connection();
  return db.collection('sales').find().toArray();
};

const findById = async (id) => {
  const db = await connection();
  const sale = await db.collection('sales').findOne(ObjectId(id));
  return sale;
};

const saleExists = async (id) => {
  const db = await connection();
  const wasFound = await db.collection('sales').findOne({ _id: ObjectId(id) });

  return wasFound !== null;
};

const updateSale = async (id, sale) => {
  const db = await connection();
  await db.collection('sales').updateOne(
    { _id: ObjectId(id) }, { $set: { itensSold: sale } },
  );
  return { _id: id, itensSold: sale };
};

const removeSale = async (id) => {
  const db = await connection();
  const { value } = await db.collection('sales').findOneAndDelete({ _id: ObjectId(id) });
  
  return value;
};

const checkAvailableQuantity = async (id, quantity) => {
  const db = await connection();
  const stock = await db.collection('products').findOne({ _id: ObjectId(id) });
  if (stock === null) return false;
  
  return stock.quantity - quantity > 0;
};
 
module.exports = {
  includeSales,
  getAllSales,
  findById,
  saleExists,
  updateSale,
  removeSale,
  checkAvailableQuantity,
};