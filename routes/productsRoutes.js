const express = require('express');
const { create,
  getAll, update,
  remove, getById } = require('../controllers/productsController');
  const { validateProduct,
    validateProductId } = require('../middlewares/ValidationsMiddleware');

const router = express.Router();

router.route('/').post(validateProduct, create);

router.route('/:id')
  .get(validateProductId, getById);

router.route('/').get(getAll);

module.exports = router;
