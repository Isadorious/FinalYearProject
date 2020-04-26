const Community = require(`../models/community`);

export async function isOwner(communityID, userID) {
	Community.findById({ _id: req.params.id }, (err, community) => {
	
		if(community === null)
		{
			let result = {status: 404, message: `Unable to find community`, permission: false, }
			return result;
		} else if(userID == community.ownerID) {
            let result = {permission: true,}
            return result;
		} else {
            let result = {permission: false,}
            return result;
        }
	})
}

export async function isAdmin(communityID, userID) {

    let result = isOwner(communityID, userID);

    if(result.permission === true)
    {
        return result;
    }

	Community.findById({ _id: req.params.id }, (err, community) => {
	
		if(community === null)
		{
			let result = {status: 404, message: `Unable to find community`}
			return result;
		} else if(community.communityAdminsID.includes(user._id) === true) {
            let result = {permission: true,}
            return result;
		} else {
            let result = {permission: false,}
            return result;
        }
	});
}