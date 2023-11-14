// tests/unit/get-one-by-id-info.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id/info', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/:id/info').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/:id')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  // Using a valid username/password pair should give a success result and allow user to get info
  test('authenticated users can get a fragment info', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .send('Test Fragment');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');

    const get = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}/info`)
      .auth('user1@email.com', 'password1');
    expect(get.statusCode).toBe(200);
  });
  // Using a valid username/password pair but invalid ID should give an error
  test('authenticated users get error when no fragment is found with corresponding ID', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .send('Test Fragment');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');

    const resGet = await request(app)
      .get(`/v1/fragments/invalidID/info`)
      .auth('user1@email.com', 'password1');
    expect(resGet.statusCode).toBe(404);
  });
});
