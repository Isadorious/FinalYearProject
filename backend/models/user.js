const mongoose = require(`mongoose`);
const bcrypt = require(`bcrypt`);
  
const Schema = mongoose.Schema;
 
const userSchema = new Schema({
	username: {
		type: `String`,
		required: true,
		trim: true,
		unique: true
	},
	email: {
		type:`String`,
		trim: true,
		unique: true
	},
	password: {
		type:`String`,
		required: true,
		trim: true
	},
	nickname: {
		type: `String`,
		trim: true
	},
	description: {
		type: `String`,
		trim: true
	},
	profilePicture : {
		type: `String`
	},
	communities : {
		type: [`String`]
	},
	dateOfBirth : {
		type: Date,
	}
});

userSchema.pre(`save`, function(next){
	const user = this;
	const saltingRounds = parseInt(process.env.SALT_ROUNDS);
	if(user.isModified("password") || user.isNew) { // Check to see if user's password has been modified or if user is new
		bcrypt.hash(user.password, saltingRounds, function(err, hash){
			if(err){
				console.log(`Error hashing password for user`, user.username);
				next(err);
			} else {
				user.password = hash;
				next();
			}
		});	
	} else {
		next();
	}
});

userSchema.methods.isValidPassword = async function(password){
	const user = this;

	const compare = await bcrypt.compare(password, user.password);
	return compare;
};

userSchema.path(`email`).validate((email) => {
	const emailRegex = /\S+@\S+\.\S+/; // Checks it is of the form String@String.String
	return emailRegex.test(String(email).toLowerCase());
}, `Email must be user@website.tld`);

userSchema.path(`dateOfBirth`).validate((dateOfBirth) => {
	const now = new Date();
	let age = now.getFullYear() - dateOfBirth.getFullYear();
	const month = now.getMonth() - dateOfBirth.getMonth();

	if(month < 0 || (month === 0 && now.getDate() < dateOfBirth.getDate())) {
		age--;
	}

	if(age >= 13) {
		return true;
	} else {
		return false;
	}
}, `User must be at least 13 years old`);

module.exports = mongoose.model(`User`, userSchema);