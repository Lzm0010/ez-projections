const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

//my models
const {app} = require('./../../server');
const {Company} = require('./../../models/company');
const {Rule} = require('./../../models/rule');

//seed data
const {users, companies, categories, rules} = require('./../seed/seed');

describe('POST /companies/:id/rules', () => {
  it('should post a new rule to database', (done) => {
    let compId = companies[0]._id.toHexString();
    let _category = categories[0]._id.toHexString();
    let name = "Units Sold";
    let rule = "Demand * Units";

    request(app)
      .post(`/companies/${compId}/rules`)
      .set('x-auth', users[0].tokens[0].token)
      .send({name, _category, rule})
      .expect(200)
      .expect((res) => {
        expect(res.body.rules[1].name).toBe(name);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Company.findById(compId)
        .populate('rules')
        .populate('categories')
        .then((comp) => {
          expect(comp.rules.length).toBe(2);
          expect(comp.rules[1]).toInclude({name, _category, rule});
          expect(comp.rules[1]._category.toHexString()).toBe(_category);
          done();
        }).catch((err) => done(err));
      });
  });

  it('should return a 404 with an invalid company', (done) => {
    let _category = categories[0]._id.toHexString();

    request(app)
      .post(`/companies/${new ObjectID().toHexString()}/rules`)
      .set('x-auth', users[0].tokens[0].token)
      .send({name: "something", _category, rule: "some rule"})
      .expect(404)
      .end(done);
  });

  it('should not create a rule with invalid data', (done) => {
    let compId = companies[0]._id.toHexString();

    request(app)
      .post(`/companies/${compId}/rules`)
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Rule.find({})
        .then((rules) => {
          expect(rules.length).toBe(2);
          done();
        }).catch((err) => done(err));
      });
  });

});

describe('GET /companies/:id/rules', () => {
  it('should fetch all rules for a particular company', (done) => {
    let compId = companies[0]._id.toHexString();

    request(app)
      .get(`/companies/${compId}/rules`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(1);
      })
      .end(done);
  });

  it('should get a 404 for company that is not users', (done) => {
    let compId = companies[0]._id.toHexString();

    request(app)
      .get(`/companies/${compId}/rules`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /companies/:id/rules/:id', () => {
  it('should update a category by id', (done) => {
    let compId = companies[0]._id.toHexString();
    let rulId = rules[0]._id.toHexString();
    let name = "New rule name";
    let _category = categories[1]._id.toHexString();
    let rule = "New rule equation";

    request(app)
      .patch(`/companies/${compId}/rules/${rulId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({name, _category, rule})
      .expect(200)
      .expect((res) => {
        expect(res.body.rule.name).toBe(name);
        expect(res.body.rule._category).toBe(_category);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Company.findById(compId)
        .populate('rules')
        .then((comp) => {
          expect(comp.rules[0].name).toBe(name);
          done();
        }).catch((err) => done(err));
      });
  });

  it('should not update a rule that is not companys', (done) => {
    let compId = companies[0]._id.toHexString();
    let rulId = rules[1]._id.toHexString();
    let name = "Monkeys";

    request(app)
      .patch(`/companies/${compId}/rules/${rulId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({name})
      .expect(404)
      .end(done)
  });
});

describe('DELETE /companies/:id/rules/:id', () => {
  it('should find a rule remove it from company and delete it', (done) => {
    let compId = companies[0]._id.toHexString();
    let rulId = rules[0]._id.toHexString();

    request(app)
      .delete(`/companies/${compId}/rules/${rulId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Company.findById(compId)
        .populate('rules')
        .then((comp) => {
          expect(comp.rules.length).toBe(0);
        }).then(() => {
          Rule.findById(rulId)
          .then((rule) => {
            expect(rule).toNotExist();
            done();
          })
        }).catch((err) => done(err));
      });
  });

  it('should not allow a rule to be deleted by wrong user and company ', (done) => {
    let compId = companies[0]._id.toHexString();
    let rulId = rules[1]._id.toHexString();

    request(app)
      .delete(`/companies/${compId}/rules/${rulId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Company.findById(compId)
        .populate('rules')
        .then((comp) => {
          expect(comp.rules.length).toBe(1);
        }).then(() => {
          Rule.findById(rulId)
          .then((rule) => {
            expect(rule).toExist();
            done();
          })
        }).catch((err) => done(err));
      });
  });
});
