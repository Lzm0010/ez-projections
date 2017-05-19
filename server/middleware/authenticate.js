let {User} = require('./../models/user');


//middleware for auth tokens for users
let authenticate = (req, res, next) => {
	//grab & store x-auth from request header
	let token = req.header('x-auth');

	//look in db for user with this token
	User.findByToken(token).then( (user) => {
		//if no user reject the promise
		if (!user) {
			//valid token, but no user
			return Promise.reject();
		}

		//found valid user, set the request params to user found info
		req.user = user;
		req.token = token;
		//continue to rest of routes - next is required in middleware
		next();
		//catch all other errors
	}).catch(e => {
		//send back a 401 status if invalid token
		res.status(401).send();
	});
};

module.exports = {authenticate};
