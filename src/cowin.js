const axios = require('axios');
const yourAge = '51'  // Replace value here
const appointmentsListLimit = 2 // Increase/Decrease it based on the amount of information you want in the notification.

const getDate = () => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const dd = tomorrow.getDate();
    const mm = tomorrow.getMonth() + 1;
    const yyyy = tomorrow.getFullYear();
    return `${dd < 10 ? '0' + dd : dd}-${mm < 10 ? '0' + mm : mm}-${yyyy}`
};
const date = getDate();
const pingCowin = async ({ districtId }) => {
    try {
    const { data } = await axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtId}&date=${date}`);
        const { centers }= data;
        let isSlotAvailable = false;
        let dataOfSlot = "";
        let updatedCenters = [];
        let appointmentsAvailableCount = 0;
        let sentences = [];
        if(centers.length) {
            updatedCenters = centers.filter(center => {
                isSlotAvailable=false;
                center.sessions.forEach((session => {
                    if(session.min_age_limit < +yourAge && session.available_capacity > 0) {
                        isSlotAvailable = true
                        appointmentsAvailableCount++;
                        if(appointmentsAvailableCount <= appointmentsListLimit) {
                            dataOfSlot = `${dataOfSlot}\nSlot for ${session.available_capacity} is available: ${center.name} on ${session.date}`;
                        sentences.push(sentences);
                        }
                    }
                }))
                return isSlotAvailable;
            });

            dataOfSlot = `${dataOfSlot}\n${appointmentsAvailableCount - appointmentsListLimit} more slots available...`
        }
        console.log("🚀 ~ file: cowin.js ~ line 46 ~ pingCowin ~ sentences", sentences)

        return { centers: updatedCenters, isSlotAvailable, dataOfSlot, sentences };
    } catch (error) {
        console.log("Error: " + error.message);
    }
};

export { pingCowin };
