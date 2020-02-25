const mongoose = require(`mongoose`);

const Schema = mongoose.Schema;

const subTaskSchema = new Schema ({
	subTaskName: {
		type: `String`,
		required: true,
		trim: true
	},
	subTaskDescription: {
		type: `String`
	},
	subTaskAssignedUsers: {
		type: [`String`]
	},
	subTaskDue: {
		type: Date
	}
});

module.exports = mongoose.model(`SubTask`, subTaskSchema);