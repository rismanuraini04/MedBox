const router = require("express").Router();
const controllers = require("./controllers");
const { body } = require("express-validator");
const { MqttTopic } = require("../mqttserver");
const mqttTopic = new MqttTopic();
router.post("/generateid", controllers.generateId);
router.post("/reminder", controllers.setSensorBoxRemider);
router.patch("/reminder", controllers.updateSensorBoxRemider);
router.get("/reminder/:id", controllers.getSensorBoxRemider);
router.delete("/reminder/:id", controllers.deleteSensorBoxRemider);

mqttTopic.listener("/update/weight/+", controllers.updateMedicineWeight);

module.exports = { router, mqttTopic };
