const express = require(`express`);
const router = express.Router();
const CustomData = require(`../models/customData`);
const Community = require(`../models/community`);

/*
* route/:communityID/structure/:structureID/data/:customDataID
*/

router.get(`/:communityID/structure/:structureID`, (req, res) => {
	passport.authenticate(`jwt`, { session: false }, (err, user, info) => {
		if (err) {
			res.send(err);
		} else if (info != undefined) {
			res.json({ message: info.message });
		} else {
			isStaff(communityID, user._id)
				.then((result) => {
					const query = CustomData.find({ communityID: req.params.communityID, structureID: req.params.structureID });
					query.exec((err, customData) => {
						if (err) {
							res.send(err);
						} else {
							res.send(customData);
						}
					});
				}).catch((result) => {
					res.status(result.status).json({ message: result.message });
				});
		}
	})(req, res);
});

router.get(`/:communityID/structure/:structureID/data/:dataID`, (req, res) => {
	passport.authenticate(`jwt`, { session: false }, (err, user, info) => {
		if (err) {
			res.send(err);
		} else if (info != undefined) {
			res.json({ message: info.message });
		} else {
			isStaff(communityID, user._id)
				.then((result) => {
					const query = CustomData.findOne({ _id: req.params.dataID, communityID: req.params.communityID, structureID: req.params.structureID });
					query.exec((err, customData) => {
						if (err) {
							res.send(err);
						} else {
							res.send(customData);
						}
					});
				}).catch((result) => {
					res.status(result.status).json({ message: result.message });
				});
		}
	})(req, res);
});

router.post(`/`, (req, res) => {
	// Setup a custom data object based on submitted data
	// Community ID, Structure ID, Author ID
	// Put the key value pairs for the custom data into the content object
	// Mark content as modified
	// Save the custom data object
	// Return result based on status
	const customData = new CustomData(req.body);

	customData.save((err, customData) => {
		if(err) {
			res.send(err);
		} else {
			res.json({message: `CustomData added successfully!`, customData});
		}
	});
});

router.put(`/:communityID/structure/:structureID/data/:dataID`, (req, res) => {

	const query = CustomData.findOne({_id: req.params.dataID, communityID: req.params.communityID, structureID: req.params.structureID});

	query.exec((err, customData) => {
		if(err) {
			res.send(err);
		} else {
			customData.set(req.body);
			
			customData.markModified(`content`);
			customData.save((error, customData) => {
				if(error) {
					res.send(error);
				} else {
					res.send({message: `customData updated successfully!`, customData});
				}
			});
		}
	});
});

router.delete(`/:communityID/structure/:structureID/data/:dataID`, (req, res) => {
	// Delete the custom data object that matches all 3 IDs
	const query = CustomData.deleteOne({_id: req.params.dataID, communityID: req.params.communityID, structureID: req.params.structureID});

	query.exec((err, result) => {
		if(err) {
			res.send(err);
		} else {
			res.json({message: `customData successfully deleted!`, result});
		}
	});
});

module.exports = router;