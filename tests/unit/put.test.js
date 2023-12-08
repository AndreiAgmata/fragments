const request = require('supertest');
const app = require('../../src/app');

describe('PUT /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  test('incorrect credentials are denied', () =>
    request(app).put('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('update fragment data', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('fragment');

    const id = resPost.body.fragment.id;

    const res = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .send('updated fragment')
      .set('content-type', 'text/plain');
    expect(res.statusCode).toBe(201);
  });

  test('update fragment data with mismatching content type', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('fragment');

    const id = resPost.body.fragment.id;

    const res = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .send('new fragment')
      .set('content-type', 'text/markdown');
    expect(res.statusCode).toBe(415);
    expect(res.body.status).toBe('error');
  });

  test('update fragment that does not exist', async () => {
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('fragment');

    const res = await request(app)
      .put(`/v1/fragments/invalid_id`)
      .auth('user1@email.com', 'password1')
      .send('new fragment')
      .set('content-type', 'text/plain');
    expect(res.statusCode).toBe(500);
  });
});
