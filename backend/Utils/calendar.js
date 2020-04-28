const Calendar = require(`../models/calendar`);
const { isAdmin, isStaff } = require('./community');

function canViewCalendar(calendarID, userID) {
    return new Promise((resolve, reject) => {
        Calendar.findById(calendarID, (err, calendar) => {
            if (calendar === null) {
                let result = { status: 404, message: `Unable to find calendar`, permission: false, }
                reject(result);
            }

            // Check visibility for 0
            if (calendar.visibility === 0) {
                let result = { permission: true };
                resolve(result);
            }
            // Check visibility for 1
            if (calendar.visibility === 1) {
                isStaff(calendar.communityID, userID)
                    .then((result) => {
                        resolve(result);
                    }).catch((result) => {
                        reject(result);
                    });
            }
            // Check visibility for 2
            if (calendar.visibility === 2) {
                isAdmin(calendar.communityID, userID)
                    .then((result) =>{
                        resolve(result);
                    }).catch((result) => {
                        reject(result);
                    });
            }
        });
    })
}

exports.canViewCalendar = canViewCalendar;