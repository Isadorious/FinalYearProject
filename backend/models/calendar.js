const mongoose = require(`mongoose`);

const Schema = mongoose.Schema;

const calendarSchema = new Schema({
	calendarName: {
		type: `String`,
		required: true,
		trim: true
	},
	description: {
		type: `String`,
		trim: true,
	},
	background: {
		type: `String`
	},
	categories: {
		type: [`String`]
	},
	tasks: {
		type: [Number]
	}
});

module.exports = mongoose.model(`Calendar`, calendarSchema);