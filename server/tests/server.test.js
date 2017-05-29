//my modules
const {app} = require('./../server');

//seed data
const {populateUsers, populateCompanies, populateCategories} = require('./seed/seed');

//before each test
beforeEach(populateUsers);
beforeEach(populateCompanies);
beforeEach(populateCategories);

//user tests
describe('USER TESTS', () => {
  require('./controllers/users_controller.test');
});

//company tests
describe('COMPANY TESTS', () => {
  require('./controllers/companies_controller.test');
});

//category tests
describe('CATEGORY TESTS', () => {
  require('./controllers/categories_controller.test');
});

//product tests
describe('PRODUCT TESTS', () => {
  require('./controllers/products_controller.test');
});

//rule tests
describe('RULE TESTS', () => {
  require('./controllers/rules_controller.test');
});

//assumption tests
describe('ASSUMPTION TESTS', () => {
  require('./controllers/assumptions_controller.test');
});
