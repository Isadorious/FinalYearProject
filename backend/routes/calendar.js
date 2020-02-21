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

router.put(`/:id`, (req, res) => {
	Calendar.findById({_id: req.params.id}, (err, calendar) => {
		if(err) res.send(err);

		Object.assign(calendar, req.body).save((err, calendar) => {
			if(err) res.send(err);
			res.json({message: "Calendar updated!", calendar});
		})
	});
});

router.delete(`/:id`, (req, res) => {
	Calendar.deleteOne({_id: req.params.id}, (err, result) => {
		if(err) res.send(err);

		res.json({message: `Calendar successfully deleted!`, result});
	})
});

/*
*	TASK associated routes
*/
router.get(`/:id/tasks`, (req, res) => {
	let query = Calendar.findById(req.params.id);
	query.exec((err, calendar) => {
		if (err) res.send(err);
		res.json(calendar.tasks);
	});
});

module.exports = router;