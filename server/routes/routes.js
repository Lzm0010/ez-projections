//ROUTES
//my middleware modules
const {authenticate} = require('./../middleware/authenticate');

//my controller modules
const UsersController = require('./../controllers/users_controller');
const CompaniesController = require('./../controllers/companies_controller');
const CategoriesController = require('./../controllers/categories_controller');
const RulesController = require('./../controllers/rules_controller');
const ProductsController = require('./../controllers/products_controller');
const AssumptionsController = require('./../controllers/assumptions_controller');

module.exports = (app) => {
  //user routes
  //create a user
  app.post('/users', UsersController.create);
  //login
  app.post('/users/login', UsersController.login);
  //find myself
  app.get('/users/me', authenticate, UsersController.findMe);
  //logout
  app.delete('/users/me/token', authenticate, UsersController.logout);

  //company routes
  //create a company
  app.post('/companies', authenticate, CompaniesController.create);
  //get all companies associated w/ user
  app.get('/companies', authenticate, CompaniesController.index);
  //get specific company
  app.get('/companies/:id', authenticate, CompaniesController.findIt);
  //update company
  app.patch('/companies/:id', authenticate, CompaniesController.update);
  //delete a company
  app.delete('/companies/:id', authenticate, CompaniesController.delete);

  // category routes
  // create category for a company
  app.post('/companies/:id/categories', authenticate, CategoriesController.create);
  //get all categories for company
  app.get('/companies/:id/categories', authenticate, CategoriesController.index);
  //update category
  app.patch('/companies/:id/categories/:catId', authenticate, CategoriesController.update);
  //delete category
  app.delete('/companies/:id/categories/:catId', authenticate, CategoriesController.delete);

  //product routes
  //create a product
  app.post('/companies/:id/products', authenticate, ProductsController.create);
  //get all products associated w/ company
  app.get('/companies/:id/products', authenticate, ProductsController.index);
  //get specific product
  app.get('/companies/:id/products/:proId', authenticate, ProductsController.findIt);
  //update product
  app.patch('/companies/:id/products/:proId', authenticate, ProductsController.update);
  //delete product
  app.delete('/companies/:id/products/:proId', authenticate, ProductsController.delete);

  //rule routes
  //create a rule
  app.post('/companies/:id/rules', authenticate, RulesController.create);
  //get all rules associated w/ company
  app.get('/companies/:id/rules', authenticate, RulesController.index);
  //update rule
  app.patch('/companies/:id/rules/:rulId', authenticate, RulesController.update);
  //delete rule
  app.delete('/companies/:id/rules/:rulId', authenticate, RulesController.delete);

  //assumption routes
  //create assumption
  app.post('/companies/:id/products/:proId/assumptions', authenticate, AssumptionsController.create);
  //get all assumptions associated w/ product
  app.get('/companies/:id/products/:proId/assumptions', authenticate, AssumptionsController.index);
  //update assumption
  app.patch('/companies/:id/products/:proId/assumptions/:AssId', authenticate, AssumptionsController.update);
  //delete assumption
  app.delete('/companies/:id/products/:proId/assumptions/:AssId', authenticate, AssumptionsController.delete);
}
