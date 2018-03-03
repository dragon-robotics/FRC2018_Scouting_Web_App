var express = require('express')

var router = express.Router()

// Getting the Todo Controller that we just created

var ScoutingDataController = require('../../controllers/scoutingData.controller');


// Map each API to the Controller FUnctions

router.get('/:search', ScoutingDataController.getScoutingData)

router.post('/', ScoutingDataController.createScoutingData)

router.put('/', ScoutingDataController.updateScoutingData)

// router.delete('/:id',ScoutingDataController.removeScoutingData)


// Export the Router

module.exports = router;