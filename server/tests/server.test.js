const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

//my modules
const {app} = require('./../server');
const {User} = require('./../models/user');
const {Company} = require('./../models/company');
const {AssumptionType} = require('./../models/assumption-type');
const {Assumption} = require('./../models/assumption');
const {Product} = require('./../models/product');

//seed data
const {users, populateUsers} = require('./seed/seed');

//user tests
beforeEach(populateUsers);

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

  it('should return error if invalid request', () => {

  });

  it('should not store a user if email is not unique', () => {

  });
});

describe('POST /users/login', () => {

});

describe('GET /users/me', () => {

});

describe('Delete /users/me/token', () => {

});

//company tests
describe('POST /companies', () => {

});

describe('GET /companies', () => {

});

describe('GET /companies/:id', () => {

});

describe('PATCH /companies/:id', () => {

});

describe('DELETE /companies/:id', () => {

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
