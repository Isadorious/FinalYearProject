const Community = require(`../models/community`);

function isOwner(communityID, userID) {
    return new Promise((resolve, reject) => {
        Community.findById(communityID, (err, community) => {
    
            if (community === null) {
                let result = { status: 404, message: `Unable to find community`, permission: false, }
                resolve(result);
            } else if (userID == community.ownerID) {
                let result = { permission: true, }
                resolve(result);
            } else {
                let result = { permission: false, }
                resolve(result);
            }
        });
    });
}

function isAdmin(communityID, userID) {
    return new Promise((resolve, reject) => {
        isOwnerP(communityID, userID)
        .then((result) => {
            if(result.permission === true) {
                resolve(result);
            } else {
                Community.findById(communityID, (err, community) => {
                    if (community === null) {
                        let result = { status: 404, message: `Unable to find community` }
                        resolve(result);
                    } else if (community.communityAdminsID.includes(userID) === true) {
                        let result = { permission: true, }
                        resolve(result);
                    } else {
                        let result = { permission: false, }
                        resolve(result);
                    }
                });
            }
        });
    });
}

function isStaff(communityID, userID) {
    return new Promise((resolve, reject) => {
        isAdminP(communityID, userID)
        .then((result) => {
            if(result.permission === true) {
                resolve(result);
            } else {
                Community.findById(communityID, (err, community) => {
                    if (community === null) {
                        let result = { status: 404, message: `Unable to find community` }
                        return result;
                    } else if (community.communityStaffID.includes(userID) === true) {
                        let result = { permission: true, }
                        return result;
                    } else {
                        let result = { permission: false, }
                        return result;
                    }
                });
            }
        });
    })
}



exports.isOwner = isOwner;
exports.isStaff = isStaff;
exports.isAdmin = isAdmin;