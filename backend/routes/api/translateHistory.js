const router = require('express').Router();
const translateHistoryController = require('../../controllers/translateHistoryController');

router.post("/", translateHistoryController.createTranslation)
router.get("/:uid", translateHistoryController.readTranslationsByUid)
router.put("/:id", translateHistoryController.updateTranslationById)
router.delete("/:id", translateHistoryController.deleteTranslationById)

module.exports = router;