const { generateToken } = require('../../../src/utils/auth');
const jwt = require('jsonwebtoken');

describe('Auth Util', () => {
  it('should generate a valid token', () => {
    const user = { _id: '123' };
    const token = generateToken(user);
    const decoded = jwt.verify(token, 'your_jwt_secret');
    expect(decoded.id).toBe(user._id);
  });
});