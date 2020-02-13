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

router.get(`/:id`, (req, res) => {
	let query = Calendar.findById(req.params.id);
	query.exec((err, calendar) => {
		if (err) res.send(err);
		res.json(calendar);
	});
});

module.exports = router;