const router = require("express").Router();
const errorController = require("../../controllers/errorController");

router.post("/", errorController.insertError);

module.exports = router;
