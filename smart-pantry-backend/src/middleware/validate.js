/**
 * Simple validation middleware for required fields.
 */
function validateRequired(fields) {
  return (req, res, next) => {
    const missing = [];

    for (const field of fields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return res.status(400).json({
        status: 400,
        error: 'Validation Error',
        message: `Missing required fields: ${missing.join(', ')}`,
      });
    }

    next();
  };
}

module.exports = { validateRequired };