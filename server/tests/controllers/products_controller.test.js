const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

//my models
const {app} = require('./../../server');
const {Company} = require('./../../models/company');
const {Product} = require('./../../models/product');
const {Assumption} = require('./../../models/assumption');

//seed data
const {users, companies, products} = require('./../seed/seed');

describe('POST /companies/:id/products', () => {
  it('should post a new product to database', (done) => {
    let compId = companies[0]._id.toHexString();
    let name = "Beer";

    request(app)
      .post(`/companies/${compId}/products`)
      .set('x-auth', users[0].tokens[0].token)
      .send({name})
      .expect(200)
      .expect((res) => {
        expect(res.body.products[1].name).toBe(name);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Company.findById(compId)
        .populate('products')
        .then((comp) => {
          expect(comp.products.length).toBe(2);
          expect(comp.products[1]).toInclude({name});
          done();
        }).catch((err) => done(err));
      });
  });

  it('should return a 404 with an invalid company', (done) => {
    request(app)
      .post(`/companies/${new ObjectID().toHexString()}/products`)
      .set('x-auth', users[0].tokens[0].token)
      .send({name: "something"})
      .expect(404)
      .end(done);
  });

  it('should not create a category with invalid data', (done) => {
    let compId = companies[0]._id.toHexString();

    request(app)
      .post(`/companies/${compId}/products`)
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Product.find({})
        .then((products) => {
          expect(products.length).toBe(2);
          done();
        }).catch((err) => done(err));
      });
  });
});

describe('GET /companies/:id/products', () => {
  it('should fetch all products for a particular company', (done) => {
    let compId = companies[0]._id.toHexString();

    request(app)
      .get(`/companies/${compId}/products`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /companies/:id/products/:id', () => {
  it('should get product associated with id', (done) => {
    request(app)
      .get(`/companies/${companies[0]._id.toHexString()}/products/${products[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.product._company).toBe(companies[0]._id.toHexString());
        expect(res.body.product.name).toBe(companies[0].products[0].name);
      })
      .end(done);
  });

  it('should not grab a product not created by company', (done) => {
    request(app)
      .get(`/companies/${companies[0]._id.toHexString()}/products/${products[1]._id.toHexString()}`)
      .set(`x-auth`, users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /companies/:id/products/:id', () => {
  it('should update a product by id', (done) => {
    let compId = companies[0]._id.toHexString();
    let proId = products[0]._id.toHexString();
    let name = "Miller Light";

    request(app)
      .patch(`/companies/${compId}/products/${proId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({name})
      .expect(200)
      .expect((res) => {
        expect(res.body.product.name).toBe(name);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Company.findById(compId)
        .populate('products')
        .then((comp) => {
          expect(comp.products[0].name).toBe(name);
          done();
        }).catch((err) => done(err));
      });
    });

    it('should not update a product that is not companys', (done) => {
      let compId = companies[0]._id.toHexString();
      let proId = products[1]._id.toHexString();
      let name = "Monkeys";

      request(app)
        .patch(`/companies/${compId}/products/${proId}`)
        .set('x-auth', users[0].tokens[0].token)
        .send({name})
        .expect(404)
        .end(done)
    });
});

describe('DELETE /companies/:id/products/:id', () => {
  it('should find a product remove it from company and delete it', (done) => {
    let compId = companies[0]._id.toHexString();
    let proId = products[0]._id.toHexString();

    request(app)
      .delete(`/companies/${compId}/products/${proId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Company.findById(compId)
        .populate('products')
        .then((comp) => {
          expect(comp.products.length).toBe(0);
        }).then(() => {
          Product.findById(proId)
          .then((product) => {
            expect(product).toNotExist();
            done();
          })
        }).catch((err) => done(err));
      });
  });

  it('should delete assumptions that belong to product before deleting product', (done) => {
    let compId = companies[0]._id.toHexString();
    let proId = products[0]._id.toHexString();

    request(app)
      .delete(`/companies/${compId}/products/${proId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Assumption.find({})
        .then((assumptions) => {
          expect(assumptions.length).toBe(1);
          done();
        }).catch((err) => done(err));
      });
  });

  it('should not allow a product to be deleted by wrong user and company ', (done) => {
    let compId = companies[0]._id.toHexString();
    let proId = products[1]._id.toHexString();

    request(app)
      .delete(`/companies/${compId}/products/${proId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Company.findById(compId)
        .populate('products')
        .then((comp) => {
          expect(comp.products.length).toBe(1);
        }).then(() => {
          Product.findById(proId)
          .then((product) => {
            expect(product).toExist();
            done();
          })
        }).catch((err) => done(err));
      });
  });
});
