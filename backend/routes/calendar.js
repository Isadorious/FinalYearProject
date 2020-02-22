var express = require(`express`);
var router = express.Router();
var Calendar = require(`../models/calendar`);
const Task = require(`../models/task`);
const Comment = require(`../models/comment`);

router.get(`/`, (req, res) => {
	let query = Calendar.find({});

	query.exec((err, calendars) => {
		if (err) res.send(err);
		res.json(calendars);
	});
});

router.get(`/:id`, (req, res) => {
	let query = Calendar.findById(req.params.id);
	query.exec((err, calendar) => {
		if (err) res.send(err);
		res.json(calendar);
	});
});

router.post(`/`, (req, res) => {
	var calendar = new Calendar(req.body);
	calendar.save((err, calendar) => {
		if (err) {
			res.send(err);
		}
		else {
			res.json({ message: `Calendar added successfully!`, calendar });
		}
	});
});

router.put(`/:id`, (req, res) => {
	Calendar.findById({_id: req.params.id}, (err, calendar) => {
		if(err) res.send(err);

		Object.assign(calendar, req.body).save((err, calendar) => {
			if(err) res.send(err);
			res.json({message: "Calendar updated!", calendar});
		})
	});
});

router.delete(`/:id`, (req, res) => {
	Calendar.deleteOne({_id: req.params.id}, (err, result) => {
		if(err) res.send(err);

		res.json({message: `Calendar successfully deleted!`, result});
	})
});

/*
*	TASK associated routes
*/
router.get(`/:id/tasks`, (req, res) => {
	let query = Calendar.findById(req.params.id);
	query.exec((err, calendar) => {
		if (err) res.send(err);
		res.json(calendar.tasks);
	});
});

router.get(`/:id/tasks/:taskID`, (req, res) => {
	let query = Calendar.findById(req.params.id);
	query.exec((err, calendar) => {
		if(err) res.send(err);
		res.json(calendar.tasks.id(req.params.taskID));
	})
});

router.post(`/:id/tasks`, (req, res) => {
	let query = Calendar.findById(req.params.id);
	let task = new Task(req.body)
	query.exec((err, calendar) => {
		if(err) 
		{
			res.send(err)
		} else {
			calendar.tasks.push(task);

			calendar.save((error, calendar) => {
				if(error) { res.send(error); } else {
				res.json({message : `Task added successfully!`,task}); }
			});
		}
	});
});

router.put(`/:id/tasks/:taskID`, (req, res) => {
	let query = Calendar.findById(req.params.id);

	query.exec((err, calendar) => {
		if(err)	{
			res.send(err);
		} else {
			const task = calendar.tasks.id(req.params.taskID);
			task.set(req.body);

			calendar.save((error, calendar) => {
				if(error) {res.send(error); } else {
					res.json({message: `Task updated successfully!`, task});
				}
			});
		}
	})
});

router.delete(`/:id/tasks/:taskID`, (req, res) => {
	let query = Calendar.findById(req.params.id);

	query.exec((err, calendar) => {
		if(err) {
			res.send(err);
		} else {
			calendar.tasks.id(req.params.taskID).remove();

			calendar.save((error, calendar) => {
				if(err) {
					res.send(error);
				} else {
					res.json({message: `Task successfully deleted!`});
				}
			});
		}
	});
});

/*
* Comment associated routes
*/
router.get(`/:id/tasks/:taskID/comments`, (req, res) => {
	let query = Calendar.findById(req.params.id);
	query.exec((err, calendar) => {
		if(err) {
			res.send(err);
		} else {
			const task = calendar.tasks.id(req.params.taskID);
			res.send(task.taskComments);
		}
	});
});

router.get(`/:id/tasks/:taskID/comments/:commentID`, (req, res) => {
	let query = Calendar.findById(req.params.id);
	query.exec((err, calendar) => {
		if(err) {
			res.send(err);
		} else {
			const comment = calendar.tasks.id(req.params.taskID).taskComments.id(req.params.commentID);
			res.send(comment);
		}
	});
});

router.post(`/:id/tasks/:taskID/comments`, (req, res) => {
	let query = Calendar.findById(req.params.id);
	let comment = new Comment(req.body);
	query.exec((err, calendar) => {
		if(err) 
		{
			res.send(err)
		} else {
			calendar.tasks.id(req.params.taskID).taskComments.push(comment);

			calendar.save((error, calendar) => {
				if(error) { res.send(error); } else {
				res.json({message : `Comment added successfully!`,comment}); }
			});
		}
	});

});

router.put(`/:id/tasks/:taskID/comments/:commentID`, (req, res) => {
	let query = Calendar.findById(req.params.id);

	query.exec((err, calendar) => {
		if(err)	{
			res.send(err);
		} else {
			const comment = calendar.tasks.id(req.params.taskID).taskComments.id(req.params.commentID);
			comment.set(req.body);

			calendar.save((error, calendar) => {
				if(error) {res.send(error); } else {
					res.json({message: `Comment updated successfully!`, comment});
				}
			});
		}
	})
});

router.delete(`/:id/tasks/:taskID/comments/:commentID`, (req, res) => {
	let query = Calendar.findById(req.params.id);

	query.exec((err, calendar) => {
		if(err) {
			res.send(err);
		} else {
			calendar.tasks.id(req.params.taskID).taskComments.id(req.params.commentID).remove();

			calendar.save((error, calendar) => {
				if(err) {
					res.send(error);
				} else {
					res.json({message: `Comment successfully deleted!`});
				}
			});
		}
	});
});

/*
* Subtask associated routes
*/
router.get(`/:id/tasks/:taskID/subtasks`, (req, res) => {
	let query = Calendar.findById(req.params.id);
	query.exec((err, calendar) => {
		if(err) {
			res.send(err);
		} else {
			const task = calendar.tasks.id(req.params.taskID);
			res.send(task.subTasks);
		}
	});
});

router.get(`/:id/tasks/:taskID/subtasks/:subTaskID`, (req, res) => {
	let query = Calendar.findById(req.params.id);
	query.exec((err, calendar) => {
		if(err) {
			res.send(err);
		} else {
			const subtask = calendar.tasks.id(req.params.taskID).subTasks.id(req.params.subTaskID);
			res.send(subtask);
		}
	});
});


module.exports = router;