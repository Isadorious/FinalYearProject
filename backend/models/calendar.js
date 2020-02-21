const mongoose = require(`mongoose`);

const Schema = mongoose.Schema;

const commentSchema = new Schema ({
    commentUserID: {
        type: Number,
        required: true
    },
    commentContent: {
        type: `String`,
        required: true
    }
});

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
        type: [commentSchema]
	},
	subTasks: {
		type: [subTaskSchema]
	}
});

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
		type: [taskSchema]
	}
});

module.exports = mongoose.model(`Calendar`, calendarSchema);
module.exports = mongoose.model(`Task`, taskSchema);
module.exports = mongoose.model(`SubTask`, subTaskSchema);
module.exports = mongoose.model(`Comment`, commentSchema);