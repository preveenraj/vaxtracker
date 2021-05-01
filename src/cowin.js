import axios from "axios";
import { transformDate } from "./dateutils";

const pingCowin = async ({ districtId, ageValue, date }) => {
  try {
    const { data } = await axios.get(
      `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtId}&date=${transformDate(date)}`
    );
    const { centers } = data;
    let isSlotAvailable = false;
    let updatedCenters = [];
    let appointmentsAvailableCount = 0;
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
          }
        });
        return isSlotAvailable;
      });
    }

    return { centers: updatedCenters, appointmentsAvailableCount };
  } catch (error) {
    console.log("Error: " + error.message);
  }
};

export { pingCowin, transformDate };
