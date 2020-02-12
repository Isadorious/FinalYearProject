var express = require(`express`);
var router = express.Router();
var User = require(`../models/user`);

router.get(`/`, (req, res) => {
	let query = User.find({});

	query.exec((err, users) => {
		if(err) res.send(err);
		res.json(users);
	});
});

module.exports = router;