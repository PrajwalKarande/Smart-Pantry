const { validateRequired } = require('../../../src/middleware/validate');

function mockReqResNext(body = {}) {
  return {
    req: { body },
    res: {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    },
    next: jest.fn(),
  };
}

describe('Validate Middleware', () => {

  test('should call next() when all required fields are present', () => {
    const middleware = validateRequired(['name', 'quantity']);
    const { req, res, next } = mockReqResNext({ name: 'Tomatoes', quantity: 5 });

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  test('should return 400 when required field is missing', () => {
    const middleware = validateRequired(['name', 'quantity']);
    const { req, res, next } = mockReqResNext({ name: 'Tomatoes' });

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('quantity'),
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 400 when required field is empty string', () => {
    const middleware = validateRequired(['name']);
    const { req, res, next } = mockReqResNext({ name: '' });

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 400 when required field is null', () => {
    const middleware = validateRequired(['name']);
    const { req, res, next } = mockReqResNext({ name: null });

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('should list all missing fields in error message', () => {
    const middleware = validateRequired(['name', 'quantity', 'unit']);
    const { req, res, next } = mockReqResNext({});

    middleware(req, res, next);

    const responseBody = res.json.mock.calls[0][0];
    expect(responseBody.message).toContain('name');
    expect(responseBody.message).toContain('quantity');
    expect(responseBody.message).toContain('unit');
  });

  test('should pass when field value is 0 (falsy but valid)', () => {
    const middleware = validateRequired(['count']);
    const { req, res, next } = mockReqResNext({ count: 0 });

    middleware(req, res, next);

    // 0 is a valid value, should pass
    expect(next).toHaveBeenCalledTimes(1);
  });
});