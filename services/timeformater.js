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

module.exports = { days, times, timeOffset };
