const Community = require(`../models/community`);

function isOwner(communityID, userID) {
    return new Promise((resolve, reject) => {
        Community.findById(communityID, (err, community) => {
            if (community === null) {
                let result = { status: 404, message: `Unable to find community`, permission: false, }
                reject(result);
            } else if (userID == community.ownerID) {
                let result = { permission: true, status: 200, message: `Authorized` }
                resolve(result);
            } else {
                let result = { permission: false, status: 401, message: `Unauthorized` }
                reject(result);
            }
        });
    });
}

function isAdmin(communityID, userID) {
    return new Promise((resolve, reject) => {
        isOwner(communityID, userID)
            .then((result) => {
                resolve(result);
            }).catch((res) => {
                if (res.status === 404) {
                    reject(res);
                } else {
                    Community.findById(communityID, (err, community) => {
                        if (community === null) {
                            let result = { status: 404, message: `Unable to find community` }
                            reject(result);
                        } else if (community.communityAdminsID.includes(userID) === true) {
                            let result = { permission: true, status: 200, message: `Authorized` }
                            resolve(result);
                        } else {
                            let result = { permission: false, status: 401, message: `Unauthorized` }
                            reject(result);
                        }
                    });
                }
            });
    });
}

function isStaff(communityID, userID) {
    return new Promise((resolve, reject) => {
        isAdmin(communityID, userID)
            .then((result) => {
                resolve(result);
            }).catch((res) => {
                if (res.status === 404) {
                    reject(res);
                } else {
                    Community.findById(communityID, (err, community) => {
                        if (community === null) {
                            let result = { status: 404, message: `Unable to find community` }
                            reject(result);
                        } else if (community.communityStaffID.includes(userID) === true) {
                            let result = { permission: true, status: 200, message: `Authorized` }
                            resolve(result);
                        } else {
                            let result = { permission: false, status: 401, message: `Unauthorized` }
                            reject(result);
                        }
                    });
                }
            });
    });
}



exports.isOwner = isOwner;
exports.isStaff = isStaff;
exports.isAdmin = isAdmin;