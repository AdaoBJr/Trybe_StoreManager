const sinon = require('sinon');
const { expect } = require('chai');
const { MongoClient, ObjectId } = require('mongodb');
const { getConnection } = require('./mongoMockConnection');

const productsModel = require('../../models/Products');
const salesModel = require('../../models/Sales');


describe('Exibe toda a lista de produtos', () => {
  describe('quando existe um produto cadastrado', () => {
    const payload = { name: 'Playstation 5', quantity: 100 };
    describe('a resposta', () => {
      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        await connectionMock.db('StoreManager').collection('products').insertOne(payload);
      });

      after(() => {
        MongoClient.connect.restore();
      })

      it('retorna um objeto', async () => {
        const response = await productsModel.getAll();
        expect(response).to.be.an('object');
      });

      it('o objeto possui a chave "products"', async () => {
        const response = await productsModel.getAll();
        expect(response).to.have.property('products');
      });

      it('a chave products é um array', async () => {
        const { products } = await productsModel.getAll();
        expect(products).to.be.an('array');
      });

      it('o array contém um objeto', async () => {
        const { products } = await productsModel.getAll();
        expect(products[0]).to.include.an('object')
      });

      it('o objeto contém as chaves "_id", "name", "quantity"', async () => {
        const { products } = await productsModel.getAll();
        expect(products[0]).to.have.all.keys('_id', 'name', 'quantity');
      });
    });
  });

  describe('quando nao existe um produto cadastrado', () => {
    describe('a resposta', () => {
      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        await connectionMock.db('StoreManager').collection('products').deleteMany({});
      });

      after(() => {
        MongoClient.connect.restore();
      })

      it('retorna um objeto', async () => {
        const response = await productsModel.getAll();
        expect(response).to.be.an('object');
      });

      it('o objeto possui a chave "products"', async () => {
        const response = await productsModel.getAll();
        expect(response).to.have.property('products');
      });

      it('a chave products é um array', async () => {
        const { products } = await productsModel.getAll();
        expect(products).to.be.an('array');
      });

      it('o array é vazio', async () => {
        const { products } = await productsModel.getAll();
        expect(products).to.be.empty;
      });
    });
  })
});

describe('Procura um produto pelo nome', () => {
  describe('quando existe o produto', () => {
    const payload = { name: 'Playstation 5', quantity: 100 };
    describe('a resposta', () => {

      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        await connectionMock.db('StoreManager').collection('products').insertOne(payload);
      });

      after(() => {
        MongoClient.connect.restore();
      });

      it('retorna um objeto', async () => {
        const response = await productsModel.findByName(payload.name);
        expect(response).to.be.an('object');
      });

      it('o objeto contém as chaves "_id", "name", "quantity"', async () => {
        const response = await productsModel.findByName(payload.name);
        expect(response).to.have.all.keys('_id', 'name', 'quantity');
      });
    });
  });

  describe('quando não existe o produto', () => {
    const payload = { name: 'Playstation 5', quantity: 100 };
    describe('a resposta', () => {

      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        await connectionMock.db('StoreManager').collection('products').deleteMany({});
      });

      after(() => {
        MongoClient.connect.restore();
      });

      it('retorna "null"', async () => {
        const response = await productsModel.findByName(payload.name);
        expect(response).to.be.null;
      });
    });
  });
});

describe('Procura um produto pelo id', () => {
  describe('quando existe o produto', () => {
    const payload = { name: 'Playstation 5', quantity: 100 };

    describe('a resposta', () => {
      let response;
      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        response = await connectionMock.db('StoreManager').collection('products').insertOne(payload);
      });

      after(async () => {
        MongoClient.connect.restore();
      });

      it('retorna um objeto', async () => {
        const result = await productsModel.findById(response.insertedId);
        expect(result).to.be.an('object');
      });

      it('o objeto contém as chaves "_id", "name", "quantity"', async () => {
        const result = await productsModel.findById(response.insertedId);
        expect(result).to.have.all.keys('_id', 'name', 'quantity');
      });
    });
  });

  describe('quando não existe o produto', () => {
    const ID_EXAMPLE = "6140b6bafc23168216d5f951";
    const payload = { name: 'Playstation 5', quantity: 100 };

    describe('a resposta', () => {
      let response;
      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        response = await connectionMock.db('StoreManager').collection('products').insertOne(payload);
      });

      after(() => {
        MongoClient.connect.restore();
      });

      it('retorna "null"', async () => {
        const result = await productsModel.findById(ID_EXAMPLE);
        expect(result).to.be.null;
      });
    });
  });

  describe('quando o id for inválido', () => {
    const ID_EXAMPLE = "61409dcc05";

    describe('a resposta', () => {
      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        sinon.stub(ObjectId, 'isValid').returns(false);
      });

      after(() => {
        ObjectId.isValid.restore();
        MongoClient.connect.restore();
      });

      it('retorna "null"', async () => {
        const result = await productsModel.findById(ID_EXAMPLE);
        expect(result).to.be.null;
      });
    });
  });
});

describe('Testa a inserção de um novo produto', () => {
  describe('quando inserido com sucesso', () => {
    const payload = { name: 'Playstation 5', quantity: 100 };

    describe('a resposta', () => {
      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        await connectionMock.db('StoreManager').collection('products').insertOne(payload);
      });

      after(() => {
        MongoClient.connect.restore();
      })

      it('é um objeto', async () => {
        const response = await productsModel.createProduct(payload);
        expect(response).to.be.an('object');
      });

      it('o objeto contém as propriedades, "_id", "name" e "quantity"', async () => {
        const response = await productsModel.createProduct(payload);
        expect(response).to.have.all.keys('_id', 'name', 'quantity');
      });
    });
  });

  describe('quando há uma falha na inserção', () => {
    const payload = { texto: 'Playstation 5', qtt: 100 };

    describe('a resposta', () => {
      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
      });

      after(() => {
        MongoClient.connect.restore();
      })

      it('é um objeto', async () => {
        const response = await productsModel.createProduct(payload);
        expect(response).to.be.null;
      });
    });
  });
});

describe('Testa a atualização de um produto', () => {
  describe('caso atualizado com sucesso', () => {
    const payload = { name: 'Playtation 5', quantity: 100 };
    const update = { name: 'Playstation 5', quantity: 1000 };

    describe('a resposta', () => {
      let result;
      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        result = await connectionMock.db('StoreManager').collection('products').insertOne(payload);
      });

      after(() => {
        MongoClient.connect.restore();
      });

      it('é um objeto', async () => {
        const response = await productsModel.updateProduct(result.insertedId, update.name, update.quantity);
        expect(response).to.be.an('object');
      });

      it('o objeto contém as propriedades "_id", "name", "quantity"', async () => {
        const response = await productsModel.updateProduct(result.insertedId, update.name, update.quantity);
        expect(response).to.have.all.keys('_id', 'name', 'quantity');
      });
    });
  });

  describe('caso falhe a atualização', () => {
    const payload = { name: 'Playtation 5', quantity: 100 };
    const update = { name: 'Playstation 5', quantity: 1000 };
    const invalidId = '123456'
    describe('a resposta', () => {
      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        await connectionMock.db('StoreManager').collection('products').insertOne(payload);
      });

      after(() => {
        MongoClient.connect.restore();
      })

      it('retorna "null"', async () => {
        const response = await productsModel.updateProduct(invalidId, update.name, update.quantity);
        expect(response).to.be.null;
      });
    })
  });

  describe('quando o id for inválido', () => {
    const payload = { name: 'Playtation 5', quantity: 100 };
    const update = { name: 'Playstation 5', quantity: 1000 };
    const invalidId = '123456'

    describe('a resposta', () => {
      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        sinon.stub(ObjectId, 'isValid').returns(false);
      });

      after(() => {
        ObjectId.isValid.restore();
        MongoClient.connect.restore();
      });

      it('retorna "null"', async () => {
        const result = await productsModel.updateProduct(invalidId, update.name, update.quantity);
        expect(result).to.be.null;
      });
    });
  });
});

describe('Testa a remoção de um produto', () => {
  describe('quando removido com sucesso', () => {
    const payload = { name: 'Playstation 5', quantity: 100 };
    describe('a resposta', () => {
      let result;

      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        result = await connectionMock.db('StoreManager').collection('products').insertOne(payload);
      });

      after(() => {
        MongoClient.connect.restore();
      });

      it('é um objeto contendo as keys "_id", "name" e "quantity', async () => {
        const response = await productsModel.deleteProduct(result.insertedId);
        expect(response).to.be.an('object');
        expect(response).to.have.all.keys('_id', 'name', 'quantity');
      });
    })
  });

  describe('quando falha a remoção', () => {
    const payload = { name: 'Playstation 5', quantity: 100 };
    const invalidId = '123456';
    describe('a resposta', () => {
      let result;

      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        result = await connectionMock.db('StoreManager').collection('products').insertOne(payload);
      });

      after(() => {
        MongoClient.connect.restore();
      });

      it('retorna "null"', async () => {
        const response = await productsModel.deleteProduct(invalidId);
        expect(response).to.be.null;
      });
    })
  });
});

describe('Exibe toda a lista de vendas', () => {
  describe('quando existe uma venda cadastrada', () => {
    const payload = { name: 'Playstation 5', quantity: 100 };
    let connectionMock;
    let product;
    describe('a resposta', () => {
      before(async () => {
        connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        product = await connectionMock.db('StoreManager').collection('products').insertOne(payload);
        const sale = [{ productId: product.insertedId, quantity: 100 }];
        await connectionMock.db('StoreManager').collection('sales').insertOne({ sale });
      });

      after(async () => {
        await connectionMock.db('StoreManager').collection('sales').deleteMany({});
        MongoClient.connect.restore();
      });

      it('retorna um objeto', async () => {
        const response = await salesModel.getAll();
        expect(response).to.be.an('object');
      });

      it('o objeto possui a chave "sales"', async () => {
        const response = await salesModel.getAll();
        expect(response).to.have.property('sales');
      });

      it('a chave "sales" é um array', async () => {
        const { sales } = await salesModel.getAll();
        expect(sales).to.be.an('array');
      });

      it('o array contém um objeto', async () => {
        const { sales } = await salesModel.getAll();
        expect(sales[0]).to.include.an('object')
      });

      it('o objeto contém as chaves "_id" e "sale"', async () => {
        const { sales } = await salesModel.getAll();
        expect(sales[0]).to.have.all.keys('_id', 'sale');
      });
    });
  });

  describe('quando nao existe uma venda cadastrada', () => {
    describe('a resposta', () => {
      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        await connectionMock.db('StoreManager').collection('sales').deleteMany({});
      });

      after(() => {
        MongoClient.connect.restore();
      })

      it('retorna um objeto', async () => {
        const response = await salesModel.getAll();
        expect(response).to.be.an('object');
      });

      it('o objeto possui a chave "sales"', async () => {
        const response = await salesModel.getAll();
        expect(response).to.have.property('sales');
      });

      it('a chave sales é um array', async () => {
        const { sales } = await salesModel.getAll();
        expect(sales).to.be.an('array');
      });

      it('o array é vazio', async () => {
        const { sales } = await salesModel.getAll();
        expect(sales).to.be.empty;
      });
    });
  });
});

describe('Procura uma venda pelo id', () => {
  describe('quando existe a venda', () => {
    const payload = { name: 'Playstation 5', quantity: 100 };
    let connectionMock;
    let product;
    let newSale;

    describe('a resposta', () => {
      before(async () => {
        connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        product = await connectionMock.db('StoreManager').collection('products').insertOne(payload);
        const salePayload = [{ productId: product.insertedId, quantity: 100 }];
        newSale = await connectionMock.db('StoreManager').collection('sales').insertOne({ sale: salePayload });
      });

      after(async () => {
        await connectionMock.db('StoreManager').collection('sales').deleteMany({});
        MongoClient.connect.restore();
      });

      it('retorna um objeto', async () => {
        const result = await salesModel.getById(newSale.insertedId);
        expect(result).to.be.an('object');
      });

      it('o objeto possui as chaves "_id", "sale"', async () => {
        const result = await salesModel.getById(newSale.insertedId);
        expect(result).to.have.all.keys('_id', 'sale');

      });

      it('a chave "_id" possui o id da venda', async () => {
        const { _id } = await salesModel.getById(newSale.insertedId);
        expect(_id).to.be.deep.equal(newSale.insertedId);
      })

      it('a chave "sale" é um array', async () => {
        const result = await salesModel.getById(newSale.insertedId);
        expect(result.sale).to.be.an('array');
      });

      it('o array "sale" possui um objeto, com as chaves "productId" e "quantity"', async () => {
        const { sale } = await salesModel.getById(newSale.insertedId);
        expect(sale[0]).to.be.an('object');
        expect(sale[0]).to.have.all.keys('productId', 'quantity');
      });
    });
  });

  describe('quando não existe a venda', () => {
    const notFoundId = "6140d5e0d6ddb4f5c96a833d"
    let connectionMock;

    describe('a resposta', () => {
      before(async () => {
        connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
      });

      after(() => {
        MongoClient.connect.restore();
      });

      it('retorna "null"', async () => {
        const result = await salesModel.getById(notFoundId);
        expect(result).to.be.null;
      });
    });
  });

  describe('quando o id for inválido', () => {
    const INVALID_ID = "61409dcc05";

    describe('a resposta', () => {
      before(async () => {
        const connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        sinon.stub(ObjectId, 'isValid').returns(false);
      });

      after(() => {
        ObjectId.isValid.restore();
        MongoClient.connect.restore();
      });

      it('retorna "null"', async () => {
        const result = await salesModel.getById(INVALID_ID);
        expect(result).to.be.null;
      });
    });
  });
});

describe('Testa o cadastro de uma nova venda', () => {
  describe('quando cadastrado com sucesso', () => {
    const payload = { name: 'Playstation 5', quantity: 100 };
    let connectionMock;
    let product;
    let newSale;
    describe('a resposta', () => {
      before(async () => {
        connectionMock = await getConnection();
        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
        product = await connectionMock.db('StoreManager').collection('products').insertOne(payload);
        newSale = [{ productId: product.insertedId, quantity: 100 }];
      });

      after(async () => {
        await connectionMock.db('StoreManager').collection('sales').deleteMany({});
        await connectionMock.db('StoreManager').collection('products').deleteMany({});
        MongoClient.connect.restore();
      });

      it('é um objeto', async () => {
        const response = await salesModel.newSale(newSale);
        expect(response).to.be.an('object');
      });

      it('o objeto possui as chaves "itensSold" e "_id"', async () => {
        const response = await salesModel.newSale(newSale);
        expect(response).to.have.all.keys('itensSold', '_id');
      });

      it('"itensSold" é um array contendo um objeto', async () => {
        const { itensSold } = await salesModel.newSale(newSale);
        expect(itensSold).to.be.an('array');
        expect(itensSold[0]).to.be.an('object');
      });

      it('o objeto possui as chaves "productId" e "quantity"', async () => {
        const { itensSold } = await salesModel.newSale(newSale);
        expect(itensSold[0]).to.have.all.keys('productId', 'quantity');
      });
    });
  });
});




// describe('Insere um novo filme no DB', () => {
//   const moviePayload = {
//     title: 'Bastardos Inglórios',
//     directedBy: 'Quentin Tarantino',
//     releaseYear: 2009,
//   };

//   describe('quando é inserido com sucesso', () => {
//     it('retorna um Objeto', async () => {
//       const result = await MoviesModel.create(moviePayload);
//       expect(result).to.be.an('object');
//     });
//     it('possui a propriedade "id" do novo filme inserido', async () => {
//       const result = await MoviesModel.create(moviePayload);
//       expect(result).to.have.a.property('id')
//     });
//   });
// })
