const router = require('express').Router();

router.use('/test', require('./test'));
router.use('/register', require('./register'))
router.use('/feedback', require('./feedback'))
module.exports = router;
