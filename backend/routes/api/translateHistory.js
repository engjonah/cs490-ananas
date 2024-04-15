const router = require('express').Router();
const translateHistoryController = require('../../controllers/translateHistoryController');
const requireAuth = require("../../middleware/requireAuth")

router.use(requireAuth)
router.post("/", translateHistoryController.createTranslation)
router.delete("/clearHistory/:uid", translateHistoryController.clearTranslationHistoryByUid)
router.get("/:uid", translateHistoryController.readTranslationsByUid)
router.put("/:id", translateHistoryController.updateTranslationById)
router.delete("/:id", translateHistoryController.deleteTranslationById)

module.exports = router;