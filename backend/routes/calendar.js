const express = require(`express`);
const router = express.Router();
const Calendar = require(`../models/calendar`);
const Task = require(`../models/task`);
const Comment = require(`../models/comment`);
const SubTask = require(`../models/subtask`);
const Community = require(`../models/community`);
const Category = require(`../models/category`);
const { isStaff, isAdmin, isOwner } = require('../Utils/community');
const { canViewCalendar } = require('../Utils/calendar');
const passport = require(`passport`);
const jwt = require(`jsonwebtoken`);

router.get(`/:id`, (req, res) => {
	passport.authenticate(`jwt`, { session: false }, (err, user, info) => {
		if (err) {
			res.send(err);
		} else if (info != undefined) {
			res.json({ message: info.message });
		} else {
			const query = Calendar.findById(req.params.id);
			query.setOptions({ lean: true }); // Query returns a javascript object allowing for modification outside of model
			query.exec((err, calendar) => {
				if (err) {
					res.send(err);
					return;
				}

				canViewCalendar(req.params.id, user._id)
					.then((result) => {
						Community.findById(calendar.communityID, (err, community) => {
							if (err) {
								res.send(err);
								return;
							}

							if (community !== null) {
								calendar.communityStaffID = community.communityStaffID;
								calendar.communityAdminsID = community.communityAdminsID;
								calendar.ownerID = community.ownerID;
							}

							isOwner(calendar.communityID, user._id)
								.then((result) => {
									calendar.permission = 3;
									res.json(calendar);
									return;
								}).catch((result) => {
									isAdmin(calendar.communityID, user._id)
										.then((result) => {
											calendar.permission = 2;
											res.json(calendar);
											return;
										}).catch((result) => {
											isStaff(calendar.communityID, user._id)
												.then((result) => {
													calendar.permission = 1;
													res.json(calendar);
													return;
												}).catch((result) => {
													res.json(calendar);
													return;
												});
										});
								});
						});
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
							Community.findById(calendar.communityID, (err, community) => {
								community.calendarsID.push(calendar.id);

								community.save((err, community) => {
									if (err) {
										res.send(err);
										return;
									} else {
										res.send({ message: `Calendar added successfully!`, calendar });
									}
								});
							});
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

				canViewCalendar(req.params.id, user._id)
					.then((result) => {
						res.json(calendar.tasks);
					}).catch((result) => {
						res.status(result.status).json({ message: result.message });
					});
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

				canViewCalendar(req.params.id, user._id)
					.then((result) => {
						res.json(calendar.tasks.id(req.params.taskID));
					}).catch((result) => {
						res.status(result.status).json({ message: result.message });
					});
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
					isStaff(calendar.communityID, user._id)
						.then((result) => {
							const task = new Task(req.body);
							calendar.tasks.push(task);

							calendar.save((error) => {
								if (error) {
									res.send(error);
								} else {
									res.json({ message: `Task added successfully!`, task });
								}
							});
						}).catch((result) => {
							res.status(result.status).json({ message: result.message });
						});
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
					isStaff(calendar.communityID, user._id)
						.then((result) => {
							const task = calendar.tasks.id(req.params.taskID);
							task.set(req.body);

							calendar.save((error) => {
								if (error) {
									res.send(error);
								} else {
									res.json({ message: `Task updated successfully!`, task });
								}
							});
						}).catch((result) => {
							res.status(result.status).json({ message: result.message });
						});
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
					isStaff(calendar.communityID, user._id)
						.then((result) => {
							calendar.tasks.id(req.params.taskID).remove();

							calendar.save((error) => {
								if (err) {
									res.send(error);
								} else {
									res.json({ message: `Task successfully deleted!` });
								}
							});
						}).catch((result) => {
							res.status(result.status).json({ message: result.message });
						});
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
					canViewCalendar(calendar._id, user._id)
						.then((result) => {
							const task = calendar.tasks.id(req.params.taskID);
							res.send(task.taskComments);
						}).catch((result) => {
							res.status(result.status).json({ message: result.message });

						});
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

					canViewCalendar(calendar._id, user._id)
						.then((result) => {
							const comment = calendar.tasks.id(req.params.taskID).taskComments.id(req.params.commentID);
							res.send(comment);
						}).catch((result) => {
							res.status(result.status).json({ message: result.message });
						});
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
			canViewCalendar(calendar._id, user._id)
				.then((result) => {
					isStaff(calendar.communityID, user._id)
						.then((result) => {
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
						}).catch((result) => {
							res.status(result.status).json({ message: result.message });
						})
				}).catch((result) => {
					res.status(result.status).json({ message: result.message });
				});
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

					canViewCalendar(calendar._id, user._id)
						.then((result) => {
							isStaff(calendar.communityID, user._id)
								.then((result) => {
									comment.set(req.body);
									calendar.save((error) => {
										if (error) {
											res.send(error);
										} else {
											res.json({ message: `Comment updated successfully!`, comment });
										}
									});
								}).catch((result) => {
									res.status(result.status).json({ message: result.message });
								})
						}).catch((result) => {
							res.status(result.status).json({ message: result.message });
						});
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

					canViewCalendar(calendar._id, user._id)
						.then((result) => {
							if (isAuth) {
								calendar.tasks.id(req.params.taskID).taskComments.id(req.params.commentID).remove();
								calendar.save((error) => {
									if (error) {
										res.send(error);
									} else {
										res.json({ message: `Comment successfully deleted!` });
									}
								});
							} else {
								isAdmin(calendar.communityID, user._id)
									.then((result) => {
										calendar.tasks.id(req.params.taskID).taskComments.id(req.params.commentID).remove();
										calendar.save((error) => {
											if (error) {
												res.send(error);
											} else {
												res.json({ message: `Comment successfully deleted!` });
											}
										});
									}).catch((result) => {
										res.status(result.status).json({ message: result.message });
									})
							}
						}).catch((result) => {
							res.status(result.status).json({ message: result.message });
						});
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
					canViewCalendar(calendar._id, user._id)
						.then((result) => {
							const task = calendar.tasks.id(req.params.taskID);
							res.send(task.subTasks);
						}).catch((result) => {
							res.status(result.status).json({ message: result.message });
						});
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
					canViewCalendar(calendar._id, user._id)
						.then((result) => {
							const subtask = calendar.tasks.id(req.params.taskID).subTasks.id(req.params.subTaskID);
							res.send(subtask);
						}).catch((result) => {
							res.status(result.status).json({ message: result.message });
						});
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
					canViewCalendar(calendar._id, user._id)
						.then((result) => {
							isStaff(calendar.communityID, user._id)
								.then((result) => {
									calendar.tasks.id(req.params.taskID).subTasks.push(subTask);
									calendar.save((error) => {
										if (error) {
											res.send(error);
										} else {
											res.json({ message: `SubTask added successfully!`, subTask });
										}
									});
								}).catch((result) => {
									res.status(result.status).json({ message: result.message });
								});
						}).catch((result) => {
							res.status(result.status).json({ message: result.message });
						});
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
					canViewCalendar(calendar._id, user._id)
						.then((result) => {
							isStaff(calendar.communityID, user._id)
								.then((result) => {
									const subTask = calendar.tasks.id(req.params.taskID).subTasks.id(req.params.subTaskID);
									subTask.set(req.body);
									calendar.save((error) => {
										if (error) {
											res.send(error);
										} else {
											res.json({ message: `Subtask updated successfully!`, subTask });
										}
									});
								}).catch((result) => {
									res.status(result.status).json({ message: result.message });
								});
						}).catch((result) => {
							res.status(result.status).json({ message: result.message });
						});
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
					canViewCalendar(calendar._id, user._id)
						.then((result) => {
							isStaff(calendar.communityID, user._id)
								.then((result) => {
									calendar.tasks.id(req.params.taskID).subTasks.id(req.params.subTaskID).remove();
									calendar.save((error) => {
										if (err) {
											res.send(error);
										} else {
											res.json({ message: `Subtask successfully deleted!` });
										}
									});
								}).catch((result) => {
									res.status(result.status).json({ message: result.message });
								});
						}).catch((result) => {
							res.status(result.status).json({ message: result.message });
						});
				}
			});
		}
	})(req, res);
});

/*
* Category routes
*/

router.get(`/:id/category/:categoryID`, (req, res) => {
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

				canViewCalendar(req.params.id, user._id)
					.then((result) => {
						res.json(calendar.categories.id(req.params.categoryID));
					}).catch((result) => {
						res.status(result.status).json({ message: result.message });
					});
			});
		}
	})(req, res);
});

router.post(`/:id/category`, (req, res) => {
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
					isStaff(calendar.communityID, user._id)
						.then((result) => {
							const category = new Category(req.body);
							calendar.categories.push(category);

							calendar.save((error) => {
								if (error) {
									res.send(error);
								} else {
									res.json({ message: `Category added successfully!`, category });
								}
							});
						}).catch((result) => {
							res.status(result.status).json({ message: result.message });
						});
				}
			});
		}
	})(req, res);
});

router.put(`/:id/category/:categoryID`, (req, res) => {
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
					isStaff(calendar.communityID, user._id)
						.then((result) => {
							const category = calendar.categories.id(req.params.categoryID);
							category.set(req.body);

							calendar.save((error) => {
								if (error) {
									res.send(error);
								} else {
									res.json({ message: `Category updated successfully!`, category });
								}
							});
						}).catch((result) => {
							res.status(result.status).json({ message: result.message });
						});
				}
			});
		}
	})(req, res);
});

router.delete(`/:id/category/:categoryID`, (req, res) => {
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
					isStaff(calendar.communityID, user._id)
						.then((result) => {
							calendar.categories.id(req.params.categoryID).remove();

							// Remove category IDs from tasks
							const tasksToUpdate = calendars.tasks.filter(function(task) {
								return task.taskCategory == req.params.categoryID; 
							});

							tasksToUpdate.forEach(function(modifiedTask) {
								modifiedTask.taskCategory = '';
								const task = calendar.tasks.id(modifiedTask._id);
								task.set(modifiedTask);
							});

							// Save the calendar
							calendar.save((error) => {
								if (err) {
									res.send(error);
								} else {
									res.json({ message: `Category successfully deleted!` });
								}
							});
						}).catch((result) => {
							res.status(result.status).json({ message: result.message });
						});
				}
			});
		}
	})(req, res);
});

module.exports = router;