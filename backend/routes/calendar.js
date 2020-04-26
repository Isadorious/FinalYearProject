const express = require(`express`);
const router = express.Router();
const Calendar = require(`../models/calendar`);
const Task = require(`../models/task`);
const Comment = require(`../models/comment`);
const SubTask = require(`../models/subtask`);
const Community = require(`../models/community`);

router.get(`/:id`, (req, res) => {
	passport.authenticate(`jwt`, { session: false }, (err, user, info) => {
		if (err) {
			res.send(err);
		} else if (info != undefined) {
			res.json({ message: info.message });
		} else {
			const query = Calendar.findById(req.params.id);
			query.exec((err, calendar) => {
				if (err) {
					res.send(err);
					return;
				}

				if (calendar === null) {
					res.status(404).json({ message: `Unable to find calendar` });
					return;
				}

				if (calendar.visibility === 0) {
					res.json(calendar);
					return;
				}

				if (calendar.visibility > 0) {
					Community.findById(calendar.communityID, ((err, community) => {
						let isUserStaff = false;
						let isUserAdmin = false;
						let isUserOwner = false;

						if (user._id == community.ownerID) {
							isUserOwner = true;
						} else if (community.communityAdminsID.includes(user._id) === true) {
							isUserAdmin = true;
						} else if (community.communityStaffID.includes(user._id) === true) {
							isUserStaff = true;
						}

						if (calendar.visibility === 1 && (isUserOwner || isUserAdmin || isUserStaff)) {
							res.json(calendar);
						} else if (calendar.visibility === 2 && (isUserOwner || isUserAdmin)) {
							res.json(calendar);
						} else {
							res.status(401).json({ message: `Unauthorized` });
						}

					}));
				}
			});
		}
	})(req, res);
});

router.post(`/`, (req, res) => {
	passport.authenticate(`jwt`, { session: false }, (err, user, info) => {
		if (err) {
			res.send(err);
		} else if (info != undefined) {
			res.json({ message: info.message });
		} else {
			const calendar = new Calendar(req.body);

			// Check that user is allowed to create a new calendar for community
			Community.findById(calendar.communityID, ((err, community) => {
				if (err) {
					res.send(err);
					return;
				}

				if (community === null) {
					res.status(404).json({ message: `Unable to find community` });
					return;
				}

				// Check if user is owner or admin to allow them to modify the community
				let hasPerm = false;
				if (user._id == community.ownerID) {
					hasPerm = true;
				} else if (community.communityAdminsID.includes(user._id) === true) {
					hasPerm = true;
				}

				if(hasPerm === true)
				{
					calendar.save((err, calendar) => {
						if (err) {
							res.send(err);
							return;
						} else {
							community.calendarsID.push(calendar.id);

							community.save((err, community) => {
								if(err) {
									res.send(err);
									return;
								} else {
									res.send({message: `Calendar saved!`, calendar});
								}
							})
						}
					});
				} else {
					res.status(401).json({message: `Not authorized to create new calendar`});
				}

			}));
		}
	})(req, res);
});

router.put(`/:id`, (req, res) => {
	Calendar.findById({ _id: req.params.id }, (err, calendar) => {
		if (err) {
			res.send(err);
		}

		Object.assign(calendar, req.body).save((err, calendar) => {
			if (err) {
				res.send(err);
			}
			res.json({ message: `Calendar updated!`, calendar });
		});
	});
});

router.delete(`/:id`, (req, res) => {
	Calendar.deleteOne({ _id: req.params.id }, (err, result) => {
		if (err) {
			res.send(err);
		}

		res.json({ message: `Calendar successfully deleted!`, result });
	});
});

/*
*	TASK associated routes
*/
router.get(`/:id/tasks`, (req, res) => {
	const query = Calendar.findById(req.params.id);
	query.exec((err, calendar) => {
		if (err) {
			res.send(err);
		}
		res.json(calendar.tasks);
	});
});

router.get(`/:id/tasks/:taskID`, (req, res) => {
	const query = Calendar.findById(req.params.id);
	query.exec((err, calendar) => {
		if (err) {
			res.send(err);
		}
		res.json(calendar.tasks.id(req.params.taskID));
	});
});

router.post(`/:id/tasks`, (req, res) => {
	const query = Calendar.findById(req.params.id);
	const task = new Task(req.body);
	query.exec((err, calendar) => {
		if (err) {
			res.send(err);
		} else {
			calendar.tasks.push(task);

			calendar.save((error) => {
				if (error) {
					res.send(error);
				} else {
					res.json({ message: `Task added successfully!`, task });
				}
			});
		}
	});
});

router.put(`/:id/tasks/:taskID`, (req, res) => {
	const query = Calendar.findById(req.params.id);

	query.exec((err, calendar) => {
		if (err) {
			res.send(err);
		} else {
			const task = calendar.tasks.id(req.params.taskID);
			task.set(req.body);

			calendar.save((error) => {
				if (error) {
					res.send(error);
				} else {
					res.json({ message: `Task updated successfully!`, task });
				}
			});
		}
	});
});

router.delete(`/:id/tasks/:taskID`, (req, res) => {
	const query = Calendar.findById(req.params.id);

	query.exec((err, calendar) => {
		if (err) {
			res.send(err);
		} else {
			calendar.tasks.id(req.params.taskID).remove();

			calendar.save((error) => {
				if (err) {
					res.send(error);
				} else {
					res.json({ message: `Task successfully deleted!` });
				}
			});
		}
	});
});

/*
* Comment associated routes
*/
router.get(`/:id/tasks/:taskID/comments`, (req, res) => {
	const query = Calendar.findById(req.params.id);
	query.exec((err, calendar) => {
		if (err) {
			res.send(err);
		} else {
			const task = calendar.tasks.id(req.params.taskID);
			res.send(task.taskComments);
		}
	});
});

router.get(`/:id/tasks/:taskID/comments/:commentID`, (req, res) => {
	const query = Calendar.findById(req.params.id);
	query.exec((err, calendar) => {
		if (err) {
			res.send(err);
		} else {
			const comment = calendar.tasks.id(req.params.taskID).taskComments.id(req.params.commentID);
			res.send(comment);
		}
	});
});

router.post(`/:id/tasks/:taskID/comments`, (req, res) => {
	const query = Calendar.findById(req.params.id);
	const comment = new Comment(req.body);
	query.exec((err, calendar) => {
		if (err) {
			res.send(err);
		} else {
			calendar.tasks.id(req.params.taskID).taskComments.push(comment);

			calendar.save((error) => {
				if (error) {
					res.send(error);
				} else {
					res.json({ message: `Comment added successfully!`, comment });
				}
			});
		}
	});

});

router.put(`/:id/tasks/:taskID/comments/:commentID`, (req, res) => {
	const query = Calendar.findById(req.params.id);

	query.exec((err, calendar) => {
		if (err) {
			res.send(err);
		} else {
			const comment = calendar.tasks.id(req.params.taskID).taskComments.id(req.params.commentID);
			comment.set(req.body);

			calendar.save((error) => {
				if (error) {
					res.send(error);
				} else {
					res.json({ message: `Comment updated successfully!`, comment });
				}
			});
		}
	});
});

router.delete(`/:id/tasks/:taskID/comments/:commentID`, (req, res) => {
	const query = Calendar.findById(req.params.id);

	query.exec((err, calendar) => {
		if (err) {
			res.send(err);
		} else {
			calendar.tasks.id(req.params.taskID).taskComments.id(req.params.commentID).remove();

			calendar.save((error) => {
				if (err) {
					res.send(error);
				} else {
					res.json({ message: `Comment successfully deleted!` });
				}
			});
		}
	});
});

/*
* Subtask associated routes
*/
router.get(`/:id/tasks/:taskID/subtasks`, (req, res) => {
	const query = Calendar.findById(req.params.id);
	query.exec((err, calendar) => {
		if (err) {
			res.send(err);
		} else {
			const task = calendar.tasks.id(req.params.taskID);
			res.send(task.subTasks);
		}
	});
});

router.get(`/:id/tasks/:taskID/subtasks/:subTaskID`, (req, res) => {
	const query = Calendar.findById(req.params.id);
	query.exec((err, calendar) => {
		if (err) {
			res.send(err);
		} else {
			const subtask = calendar.tasks.id(req.params.taskID).subTasks.id(req.params.subTaskID);
			res.send(subtask);
		}
	});
});

router.post(`/:id/tasks/:taskID/subtasks`, (req, res) => {
	const query = Calendar.findById(req.params.id);
	const subTask = new SubTask(req.body);
	query.exec((err, calendar) => {
		if (err) {
			res.send(err);
		} else {
			calendar.tasks.id(req.params.taskID).subTasks.push(subTask);

			calendar.save((error) => {
				if (error) {
					res.send(error);
				} else {
					res.json({ message: `SubTask added successfully!`, subTask });
				}
			});
		}
	});

});

router.put(`/:id/tasks/:taskID/subtasks/:subTaskID`, (req, res) => {
	const query = Calendar.findById(req.params.id);

	query.exec((err, calendar) => {
		if (err) {
			res.send(err);
		} else {
			const subTask = calendar.tasks.id(req.params.taskID).subTasks.id(req.params.subTaskID);
			subTask.set(req.body);

			calendar.save((error) => {
				if (error) {
					res.send(error);
				} else {
					res.json({ message: `Subtask updated successfully!`, subTask });
				}
			});
		}
	});
});

router.delete(`/:id/tasks/:taskID/subtasks/:subTaskID`, (req, res) => {
	const query = Calendar.findById(req.params.id);

	query.exec((err, calendar) => {
		if (err) {
			res.send(err);
		} else {
			calendar.tasks.id(req.params.taskID).subTasks.id(req.params.subTaskID).remove();

			calendar.save((error) => {
				if (err) {
					res.send(error);
				} else {
					res.json({ message: `Subtask successfully deleted!` });
				}
			});
		}
	});
});

module.exports = router;