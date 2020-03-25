const express = require(`express`);
const router = express.Router();
const User = require(`../models/user`);
const passport = require(`passport`);
const jwt = require(`jsonwebtoken`);

router.get(`/`, (req, res) => {
	const query = User.find({});

	query.exec((err, users) => {
		if (err) {
			res.send(err);
		}
		res.json(users);
	});
});

router.post(`/login`, (req, res, next) => {
	passport.authenticate(`login`, (err, user, info) => {
		if(err) {
			res.send(err);
		} else if(info != undefined) {
			res.send(info);
		} else {
			req.logIn(user, {session: false}, err => {
				if(err) {
					res.send(err);
				} else {
					User.findOne({username: req.body.username}, (err, user) => {
						if(err) {
							res.send(err);
						} else {
							const token = jwt.sign({username: user.username, email: user.email }, process.env.SECRET_KEY);
							res.status(200).send({
								auth: true,
								token: token,
								message: `User logged in successfully!`
							});
						} 
					});
				}
			});
		}
	})(req, res, next);
});

router.get(`/:id`, (req, res, next) => {
	passport.authenticate(`jwt`, {session: false}, (err, user, info) => {
		if(err) {
			console.log(err);
		}
		if(info != undefined)
		{
			console.log(info.message);
			res.send(info.message);
		} else {
			const query = User.findById(req.params.id);

			query.exec((err, user) => {
				if (err) {
					res.send(err);
				} else {
					res.json(user);
				}
			})
		}
	})(req, res, next);
});

router.post(`/`, (req, res, next) => {
	passport.authenticate(`register`, (err, user, info) => {
		if(err) {
			res.send(err);
		}else if(info != undefined) {
			res.send(info);
		} else {
			req.logIn(user, {session: false}, err => {
				if(err) {
					res.send(err);
				}
				User.findOne({username: req.body.username}, (err, user) => {
					if(err) {
						res.send(err);
					} else {
						Object.assign(user, req.body).save((err, user) => {
							if(err) {
								console.log(err);
								res.send(err);
							} else {
								res.json({message: `User added successfully!`, user});
							}
						});
					} 
				});
			});
		}
	})(req, res, next);
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