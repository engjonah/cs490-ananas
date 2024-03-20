const router = require("express").Router();

router.use("/test", require("./test"));
router.use("/register", require("./register"));
router.use("/feedback", require("./feedback"));
router.use("/login", require("./login"));
router.use("/translate", require("./translate"));
router.use("/error", require("./error"));

module.exports = router;
