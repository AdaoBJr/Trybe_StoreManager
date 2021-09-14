const express = require('express');
const bodyParser = require('body-parser');

const {
  validateName,
  productExists,
  validateQuantity } = require('./middlewares/productMiddlewares');

const { createProduct } = require('./controllers/productsController'); 

const app = express();
app.use(bodyParser.json());

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

app.post(
  '/products',
  validateName,
  productExists,
  validateQuantity,
  createProduct,
  );

app.listen(3000, () => console.log('online na porta 3000'));
