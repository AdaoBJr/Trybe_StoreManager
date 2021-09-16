const express = require('express');
const bodyParser = require('body-parser');
const controllerProducts = require('./controllers/ProductsController');
const controllerSales = require('./controllers/SalesController');

const app = express();
app.use(bodyParser.json());

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

const PORT = '3000';

app.post('/products', controllerProducts.createProducts);
app.post('/sales', controllerSales.createSales);
app.get('/sales', controllerSales.getAllSales);
app.get('/sales/:id', controllerSales.findById);
app.get('/products', controllerProducts.getAllProducts);
app.get('/products/:id', controllerProducts.findById);
app.put('/products/:id', controllerProducts.updateProduct);
app.put('/sales/:id', controllerSales.updateSales);
app.delete('/products/:id', controllerProducts.excludeProduct);
app.delete('/sales/:id', controllerSales.excludeSales);

app.listen(PORT, () => {
  console.log(`Conectado a porta ${PORT}`);
});
