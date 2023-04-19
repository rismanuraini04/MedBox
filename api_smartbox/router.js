const router = require("express").Router();
const controllers = require("./controllers");
const { body } = require("express-validator");

router.post("/generateid", controllers.generateId);
router.post("/reminder", controllers.setSensorBoxRemider);

module.exports = router;
