const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

//relevant modules
const {app} = require('./../../server');
const {Company} = require('./../../models/company');
const {Product} = require('./../../models/product');

//seed data
const {users, companies} = require('./../seed/seed');


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
        expect(res.body.comp._creator).toInclude({_id:users[0]._id.toHexString(), email:users[0].email});
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

  it('should delete products associated with company before deleting company', (done) => {
    let hexId = companies[0]._id.toHexString();

    request(app)
      .delete(`/companies/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Product.find({}).then((products) => {
          expect(products.length).toBe(1);
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
