const request = require('supertest');
const app = require('../../src/app');

describe('API', () => {
  it('should return 404 for non-existent route', async () => {
    const res = await request(app).get('/api/non-existent-route');
    expect(res.status).toBe(404);
  });
});