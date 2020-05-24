const mongoose = require(`mongoose`);

const Schema = mongoose.Schema;

const commentSchema = new Schema({
	commentUserID: {
		type: `String`,
		required: true
	},
	commentContent: {
		type: `String`,
		required: true
	},
	commentDate: {
		type: Date,
		required: true,
		default: Date.now,
	},
});

module.exports = mongoose.model(`Comment`, commentSchema);