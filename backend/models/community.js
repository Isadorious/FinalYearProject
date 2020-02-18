const mongoose = require(`mongoose`);

const environment = process.env.NODE_ENV;

const Schema = mongoose.Schema;

const communitySchema = new Schema({
	communityName: {
		type: `String`,
		required: true,
		trim: true,
		unique: true
	},
	description: {
		type: `String`,
		trim: true,
	},
	logo: {
		type: `String`
	},
	banner: {
		type: `String`
	},
	ownerID: {
		type: `String`,
		required: true
	},
	communityAdminsID: {
		type: [`String`]
	},
	communityStaffID: {
		type: [`String`]
	},
	calendarsID: {
		type: [`String`]
	}
});

module.exports = mongoose.model(`Community`, communitySchema);