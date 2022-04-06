const app = require('../app');
const supertest = require('supertest');
const { StatusCodes } = require('http-status-codes');

describe('User endpoints', () => {
  let requestTest;
  beforeEach(() => {
    requestTest = supertest(app);
  });
  // Testing the templates
  it('GET /account/register should return the register page', async () => {
    const res = await requestTest.get('/account/register');
    expect(res.status).toEqual(StatusCodes.OK);
  });
  it('GET /account/login should return the login page', async () => {
    const res = await requestTest.get('/account/login');
    expect(res.status).toEqual(StatusCodes.OK);
  });
  it('GET /account/polls should return the userPolls page', async () => {
    // Getting the user cookie from the server
    const user = await requestTest
      .post('/account/login')
      .send({ username: 'Mike', password: 'password2' });
    const cookie = user.headers['set-cookie'];
    const res = await requestTest.get('/account/polls').set('Cookie', cookie);
    expect(res.status).toEqual(StatusCodes.OK);
  });
  // Testing the register and login functionalities
  it('POST /account/register should register the user and return their info', async () => {
    const res = await requestTest.post('/account/register').send({
      username: 'Jane',
      password: 'password4',
      email: 'jane@somedomain.com',
    });
    expect(res.status).toEqual(StatusCodes.CREATED);
    expect(res.body.user.id).toBeTruthy();
    expect(res.body.user.username).toBeTruthy();
  });
  it('POST /account/register should login the previously registered user', async () => {
    const res = await requestTest.post('/account/login').send({
      username: 'Jane',
      password: 'password4',
    });
    expect(res.status).toEqual(StatusCodes.OK);
    expect(res.body.user.id).toBeTruthy();
    expect(res.body.user.username).toBeTruthy();
  });
  it('POST /account/login should login the user and return their info', async () => {
    const res = await requestTest
      .post('/account/login')
      .send({ username: 'Mike', password: 'password2' });
    expect(res.status).toEqual(StatusCodes.OK);
    expect(res.body.user.id).toBeTruthy();
    expect(res.body.user.username).toBeTruthy();
  });
  it('POST /account/login should fail authentication', async () => {
    const res = await requestTest
      .post('/account/login')
      .send({ username: 'Mike', password: 'password3' });
    expect(res.status).toEqual(StatusCodes.BAD_REQUEST);
  });
});
