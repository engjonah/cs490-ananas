const router = require('express').Router();
const accountController = require('../../controllers/accountController');

router.get("/:uid", accountController.getUser);
router.put("/:uid", accountController.updateName);

module.exports = router;