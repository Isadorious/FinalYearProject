const mongoose = require(`mongoose`);

const Schema = mongoose.Schema;

const CustomDataStructure = require(`./customData/customDataStructure`);


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
	},
	dataStores: {
		type: [CustomDataStructure.schema],
	}
});

module.exports = mongoose.model(`Community`, communitySchema);