const express = require('express');

const { productsRoutes, salesRoutes } = require('./api/routes');
const nextErrors = require('./api/errors/nextErrors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/products', productsRoutes);
app.use('/sales', salesRoutes);

app.get('/', (_request, response) => response.send());

app.use(nextErrors);

module.exports = app;
