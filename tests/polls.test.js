const app = require('../app');
const supertest = require('supertest');

describe('Polls endpoints', () => {
  let requestTest;
  beforeEach(() => {
    requestTest = supertest(app);
  });
  it('GET /polls/1 should fail, because there is no poll yet', async () => {
    const res = await requestTest.get('/polls/1');
    expect(res.status).toEqual(404);
  });
});
