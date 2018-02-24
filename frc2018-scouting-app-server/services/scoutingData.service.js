// Getting the Newly created Mongoose Model we just created 
var ScoutingData = require('../models/scoutingData.model');
var _ = require('lodash');

// Saving the context of this module inside the _the variable
_this = this;

var sourceDestinationMap = {
        // Left Portal
        "lp_los": 1,
        "lp_ros": 1.5,
        "lp_ls": 2,
        "lp_rs": 2.5,
        "lp_las": 3,
        "lp_ras": 3.5,
        "lp_aez": 4,
        // Right Portal
        "rp_los": 1.5,
        "rp_ros": 1,
        "rp_ls": 2.5,
        "rp_rs": 2,
        "rp_las": 3.5,
        "rp_ras": 3,
        "rp_aez": 4,
        // Opponent Platform Zone
        "opz_los": 0.5,
        "opz_ros": 0.5,
        "opz_ls": 1.25,
        "opz_rs": 1.25,
        "opz_las": 2.25,
        "opz_ras": 2.25,
        "opz_aez": 3.25,
        // Alliance Platform Zone
        "apz_los": 2.25,
        "apz_ros": 2.25,
        "apz_ls": 1.25,
        "apz_rs": 1.25,
        "apz_las": 0.5,
        "apz_ras": 0.5,
        "apz_aez": 1.5,
        // Alliance Power Cube Zone
        "apcz_los": 2.5,
        "apcz_ros": 2.5,
        "apcz_ls": 1.5,
        "apcz_rs": 1.5,
        "apcz_las": 0.5,
        "apcz_ras": 0.5,
        "apcz_aez": 4,
        // Alliance Exchange Zone
        "aez_los": 3,
        "aez_ros": 3,
        "aez_ls": 2,
        "aez_rs": 2,
        "aez_las": 1,
        "aez_ras": 1,
        "aez_aez": 0.5,
};

// Async function to get the To do List
exports.getScoutingData = async function(query, page, limit){

    // Options setup for the mongoose paginate
    var options = {
        page,
        limit
    }
    
    // Try Catch the awaited promise to handle the error 
    
    try {
        var scoutingDatas = await ScoutingData.paginate(query, options)
        
        // Return the todod list that was retured by the mongoose promise
        return scoutingDatas;

    } catch (e) {

        // return a Error message describing the reason 
        throw Error('Error while Paginating Todos')
    }
}

exports.createScoutingData = async function(rawData){
    

    try{

        // /* Calculate additional match data metrics before adding to database */
        // // Calculate Cubes Scored
        // var cubesScored = rawData.cyclePaths.length;
        // // Calculate Cycle Time
        // var cycleTime = 135 / cubesScored;
        // // Calculate Efficiency
        // switch(rawData.matchData.fieldConfig){
        //     case 0:         // LOS, LS, LAS
        //         break;
        //     case 1:         // LOS, RS, LAS
        //         break;
        //     case 2:         // ROS, LS, RAS
        //         break;
        //     case 3:         // ROS, RS, RAS
        //         break;
        // }

        // // Calculate PickUp styles
        // var pickUpCounts = _.countBy(rawData.matchData.cyclePaths, function(result){
        //                         return result.pickUpOrientation;
        //                     });

        // Creating a new Mongoose Object by using the new keyword
        var newScoutingData = new ScoutingData({
            team: rawData.team,
            event: rawData.event,
            match: rawData.match,
            matchData: rawData.matchData,
            comments: rawData.comments,
        })

        // Saving the Todo 
        var savedScoutingData = await newScoutingData.save();

        return savedScoutingData;
    }catch(e){
      
        // return a Error message describing the reason     
        throw Error("Error while Creating ScoutingData")
    }
}

exports.updateTodo = async function(rawData){
    var id = rawData.id

    try{
        //Find the old Todo Object by the Id
    
        var oldScoutingData = await ScoutingData.findById(id);
    }catch(e){
        throw Error("Error occured while Finding the ScoutingData by ID")
    }

    // If no old Todo Object exists return false
    if(!oldScoutingData){
        return false;
    }

    console.log(oldScoutingData)

    //Edit the Todo Object
    savedScoutingData.team = rawData.team
    savedScoutingData.event = rawData.team
    savedScoutingData.match = rawData.team
    savedScoutingData.matchData = rawData.matchData
    savedScoutingData.comments = rawData.comments


    console.log(oldScoutingData)

    try{
        var savedScoutingData = await oldScoutingData.save()
        return savedScoutingData;
    }catch(e){
        throw Error("And Error occured while updating the Todo");
    }
}

exports.deleteTodo = async function(id){
    
    // Delete the Todo
    try{
        var deleted = await ToDo.remove({_id: id})
        if(deleted.result.n === 0){
            throw Error("Todo Could not be deleted")
        }
        return deleted
    }catch(e){
        throw Error("Error Occured while Deleting the Todo")
    }
}