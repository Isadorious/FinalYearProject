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
	try {
		const user = await userModel.create({username, password});
		return done(null, user);
	} catch (error) {
		// Send the error to the next middlewear
		done(error);
	}
}));