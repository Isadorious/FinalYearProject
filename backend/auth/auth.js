const passport = require(`passport`);
const localStrategy = require(`passport-local`).Strategy;
const userModel = require(`../models/user`);
const jwtStrategy = require(`passport-jwt`).Strategy;
const extractJWT = require(`passport-jwt`).ExtractJwt;

// Create passport middlewear to handle user registration
passport.use(`register`, new localStrategy({
	usernameField: `username`,
	passwordField: `password`,
	session: false
}, async (username, password, done) => {
	const user = new userModel({username, password});
	user.save((err, user) => {
		if(err){
			return done(err, null, {message: `error: username already exists`});
		}
		return done(null, user);
	});
}));