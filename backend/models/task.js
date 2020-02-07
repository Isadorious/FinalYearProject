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
        type: [Number]
    },
    subTaskDue: {
        type: Date
    },
    subTaskComments: {
        type: [commentSchema]
    }
});