const Calendar = require(`../models/calendar`);
import {isAdmin, isStaff} from './community';

export async function canViewCalendar(calendarID, userID) {
    Calendar.findById(calendarID, (err, calendar) => {
        if(calendar === null) {
			let result = {status: 404, message: `Unable to find calendar`, permission: false, }
			return result;
        }

        // Check visibility for 0
        if(calendar.visibility === 0)
        {
            let result = {permission: true},
            return result;
        }
        // Check visibility for 1
        if(calendar.visibility === 1)
        {
           let result = isStaff(calendar.communityID, userID);
           return result;
        }
        // Check visibility for 2
        if(calendar.visibility === 2)
        {
            let result = isAdmin(calendar.communityID, userID);
            return result;
        }
    });
}