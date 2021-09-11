// const { ObjectId } = require('mongodb');
const connection = require('./connection');

// Cria uma string com o nome completo do autor

// Busca todos os autores do banco.

// const getAll = async () => connection()
//     .then((db) => db.collection('products').find().toArray())
//     .then((produts) =>
//     produts.map(({ _id, name, quantity }) =>
//         getNewProduct({
//           _id,
//           name,
//           quantity,
//           })));

const getAll = async () => connection()
    .then((db) => db.collection('products').find().toArray())
    .then((products) => ({ products }));

// /*
// Busca um autor específico, a partir do seu ID
// @param {String} id ID do autor a ser recuperado
// */
// const findById = async (id) => {
//   if (!ObjectId.isValid(id)) {
//     return null;
//   }

//   const authorData = await connection()
//     .then((db) => db.collection('authors').findOne(new ObjectId(id)));

//   if (!authorData) return null;

//   const { firstName, middleName, lastName } = authorData;

//   return getNewAuthor({ id, firstName, middleName, lastName });
// };

// const isNonEmptyString = (value) => {
//   if (!value) return false;

//   return typeof value === 'string';
// };

// const isValid = (firstName, middleName, lastName) => {
//   if (middleName && typeof middleName !== 'string') return false;

//   return isNonEmptyString(firstName) && isNonEmptyString(lastName);
// };

const create = async (name, quantity) =>
  connection()
    .then((db) => db.collection('products').insertOne({ name, quantity }))
    .then((result) => ({ _id: result.insertedId, name, quantity }));

const findByName = async (name) => {
  const product = await connection()
    .then((db) => db.collection('products').findOne({ name }));

  // Caso nenhum product seja encontrado, devolvemos null
  if (!product) return null;

  // Caso contrário, retornamos o author encontrado
  return (product);
};

module.exports = {
  getAll,
  create,
  findByName,
};