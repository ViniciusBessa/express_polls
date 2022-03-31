const server = require('./app');
const supertest = require('supertest');

describe('Index endpoints', () => {
  let requestTest;
  beforeEach(() => {
    requestTest = supertest(server);
  });
  afterEach((done) => {
    server.close(done);
  });
  it('GET / should return the homepage', async () => {
    const res = await requestTest.get('/');
    expect(res.status).toEqual(200);
  });
});
