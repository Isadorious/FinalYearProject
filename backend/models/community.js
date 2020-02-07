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
		type: Number,
		required: true
	},
	communityAdminsID: {
		type: [Number]
	},
	communityStaffID: {
		type: [Number]
	},
	communityMembersID: {
		type: [Number]
	},
	calendarsID: {
		type: [Number]
	}
});

module.exports = mongoose.model(`Community`, communitySchema);