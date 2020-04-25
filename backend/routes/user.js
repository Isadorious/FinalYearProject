const express = require(`express`);
const router = express.Router();
const User = require(`../models/user`);
const passport = require(`passport`);
const jwt = require(`jsonwebtoken`);

router.get(`/`, (req, res) => {
	passport.authenticate(`jwt`, {session : false}, (err, user, info) => {
		if(err) {
			console.log(err);
		}
		if(info != undefined)
		{
			res.json({message: info.message});
		} else {

			if(req.query.username !== undefined) {
				const query = User.findOne({username: req.query.username})

				query.exec((error, user) => {
					if(error){
						res.send(error);
					} else {
						user.password = '';
						user.email = '';
						user.dateOfBirth = '';
						res.send({message: `Found user`, user});
					}
				});
			} else {
				const query = User.find({});

				query.exec((error, users) => {
					if(error)
					{
						res.send(error);
					} else {
						users.forEach((user, index) => {
							user.password = ``;
							user.email = ``;
							user.dateOfBirth = ``;
						});
						res.send({message: `found users`, users});
					}
				});
			}
		}
	})(req, res);
});

router.post(`/login`, (req, res, next) => {
	passport.authenticate(`login`, (err, user, info) => {
		if(err) {
			res.send(err);
		} else if(info != undefined) {
			res.json({message: info.message});
		} else {
			req.logIn(user, {session: false}, err => {
				if(err) {
					res.send(err);
				} else {
					User.findOne({username: req.body.username}, (err, user) => {
						if(err) {
							res.send(err);
						} else if(user === null){
							res.status(404).json({message: `User not found`});
						} else {
							const token = jwt.sign({username: user.username, email: user.email }, process.env.SECRET_KEY);
							res.status(200).send({
								auth: true,
								token: token,
								message: `User logged in successfully!`,
								id: user.id,
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
			res.json({message: info.message});
		} else {
			let sameUser = false;

			if(user.id == req.params.id)
			{
				sameUser = true;
			}

			const query = User.findById(req.params.id);

			query.exec((err, user) => {
				if (err) {
					res.send(err);
				} else if (user === null){
					res.status(404).json({message: `User not found`});
				} else {
					if(sameUser == false)
					{
						user.email = ``;
						user.dateOfBirth = ``;
					}

					user.password = ``;

					res.json({message: `Found user successfully!`,user});
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
			res.json({message: info.message});
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

router.put(`/:id`, (req, res, next) => {
	passport.authenticate(`jwt`, {session: false}, (err, user, info) => {
		if(!user.id == req.params.id)
		{
			res.status(403).send({message: `can't modify other users data`});
		} else {
			User.findOne({_id: req.params.id}, (err, user) => {
				if(err) {
					res.send(err);
				} else if(user === null) {
					res.status(404).json({message: `User not found`});
				} else {
					Object.assign(user, req.body).save((error, user) => {
						if(error) {
							console.log(error);
							res.send(error);
						} else {
							user.password = ``;
							res.json({message: `User updated!`, user});
						}
					});
				}
			});
		}

	})(req, res, next);
});

router.post(`/uploadProfilePicture/:id`, (req, res, next) => {
	passport.authenticate(`jwt`, {session: false}, (err, user, info) => {
		if(user.id != req.params.id)
		{
			res.status(403).send({message: `can't modify other users data`});
			return;
		} else {
			if(!req.files) {
				res.status(400).send({message: `No file uploaded`});
				return;
			} else {
				let fileLocation;
				try {
					let profilePicture = req.files.profilePicture;
					fileLocation = `uploads/userData/` +user.id+ `/` + profilePicture.name;
					profilePicture.mv(`./` + fileLocation);
				} catch (err) {
					console.log(err);
					res.status(500).send(err);
					return;
				}

				User.findOne({_id: req.params.id}, (err, user) => {
					if(err) {
						console.log(err);
						res.status(500).send(err);
						return;
					} else if(user === null) {
						res.status(404).json({message: `User not found`});
					} else {
						user.profilePicture = fileLocation;

						user.save((error, user) => {
							if(error) {
								console.log(error);
								res.status(500).send(error);
								return;
							} else {
								res.json({message: `Profile Picture uploaded!`});
							}
						});
					}
				});
			}
		}
	})(req, res, next);
});

router.delete(`/:id`, (req, res) => {
	passport.authenticate(`jwt`, {session: false}, (err, user, info) => {
		if(err) {
			res.send(err);
		} else if(info != undefined) {
			res.json({message: info.message});
		} else if(user.id === req.params.id) {
			User.deleteOne({_id: req.params.id}, (err, result) => {
				if(err) {
					res.send(err);
				}	
				res.json({message: `User successfully deleted!`, result});
			});
		} else {
			res.status(403).send({message: `can't modify other users data`});
		}
	});
});

module.exports = router;