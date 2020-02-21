const mongoose = require(`mongoose`);

const Schema = mongoose.Schema;
const Comment = require(`./comment`);
const SubTask = require(`./subtask`);

const taskSchema = new Schema ({
    taskName: {
        type: `String`,
        required: true,
        trim: true
    },
    taskDescription: {
        type: `String`
    },
    taskCategory: {
        type: `String`
    },
    taskAssignedUsers: {
        type: [`String`]
    },
    taskDue: {
        type: Date
    },
    taskComments: {
        type: [Comment]
	},
	subTasks: {
		type: [SubTask]
	}
});

module.exports = mongoose.model(`Task`, taskSchema);