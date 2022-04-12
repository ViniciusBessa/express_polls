const app = require('../app');
const supertest = require('supertest');
const { StatusCodes } = require('http-status-codes');

describe('Index endpoints', () => {
  let requestTest;

  beforeEach(() => {
    requestTest = supertest(app);
  });

  // Testing the homepage
  it('GET / should return the homepage', async () => {
    const res = await requestTest.get('/');
    expect(res.status).toEqual(StatusCodes.OK);
  });
});
