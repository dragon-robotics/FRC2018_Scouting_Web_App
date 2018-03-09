var express = require('express')

var router = express.Router()

// Getting the Todo Controller that we just created

var ScoutingDataController = require('../../controllers/scoutingData.controller');


// Map each API to the Controller FUnctions

router.get('/readyChartPerMatch/:event/:team', ScoutingDataController.getReadyStatusPerMatch)
router.get('/robotPlacementChartPerMatch/:event/:team', ScoutingDataController.getRobotPlacementPerMatch)
router.get('/fieldConfigurationChartPerMatch/:event/:team', ScoutingDataController.getFieldConfigurationPerMatch)
router.get('/autoLineChartPerMatch/:event/:team', ScoutingDataController.getAutoLinePerMatch)
router.get('/autoSwitchScaleExchangeZoneChartPerMatch/:event/:team', ScoutingDataController.getAutoSwitchScaleExchangeZoneChartPerMatch)
router.get('/climbPointsChartPerMatch/:event/:team', ScoutingDataController.getClimbPointsChartPerMatch)
router.get('/:event/:match/:team', ScoutingDataController.getScoutingData)
router.get('/:event/:eventID', ScoutingDataController.getYPRData)

router.post('/', ScoutingDataController.createScoutingData)

router.put('/', ScoutingDataController.updateScoutingData)

// router.delete('/:id',ScoutingDataController.removeScoutingData)


// Export the Router

module.exports = router;