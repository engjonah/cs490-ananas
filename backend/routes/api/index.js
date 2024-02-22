const router = require('express').Router();

router.use('/test', require('./test'));
router.use('/register', require('./register'))
module.exports = router;
