const mongoose = require(`mongoose`);

const Schema = mongoose.Schema;

const customSchema = new Schema({
	authorID: {
		type: `String`,
		required: true,
	},
	structureID: {
		type: `String`,
		required: true,
	},
	communityID: {
		type: `String`,
		required: true,
	},
	content: {
		type: Schema.Types.Mixed
	},
	date: {
		type: Date,
		required: true,
		default: Date.now,
	}
});

module.exports = mongoose.model(`CustomData`, customSchema);