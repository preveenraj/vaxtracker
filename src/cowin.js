const axios = require('axios');

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
const pingCowin = async ({ districtId, ageValue }) => {
    try {
    const { data } = await axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtId}&date=${date}`);
        const { centers }= data;
        let isSlotAvailable = false;
        let updatedCenters = [];
        let appointmentsAvailableCount = 0;
        if(centers.length) {
            updatedCenters = centers.filter(center => {
                isSlotAvailable=false;
                center.sessions.forEach((session => {
                    if(session.min_age_limit < +ageValue && session.available_capacity > 0) {
                        isSlotAvailable = true;
                        appointmentsAvailableCount++;
                    }
                }))
                return isSlotAvailable;
            });
        }

        return { centers: updatedCenters, appointmentsAvailableCount };
    } catch (error) {
        console.log("Error: " + error.message);
    }
};

export { pingCowin };
