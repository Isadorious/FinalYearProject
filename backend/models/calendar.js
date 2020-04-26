const mongoose = require(`mongoose`);

const Schema = mongoose.Schema;
const Task = require(`./task`);

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
		type: [Task.schema]
	},
	visibility: {
		type: Number,
		default: 0, // 0 for public, 1 for staff, 2 for admin
		required: true,
	}
});

module.exports = mongoose.model(`Calendar`, calendarSchema);