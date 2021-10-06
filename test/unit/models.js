const sinon = require('sinon');
const { expect } = require('chai');
const { MongoClient, ObjectId } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoDB = require('../../models/connection');
const testProd = require('../../models/Products');
const testSale = require('../../models/sales');

const database = new MongoMemoryServer();

const connect = async () {
    const URL = await database.getUri();
    const OPTIONS = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    return MongoClient.connect(URL, OPTIONS);
};

describe('Testing products list', () => {
    describe('Testing products in storage', () => {
        const payload = { name: 'Produto', quantity: 840};
        describe('response', () => {
            before(async () => {
                const mockConn = await connect();
                sinon.stub(MongoClient, 'connect').resolves(mockConn);
                await mockConn.db('StoreManager').collection('products').insertOne(payload);
              });

              after(() => {
                  MongoClient.connect.restore();
              })

              it('Must be an object', async () => {
                const ret = await testProd.selectAll();
                expect(ret).to.be.an('object');
              });

              it('Object has "products" property', async () => {
                const ret = await testProd.selectAll();
                expect(ret).to.have.property('products');
              });

              it('"products" property is an array', async () => {
                const { products } = await testProd.selectAll();
                expect(products).to.be.an('array');
              });

              it('array of objects', async () => {
                const { products } = await testProd.selectAll();
                expect(products[0]).to.include.an('object')
              });

              it('object has the properties: "_id", "name", "quantity"', async () => {
                const { products } = await testProd.selectAll();
                expect(products[0]).to.have.all.keys('_id', 'name', 'quantity');
              });
            });
        });

        describe('inexistent prod', () => {
            describe('response', () => {
              before(async () => {
                const mock = await connect();
                sinon.stub(MongoClient, 'connect').resolves(mock);
                await mock.db('StoreManager').collection('products').deleteMany({});
              });

              after(() => {
                MongoClient.connect.restore();
              })

              it('expects to return an object', async () => {
                const ret = await testProd.selectAll();
                expect(ret).to.be.an('object');
              });

              it('object must have "products" property', async () => {
                const ret = await testProd.selectAll();
                expect(ret).to.have.property('products');
              });
              
              it('property must be an array', async () => {
                const { products } = await testProd.selectAll();
                expect(products).to.be.an('array');
              });
        
              it('array must be empty', async () => {
                const { products } = await testProd.selectAll();
                expect(products).to.be.empty;
              });
            });
          })
        });

        describe('Search product by name', () => {
            describe('Expecting product to exist', () => {
              const payload = { name: 'Produto', quantity: 840 };
              describe('API response', () => {
          
                before(async () => {
                  const mockConn = await connect();
                  sinon.stub(MongoClient, 'connect').resolves(mockConn);
                  await mockConn.db('StoreManager').collection('products').insertOne(payload);
                });
          
                after(() => {
                  MongoClient.connect.restore();
                });
          
                it('Expects object', async () => {
                  const ret = await testProd.findByName(payload.name);
                  expect(ret).to.be.an('object');
                });
          
                it('Expects to have the properties "_id", "name", "quantity"', async () => {
                  const ret = await testProd.findByName(payload.name);
                  expect(ret).to.have.all.keys('_id', 'name', 'quantity');
                });
            });
        });

        describe('Expecting prod not to exist', () => {
            const payload = { name: 'Produto', quantity: 840 };
            describe('response', () => {
        
              before(async () => {
                const mockConn = await connect();
                sinon.stub(MongoClient, 'connect').resolves(mockConn);
                await mockConn.db('StoreManager').collection('products').deleteMany({});
              });
        
              after(() => {
                MongoClient.connect.restore();
              });
        
              it('expecting to be null', async () => {
                const ret = await testProd.findByName(payload.name);
                expect(ret).to.be.null;
              });
            });
        });
    });
