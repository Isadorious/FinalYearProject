const express = require(`express`);
const router = express.Router();
const CustomData = require(`../models/customData`);
const Community = require(`../models/community`);

/*
* route/:communityID/structure/:structureID/data/:customDataID
*/

router.get(`/:communityID/structure/:structureID`, (req, res) => {
	const query = CustomData.find({communityID: req.params.communityID, structureID: req.params.structureID});

	query.exec((err, customData) => {
		if(err) {
			res.send(err);
		} else {
			res.send(customData);
		}
	});
});

router.get(`/:communityID/structure/:structureID/data/:dataID`, (req, res) => {
	const query = CustomData.findOne({_id: req.params.dataID, communityID: req.params.communityID, structureID: req.params.structureID});

	query.exec((err, customData) => {
		if(err) {
			res.send(err);
		} else {
			res.send(customData);
		}
	});
});

module.exports = router;