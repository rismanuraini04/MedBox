const router = require("express").Router();
const controller = require("./controlers");
const { checkId } = require("../middlewares/customMiddleware");
const {
    loginRequired,
    logoutRequired,
} = require("../middlewares/UiMiddleware");
const {
    isUserHaveDevice,
    isUserNOTHaveDevice,
} = require("../middlewares/smartMedicineMiddleware");

router.get("/", loginRequired, isUserHaveDevice, controller.dashboard);
router.get(
    "/link-device",
    isUserNOTHaveDevice,
    loginRequired,
    controller.linkDevice
);
router.get("/login", logoutRequired, controller.login);
router.get("/logout", loginRequired, controller.logout);
router.get("/register", logoutRequired, controller.register);
router.get("/options/:id", loginRequired, checkId, controller.pageOptions);
router.get(
    "/options/schedule/:id",
    loginRequired,
    checkId,
    controller.scheduleReminder
);
router.get("/profile", loginRequired, controller.profile);
router.get("/history/:id", loginRequired, checkId, controller.history);

module.exports = router;
