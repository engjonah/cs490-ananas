const router = require('express').Router();
const accountController = require('../../controllers/accountController');

router.get("/", accountController.getUser)

module.exports = router;