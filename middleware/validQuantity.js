const isValidQuantity = (req, res, next) => {
  const { quantity } = req.body;

  if (quantity < 1) {
  return res.status(422).json({
    err: {
      code: 'invalid_data',
      message: '"quantity" must be larger than or equal to 1',
      },
    });
  }

  if (typeof quantity !== 'number') {
    return res.status(422).json({
      err: {
        code: 'invalid_data',
        message: '"quantity" must be a number',
        },
      });
    }
    next();
};

  module.exports = { isValidQuantity };
