const router = require('express').Router();
const translateHistoryController = require('../../controllers/translateHistoryController');

router.post("/", translateHistoryController.createTranslation)
router.get("/", translateHistoryController.readTranslationsByUid)
router.put("/", translateHistoryController.updateTranslationById)
router.delete("/", translateHistoryController.deleteTranslationById)

module.exports = router;