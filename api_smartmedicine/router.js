const router = require("express").Router();
const controllers = require("./controllers");
const { body } = require("express-validator");

router.post("/link-to-device", controllers.linkToDevice);
router.get("/detail", controllers.detail);

module.exports = router;
