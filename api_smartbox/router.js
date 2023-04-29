const router = require("express").Router();
const controllers = require("./controllers");
const { body } = require("express-validator");

router.post("/generateid", controllers.generateId);
router.post("/reminder", controllers.setSensorBoxRemider);
router.get("/reminder/:id", controllers.getSensorBoxRemider);

module.exports = router;
