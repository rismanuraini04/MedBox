const nodeCron = require("node-cron");
const { checkTime } = require("./tempratureChecker");

// Set job to working on every minutes 25 of each hour every day (10.25)
nodeCron.schedule("0 25 * * * *", () => {
  checkTime();
});

module.exports = nodeCron;
