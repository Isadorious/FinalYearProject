const Community = require(`../models/community`);

async function isOwner(communityID, userID) {
    Community.findById(communityID, (err, community) => {

        if (community === null) {
            let result = { status: 404, message: `Unable to find community`, permission: false, }
            return result;
        } else if (userID == community.ownerID) {
            let result = { permission: true, }
            return result;
        } else {
            let result = { permission: false, }
            return result;
        }
    })
}

async function isAdmin(communityID, userID) {

    let result = isOwner(communityID, userID);

    if (result.permission === true) {
        return result;
    }

    Community.findById(communityID, (err, community) => {

        if (community === null) {
            let result = { status: 404, message: `Unable to find community` }
            return result;
        } else if (community.communityAdminsID.includes(user._id) === true) {
            let result = { permission: true, }
            return result;
        } else {
            let result = { permission: false, }
            return result;
        }
    });
}

async function isStaff(communityID, userID) {
    let result = isAdmin(communityID, userID);

    if (result.permission === true) {
        return result;
    }

    Community.findById(communityID, (err, community) => {

        if (community === null) {
            let result = { status: 404, message: `Unable to find community` }
            return result;
        } else if (community.communityStaffID.includes(user._id) === true) {
            let result = { permission: true, }
            return result;
        } else {
            let result = { permission: false, }
            return result;
        }
    });
}

exports.isOwner = isOwner;
exports.isStaff = isStaff;
exports.isAdmin = isAdmin;