const app = require('../app');
const supertest = require('supertest');

describe('Index endpoints', () => {
  let requestTest;
  beforeEach(() => {
    requestTest = supertest(app);
  });
  it('GET / should return the homepage', async () => {
    const res = await requestTest.get('/');
    expect(res.status).toEqual(200);
  });
});