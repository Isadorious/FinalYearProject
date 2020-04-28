const express = require(`express`);
const router = express.Router();
const Community = require(`../models/community`);
const passport = require(`passport`);
const jwt = require(`jsonwebtoken`);
const User = require(`../models/user`);
const {isOwner, isAdmin, isStaff} = require(`../Utils/community`);

router.get(`/`, (req, res) => {
	passport.authenticate(`jwt`, {session: false}, (err, user, info) => {
		if(err) {
			res.send(err);
		} else if(info != undefined) {
			res.json({message: info.message});
		} else {

			if(req.query.communityName !== undefined) {
				const query = Community.findOne({communityName: req.query.communityName})

				query.exec((err, community) => {
					if (err) {
						res.send(err);
						return;
					}
					if(community === null)
					{
						res.status(404).json({message: `No community found`});
					} else {
						res.json(community);
					}
				});
			} else {
				const query = Community.find({});
				query.exec((err, communities) => {
					if (err) {
						res.send(err);
					}
					res.json(communities);
				});
			}
		}
	})(req, res);
});

router.get(`/:id`, (req, res) => {
	passport.authenticate(`jwt`, {session: false}, (err, user, info) => {
		if(err) {
			res.send(err);
		} else if(info != undefined) {
			res.json({message: info.message});
		} else {
			const query = Community.findById(req.params.id);
			query.setOptions({ lean: true}); // Query returns a javascript object allowing for modification outside of model
			query.exec((err, community) => {
				if (err) {
					res.send(err);
					return;
				}
				if(community === null)
				{
					res.status(404).json({message: `No community found`});
				} else {
					community.permission = 0;

					isOwner(community._id, user._id)
						.then((result) => {
							if(result.permission === true) {
								community.permission = 3;
								res.json(community);
								return;
							} else {
								isAdmin(community._id, user._id)
									.then((result) => {
										if(result.permission === true) {
											community.permission = 2;
											res.json(community);
											return;
										} else {
											isStaff(community._id, user._id)
												.then((result) => {
													if(result.permission === true) {
														community.permission = 1;
														res.json(community);
														return;
													} else {
														res.json(community);
														return;
													}
												});
										}
									});
							}
						});
				}
			});
		}
	})(req, res);
});

router.post(`/uploadBanner/:id`, (req, res) => {
	passport.authenticate(`jwt`, {session: false}, (err, user, info) => {
		if(err) {
			res.status(500).send(err);
		} else if(info != undefined) {
			res.json({message: info.message});
		} else {
			let canModify = isAdmin(req.params.id, user._id);

			if(canModify.permission === true) {
				if(!req.files) {
					res.status(400).send({message: `No file uploaded`});
					return;
				} else {
					let fileLocation;
					try {
						let banner = req.files.banner;
						fileLocation = `uploads/communityData/${req.params.id}/banner/${banner.name}`;
						banner.mv(`./${fileLocation}`);
					} catch (err) {
						console.log(err);
						res.status(500).send(err);
						return;
					}

					Community.findById(req.params.id, (err, community) => {
						if(err) {
							res.status(500).send(err);
						} else if (community === null) {
							res.status(404).json({message: `Community not found`});
						} else {
							community.banner = fileLocation;

							community.save((error, community) => {
								if(error) {
									res.status(500).send(error);
									return;
								} else {
									res.json({message: `Banner uploaded!`});
								}
							});
						}
					});
				}
			} else {
				res.status(canModify.status).json({message: canModify.message});
			}
		}
	})(req, res);
});

router.post(`/uploadLogo/:id`, (req, res) => {
	passport.authenticate(`jwt`, {session: false}, (err, user, info) => {
		if(err) {
			res.status(500).send(err);
		} else if(info != undefined) {
			res.json({message: info.message});
		} else {
			let canModify = isAdmin(req.params.id, user._id);

			if(canModify.permission === true) {
				if(!req.files) {
					res.status(400).send({message: `No file uploaded`});
					return;
				} else {
					let fileLocation;
					try {
						let logo = req.files.logo;
						fileLocation = `uploads/communityData/${req.params.id}/logo/${logo.name}`;
						logo.mv(`./${fileLocation}`);
					} catch (err) {
						console.log(err);
						res.status(500).send(err);
						return;
					}

					Community.findById(req.params.id, (err, community) => {
						if(err) {
							res.status(500).send(err);
						} else if (community === null) {
							res.status(404).json({message: `Community not found`});
						} else {
							community.logo = fileLocation;

							community.save((error, community) => {
								if(error) {
									res.status(500).send(error);
									return;
								} else {
									res.json({message: `Logo uploaded!`});
								}
							});
						}
					});
				}
			} else {
				res.status(canModify.status).json({message: canModify.message});
			}
		}
	})(req, res);
})

router.post(`/`, (req, res) => {
	passport.authenticate(`jwt`, { session: false }, (err, user, info) => {
		if (err) {
			res.send(err);
		} else if (info != undefined) {
			res.json({ message: info.message });
		} else {
			// Create new community from the data in the request body
			const community = new Community(req.body);
			// Save the new community in the database
			community.save((err, community) => {
				if (err) {
					res.send(err);
				} else {
					res.json({ message: `Community added successfully!`, community });
				}
			});

			User.findById((user.id), (err, user) => {
				user.communities.push(community.id);
				user.save();
			})


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
			Community.findById({ _id: req.params.id }, (err, community) => {
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

				if (hasPerm === true) {
					Object.assign(community, req.body).save((err, community) => {
						if (err) {
							res.send(err);
						}
						res.json({ message: `Community updated!`, community });
					});
				} else {
					res.status(401).json({ message: `Not authorized to edit this community` });
				}
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
			// Check if user is owner to allow delete
			Community.findById({ _id: req.params.id }, (err, community) => {
				if (err) {
					res.send(err);
					return;
				}
				if (community === null) {
					res.status(404).json({ message: `Unable to find community` });
					return;
				}
				if (user._id == community.ownerID) {
					Community.deleteOne({ _id: req.params.id }, (err, result) => {
						if (err) {
							res.send(err);
						}
						res.json({ message: `Community successfully deleted!`, result });
					});
				} else {
					res.status(401).json({ message: `Not authorized to delete this community` });
				}
			})
		}
	})(req, res);
});

module.exports = router;