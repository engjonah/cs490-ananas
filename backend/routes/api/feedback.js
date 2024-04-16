const router = require('express').Router();
const feedbackController = require('../../controllers/feedbackController');
const requireAuth = require("../../middleware/requireAuth")

//router.use(requireAuth)
router.post("/", feedbackController.insertFeedback)
router.get("/", feedbackController.getFeedback)
router.get("/metrics", feedbackController.getFeedbackCountByRating)




module.exports = router;