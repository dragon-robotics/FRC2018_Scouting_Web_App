// Getting the Newly created Mongoose Model we just created 
var ScoutingData = require('../models/scoutingData.model')

// Saving the context of this module inside the _the variable
_this = this

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
    
    // Creating a new Mongoose Object by using the new keyword
    var newScoutingData = new ScoutingData({
        team: rawData.team,
        event: rawData.event,
        match: rawData.match,
        matchData: rawData.matchData,
        comments: rawData.comments,
    })

    try{

        // Saving the Todo 
        var savedScoutingData = await newScoutingData.save()

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