const router = require("express").Router();
const controller = require("./controlers");

router.get("/", controller.linkDevice);
router.get("/login", controller.login);

module.exports = router;
