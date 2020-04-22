const express = require(`express`);
const router = express.Router();
const Community = require(`../models/community`);

router.get(`/`, (req, res) => {
	const query = Community.find({});

	query.exec((err, communities) => {
		if (err) {
			res.send(err);
		}
		res.json(communities);
	});
});

router.get(`/:id`, (req, res) => {
	const query = Community.findById(req.params.id);
	query.exec((err, community) => {
		if (err) {
			res.send(err);
		}
		res.json(community);
	});
});

router.post(`/`, (req, res) => {
	passport.authenticate(`jwt`, {session: false}, (err, user, info) => {
		if(err) {
			res.send(err);
		} else if(info != undefined) {
			res.json({message: info.message});
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
		}
	});
});

router.put(`/:id`, (req, res) => {
	Community.findById({_id: req.params.id}, (err, community) => {
		if(err) {
			res.send(err);
		}

		Object.assign(community, req.body).save((err, community) => {
			if(err) {
				res.send(err);
			}
			res.json({message: `Community updated!`, community});
		});
	});
});

router.delete(`/:id`, (req, res) => {
	Community.deleteOne({_id: req.params.id}, (err, result) => {
		if(err) {
			res.send(err);
		}

		res.json({message: `Community successfully deleted!`, result});
	});
});

module.exports = router;