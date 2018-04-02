// Accessing the Service that we just created

var ScoutingDataService = require('../services/scoutingData.service')
var _ = require('lodash')

// Saving the context of this module inside the _the variable

_this = this


exports.getYPRData = async function (req, res, next){
    
    try{
        var event = req.params.event;
        var yprData = await ScoutingDataService.getYPRData(event);
        
        // Return the scoutingData list with the appropriate HTTP Status Code and Message.
        
        return res.status(200).json({status: 200, data: yprData, message: "Succesfully Received YPR Data"});
        
    }catch(e){
        
        //Return an Error Response Message with Code and the Error Message.
        
        return res.status(400).json({status: 400, message: e.message});
        
    }
}

// Async Controller function to get the To do List

exports.getScoutingData = async function(req, res, next){

    // Check the existence of the query parameters, If the exists doesn't exists assign a default value
    try{
        var event = req.params.event;
        var match = req.params.match;
        var team = +req.params.team;

        var query = [{ 
            "$match": {
                "match" : match,
                "team" : team,
                "event" : event,
            },
        },{ 
            "$project": {
                "_id" : 1,
                "event" : 1,
                "match" : 1,
                "team" : 1,
                "matchData.readyCode" : 1,
                "matchData.robotPlacement" : 1,
                "matchData.fieldConfig" : 1,
                "matchData.autoLine" : 1,
                "matchData.autoSwitchCubeCount" : 1,
                "matchData.autoScaleCubeCount" : 1,
                "matchData.autoExchangeCubeCount" : 1,
                "matchData.cyclePaths" : 1,
                "matchData.climbingType" : 1,
                "comments" : 1,
            }
        }];

        var scoutingData = await ScoutingDataService.getScoutingData(query)
        
        // Return the scoutingData list with the appropriate HTTP Status Code and Message.
        
        return res.status(200).json({status: 200, data: scoutingData, message: "Succesfully Received Scouting Data"});
        
    }catch(e){
        
        //Return an Error Response Message with Code and the Error Message.
        
        return res.status(400).json({status: 400, message: e.message});
        
    }
}

exports.createScoutingData = async function(req, res, next){

    // Req.Body contains the form submit values.

    var scoutingData = {
        team: req.body.team,
        event: req.body.event,
        match: req.body.match,
        matchData: req.body.matchData,
        comments: req.body.comments,
    }

    try{
        
        // Calling the Service function with the new object from the Request Body
    
        var createdScoutingData = await ScoutingDataService.createScoutingData(scoutingData)
        return res.status(201).json({status: 201, data: createdScoutingData, message: "Succesfully Created Scouting Data"})
    }catch(e){
        
        //Return an Error Response Message with Code and the Error Message.
        
        return res.status(400).json({status: 400, message: "Scouting Data Creation was Unsuccesful"})
    }
}

exports.updateScoutingData = async function(req, res, next){

    // Id is necessary for the update

    if(!req.body._id){
        return res.status(400).json({status: 400., message: "Id must be present"})
    }

    var id = req.body._id;

    var scoutingData = {
        id,
        team: req.body.team ? req.body.team : null,
        event: req.body.event ? req.body.event : null,
        eventID: req.body.eventID ? req.body.eventID : null,
        match: req.body.match ? req.body.match : null,
        matchData: req.body.matchData ? req.body.matchData : null,
        comments: req.body.comments ? req.body.comments : null,
    }

    try{
        var updatedScoutingData = await ScoutingDataService.updateScoutingData(scoutingData)
        return res.status(200).json({status: 200, data: updatedScoutingData, message: "Succesfully Updated Scouting Data"})
    }catch(e){
        return res.status(400).json({status: 400., message: e.message})
    }
}

exports.getTeamEventRawData = async function(req, res, next){
    try{
        var event = req.params.event;
        var team = +req.params.team;

        var query = [
            {
                "$match": {
                    "event": event,
                    "team": team,
                }
            },
            {
                "$project": {
                    "_id": 0,
                    event: 1,
                    team: 1,
                    match: 1,
                    readyCode: "$matchData.readyCode",
                    robotPlacement: "$matchData.robotPlacement",
                    fieldConfig: "$matchData.fieldConfig",
                    autoLine: "$matchData.autoLine",
                    autoSwitchCubeCount: "$matchData.autoSwitchCubeCount",
                    autoScaleCubeCount: "$matchData.autoScaleCubeCount",
                    autoExchangeCubeCount: "$matchData.autoExchangeCubeCount",
                    cubesScored: "$matchData.cubesScored",
                    cycleTime: "$matchData.cycleTime",
                    efficiency: "$matchData.efficiency",
                    pickUpWide: "$matchData.pickUpWide",
                    pickUpDiag: "$matchData.pickUpDiag",
                    pickUpTall: "$matchData.pickUpTall",
                    pickUpDropOff: "$matchData.pickUpDropOff",
                    climbingType: "$matchData.climbingType",
                }
            }
        ];

        var rawTeamEventData = await ScoutingDataService.getTeamEventRawData(query)
        // Return the scoutingData list with the appropriate HTTP Status Code and Message.
        
        return res.status(200).json({status: 200, data: rawTeamEventData, message: "Succesfully Received Team Event Raw Data"});
    }catch(e){
        
        //Return an Error Response Message with Code and the Error Message.
        
        return res.status(400).json({status: 400, message: e.message});
    }
}

/* Per Match Chart Controller */

exports.getReadyStatusPerMatch = async function(req, res, next){

    // Check the existence of the query parameters, If the exists doesn't exists assign a default value


    try{
        var event = req.params.event;
        var team = +req.params.team;

        var query = [{ 
            "$match": {
                "event" : event,
                "team" : team,
            },
        },{ 
            "$project": {
                "_id" : 0,
                // "name": "$match",
                "name" : "$match",
                "y": "$matchData.readyCode",
            }
        }];

        var readyStatusData = await ScoutingDataService.getReadyStatusPerMatch(query)
        // Return the scoutingData list with the appropriate HTTP Status Code and Message.
        
        return res.status(200).json({status: 200, data: readyStatusData, message: "Succesfully Received Ready Status Per Match Data"});
        
    }catch(e){
        
        //Return an Error Response Message with Code and the Error Message.
        
        return res.status(400).json({status: 400, message: e.message});
    }
}

exports.getRobotPlacementPerMatch = async function(req, res, next){

    // Check the existence of the query parameters, If the exists doesn't exists assign a default value


    try{
        var event = req.params.event;
        var team = +req.params.team;

        var query = [{ 
            "$match": {
                "event" : event,
                "team" : team,
            },
        },{ 
            "$project": {
                "_id" : 0,
                // "name": "$match",
                "name" : "$match",
                "y": "$matchData.robotPlacement",
            }
        }];

        var robotPlacementData = await ScoutingDataService.getRobotPlacementPerMatch(query)
        // Return the scoutingData list with the appropriate HTTP Status Code and Message.
        
        return res.status(200).json({status: 200, data: robotPlacementData, message: "Succesfully Received Robot Placement Per Match Data"});
        
    }catch(e){
        
        //Return an Error Response Message with Code and the Error Message.
        
        return res.status(400).json({status: 400, message: e.message});
        
    }
}

exports.getFieldConfigurationPerMatch = async function(req, res, next){

    // Check the existence of the query parameters, If the exists doesn't exists assign a default value


    try{
        var event = req.params.event;
        var team = +req.params.team;

        var query = [{ 
            "$match": {
                "event" : event,
                "team" : team,
            },
        },{ 
            "$project": {
                "_id" : 0,
                // "name": "$match",
                "name" : "$match",
                "y": "$matchData.fieldConfig",
            }
        }];

        var fieldConfigurationData = await ScoutingDataService.getFieldConfigurationPerMatch(query)
        // Return the scoutingData list with the appropriate HTTP Status Code and Message.
        
        return res.status(200).json({status: 200, data: fieldConfigurationData, message: "Succesfully Received Field Configuration Per Match Data"});
        
    }catch(e){
        
        //Return an Error Response Message with Code and the Error Message.
        
        return res.status(400).json({status: 400, message: e.message});
        
    }
}

exports.getAutoLinePerMatch = async function(req, res, next){

    // Check the existence of the query parameters, If the exists doesn't exists assign a default value


    try{
        var event = req.params.event;
        var team = +req.params.team;

        var query = [{ 
            "$match": {
                "event" : event,
                "team" : team,
            },
        },{ 
            "$project": {
                "_id" : 0,
                // "name": "$match",
                "name" : "$match",
                "y": "$matchData.autoLine",
            }
        }];

        var autoLineData = await ScoutingDataService.getAutoLinePerMatch(query)
        // Return the scoutingData list with the appropriate HTTP Status Code and Message.
        
        return res.status(200).json({status: 200, data: autoLineData, message: "Succesfully Received Auto Cross Per Match Data"});
        
    }catch(e){
        
        //Return an Error Response Message with Code and the Error Message.
        
        return res.status(400).json({status: 400, message: e.message});
        
    }
}

exports.getAutoSwitchScaleExchangeZoneChartPerMatch = async function(req, res, next){

    // Check the existence of the query parameters, If the exists doesn't exists assign a default value


    try{
        var event = req.params.event;
        var team = +req.params.team;

        var query = [{ 
            "$match": {
                "event" : event,
                "team" : team,
            },
        },{ 
            "$project": {
                "_id" : 0,
                "match" : "$match",
                "autoSwitchCubeCount": "$matchData.autoSwitchCubeCount",
                "autoScaleCubeCount": "$matchData.autoScaleCubeCount",
                "autoExchangeCubeCount": "$matchData.autoExchangeCubeCount",
            }
        }];

        var autoSwitchScaleExchangeZoneData = await ScoutingDataService.getAutoSwitchScaleExchangeZoneChartPerMatch(query)
        // Return the scoutingData list with the appropriate HTTP Status Code and Message.
        
        return res.status(200).json({status: 200, data: autoSwitchScaleExchangeZoneData, message: "Succesfully Received Auto Switch/Scale/Exchange Zone Cube Count Per Match Data"});
        
    }catch(e){
        
        //Return an Error Response Message with Code and the Error Message.
        
        return res.status(400).json({status: 400, message: e.message});
        
    }
}

exports.getClimbPointsChartPerMatch = async function(req, res, next){

    // Check the existence of the query parameters, If the exists doesn't exists assign a default value
    try{
        var event = req.params.event;
        var team = +req.params.team;

        var query = [{ 
            "$match": {
                "event" : event,
                "team" : team,
            },
        },{ 
            "$project": {
                "_id" : 0,
                "name" : "$match",
                "y": "$matchData.climbing",
            }
        }];

        var climbPointsData = await ScoutingDataService.getClimbPointsChartPerMatch(query)
        // Return the scoutingData list with the appropriate HTTP Status Code and Message.
        
        return res.status(200).json({status: 200, data: climbPointsData, message: "Succesfully Received Climb Point Per Match Data"});
        
    }catch(e){
        
        //Return an Error Response Message with Code and the Error Message.
        
        return res.status(400).json({status: 400, message: e.message});
        
    }
}

exports.getPickUpTypeChartPerMatch = async function(req, res, next){
    try{
        var event = req.params.event;
        var team = +req.params.team;

        var query = [{ 
            "$match": {
                "event" : event,
                "team" : team,
            },
        },{ 
            "$project": {
                "_id" : 0,
                match: 1,
                wide : "$matchData.pickUpWide",
                diag : "$matchData.pickUpDiag",
                tall : "$matchData.pickUpTall",
                dropoff : "$matchData.pickUpDropOff",
            }
        }];

        var pickUpTypeData = await ScoutingDataService.getPickUpTypeChartPerMatch(query)
        // Return the scoutingData list with the appropriate HTTP Status Code and Message.
        
        return res.status(200).json({status: 200, data: pickUpTypeData, message: "Succesfully Received Pickup Type Per Match Data"});
        
    }catch(e){
        
        //Return an Error Response Message with Code and the Error Message.
        
        return res.status(400).json({status: 400, message: e.message});
        
    }
}

exports.getEfficiencyChartPerMatch = async function(req, res, next){
    // Check the existence of the query parameters, If the exists doesn't exists assign a default value
    try{
        var event = req.params.event;
        var team = +req.params.team;

        var query = [{ 
            "$match": {
                "event" : event,
                "team" : team,
            },
        },{ 
            "$project": {
                "_id" : 0,
                "name" : "$match",
                "y": "$matchData.efficiency",
            }
        }];

        var efficiencyData = await ScoutingDataService.getEfficiencyChartPerMatch(query)
        // Return the scoutingData list with the appropriate HTTP Status Code and Message.
        
        return res.status(200).json({status: 200, data: efficiencyData, message: "Succesfully Received Efficiency Per Match Data"});
        
    }catch(e){
        
        //Return an Error Response Message with Code and the Error Message.
        
        return res.status(400).json({status: 400, message: e.message});
        
    }
}

exports.getCycleTimeChartPerMatch = async function(req, res, next){
    // Check the existence of the query parameters, If the exists doesn't exists assign a default value
    try{
        var event = req.params.event;
        var team = +req.params.team;

        var query = [{ 
            "$match": {
                "event" : event,
                "team" : team,
            },
        },{ 
            "$project": {
                "_id" : 0,
                "name" : "$match",
                "y": "$matchData.cycleTime",
            }
        }];

        var cycleTimeData = await ScoutingDataService.getEfficiencyChartPerMatch(query)
        // Return the scoutingData list with the appropriate HTTP Status Code and Message.
        
        return res.status(200).json({status: 200, data: cycleTimeData, message: "Succesfully Received Cycle Time Per Match Data"});
        
    }catch(e){
        
        //Return an Error Response Message with Code and the Error Message.
        
        return res.status(400).json({status: 400, message: e.message});
        
    }
}

exports.getCubesScoredChartPerMatch = async function(req, res, next){
    // Check the existence of the query parameters, If the exists doesn't exists assign a default value
    try{
        var event = req.params.event;
        var team = +req.params.team;

        var query = [{ 
            "$match": {
                "event" : event,
                "team" : team,
            },
        },{ 
            "$project": {
                "_id" : 0,
                "name" : "$match",
                "y": "$matchData.cubesScored",
            }
        }];

        var cubesScoredData = await ScoutingDataService.getEfficiencyChartPerMatch(query)
        // Return the scoutingData list with the appropriate HTTP Status Code and Message.
        
        return res.status(200).json({status: 200, data: cubesScoredData, message: "Succesfully Received Cubes Scored Per Match Data"});
        
    }catch(e){
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message});
    }
}

/* Overall Chart Controller */

exports.getRobotReadyStatusOverall = async function(req, res, next){
    // Check the existence of the query parameters, If the exists doesn't exists assign a default value
    try{
        var event = req.params.event;
        var team = +req.params.team;

        var query = [
                        {
                            "$match": {
                                event: event,
                                team: team       
                            }
                        },
                        {
                            "$project": {
                                _id: 0,
                                event: 1,
                                team: 1,
                                readyCode: "$matchData.readyCode" 
                            }       
                        },
                        {
                            "$group":
                            {
                                _id: { event: "$event", team: "$team"},
                                event: {"$first": "$event"},
                                team: {"$first": "$team"},
                                readyCodeList: {"$push": "$readyCode"},
                            }
                        },
                            {
                            "$project": {
                                _id: 0,
                            }
                        },
                    ];

        var robotReadyStatusOverallData = await ScoutingDataService.getRobotReadyStatusOverall(query)
        // Return the scoutingData list with the appropriate HTTP Status Code and Message.
        
        return res.status(200).json({status: 200, data: robotReadyStatusOverallData, message: "Succesfully Received Robot Ready Overall Data"});
        
    }catch(e){
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message});
    }
}

exports.getRobotPlacementOverall = async function(req, res, next){
    // Check the existence of the query parameters, If the exists doesn't exists assign a default value
    try{
        var event = req.params.event;
        var team = +req.params.team;

        var query = [
                        {
                            "$match": {
                                event: event,
                                team: team       
                            }
                        },
                        {
                            "$project": {
                                _id: 0,
                                event: 1,
                                team: 1,
                                robotPlacement: "$matchData.robotPlacement" 
                            }       
                        },
                        {
                            "$group":
                            {
                                _id: { event: "$event", team: "$team"},
                                event: {"$first": "$event"},
                                team: {"$first": "$team"},
                                robotPlacementList: {"$push": "$robotPlacement"},
                            }
                        },
                            {
                            "$project": {
                                _id: 0,
                            }
                        },
                    ];

        var robotPlacementOverallData = await ScoutingDataService.getRobotPlacementOverall(query)
        // Return the scoutingData list with the appropriate HTTP Status Code and Message.
        
        return res.status(200).json({status: 200, data: robotPlacementOverallData, message: "Succesfully Received Robot Placement Overall Data"});
        
    }catch(e){
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message});
    }
}

exports.getFieldConfigurationOverall = async function(req, res, next){
    // Check the existence of the query parameters, If the exists doesn't exists assign a default value
    try{
        var event = req.params.event;
        var team = +req.params.team;

        var query = [
                        {
                            "$match": {
                                event: event,
                                team: team       
                            }
                        },
                        {
                            "$project": {
                                _id: 0,
                                event: 1,
                                team: 1,
                                fieldConfig: "$matchData.fieldConfig" 
                            }       
                        },
                        {
                            "$group":
                            {
                                _id: { event: "$event", team: "$team"},
                                event: {"$first": "$event"},
                                team: {"$first": "$team"},
                                fieldConfigurationList: {"$push": "$fieldConfig"},
                            }
                        },
                            {
                            "$project": {
                                _id: 0,
                            }
                        },
                    ];

        var fieldConfigurationOverallData = await ScoutingDataService.getFieldConfigurationOverall(query)
        // Return the scoutingData list with the appropriate HTTP Status Code and Message.
        
        return res.status(200).json({status: 200, data: fieldConfigurationOverallData, message: "Succesfully Received Robot Placement Overall Data"});
        
    }catch(e){
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message});
    }
}

exports.getAutoLineOverall = async function(req, res, next){
    // Check the existence of the query parameters, If the exists doesn't exists assign a default value
    try{
        var event = req.params.event;
        var team = +req.params.team;

        var query = [
                        {
                            "$match": {
                                event: event,
                                team: team       
                            }
                        },
                        {
                            "$project": {
                                _id: 0,
                                event: 1,
                                team: 1,
                                autoLine: "$matchData.autoLine" 
                            }       
                        },
                        {
                            "$group":
                            {
                                _id: { event: "$event", team: "$team"},
                                event: {"$first": "$event"},
                                team: {"$first": "$team"},
                                autoLineList: {"$push": "$autoLine"},
                            }
                        },
                            {
                            "$project": {
                                _id: 0,
                            }
                        },
                    ];

        var autoLineOverallData = await ScoutingDataService.getAutoLineOverall(query)
        // Return the scoutingData list with the appropriate HTTP Status Code and Message.
        
        return res.status(200).json({status: 200, data: autoLineOverallData, message: "Succesfully Received Auto Line Overall Data"});
        
    }catch(e){
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message});
    }
}

exports.getAutoSwitchScaleExchangeZoneChartOverall = async function(req, res, next){
    // Check the existence of the query parameters, If the exists doesn't exists assign a default value
    try{
        var event = req.params.event;
        var team = +req.params.team;

        var query = [
                        {
                            "$match": {
                                event: event,
                                team: team       
                            }
                        },
                        {
                            "$project": {
                                _id: 0,
                                event: 1,
                                team: 1,
                                autoSwitchCubeCount: "$matchData.autoSwitchCubeCount",
                                autoScaleCubeCount: "$matchData.autoScaleCubeCount",
                                autoExchangeCubeCount: "$matchData.autoExchangeCubeCount",
                            }       
                        },
                        {
                            "$group":
                            {
                                _id: { event: "$event", team: "$team"},
                                event: {"$first": "$event"},
                                team: {"$first": "$team"},
                                autoSwitchCubeCountTotal: {"$sum": "$autoSwitchCubeCount"},
                                autoScaleCubeCountTotal: {"$sum": "$autoScaleCubeCount"},
                                autoExchangeCubeCountTotal: {"$sum": "$autoExchangeCubeCount"},
                            }
                        },
                            {
                            "$project": {
                                _id: 0,
                            }
                        },
                    ];

        var autoSwitchScaleExchangeZoneOverallData = await ScoutingDataService.getAutoSwitchScaleExchangeZoneChartOverall(query)
        // Return the scoutingData list with the appropriate HTTP Status Code and Message.
        
        return res.status(200).json({status: 200, data: autoSwitchScaleExchangeZoneOverallData, message: "Succesfully Received Auto Switch/Scale/Exchange Zone Overall Data"});
        
    }catch(e){
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message});
    }
}

exports.getClimbTypeChartOverall = async function(req, res, next){
    // Check the existence of the query parameters, If the exists doesn't exists assign a default value
    try{
        var event = req.params.event;
        var team = +req.params.team;

        var query = [
                        {
                            "$match": {
                                event: "AZ North",
                                team: 254       
                            }
                        },
                        {
                            "$project": {
                                _id: 0,
                                event: 1,
                                team: 1,
                                climbing: "$matchData.climbing",
                            }       
                        },
                        {
                            "$group":
                            {
                                _id: { event: "$event", team: "$team"},
                                event: {"$first": "$event"},
                                team: {"$first": "$team"},
                                climbTypeList: {"$push": "$climbing"},
                            }
                        },
                            {
                            "$project": {
                                _id: 0,
                            }
                        },
                    ];

        var climbTypeOverallData = await ScoutingDataService.getClimbTypeChartOverall(query)
        // Return the scoutingData list with the appropriate HTTP Status Code and Message.
        
        return res.status(200).json({status: 200, data: climbTypeOverallData, message: "Succesfully Received Climb Type Overall Data"});
        
    }catch(e){
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message});
    }
}

exports.getPickUpTypeChartOverall = async function(req, res, next){
    // Check the existence of the query parameters, If the exists doesn't exists assign a default value
    try{
        var event = req.params.event;
        var team = +req.params.team;

        var query = [
                        {
                            "$match": {
                                event: event,
                                team: team       
                            }
                        },
                        {
                            "$project": {
                                _id: 0,
                                event: 1,
                                team: 1,
                                pickUpWide: "$matchData.pickUpWide",
                                pickUpDiag: "$matchData.pickUpDiag",
                                pickUpTall: "$matchData.pickUpTall",
                                pickUpDropOff: "$matchData.pickUpDropOff",
                            }       
                        },
                        {
                            "$group":
                            {
                                _id: { event: "$event", team: "$team"},
                                event: {"$first": "$event"},
                                team: {"$first": "$team"},
                                pickUpWideTotal: {"$sum": "$pickUpWide"},
                                pickUpDiagTotal: {"$sum": "$pickUpDiag"},
                                pickUpTallTotal: {"$sum": "$pickUpTall"},
                                pickUpDropOffTotal: {"$sum": "$pickUpDropOff"},
                            }
                        },
                            {
                            "$project": {
                                _id: 0,
                            }
                        },
                    ];

        var pickUpTypeOverallData = await ScoutingDataService.getPickUpTypeChartOverall(query)
        // Return the scoutingData list with the appropriate HTTP Status Code and Message.
        
        return res.status(200).json({status: 200, data: pickUpTypeOverallData, message: "Succesfully Received Pickup Type Overall Data"});
        
    }catch(e){
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message});
    }
}

exports.getSourceDestinationChartOverall = async function(req, res, next){
    // Check the existence of the query parameters, If the exists doesn't exists assign a default value
    try{
        var event = req.params.event;
        var team = +req.params.team;

        var query = [
                        {
                            "$match": {
                                event: event,
                                team: team       
                            }
                        },
                        {
                            "$unwind": "$matchData.cyclePaths",
                        },
                        {
                            "$project": {
                                _id: 0,
                                event: 1,
                                team: 1,
                                match: 1,
                                source: "$matchData.cyclePaths.source",
                                destination: "$matchData.cyclePaths.destination"
                            }       
                        },
                        {
                            "$group": {
                                _id: { event: "$event", team: "$team", match: "$match"},
                                event: {"$first": "$event"},
                                team: {"$first": "$team"},
                                match: {"$first": "$match"},
                                sourceToDestinationList: {
                                    "$push": {
                                        source: "$source",
                                        destination: "$destination"
                                    }
                                }
                            }
                        },
                        {
                            "$project": {
                                _id: 0,
                            }
                        },
                    ];

        var sourceToDestinationOverallData = await ScoutingDataService.getSourceDestinationChartOverall(query)
        // Return the scoutingData list with the appropriate HTTP Status Code and Message.
        
        return res.status(200).json({status: 200, data: sourceToDestinationOverallData, message: "Succesfully Received Source To Destination Overall Data"});
        
    }catch(e){
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message});
    }
}

// exports.removeScoutingData = async function(req, res, next){

//     var id = req.params.id;

//     try{
//         var deleted = await ScoutingDataService.deleteScoutingData(id)
//         return res.status(204).json({status:204, message: "Succesfully Deleted Scouting Data"})
//     }catch(e){
//         return res.status(400).json({status: 400, message: e.message})
//     }

// }