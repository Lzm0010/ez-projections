const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

//my models
const {app} = require('./../../server');
const {Company} = require('./../../models/company');
const {Product} = require('./../../models/product');
const {Category} = require('./../../models/category');
const {Assumption} = require('./../../models/assumption');

//seed data
const {users, companies, categories, products, assumptions} = require('./../seed/seed');

describe('POST /companies/:id/products/:id/assumptions', () => {
  it('should post a new assumption to database', (done) => {
    let compId = companies[0]._id.toHexString();
    let proId = products[0]._id.toHexString();
    let _category = categories[1]._id.toHexString();
    let name = "Price";
    let valueType = "Currency";
    let value = 45;

    request(app)
      .post(`/companies/${compId}/products/${proId}/assumptions`)
      .set('x-auth', users[0].tokens[0].token)
      .send({_category, name, valueType, value})
      .expect(200)
      .expect((res) => {
        expect(res.body.assumptions[1].name).toBe(name);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Product.findById(proId)
        .populate('assumptions')
        .then((product) => {
          expect(product.assumptions.length).toBe(2);
          expect(product.assumptions[1]).toInclude({name, value, _category, valueType});
          done();
        }).catch((err) => done(err));
      });
  });

  it('should return a 404 with an invalid company', (done) => {
    let proId = products[0]._id.toHexString();
    let _category = categories[1]._id.toHexString();
    let name = "Price";
    let valueType = "Currency";
    let value = 45;

    request(app)
      .post(`/companies/${new ObjectID().toHexString()}/products/${proId}/assumptions`)
      .set('x-auth', users[0].tokens[0].token)
      .send({_category, name, valueType, value})
      .expect(404)
      .end(done);
  });

  it('should not create assumption with invalid data', (done) => {
    let compId = companies[0]._id.toHexString();
    let proId = products[0]._id.toHexString();

    request(app)
      .post(`/companies/${compId}/products/${proId}/assumptions`)
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Assumption.find({})
        .then((assumptions) => {
          expect(assumptions.length).toBe(2);
          done();
        }).catch((err) => done(err));
      });
  });
});

describe('GET /companies/:id/products/:id/assumptions', () => {
  it('should fetch all assumptions for a particular product', (done) => {
    let compId = companies[0]._id.toHexString();
    let proId = products[0]._id.toHexString();

    request(app)
      .get(`/companies/${compId}/products/${proId}/assumptions`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(1);
      })
      .end(done);
  });
});

describe('PATCH /companies/:id/products/:id/assumptions/:id', () => {
  it('should update assumption by id', (done) => {
    let compId = companies[0]._id.toHexString();
    let proId = products[0]._id.toHexString();
    let assId = assumptions[0]._id.toHexString();
    let _category = categories[1]._id.toHexString();
    let name = "New Assumption Name";
    let valueType = "Percentage";
    let value = 0.48;

    request(app)
      .patch(`/companies/${compId}/products/${proId}/assumptions/${assId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({_category, name, valueType, value})
      .expect(200)
      .expect((res) => {
        expect(res.body.assumption.name).toBe(name);
        expect(res.body.assumption.valueType).toBe(valueType);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Product.findById(proId)
        .populate('assumptions')
        .then((product) => {
          expect(product.assumptions[0].name).toBe(name);
          expect(product.assumptions[0].value).toBe(value);
          done();
        }).catch((err) => done(err));
      });
  });

  it('should not update assumption that is not companys', (done) => {
    let compId = companies[0]._id.toHexString();
    let proId = products[0]._id.toHexString();
    let assId = assumptions[1]._id.toHexString();
    let name = "Monkeys";

    request(app)
      .patch(`/companies/${compId}/products/${proId}/assumptions/${assId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({name})
      .expect(404)
      .end(done)
  });
});

describe('DELETE /companies/:id/products/:id/assumptions/:id', () => {
  it('should find assumption remove it from product and delete it', (done) => {
    let compId = companies[0]._id.toHexString();
    let proId = products[0]._id.toHexString();
    let assId = assumptions[0]._id.toHexString();

    request(app)
      .delete(`/companies/${compId}/products/${proId}/assumptions/${assId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Product.findById(proId)
        .populate('assumptions')
        .then((product) => {
          expect(product.assumptions.length).toBe(0);
        }).then(() => {
          Assumption.findById(assId)
          .then((assumption) => {
            expect(assumption).toNotExist();
            done();
          })
        }).catch((err) => done(err));
      });
  });

  it('should not allow a category to be deleted by wrong user and company ', (done) => {
    let compId = companies[0]._id.toHexString();
    let proId = products[0]._id.toHexString();
    let assId = assumptions[1]._id.toHexString();

    request(app)
      .delete(`/companies/${compId}/products/${proId}/assumptions/${assId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Product.findById(proId)
        .populate('assumptions')
        .then((product) => {
          expect(product.assumptions.length).toBe(1);
        }).then(() => {
          Assumption.findById(assId)
          .then((assumption) => {
            expect(assumption).toExist();
            done();
          })
        }).catch((err) => done(err));
      });
  });
});
