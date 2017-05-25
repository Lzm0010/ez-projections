const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

//my modules
const {app} = require('./../server');
const {User} = require('./../models/user');
const {Company} = require('./../models/company');
const {Category} = require('./../models/category');
const {Rule} = require('./../models/rule');
const {Product} = require('./../models/product');
const {Assumption} = require('./../models/assumption');

//seed data
const {users, companies, populateUsers, populateCompanies} = require('./seed/seed');

//user tests
beforeEach(populateUsers);
beforeEach(populateCompanies);

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

//company tests
describe('POST /companies', () => {
  it('should create a new company in db associated with user', (done) => {
    let name = "A new company";

    request(app)
      .post('/companies')
      .set('x-auth', users[0].tokens[0].token)
      .send({name})
      .expect(200)
      .expect(res => {
        expect(res.body.name).toBe(name);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Company.find({name}).then((companies) => {
          expect(companies.length).toBe(1);
          expect(companies[0].name).toBe(name);
          expect(companies[0]._creator.toHexString()).toBe(users[0]._id.toHexString());
          done();
        }).catch((err) => done(err));
      });
  });

  it('should not create a company with invalid data', (done) => {
    request(app)
      .post('/companies')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Company.find({}).then((companies) => {
          expect(companies.length).toBe(2);
          done();
        }).catch((err) => done(err));
      });
  });
});

describe('GET /companies', () => {
  it('should get all companies associated with a user', (done) => {
    request(app)
      .get('/companies')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect( (res) => {
        expect(res.body.companies.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /companies/:id', () => {
  it('should get company associated with id', (done) => {
    request(app)
      .get(`/companies/${companies[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.comp._creator).toBe(users[0]._id.toHexString());
        expect(res.body.comp.name).toBe(companies[0].name);
      })
      .end(done);
  });

  it('should not grab a company not created by user', (done) => {
    request(app)
      .get(`/companies/${companies[0]._id.toHexString()}`)
      .set(`x-auth`, users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return a 404 if company not found', (done) => {
    request(app)
      .get(`/companies/${new ObjectID().toHexString()}`)
      .set(`x-auth`, users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return a 404 if invalid object', (done) => {
    request(app)
      .get(`/companies/2049gjcompany`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /companies/:id', () => {
  it('should update a company by id', (done) => {
    let hexId = companies[0]._id.toHexString();
    let name = "My new company name";

    request(app)
      .patch(`/companies/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({name})
      .expect(200)
      .expect((res) => {
        expect(res.body.comp.name).toBe(name);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Company.findById(hexId).then((comp) => {
            expect(comp.name).toBe(name);
            done();
        }).catch((err) => done(err));
      });
  });

  it('should not update a company that is not users', (done) => {
    let hexId = companies[0]._id.toHexString();
    let name = "My new company name";

    request(app)
      .patch(`/companies/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({name})
      .expect(404)
      .end(done)
  });
});

describe('DELETE /companies/:id', () => {
  it('should find a comp by id and delete it', (done) => {
    let hexId = companies[0]._id.toHexString();

    request(app)
      .delete(`/companies/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Company.findById(hexId).then((comp) => {
          expect(comp).toNotExist();
          done();
        }).catch((err) => done(err));
      });
  });

  it('should not allow user to delete company they do not own', (done) => {
    let hexId = companies[0]._id.toHexString();

    request(app)
      .delete(`/companies/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Company.findById(hexId).then((comp) => {
          expect(comp).toExist();
          done();
        }).catch((err) => done(err));
      });
  });
});

//assumption type tests
describe('POST /assumption-types', () => {

});

describe('GET /assumption-types', () => {

});

describe('PATCH /assumption-types/:id', () => {

});

describe('DELETE /assumption-types/:id', () => {

});

//assumption tests
describe('POST /assumptions', () => {

});

describe('GET /assumptions', () => {

});

describe('PATCH /assumptions/:id', () => {

});

describe('DELETE /assumptions/:id', () => {

});

//product tests
describe('POST /products', () => {

});

describe('GET /products', () => {

});

describe('GET /products/:id', () => {

});

describe('PATCH /products/:id', () => {

});

describe('DELETE /products/:id', () => {

});
