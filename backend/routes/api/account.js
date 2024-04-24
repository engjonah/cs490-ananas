const router = require('express').Router();
const accountController = require('../../controllers/accountController');
const requireAuth = require('../../middleware/requireAuth');

router.use(requireAuth);
router.get('/:uid', accountController.getUser);
router.put('/:uid', accountController.updateName);
router.delete('/:uid', accountController.deleteUser);

module.exports = router;
