const router = require("express").Router();
const controllers = require("./controllers");
const { body } = require("express-validator");

router.post("/generateid", controllers.generateId);

module.exports = router;
