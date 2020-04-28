const express = require(`express`);
const router = express.Router();
const Calendar = require(`../models/calendar`);
const Task = require(`../models/task`);
const Comment = require(`../models/comment`);
const SubTask = require(`../models/subtask`);
const Community = require(`../models/community`);
const { isStaff, isAdmin, isOwner } = require('../Utils/community');
const { canViewCalendar } = require('../Utils/calendar');

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

				canViewCalendar(req.params.id, user._id)
					.then((result) => {
						res.json(calendar);
					}).catch((result) => {
						res.status(result.status).json({ message: result.message });
					});
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

			isAdmin(calendar.communityID, user._id)
				.then((result) => {
					calendar.save((err, calendar) => {
						if (err) {
							res.send(err);
							return;
						} else {
							community.calendarsID.push(calendar.id);

							community.save((err, community) => {
								if (err) {
									res.send(err);
									return;
								} else {
									res.send({ message: `Calendar saved!`, calendar });
								}
							})
						}
					});
				}).catch((result) => {
					res.status(result.status).json({ message: result.message });
				});
		}
	})(req, res);
});

router.put(`/:id`, (req, res) => {
	passport.authenticate(`jwt`, { session: false }, (err, user, info) => {
		if (err) {
			res.send(err);
		} else if (info != undefined) {
			res.json({ message: info.message });
		} else {

			Calendar.findById({ _id: req.params.id }, (err, calendar) => {
				if (err) {
					res.send(err);
					return;
				}

				if (calendar === null) {
					res.status(404).json({ message: `Unable to find calendar` });
					return;
				}

				isAdmin(calendar.communityID, user._id)
					.then((result) => {
						Object.assign(calendar, req.body).save((err, calendar) => {
							if (err) {
								res.send(err);
							}
							res.json({ message: `Calendar updated!`, calendar });
						});
					}).catch((result) => {
						res.status(result.status).json({ message: result.message });
					});
			});
		}
	})(req, res);
});

router.delete(`/:id`, (req, res) => {
	passport.authenticate(`jwt`, { session: false }, (err, user, info) => {
		if (err) {
			res.send(err);
		} else if (info != undefined) {
			res.json({ message: info.message });
		} else {
			Calendar.findById({ _id: req.params.id }, (err, calendar) => {
				if (err) {
					res.send(err);
					return;
				}
				if (calendar === null) {
					res.status(404).json({ message: `Unable to find calendar` });
					return;
				}
				// Check if user is owner to allow delete
				isOwner(calendar.communityID, user._id)
					.then((result) => {
						Calendar.deleteOne({ _id: req.params.id }, (err, result) => {
							if (err) {
								res.send(err);
								return;
							}
							community.calendarsID.pull(calendar.id);

							community.save((err, community) => {
								if (err) {
									res.send(err);
									return;
								}
								res.json({ message: `Calendar successfully deleted!`, result });
							});
						});
					}).catch((result) => {
						res.status(result.status).json({ message: result.message });
					});
			});
		}
	})(req, res);
});

/*
*	TASK associated routes
*/
router.get(`/:id/tasks`, (req, res) => {
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
				}

				if (calendar === null) {
					res.status(404).status({ message: `Unable to find calendar` });
					return;
				}

				if (calendar.visibility === 0) {
					res.json(calendar.tasks);
					return;
				} else if (calendar.visibility === 1) {
					const result = isStaff(calendar.communityID, user._id);
					if (result.permission === true) {
						res.json(calendar.tasks);
					} else {
						res.status(result.status).json({ message: result.message });
					}
				} else if (calendar.visibility === 2) {
					const result = isAdmin(calendar.communityID, user._id);
					if (result.permission === true) {
						res.json(calendar.tasks);
					} else {
						res.status(result.status).json({ message: result.message });
					}
				}
			});
		}
	})(req, res);
});

router.get(`/:id/tasks/:taskID`, (req, res) => {
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
				}

				if (calendar === null) {
					res.status(404).status({ message: `Unable to find calendar` });
					return;
				}

				if (calendar.visibility === 0) {
					res.json(calendar.tasks.id(req.params.taskID));
					return;
				} else if (calendar.visibility === 1) {
					const result = isStaff(calendar.communityID, user._id);
					if (result.permission === true) {
						res.json(calendar.tasks.id(req.params.taskID));
					} else {
						res.status(result.status).json({ message: result.message });
					}
				} else if (calendar.visibility === 2) {
					const result = isAdmin(calendar.communityID, user._id);
					if (result.permission === true) {
						res.json(calendar.tasks.id(req.params.taskID));
					} else {
						res.status(result.status).json({ message: result.message });
					}
				}
			});
		}
	})(req, res);
});

router.post(`/:id/tasks`, (req, res) => {
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
				} else {
					let result = isStaff(calendar.communityID, user._id);
					if (result.permission === true) {
						const task = new Task(req.body);
						calendar.tasks.push(task);

						calendar.save((error) => {
							if (error) {
								res.send(error);
							} else {
								res.json({ message: `Task added successfully!`, task });
							}
						});
					} else if (result.message !== undefined) {
						res.status(result.status).json({ message: result.message });
					} else {
						res.status(401).json({ message: `Not authorized` });
					}
				}
			});
		}
	})(req, res);
});

router.put(`/:id/tasks/:taskID`, (req, res) => {
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
				} else {
					let result = isStaff(calendar.communityID, user._id);
					if (result.permission === true) {
						const task = calendar.tasks.id(req.params.taskID);
						task.set(req.body);

						calendar.save((error) => {
							if (error) {
								res.send(error);
							} else {
								res.json({ message: `Task updated successfully!`, task });
							}
						});
					} else if (result.message !== undefined) {
						res.status(result.status).json({ message: result.message });
					} else {
						res.status(401).json({ message: `Not authorized` });
					}
				}
			});
		}
	})(req, res);
});

router.delete(`/:id/tasks/:taskID`, (req, res) => {
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
				} else {
					let result = isStaff(calendar.communityID, user._id);
					if (result.permission === true) {
						calendar.tasks.id(req.params.taskID).remove();

						calendar.save((error) => {
							if (err) {
								res.send(error);
							} else {
								res.json({ message: `Task successfully deleted!` });
							}
						});
					} else if (result.message !== undefined) {
						res.status(result.status).json({ message: result.message });
					} else {
						res.status(401).json({ message: `Not authorized` });
					}
				}
			});
		}
	})(req, res);
});

/*
* Comment associated routes
*/
router.get(`/:id/tasks/:taskID/comments`, (req, res) => {
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
				} else {
					const result = canViewCalendar(calendar._id, user._id);
					if (result.permission === true) {
						const task = calendar.tasks.id(req.params.taskID);
						res.send(task.taskComments);
					} else {
						res.status(result.status).json({ message: result.message });
					}
				}
			});
		}
	})(req, res);

});

router.get(`/:id/tasks/:taskID/comments/:commentID`, (req, res) => {
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
				} else {
					const result = canViewCalendar(calendar._id, user._id);
					if (result.permission === true) {
						const comment = calendar.tasks.id(req.params.taskID).taskComments.id(req.params.commentID);
						res.send(comment);
					} else {
						res.status(result.status).json({ message: result.message });
					}
				}
			});
		}
	})(req, res);

});

router.post(`/:id/tasks/:taskID/comments`, (req, res) => {
	passport.authenticate(`jwt`, { session: false }, (err, user, info) => {
		if (err) {
			res.send(err);
		} else if (info != undefined) {
			res.json({ message: info.message });
		} else {
			const query = Calendar.findById(req.params.id);
			const comment = new Comment(req.body);
			const canSeeCalendar = canViewCalendar(calendar._id, user._id);
			const canPostComment = isStaff(calendar.communityID, user._id);

			if (canSeeCalendar.permission === true && canPostComment === true) {
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
			} else {
				res.status(canPostComment.status).json({ message: canPostComment.message });
			}
		}
	})(req, res);


});

router.put(`/:id/tasks/:taskID/comments/:commentID`, (req, res) => {
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
				} else {
					const comment = calendar.tasks.id(req.params.taskID).taskComments.id(req.params.commentID);

					let isAuth = false;

					if (comment.authorID == user._id) {
						isAuth = true;
					} else {
						res.status(401).json({ message: `Unauthorized` });
						return;
					}

					const canSeeCalendar = canViewCalendar(calendar._id, user._id);
					const canPostComment = isStaff(calendar.communityID, user._id);

					if (canSeeCalendar.permission === true && canPostComment.permission === true && isAuth === true) {
						comment.set(req.body);
						calendar.save((error) => {
							if (error) {
								res.send(error);
							} else {
								res.json({ message: `Comment updated successfully!`, comment });
							}
						});
					} else {
						res.status(canPostComment.status).json({ message: canPostComment.message });
					}
				}
			});
		}
	})(req, res);
});

router.delete(`/:id/tasks/:taskID/comments/:commentID`, (req, res) => {
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
				} else {
					const comment = calendar.tasks.id(req.params.taskID).taskComments.id(req.params.commentID);

					let isAuth = false;

					if (comment.authorID == user._id) {
						isAuth = true;
					} else {
						res.status(401).json({ message: `Unauthorized` });
						return;
					}

					const canSeeCalendar = canViewCalendar(calendar._id, user._id);
					const canDeleteComment = isAdmin(calendar.communityID, user._id);

					if (canSeeCalendar.permission === true && (canDeleteComment.permission === true || isAuth === true)) {
						calendar.tasks.id(req.params.taskID).taskComments.id(req.params.commentID).remove();
						calendar.save((error) => {
							if (error) {
								res.send(error);
							} else {
								res.json({ message: `Comment successfully deleted!` });
							}
						});
					} else {
						res.status(canDeleteComment.status).json({ message: canDeleteComment.message });
					}
				}
			});
		}
	})(req, res);

});

/*
* Subtask associated routes
*/
router.get(`/:id/tasks/:taskID/subtasks`, (req, res) => {
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
				} else {
					let result = canViewCalendar(calendar._id, user._id);
					if (result.permission === true) {
						const task = calendar.tasks.id(req.params.taskID);
						res.send(task.subTasks);
					} else {
						res.status(result.status).json({ message: result.message });
					}
				}
			});
		}
	})(req, res);

});

router.get(`/:id/tasks/:taskID/subtasks/:subTaskID`, (req, res) => {
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
				} else {
					let result = canViewCalendar(calendar._id, user._id);
					if (result.permission === true) {
						const subtask = calendar.tasks.id(req.params.taskID).subTasks.id(req.params.subTaskID);
						res.send(subtask);
					} else {
						res.status(result.status).json({ message: result.message });
					}
				}
			});
		}
	})(req, res);
});

router.post(`/:id/tasks/:taskID/subtasks`, (req, res) => {
	passport.authenticate(`jwt`, { session: false }, (err, user, info) => {
		if (err) {
			res.send(err);
		} else if (info != undefined) {
			res.json({ message: info.message });
		} else {
			const query = Calendar.findById(req.params.id);
			const subTask = new SubTask(req.body);
			query.exec((err, calendar) => {
				if (err) {
					res.send(err);
				} else {

					const canSeeCalendar = canViewCalendar(calendar._id, user._id);
					const canPostTask = isStaff(calendar.communityID, user._id);

					if (canSeeCalendar.permission === true && canPostTask === true) {
						calendar.tasks.id(req.params.taskID).subTasks.push(subTask);

						calendar.save((error) => {
							if (error) {
								res.send(error);
							} else {
								res.json({ message: `SubTask added successfully!`, subTask });
							}
						});
					} else {
						res.status(canPostTask.status).json({ message: canPostTask.message });
					}
				}
			});
		}
	})(req, res);
});

router.put(`/:id/tasks/:taskID/subtasks/:subTaskID`, (req, res) => {
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
				} else {

					const canSeeCalendar = canViewCalendar(calendar._id, user._id);
					const canPostTask = isStaff(calendar.communityID, user._id);

					if (canSeeCalendar.permission === true && canPostTask === true) {
						const subTask = calendar.tasks.id(req.params.taskID).subTasks.id(req.params.subTaskID);
						subTask.set(req.body);

						calendar.save((error) => {
							if (error) {
								res.send(error);
							} else {
								res.json({ message: `Subtask updated successfully!`, subTask });
							}
						});
					} else {
						res.status(canPostTask.status).json({ message: canPostTask.message });
					}
				}
			});
		}
	})(req, res);
});

router.delete(`/:id/tasks/:taskID/subtasks/:subTaskID`, (req, res) => {
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
				} else {

					const canSeeCalendar = canViewCalendar(calendar._id, user._id);
					const canPostTask = isStaff(calendar.communityID, user._id);

					if (canSeeCalendar.permission === true && canPostTask === true) {
						calendar.tasks.id(req.params.taskID).subTasks.id(req.params.subTaskID).remove();

						calendar.save((error) => {
							if (err) {
								res.send(error);
							} else {
								res.json({ message: `Subtask successfully deleted!` });
							}
						});
					} else {
						res.status(canPostTask.status).json({ message: canPostTask.message });
					}
				}
			});
		}
	})(req, res);
});

module.exports = router;