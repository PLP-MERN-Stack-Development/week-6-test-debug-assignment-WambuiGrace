const { protect } = require('../../src/middleware/auth');
const User = require('../../src/models/User');
const jwt = require('jsonwebtoken');
const httpMocks = require('node-mocks-http');

describe('Auth Middleware', () => {
  it('should call next if token is valid', async () => {
    const user = { _id: '123' };
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret');
    const req = httpMocks.createRequest({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    jest.spyOn(User, 'findById').mockReturnValue({
      select: jest.fn().mockResolvedValue(user),
    });

    await protect(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if no token is provided', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await protect(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({ error: 'Not authorized, no token' });
  });

  it('should return 401 if token is invalid', async () => {
    const req = httpMocks.createRequest({
      headers: {
        authorization: 'Bearer invalidtoken',
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await protect(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({ error: 'Not authorized, token failed' });
  });
});