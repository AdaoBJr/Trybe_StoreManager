const { ObjectId } = require('mongodb');
const connection = require('../connections/mongoDBConnection');

const getAll = async () => {
    const db = await connection();
    const get = await db.collection('sales').find().toArray();

    return get;
};

const getById = async (id) => {
    // console.log(id);
    const db = await connection();
    const get = await db.collection('sales').findOne({ _id: ObjectId(id) });
    // console.log('model return produto getbyId');
    //  console.log(get);
    return get;
};

const saleExists = async (id) => {
    const db = await connection();
    const sale = await db.collection('sales').findOne({ _id: ObjectId(id) });

    return sale !== null;
};

const saleExists1 = async (id) => {
    const db = await connection();
    const sale = await db.collection('sales').findOne({ _id: id });

    return sale !== null;
};

const create = async (sales) => {
    const db = await connection();
    const nS = await db.collection('sales').insertOne({ itensSold: sales });
    //    console.log(nS);
    return nS.insertedId;
};
const update = async (id, sale) => {
  const testeID = ObjectId.isValid(id);

  if (!testeID) {
    return null;
  }
  const db = await connection();
  const product = await db.collection('sales').updateOne(
    { _id: ObjectId(id) }, { $set: { itensSold: sale } },
  );

  if (product.modifiedCount === 1) {
    return true;
  }

  return false;
};

const deleteSale = async (id) => {
    if (!ObjectId.isValid(id)) {
        return null;
    }

    const db = await connection();
    const deleteP = await db.collection('sales').deleteOne({ _id: ObjectId(id) });
    if (deleteP.deletedCount === 1) return true;

    return false;
};

module.exports = { getAll, create, getById, saleExists, update, saleExists1, deleteSale };