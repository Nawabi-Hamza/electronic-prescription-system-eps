// middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('❌ ERROR:', err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Something went wrong',
  });
};

module.exports = errorHandler;
