const router = require('express').Router();
const { getTest } = require('../controllers/testController');

router.get('/', getTest);

module.exports = router;