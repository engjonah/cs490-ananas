const router = require('express').Router();
const testController = require('../../controllers/testController');
const requireAuth = require('../../middleware/requireAuth');

router.use(requireAuth);
router.get('/', testController.getTest);

module.exports = router;
