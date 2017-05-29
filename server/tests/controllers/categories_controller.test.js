const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

//my models
const {app} = require('./../../server');
const {Company} = require('./../../models/company');
const {Category} = require('./../../models/category');

//seed data
const {users, companies, categories} = require('./../seed/seed');

describe('POST /companies/:id/categories', () => {
  it('should post a new category to database', (done) => {
    let hexId = companies[0]._id.toHexString();
    let name = "Customized";

    request(app)
      .post(`/companies/${hexId}/categories`)
      .set('x-auth', users[0].tokens[0].token)
      .send({name})
      .expect(200)
      .expect((res) => {
        expect(res.body.categories[2].name).toBe(name);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Company.findById(hexId)
        .populate('categories')
        .then((comp) => {
          expect(comp.categories.length).toBe(3);
          expect(comp.categories[2]).toInclude({name});
          done();
        }).catch((err) => done(err));
      });
  });

  it('should return a 404 with an invalid company', (done) => {
    request(app)
      .post(`/companies/${new ObjectID().toHexString()}/categories`)
      .set('x-auth', users[0].tokens[0].token)
      .send({name: "something"})
      .expect(404)
      .end(done);
  });

  it('should not create a category with invalid data', (done) => {
    let hexId = companies[0]._id.toHexString();

    request(app)
      .post(`/companies/${hexId}/categories`)
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Category.find({})
        .then((categories) => {
          expect(categories.length).toBe(4);
          done();
        }).catch((err) => done(err));
      });
  });
});

describe('GET /companies/:id/categories', () => {
  it('should fetch all categories for a particular company', (done) => {
    let hexId = companies[0]._id.toHexString();

    request(app)
      .get(`/companies/${hexId}/categories`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(2);
      })
      .end(done);
  });
});

describe('PATCH /companies/:id/categories/:id', () => {
  it('should update a category by id', (done) => {
    let compId = companies[0]._id.toHexString();
    let catId = categories[0]._id.toHexString();
    let name = "Fixed";

    request(app)
      .patch(`/companies/${compId}/categories/${catId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({name})
      .expect(200)
      .expect((res) => {
        expect(res.body.cat.name).toBe(name);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Company.findById(compId)
        .populate('categories')
        .then((comp) => {
          expect(comp.categories[0].name).toBe(name);
          done();
        }).catch((err) => done(err));
      });
  });

  it('should not update a category that is not companies', (done) => {
    let compId = companies[0]._id.toHexString();
    let catId = categories[2]._id.toHexString();
    let name = "Monkeys";

    request(app)
      .patch(`/companies/${compId}/categories/${catId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({name})
      .expect(404)
      .end(done)
  });
});

describe('DELETE /companies/:id/categories/:id', () => {

});
