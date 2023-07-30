const moment = require("moment");
require("moment-timezone");

const days = (date) => {
    return new Intl.DateTimeFormat("id", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    }).format(new Date(date));
};

const times = (date) => {
    return new Intl.DateTimeFormat("id", {
        hour: "numeric",
        minute: "numeric",
    }).format(new Date(date));
};

const timeOffset = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

const timeAdjusment = (inputTime, inputTimeZone) => {
    const SERVER_TIME_OFFSET = timeOffset();
    let incomingDateTime = moment.tz(
        inputTime,
        "YYYY-MM-DD HH:mm",
        inputTimeZone
    );
    const gmtDate = incomingDateTime.clone().tz(SERVER_TIME_OFFSET);
    const formattedDate = gmtDate.format("YYYY-MM-DD HH:mm:ss");
    return formattedDate;
};

const timeSubstractor = (inputHoursMinutesinArray = [], inputTimeZone) => {
    const SERVER_TIME_OFFSET = timeOffset();
    const substractTime = inputHoursMinutesinArray.map((inputTime) => {
        const clientMoment = moment.tz(inputTime, "HH:mm", inputTimeZone);
        const serverMoment = clientMoment.clone().tz(SERVER_TIME_OFFSET);
        return serverMoment.format("HH:mm");
    });
    return substractTime;
};

module.exports = { days, times, timeOffset, timeAdjusment, timeSubstractor };
