const express = require(`express`);
const router = express.Router();
const Community = require(`../models/community`);
const passport = require(`passport`);
const jwt = require(`jsonwebtoken`);
const User = require(`../models/user`);

router.get(`/`, (req, res) => {
	passport.authenticate(`jwt`, {session: false}, (err, user, info) => {
		if(err) {
			res.send(err);
		} else if(info != undefined) {
			res.json({message: info.message});
		} else {
			const query = Community.find({});
			query.exec((err, communities) => {
				if (err) {
					res.send(err);
				}
				res.json(communities);
			});
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