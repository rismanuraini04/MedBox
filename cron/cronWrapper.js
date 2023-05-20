const nodeCron = require("node-cron");
const { checkTime } = require("./tempratureChecker");

// Set job to working on every minutes 57 of each hour every day
nodeCron.schedule("0 57 * * * *", () => {
    checkTime();
});

module.exports = nodeCron;
