var express = require('express')

var router = express.Router()

// Getting the Todo Controller that we just created

var ScoutingDataController = require('../../controllers/scoutingData.controller');


// Map each API to the Controller FUnctions

/* Raw Team Event Data */
router.get('/teamEventRawData/:event/:team', ScoutingDataController.getTeamEventRawData)

/* Per Match Chart Data API Calls */
router.get('/readyChartPerMatch/:event/:team', ScoutingDataController.getReadyStatusPerMatch)
router.get('/robotPlacementChartPerMatch/:event/:team', ScoutingDataController.getRobotPlacementPerMatch)
router.get('/fieldConfigurationChartPerMatch/:event/:team', ScoutingDataController.getFieldConfigurationPerMatch)
router.get('/autoLineChartPerMatch/:event/:team', ScoutingDataController.getAutoLinePerMatch)
router.get('/autoSwitchScaleExchangeZoneChartPerMatch/:event/:team', ScoutingDataController.getAutoSwitchScaleExchangeZoneChartPerMatch)
router.get('/climbPointsChartPerMatch/:event/:team', ScoutingDataController.getClimbPointsChartPerMatch)
router.get('/pickUpTypeChartPerMatch/:event/:team', ScoutingDataController.getPickUpTypeChartPerMatch)
router.get('/efficiencyChartPerMatch/:event/:team', ScoutingDataController.getEfficiencyChartPerMatch)
router.get('/cycleTimeChartPerMatch/:event/:team', ScoutingDataController.getCycleTimeChartPerMatch)
router.get('/cubesScoredChartPerMatch/:event/:team', ScoutingDataController.getCubesScoredChartPerMatch)

/* Overall Chart Data API Calls */
router.get('/readyChartOverall/:event/:team', ScoutingDataController.getRobotReadyStatusOverall)
router.get('/robotPlacementChartOverall/:event/:team', ScoutingDataController.getRobotPlacementOverall)
router.get('/fieldConfigurationChartOverall/:event/:team', ScoutingDataController.getFieldConfigurationOverall)
router.get('/autoLineChartOverall/:event/:team', ScoutingDataController.getAutoLineOverall)
router.get('/autoSwitchScaleExchangeZoneChartOverall/:event/:team', ScoutingDataController.getAutoSwitchScaleExchangeZoneChartOverall)
router.get('/climbTypeChartOverall/:event/:team', ScoutingDataController.getClimbTypeChartOverall)
router.get('/pickUpTypeChartOverall/:event/:team', ScoutingDataController.getPickUpTypeChartOverall)
router.get('/sourceDestinationChartOverall/:event/:team', ScoutingDataController.getSourceDestinationChartOverall)

router.get('/:event/:match/:team', ScoutingDataController.getScoutingData)
router.get('/:event/:eventID', ScoutingDataController.getYPRData)

router.post('/', ScoutingDataController.createScoutingData)
router.put('/', ScoutingDataController.updateScoutingData)

// router.delete('/:id',ScoutingDataController.removeScoutingData)

// Export the Router

module.exports = router;