import axios from "axios";
import { transformDate } from "./dateutils";

const pingCowin = async ({ districtId, ageValue, date }) => {
  try {
    const transformedDate = transformDate(date);
    const { data } = await axios.get(
      `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtId}&date=${transformedDate}`
    );
    const { centers } = data;
    let isSlotAvailable = false;
    let updatedCenters = [];
    let appointmentsAvailableCount = 0;
    let nearestAppoinmentDate = null;
    if (centers.length) {
      updatedCenters = centers.filter((center) => {
        isSlotAvailable = false;
        center.sessions.forEach((session) => {
          if (
            session.min_age_limit < +ageValue &&
            session.available_capacity > 0
          ) {
            isSlotAvailable = true;
            appointmentsAvailableCount++;
            if(!nearestAppoinmentDate) {
              nearestAppoinmentDate = transformedDate;
            }
          }
        });
        return isSlotAvailable;
      });
    }

    return { centers: updatedCenters, appointmentsAvailableCount, nearestAppoinmentDate };
  } catch (error) {
    console.log("Error: " + error.message);
  }
};

export { pingCowin, transformDate };
