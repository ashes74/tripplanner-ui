var router = require('express').Router();
var days = require('./days');
var attractions = require('./attractions');

router.use('/days',days);
router.use('/attractions',attractions);

module.exports = router;