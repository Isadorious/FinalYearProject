var express = require(`express`);
var router = express.Router();
var Community = require(`../models/community`);

router.get(`/`, (req, res) => {
	let query = Community.find({});

	query.exec((err, communities) => {
		if (err) res.send(err);
		res.json(communities);
	});
});

router.get(`/:id`, (req, res) => {
	let query = Community.findById(req.params.id);
	query.exec((err, community) => {
		if (err) res.send(err);
		res.json(community);
	});
});

module.exports = router;