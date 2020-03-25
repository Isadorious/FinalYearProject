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
			return done(err, false, {message: `error: username already exists`});
		}
		return done(null, user);
	});
}));

passport.use(`login`, new localStrategy({
	usernameField: `username`,
	passwordField: `password`,
	session: false
}, async (username, password, done) => {
	userModel.findOne({username: username}, (err, user) => {
		if(err) {
			return done(null, false, {message: `unable to find username`});
		} else if(user == undefined) {
			return done(null, false, {message: `unable to find username`});
		} else {
			user.isValidPassword(password).then(response => {
				if (response === true)
				{
					return done(null, user);
				} else {
					return done(null, false, {message: `passwords do not match`});
				}
			});
		}
	});
}));

passport.use(`jwt`, new jwtStrategy({
	jwtFromRequest: extractJWT.fromAuthHeaderWithScheme(`JWT`),
	secretOrKey: process.env.SECRET_KEY
}, (payload, done) => {
	userModel.findOne({username: payload.username, email: payload.email}, (err, user) => {
		if(err) {
			done(err, false);
		} else {
			done(null, user);
		}
	});
}));