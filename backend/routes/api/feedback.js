const router = require('express').Router();
const feedbackController = require('../../controllers/feedbackController');
const requireAuth = require('../../middleware/requireAuth');

router.use(requireAuth);
router.post('/', feedbackController.insertFeedback);

module.exports = router;
