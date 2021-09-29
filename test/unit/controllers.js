const sinon = require('sinon');
const { expect } = require('chai');

const productController = require('../../controllers/productController')
const productService = require('../../services/productsService')

describe('Verifica se retorna as informações corretas ao criar produto', () => {
  const res = {};
  const req = {};
  
  before(async () => {
    req.body = {};

    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();

    sinon.stub(productService, 'validateProduct').resolves('Produto inválido');
  })

  after(() => {
    productService.validateProduct.restore();
  });

  it('Quando o payload é inválido', async () => {
    await productController.createNewProduct(req, res)

    expect(res.status.calledWith(422)).to.be.equal(true);
  })

})

describe('Quando o payload é válido', async () => {
  const res = {};
  const req = {};

  before(() => {
    req.body = {
      name: 'UmProduto',
      quantity: 100,
    };

    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();

    sinon.stub(productService, 'createNewProduct').resolves({
      _id: '604cb554311d68f491ba5781',
      name: 'UmProduto',
      quantity: 100,
    });
  });

  after(() => {
    productService.createNewProduct.restore();
  });

  it('Quando o payload é válido', async () => {
    await productController.createNewProduct(req, res)

    expect(res.status.calledWith(201)).to.be.equal(true);
  })
})
