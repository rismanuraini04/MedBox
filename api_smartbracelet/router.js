const router = require("express").Router();
const { MqttTopic } = require("../mqttserver");
const mqttTopic = new MqttTopic();
const controllers = require("./controllers");
const { body } = require("express-validator");

router.post("/generateid", controllers.generateId);
mqttTopic.listener("/update/temp/+", controllers.updateTemprature);

module.exports = { router, mqttTopic };
