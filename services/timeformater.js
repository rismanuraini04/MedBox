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

module.exports = { days, times, timeOffset, timeAdjusment };
