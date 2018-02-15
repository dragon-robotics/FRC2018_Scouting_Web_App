var express = require('express')

var router = express.Router()
var scoutingData = require('./api/scoutingData.route')


router.use('/scoutingData', scoutingData);


module.exports = router;