const expect = require('expect');
const request = require('supertest');

//relevant modules
const {app} = require('./../../server');
const {User} = require('./../../models/user');

//seed data
const {users} = require('./../seed/seed');

describe('POST /users', () => {
  it('should create a new user in db', (done) => {
    let email = 'lzm0010@gmail.com';
    let password = 'password';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((err) => {
          if (err) {
            return done(err);
          }
        });
      });
  });

  it('should return error if invalid request', (done) => {
    let email = 'lzmo@sdf';
    let password = '23432';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });

  it('should not store a user if email is not unique', (done) => {
    let email = 'lee@gmail.com';
    let password = 'password';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login a user with valid credentials', (done) => {
    let email = users[1].email;
    let password = users[1].password;

    request(app)
      .post('/users/login')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[1]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((err) => done(err));
      });
  });

  it('should reject invalid login', (done) => {
    let email = users[1].email;
    let password = "WrongPass";

    request(app)
      .post('/users/login')
      .send({email, password})
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((err) => done(err));
      });
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated ', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return a 401 if not authenticated', (done) => {
    request(app)
     .get('/users/me')
     .expect(401)
     .expect(res => {
      expect(res.body).toEqual({});
     })
     .end(done);
  });
});

describe('Delete /users/me/token', () => {
  it('should delete user with valid token', (done) => {
		let token = users[0].tokens[0].token;

		request(app)
			.delete('/users/me/token')
			.set('x-auth', token)
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toNotExist();
			})
			.end((err) => {
				if (err) {
					return done(err)
				}

				User.findById(users[0]._id).then((user) => {
					expect(user.tokens.length).toBe(0);
					done()
				}).catch(e => done(e));
			});

	});

  it('should return a 401 if not authenticated', (done) => {
    request(app)
      .delete('/users/me/token')
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});
