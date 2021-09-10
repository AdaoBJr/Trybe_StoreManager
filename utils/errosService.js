const error = (statusCode, message) => ({
  isError: true,
  code: typeof statusCode === 'string' ? statusCode : +statusCode,
  message,
});

module.exports = {
  conflict: (message) => error('409', message),
  unauthorized: (message) => error('401', message),
  notFound: (message) => error('404', message),
  badRequest: (message) => error('400', message),
  invalidData: (message) => error('invalid_data', message),
};
