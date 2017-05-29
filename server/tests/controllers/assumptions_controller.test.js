const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../../server');
const {Company} = require('./../../models/company');
const {Product} = require('./../../models/product');
const {Assumption} = require('./../../models/assumption');

describe('POST /companies/:id/products/:id/assumptions', () => {
  
});

describe('GET /companies/:id/products/:id/assumptions', () => {

});

describe('PATCH /companies/:id/products/:id/assumptions/:id', () => {

});

describe('DELETE /companies/:id/products/:id/assumptions/:id', () => {

});
