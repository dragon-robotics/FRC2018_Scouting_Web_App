// Accessing the Service that we just created

var ScoutingDataService = require('../services/scoutingData.service')

// Saving the context of this module inside the _the variable

_this = this


// Async Controller function to get the To do List

exports.getScoutingData = async function(req, res, next){

    // Check the existence of the query parameters, If the exists doesn't exists assign a default value
    
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10; 

    try{
    
        var scoutingData = await ScoutingDataService.getScoutingData({}, page, limit)
        
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

    console.log(req.body)

    var scoutingData = {
        id,
        team: req.body.team ? req.body.team : null,
        event: req.body.event ? req.body.event : null,
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

exports.removeScoutingData = async function(req, res, next){

    var id = req.params.id;

    try{
        var deleted = await ScoutingDataService.deleteScoutingData(id)
        return res.status(204).json({status:204, message: "Succesfully Deleted Scouting Data"})
    }catch(e){
        return res.status(400).json({status: 400, message: e.message})
    }

}