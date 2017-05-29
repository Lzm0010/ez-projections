const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {User} = require('./../../models/user');
const {Company} = require('./../../models/company');
const {Category} =require('./../../models/category');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const compOneId = new ObjectID();
const compTwoId = new ObjectID();
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
		_id: new ObjectID(),
		name: "Inventory",
		_company: compOneId
	},
	{
		_id: new ObjectID(),
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

const companies = [
	{
		_id: compOneId,
		name: "Some Company LLC",
		_creator: userOneId,
		categories: [categories[0], categories[1]],
		products: [],
		rules: []
	},
	{
		_id: compTwoId,
		name: "Another Comp Corporation",
		_creator: userTwoId,
		categories: [categories[2], categories[3]],
		products: [],
		rules: []
	}
];


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

module.exports = {users, companies, categories, populateUsers, populateCompanies, populateCategories};
