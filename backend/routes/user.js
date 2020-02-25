const express = require(`express`);
const router = express.Router();
const User = require(`../models/user`);

router.get(`/`, (req, res) => {
	const query = User.find({});

	query.exec((err, users) => {
		if (err) {
			res.send(err);
		}
		res.json(users);
	});
});

router.get(`/:id`, (req, res) => {
	const query = User.findById(req.params.id);
	query.exec((err, user) => {
		if (err) {
			res.send(err);
		}
		res.json(user);
	});
});

router.post(`/`, (req, res) => {
	// Create new user from the data in the request body
	const user = new User(req.body);
	// Save the new user in the database
	user.save((err, user) => {
		if (err) {
			res.send(err);
		} else {
			res.json({ message: `User added successfully!`, user });
		}
	});
});

router.put(`/:id`, (req, res) => {
	User.findById({_id: req.params.id}, (err, user) => {
		if(err) {
			res.send(err);
		}

		Object.assign(user, req.body).save((err, user) => {
			if(err) {
				res.send(err);
			}
			res.json({message: `User updated!`, user});
		});
	});
});

router.delete(`/:id`, (req, res) => {
	User.deleteOne({_id: req.params.id}, (err, result) => {
		if(err) {
			res.send(err);
		}

		res.json({message: `User successfully deleted!`, result});
	});
});

module.exports = router;