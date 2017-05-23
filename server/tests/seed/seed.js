const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {User} = require('./../../models/user');
const {Company} = require('./../../models/company');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
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

const companies = [
	{
		_id: new ObjectID(),
		name: "Some Company LLC",
		_creator: userOneId
	},
	{
		_id: new ObjectID(),
		name: "Another Comp Corporation",
		_creator: userTwoId
	}
];

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

module.exports = {users, companies, populateUsers, populateCompanies};
