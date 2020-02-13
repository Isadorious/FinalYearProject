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

router.post(`/`, (req, res) => {
	var calendar = new Calendar(req.body);
	calendar.save((err, calendar) => {
		if (err) {
			res.send(err);
		}
		else {
			res.json({ message: `Calendar added successfully!`, calendar });
		}
	});
});

module.exports = router;