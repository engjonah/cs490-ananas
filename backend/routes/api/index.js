const router = require('express').Router();

router.use('/test', require('./test'));
router.use('/register', require('./register'))
router.use('/feedback', require('./feedback'))
router.use('/login',require('./login'))

module.exports = router;
