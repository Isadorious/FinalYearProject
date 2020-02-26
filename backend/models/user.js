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
	}
});

userSchema.pre(`save`, function(next){
	const user = this;
	const saltingRounds = parseInt(process.env.SALT_ROUNDS);
	if(!user.isModified || !user.isNew) { // Don't perform any of these operations if the user data hasn't been updated
		next();
	} else {
		bcrypt.hash(user.password, saltingRounds, function(err, hash){
			if(err){
				console.log(`Error hashing password for user`, user.username);
				next(err);
			} else {
				user.password = hash;
				next();
			}
		});
	}
});

userSchema.methods.isValidPassword = async function(password){
	const user = this;

	const compare = await bcrypt.compare(password, user.password);
	return compare;
};

module.exports = mongoose.model(`User`, userSchema);