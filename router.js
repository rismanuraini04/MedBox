const router = require("express").Router();
const { MqttTopic } = require("./mqttserver");
const APP_ROUTER_V1 = require("./app/router");
const ROLE_V1 = require("./api_role/v1/router");
const USER_V1 = require("./api_user/v1/router");
const SMARTBOX_V1 = require("./api_smartbox/router");
const SMARTBRACELET_V1 = require("./api_smartbracelet/router");
const SMARTMEDICINE_V1 = require("./api_smartmedicine/router");
const { identifier } = require("./middlewares/identifier");
const mqttTopic = new MqttTopic();

router.use("/", APP_ROUTER_V1);
router.use("/api/v1/role", ROLE_V1);
router.use("/api/v1/user", USER_V1);
router.use("/api/v1/smartbox", SMARTBOX_V1.router);
router.use("/api/v1/smartbracelet", SMARTBRACELET_V1.router);
router.use("/api/v1/smartmedicine", SMARTMEDICINE_V1);
router.get("/worker.js", function (req, res) {
    res.sendFile(__dirname + "/public/js/util/worker.js");
});
mqttTopic.use("/bracelet", SMARTBRACELET_V1.mqttTopic);
mqttTopic.use("/smartbox", SMARTBOX_V1.mqttTopic);

module.exports = { router, mqttTopic };
