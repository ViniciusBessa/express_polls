const app = require('../app');
const supertest = require('supertest');

describe('User endpoints', () => {
  let requestTest;
  beforeEach(() => {
    requestTest = supertest(app);
  });
  it('GET /account/register should return the register page', async () => {
    const res = await requestTest.get('/account/register');
    expect(res.status).toEqual(200);
  });
  it('GET /account/login should return the login page', async () => {
    const res = await requestTest.get('/account/login');
    expect(res.status).toEqual(200);
  });
});
