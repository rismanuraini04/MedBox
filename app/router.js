const router = require("express").Router();
const controller = require("./controlers");

router.get("/", controller.dashboard);
router.get("/link-device", controller.linkDevice);
router.get("/login", controller.login);
router.get("/register", controller.register);
router.get("/options/:id", controller.pageOptions);
router.get("/schedule", controller.scheduleReminder);
router.get("/profile", controller.profile);
router.get("/history", controller.history);

module.exports = router;
