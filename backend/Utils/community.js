const Community = require(`../models/community`);

export async function isOwner(communityID, userID) {
	Community.findById({ _id: req.params.id }, (err, community) => {
	
		if(community === null)
		{
			let result = {status: 404, message: `Unable to find community`, permission: false, }
			return result;
		} else if(userID == community.ownerID) {
			let result = {permission: true,}
		}
	})
}