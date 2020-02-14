var express = require(`express`);
var router = express.Router();
var Task = require(`../models/task`);

router.get(`/`, (req, res) => {
	let query = Task.find({});

	query.exec((err, tasks) => {
		if(err) res.send(err);
		res.json(tasks);
	})
});