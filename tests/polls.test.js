const app = require('../app');
const supertest = require('supertest');

describe('Polls endpoints', () => {
  let requestTest, cookie;
  beforeAll(async () => {
    requestTest = supertest(app);
    const user = await requestTest
      .post('/account/login')
      .send({ username: 'Mike', password: 'password2' });
    cookie = user.headers['set-cookie'];
  });
  // Testing the route GET /polls/:id
  it('GET /polls/1 should return the page of the first poll', async () => {
    const res = await requestTest.get('/polls/1');
    expect(res.status).toEqual(200);
  });
  it('GET /polls/10 should fail with error 404', async () => {
    const res = await requestTest.get('/polls/10');
    expect(res.status).toEqual(404);
  });
  // Testing the route POST /polls
  it('POST /polls should create a new poll and return its id', async () => {
    const res = await requestTest
      .post('/polls')
      .send({
        title: 'Title',
        choices: {
          choice1: 'Choice-1',
          choice2: 'Choice-2',
          choice3: 'Choice-3',
        },
      })
      .set('Cookie', cookie);
    expect(res.status).toEqual(201);
    expect(res.body.pollID).toBeTruthy();
  });
  // Testing the route PATCH /polls/:id
  it('PATCH /polls/1 should finish the poll', async () => {
    const res = await requestTest.patch('/polls/1').set('Cookie', cookie);
    expect(res.status).toEqual(200);
  });
  it('PATCH /polls/3 should fail to finish the poll with 403', async () => {
    const res = await requestTest.patch('/polls/3').set('Cookie', cookie);
    expect(res.status).toEqual(403);
  });
  it('PATCH /polls/4 should fail to finish the poll with 400', async () => {
    const res = await requestTest.patch('/polls/4').set('Cookie', cookie);
    expect(res.status).toEqual(400);
  });
  it('PATCH /polls/10 should fail to finish the poll with 404', async () => {
    const res = await requestTest.patch('/polls/10').set('Cookie', cookie);
    expect(res.status).toEqual(404);
  });
});
