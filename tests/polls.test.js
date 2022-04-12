const app = require('../app');
const supertest = require('supertest');
const { StatusCodes } = require('http-status-codes');

describe('Polls endpoints', () => {
  let requestTest, cookie;

  beforeAll(async () => {
    requestTest = supertest(app);
    const user = await requestTest
      .post('/account/login')
      .send({ username: 'Mike', password: 'password2' });
    cookie = user.headers['set-cookie'];
  });

  beforeEach(async () => {
    requestTest = supertest(app);
  });

  // Testing the route GET /polls/:pollId
  it('GET /polls/1 should return the page of the first poll', async () => {
    const res = await requestTest.get('/polls/1');
    expect(res.status).toEqual(StatusCodes.OK);
  });

  it('GET /polls/10 should fail to get the poll page with error 404', async () => {
    const res = await requestTest.get('/polls/10');
    expect(res.status).toEqual(StatusCodes.NOT_FOUND);
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
    expect(res.status).toEqual(StatusCodes.CREATED);
    expect(res.body.pollId).toBeTruthy();
  });

  // Testing the route PATCH /polls/:pollId
  it('PATCH /polls/1 should finish the poll', async () => {
    const res = await requestTest.patch('/polls/1').set('Cookie', cookie);
    expect(res.status).toEqual(StatusCodes.OK);
  });

  it('PATCH /polls/3 should fail to finish the poll with 403', async () => {
    const res = await requestTest.patch('/polls/3').set('Cookie', cookie);
    expect(res.status).toEqual(StatusCodes.FORBIDDEN);
  });

  it('PATCH /polls/4 should fail to finish the poll with 400', async () => {
    const res = await requestTest.patch('/polls/4').set('Cookie', cookie);
    expect(res.status).toEqual(StatusCodes.BAD_REQUEST);
  });

  it('PATCH /polls/10 should fail to finish the poll with 404', async () => {
    const res = await requestTest.patch('/polls/10').set('Cookie', cookie);
    expect(res.status).toEqual(StatusCodes.NOT_FOUND);
  });

  // Testing the route GET /polls/search
  it('GET /polls/search should return the search page', async () => {
    const res = await requestTest.get('/polls/search?title=Poll+1');
    expect(res.status).toEqual(StatusCodes.OK);
  });

  // Testing the route GET /polls/:pollId/choices
  it('GET /polls/1/choices should return all the choices of the poll with id 1', async () => {
    const res = await requestTest.get('/polls/1/choices');
    expect(res.status).toEqual(StatusCodes.OK);
    expect(res.body.choices).toBeTruthy();
  });

  it('GET /polls/10/choices should fail to find the choices with error 404', async () => {
    const res = await requestTest.get('/polls/10/choices');
    expect(res.status).toEqual(StatusCodes.NOT_FOUND);
  });

  // Testing the route PATCH /polls/:pollId/choices/:choiceId
  it('PATCH /polls/3/choices/6 should update the number of votes of the choice', async () => {
    const res = await requestTest
      .patch('/polls/3/choices/6')
      .set('Cookie', cookie);
    expect(res.status).toEqual(StatusCodes.OK);
    expect(res.body.choice).toBeTruthy();
  });

  it('PATCH /polls/3/choices/6 should fail because of duplicate vote with error 400', async () => {
    const firstVote = await requestTest.patch('/polls/3/choices/6');
    const voteCookie = firstVote.headers['set-cookie'];
    const res = await requestTest
      .patch('/polls/3/choices/6')
      .set('Cookie', voteCookie);
    expect(res.status).toEqual(StatusCodes.BAD_REQUEST);
  });

  it('PATCH /polls/2/choices/3 should fail to update the choice with error 400', async () => {
    const res = await requestTest.patch('/polls/2/choices/3');
    expect(res.status).toEqual(StatusCodes.BAD_REQUEST);
  });

  it('PATCH /polls/3/choices/10 should fail to update the choice with error 404', async () => {
    const res = await requestTest.patch('/polls/3/choices/10');
    expect(res.status).toEqual(StatusCodes.NOT_FOUND);
  });
});
