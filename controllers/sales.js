const express = require('express');
// const rescue = require('express-rescue');
// const { checkProduct } = require('../middleware/checkProduct');
const { isValidId } = require('../middlewareSales/validId');
const { isValidQuantity } = require('../middlewareSales/validQuantity');
const sales = require('../services/sales');

const router = express.Router();

router.get(
  '/:id',
  isValidId,
  async (req, res) => {
    const { id } = req.params;
    const insertion = await sales.getSaleById(id);
    res.status(200).json(insertion);
  },
);

router.get(
  '/',
  async (req, res) => {
    const insertion = await sales.getSales();
    res.status(200).json({ sales: insertion });
  },
);

// router.put(
//   '/:id',
//   isValidName,
//   isValidQuantity,
//   async (req, res) => {
//     console.log('controller');
//     const { id } = req.params;
//     const { name, quantity } = req.body;
//     await products.updateById(id, name, quantity);
//     res.status(200).json({ id, name, quantity });
//   },
// );

// router.delete(
//   '/:id',
//   isValidId,
//   async (req, res) => {
//     console.log('controller');
//     const { id } = req.params;
//     const { name, quantity } = req.body;
//     await products.deleteProductById(id);
//     res.status(200).json({ id, name, quantity });
//   },
// );

router.post(
  '/',
  isValidQuantity,
  isValidId,
  async (req, res) => {
    const insertion = await sales.create([req.body]);
    const [{ itensSold }] = insertion.ops;
    console.log(insertion.ops);
    const { _id } = insertion.ops[0];
    res.status(200).json({ _id, itensSold });
  },
);

module.exports = router;
