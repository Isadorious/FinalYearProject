var express = require(`express`);
var router = express.Router();
var Calendar = require(`../models/calendar`);

router.get(`/`, (req, res) => {
	let query = Calendar.find({});

	query.exec((err, calendars) => {
		if (err) res.send(err);
		res.json(calendars);
	});
});

module.exports = router;