const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {User} = require('./../../models/user');
const {Company} = require('./../../models/company');
const {Category} =require('./../../models/category');
const {Rule} = require('./../../models/rule');
const {Product} = require('./../../models/product');
const {Assumption} = require('./../../models/assumption');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const compOneId = new ObjectID();
const compTwoId = new ObjectID();
const catOneId = new ObjectID();
const catTwoId = new ObjectID();
const proOneId = new ObjectID();
const proTwoId = new ObjectID();
const users = [
	{
		_id: userOneId,
		email: 'lee@gmail.com',
		password: 'password',
		tokens: [{
			access: 'auth',
			token: jwt.sign({_id: userOneId.toHexString(), access: 'auth'}, process.env.JWT_SECRET).toString()
		}]
	},
	{
		_id: userTwoId,
		email: 'bob@gmail.com',
		password: 'password',
		tokens: [{
			access: 'auth',
			token: jwt.sign({_id: userTwoId.toHexString(), access: 'auth'}, process.env.JWT_SECRET).toString()
		}]
	}
];

const categories = [
	{
		_id: catOneId,
		name: "Inventory",
		_company: compOneId
	},
	{
		_id: catTwoId,
		name: "Sales",
		_company: compOneId
	},
	{
		_id: new ObjectID(),
		name: "Fixed",
		_company: compTwoId
	},
	{
		_id: new ObjectID(),
		name: "Sales",
		_company: compTwoId
	}
];

const rules = [
	{
		_id: new ObjectID(),
		_company: compOneId,
		_category: catOneId,
		name: "My First Rule",
		rule: "Width * Height"
	},
	{
		_id: new ObjectID(),
		_company: compTwoId,
		_category: catTwoId,
		name: "My Second Rule",
		rule: "Demand * Units"
	}
];

const assumptions = [
	{
		_id: new ObjectID(),
		_product: proOneId,
		_category: catOneId,
		name: "Units per Store",
		valueType: "Number",
		value: 30
	},
	{
		_id: new ObjectID(),
		_product: proTwoId,
		_category: catTwoId,
		name: "Wholesale Price",
		valueType: "Currency",
		value: 45
	}
]

const products = [
	{
		_id: proOneId,
		name: "Heineken",
		_company: compOneId,
		assumptions: [assumptions[0]]
	},
	{
		_id: proTwoId,
		name: "Budweiser",
		_company: compTwoId,
		assumptions: [assumptions[1]]
	}
];

const companies = [
	{
		_id: compOneId,
		name: "Some Company LLC",
		_creator: userOneId,
		categories: [categories[0], categories[1]],
		products: [products[0]],
		rules: [rules[0]]
	},
	{
		_id: compTwoId,
		name: "Another Comp Corporation",
		_creator: userTwoId,
		categories: [categories[2], categories[3]],
		products: [products[1]],
		rules: [rules[1]]
	}
];

const populateAssumptions = (done) => {
	Assumption.remove({}).then(() => {
		return Assumption.insertMany(assumptions);
	}).then(() => done());
};

const populateProducts = (done) => {
	Product.remove({}).then(() => {
		return Product.insertMany(products);
	}).then(() => done());
};

const populateRules = (done) => {
	Rule.remove({}).then(() => {
		return Rule.insertMany(rules);
	}).then(() => done());
};

const populateCategories = (done) => {
	Category.remove({}).then(() => {
		return Category.insertMany(categories);
	}).then(() => done());
};

const populateCompanies = (done) => {
	Company.remove({}).then(() => {
		return Company.insertMany(companies);
	}).then(() => done());
};

const populateUsers = (done) => {
	User.remove({}).then(() => {
		let userOne = new User(users[0]).save();
		let userTwo = new User(users[1]).save();

		return Promise.all([userOne, userTwo])
	}).then(() => done());
};

module.exports = {
	users,
	companies,
	categories,
	rules,
	products,
	assumptions,
	populateUsers,
	populateCompanies,
	populateCategories,
	populateRules,
	populateProducts,
	populateAssumptions
};
