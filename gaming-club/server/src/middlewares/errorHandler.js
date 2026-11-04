export const errorHandler = (err, req, res, next) => {
  console.error('[Error Middleware]:', err);

  const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Serverda ichki xatolik yuz berdi.',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
