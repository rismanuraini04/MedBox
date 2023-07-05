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
const { identifier } = require("../middlewares/identifier");

// router.use(identifier);
router.get(
  "/",
  identifier,
  loginRequired,
  isUserHaveDevice,
  controller.dashboard
);
router.get(
  "/link-device",
  identifier,
  isUserNOTHaveDevice,
  loginRequired,
  controller.linkDevice
);
router.get("/login", identifier, logoutRequired, controller.login);

router.get("/logout", identifier, loginRequired, controller.logout);
router.get("/register", identifier, logoutRequired, controller.register);
router.get(
  "/options/:id",
  identifier,
  loginRequired,
  checkId,
  controller.pageOptions
);
router.get(
  "/options/schedule/:id",
  identifier,
  loginRequired,
  checkId,
  controller.scheduleReminder
);
router.get("/profile", identifier, loginRequired, controller.profile);
router.get(
  "/history/:id",
  identifier,
  loginRequired, //ini ada middlewarenya, apakah sdh terpenuhi
  checkId,
  controller.history
);

module.exports = router;
