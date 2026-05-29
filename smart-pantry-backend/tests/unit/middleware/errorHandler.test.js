const errorHandler = require('../../../src/middleware/errorHandler');

function mockRes() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res;
}

describe('Error Handler Middleware', () => {

  test('should handle generic error with 500 status', () => {
    const err = new Error('Something broke');
    const res = mockRes();

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 500,
        error: 'Internal Server Error',
        message: 'Something broke',
      })
    );
  });

  test('should handle custom status error (404)', () => {
    const err = new Error('Item not found');
    err.status = 404;
    const res = mockRes();

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 404,
        error: 'Not Found',
        message: 'Item not found',
      })
    );
  });

  test('should handle 400 Bad Request error', () => {
    const err = new Error('Invalid input');
    err.status = 400;
    const res = mockRes();

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        error: 'Bad Request',
      })
    );
  });

  test('should handle 503 Service Unavailable error', () => {
    const err = new Error('AI service down');
    err.status = 503;
    const res = mockRes();

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 503,
        error: 'Service Unavailable',
      })
    );
  });

  test('should handle Sequelize validation error', () => {
    const err = {
      name: 'SequelizeValidationError',
      errors: [
        { path: 'name', message: 'Name is required' },
        { path: 'quantity', message: 'Quantity must be non-negative' },
      ],
      message: 'Validation error',
    };
    const res = mockRes();

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        error: 'Validation Error',
        fieldErrors: [
          { field: 'name', message: 'Name is required' },
          { field: 'quantity', message: 'Quantity must be non-negative' },
        ],
      })
    );
  });

  test('should handle Sequelize unique constraint error', () => {
    const err = {
      name: 'SequelizeUniqueConstraintError',
      message: 'Unique violation',
    };
    const res = mockRes();

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 409,
        error: 'Conflict',
      })
    );
  });

  test('should include timestamp in error response', () => {
    const err = new Error('Test');
    const res = mockRes();

    errorHandler(err, {}, res, jest.fn());

    const responseBody = res.json.mock.calls[0][0];
    expect(responseBody.timestamp).toBeDefined();
  });
});