const router = require("express").Router();
const controllers = require("./controllers");
const { body } = require("express-validator");

router.post("/generateid", controllers.generateId);
router.post("/reminder", controllers.setSensorBoxRemider);
router.patch("/reminder", controllers.updateSensorBoxRemider);
router.get("/reminder/:id", controllers.getSensorBoxRemider);
router.delete("/reminder/:id", controllers.deleteSensorBoxRemider);

module.exports = router;
