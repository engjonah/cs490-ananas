const router = require('express').Router();
const feedbackController = require('../../controllers/feedbackController');
const requireAuth = require("../../middleware/requireAuth")

router.get("/metrics", feedbackController.getFeedbackCountByRating)
router.get("/", feedbackController.getFeedback)


module.exports = router;