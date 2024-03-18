const router = require('express').Router();
const translateController = require('../../controllers/translateController');

router.post("/", translateController.getTranslation)

module.exports = router;