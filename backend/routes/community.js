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

module.exports = router;