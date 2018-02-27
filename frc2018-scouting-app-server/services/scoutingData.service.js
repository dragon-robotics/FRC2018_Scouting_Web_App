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
        "los_lp": 1,
        "ros_lp": 1.5,
        "ls_lp": 2,
        "rs_lp": 2.5,
        "las_lp": 3,
        "ras_lp": 3.5,
        "aez_lp": 4,
        // Right Portal
        "rp_los": 1.5,
        "rp_ros": 1,
        "rp_ls": 2.5,
        "rp_rs": 2,
        "rp_las": 3.5,
        "rp_ras": 3,
        "rp_aez": 4,
        "los_rp": 1.5,
        "ros_rp": 1,
        "ls_rp": 2.5,
        "rs_rp": 2,
        "las_rp": 3.5,
        "ras_rp": 3,
        "aez_rp": 4,
        // Opponent Platform Zone
        "opz_los": 0.25,
        "opz_ros": 0.25,
        "opz_ls": 1.25,
        "opz_rs": 1.25,
        "opz_las": 2.25,
        "opz_ras": 2.25,
        "opz_aez": 3.25,
        "los_opz": 0.25,
        "ros_opz": 0.25,
        "ls_opz": 1.25,
        "rs_opz": 1.25,
        "las_opz": 2.25,
        "ras_opz": 2.25,
        "aez_opz": 3.25,
        // Alliance Platform Zone
        "apz_los":  2.25,
        "apz_ros": 2.25,
        "apz_ls": 1.25,
        "apz_rs": 1.25,
        "apz_las": 0.25,
        "apz_ras": 0.25,
        "apz_aez": 1.25,
        "los_apz":  2.25,
        "ros_apz": 2.25,
        "ls_apz": 1.25,
        "rs_apz": 1.25,
        "las_apz": 0.25,
        "ras_apz": 0.25,
        "aez_apz": 1.25,
        // Alliance Power Cube Zone
        "apcz_los": 2.25,
        "apcz_ros": 2.25,
        "apcz_ls": 1.25,
        "apcz_rs": 1.25,
        "apcz_las": 0.25,
        "apcz_ras": 0.25,
        "apcz_aez": 0.75,
        "los_apcz": 2.25,
        "ros_apcz": 2.25,
        "ls_apcz": 1.25,
        "rs_apcz": 1.25,
        "las_apcz": 0.25,
        "ras_apcz": 0.25,
        "aez_apcz": 0.75,
        // Alliance Exchange Zone
        "aez_los": 3,
        "aez_ros": 3,
        "aez_ls": 2,
        "aez_rs": 2,
        "aez_las": 1,
        "aez_ras": 1,
        "los_aez": 3,
        "ros_aez": 3,
        "ls_aez": 2,
        "rs_aez": 2,
        "las_aez": 1,
        "ras_aez": 1,
        "aez_aez": 0.25,
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

        /* Calculate additional match data metrics before adding to database */
        // Calculate Cubes Scored
        var cubesScored = rawData.matchData.cyclePaths.length;
        // Calculate Cycle Time
        var cycleTime = 135 / cubesScored;

        // Calculate Efficiency
        var efficiency;
        switch(rawData.matchData.fieldConfig){
            case 0:         // LOS, LS, LAS
                efficiency = _.reduce(rawData.matchData.cyclePaths, function(distance, value, key, arr){
                                if(key == 0){
                                    var initialPath = _.chain([value.source, value.destination])
                                                    .map(function(point){
                                                        return _.chain(point)
                                                                .toLower()
                                                                .thru(function(str){
                                                                    if(~str.indexOf("switch")){
                                                                        return "left " + str;
                                                                    }
                                                                    else if (~str.indexOf("scale")){
                                                                        return "left scale";
                                                                    }
                                                                    else{
                                                                        return str;
                                                                    }
                                                                })
                                                                .split(' ')
                                                                .reduce(function(resStr, value){
                                                                    return resStr+value[0];
                                                                }, "")
                                                                .value();
                                                    })
                                                    .join('_')
                                                    .value();
                                    var initialDistance;
                                    switch(initialPath){
                                        case "rp_ras":
                                            initialDistance = sourceDestinationMap[initialPath] + 1;
                                            break;
                                        case "rp_aez":
                                            initialDistance = sourceDestinationMap[initialPath] + 0.5;
                                            break;
                                        case "opz_ras":
                                            initialDistance = sourceDestinationMap[initialPath] + 0.5;
                                            break;
                                        case "apz_ros":
                                            initialDistance = sourceDestinationMap[initialPath] + 0.5;
                                            break;
                                        case "apcz_ros":
                                            initialDistance = sourceDestinationMap[initialPath] + 0.5;
                                            break;
                                        case "aez_ros":
                                            initialDistance = sourceDestinationMap[initialPath] + 0.5;
                                            break;
                                        default:
                                            initialDistance = sourceDestinationMap[initialPath];
                                            break; 
                                    }
                                    return distance + initialDistance;
                                }
                                else{
                                    var prevDestToSrcPath = _.chain([arr[key-1].destination, value.source])
                                                    .map(function(point){
                                                        return _.chain(point)
                                                                .toLower()
                                                                .thru(function(str){
                                                                    if(~str.indexOf("switch")){
                                                                        return "left " + str;
                                                                    }
                                                                    else if (~str.indexOf("scale")){
                                                                        return "left scale";
                                                                    }
                                                                    else{
                                                                        return str;
                                                                    }
                                                                })
                                                                .split(' ')
                                                                .reduce(function(resStr, value){
                                                                    return resStr+value[0];
                                                                }, "")
                                                                .value();
                                                    })
                                                    .join('_')
                                                    .value();
                                    var srcToDestPath = _.chain([value.source, value.destination])
                                                    .map(function(point){
                                                        return _.chain(point)
                                                                .toLower()
                                                                .thru(function(str){
                                                                    if(~str.indexOf("switch")){
                                                                        return "left " + str;
                                                                    }
                                                                    else if (~str.indexOf("scale")){
                                                                        return "left scale";
                                                                    }
                                                                    else{
                                                                        return str;
                                                                    }
                                                                })
                                                                .split(' ')
                                                                .reduce(function(resStr, value){
                                                                    return resStr+value[0];
                                                                }, "")
                                                                .value();
                                                    })
                                                    .join('_')
                                                    .value();
                                    var prevDestToSrcDistance;
                                    var srcToDestDistance;
                                    
                                    if(prevDestToSrcPath === "rp_ras" || prevDestToSrcPath === "ras_rp"){
                                        prevDestToSrcDistance = sourceDestinationMap[prevDestToSrcPath] + 1;
                                    }
                                    else if(prevDestToSrcPath === "rp_aez" || prevDestToSrcPath === "aez_rp"){
                                        prevDestToSrcDistance = sourceDestinationMap[prevDestToSrcPath] + 0.5;
                                    }
                                    else if(prevDestToSrcPath === "opz_ras" || prevDestToSrcPath === "ras_opz"){
                                        prevDestToSrcDistance = sourceDestinationMap[prevDestToSrcPath] + 0.5;
                                    }
                                    else if(prevDestToSrcPath === "apz_ros" || prevDestToSrcPath === "ros_apz"){
                                        prevDestToSrcDistance = sourceDestinationMap[prevDestToSrcPath] + 0.5;
                                    }
                                    else if(prevDestToSrcPath === "apcz_ros" || prevDestToSrcPath === "ros_apcz"){
                                        prevDestToSrcDistance = sourceDestinationMap[prevDestToSrcPath] + 0.5;
                                    }
                                    else if(prevDestToSrcPath === "aez_ros" || prevDestToSrcPath === "ros_aez"){
                                        prevDestToSrcDistance = sourceDestinationMap[prevDestToSrcPath] ;
                                    }
                                    else{
                                        prevDestToSrcDistance = sourceDestinationMap[prevDestToSrcPath];
                                    }

                                    if(srcToDestPath === "rp_ras" || srcToDestPath === "ras_rp"){
                                        srcToDestDistance = sourceDestinationMap[srcToDestPath] + 1;
                                    }
                                    else if(srcToDestPath === "rp_aez" || srcToDestPath === "aez_rp"){
                                        srcToDestDistance = sourceDestinationMap[srcToDestPath] + 0.5;
                                    }
                                    else if(srcToDestPath === "opz_ras" || srcToDestPath === "ras_opz"){
                                        srcToDestDistance = sourceDestinationMap[srcToDestPath] + 0.5;
                                    }
                                    else if(srcToDestPath === "apz_ros" || srcToDestPath === "ros_apz"){
                                        srcToDestDistance = sourceDestinationMap[srcToDestPath] + 0.5;
                                    }
                                    else if(srcToDestPath === "apcz_ros" || srcToDestPath === "ros_apcz"){
                                        srcToDestDistance = sourceDestinationMap[srcToDestPath] + 0.5;
                                    }
                                    else if(srcToDestPath === "aez_ros" || srcToDestPath === "ros_aez"){
                                        srcToDestDistance = sourceDestinationMap[srcToDestPath] ;
                                    }
                                    else{
                                        srcToDestDistance = sourceDestinationMap[srcToDestPath];
                                    }

                                    return distance + prevDestToSrcDistance + srcToDestDistance;
                                }
                            }, 0);
                break;
            case 1:         // LOS, RS, LAS
                efficiency = _.reduce(rawData.matchData.cyclePaths, function(distance, value, key, arr){
                    if(key == 0){
                        var initialPath = _.chain([value.source, value.destination])
                                        .map(function(point){
                                            return _.chain(point)
                                                    .toLower()
                                                    .thru(function(str){
                                                        if(~str.indexOf("switch")){
                                                            return "left " + str;
                                                        }
                                                        else if (~str.indexOf("scale")){
                                                            return "right scale";
                                                        }
                                                        else{
                                                            return str;
                                                        }
                                                    })
                                                    .split(' ')
                                                    .reduce(function(resStr, value){
                                                        return resStr+value[0];
                                                    }, "")
                                                    .value();
                                        })
                                        .join('_')
                                        .value();
                        var initialDistance;
                        switch(initialPath){
                            case "lp_las":
                                initialDistance = sourceDestinationMap[initialPath] + 1;
                                break;
                            case "lp_aez":
                                initialDistance = sourceDestinationMap[initialPath] + 0.5;
                                break;
                            case "opz_las":
                                initialDistance = sourceDestinationMap[initialPath] + 0.5;
                                break;
                            case "apz_los":
                                initialDistance = sourceDestinationMap[initialPath] + 0.5;
                                break;
                            case "apcz_los":
                                initialDistance = sourceDestinationMap[initialPath] + 0.5;
                                break;
                            case "aez_los":
                                initialDistance = sourceDestinationMap[initialPath] + 0.5;
                                break;
                            default:
                                initialDistance = sourceDestinationMap[initialPath];
                                break; 
                        }
                        return distance + initialDistance;
                    }
                    else{
                        var prevDestToSrcPath = _.chain([arr[key-1].destination, value.source])
                                        .map(function(point){
                                            return _.chain(point)
                                                    .toLower()
                                                    .thru(function(str){
                                                        if(~str.indexOf("switch")){
                                                            return "left " + str;
                                                        }
                                                        else if (~str.indexOf("scale")){
                                                            return "right scale";
                                                        }
                                                        else{
                                                            return str;
                                                        }
                                                    })
                                                    .split(' ')
                                                    .reduce(function(resStr, value){
                                                        return resStr+value[0];
                                                    }, "")
                                                    .value();
                                        })
                                        .join('_')
                                        .value();
                        var srcToDestPath = _.chain([value.source, value.destination])
                                        .map(function(point){
                                            return _.chain(point)
                                                    .toLower()
                                                    .thru(function(str){
                                                        if(~str.indexOf("switch")){
                                                            return "left " + str;
                                                        }
                                                        else if (~str.indexOf("scale")){
                                                            return "right scale";
                                                        }
                                                        else{
                                                            return str;
                                                        }
                                                    })
                                                    .split(' ')
                                                    .reduce(function(resStr, value){
                                                        return resStr+value[0];
                                                    }, "")
                                                    .value();
                                        })
                                        .join('_')
                                        .value();
                        var prevDestToSrcDistance;
                        var srcToDestDistance;
                        
                        if(prevDestToSrcPath === "lp_las" || prevDestToSrcPath === "las_lp"){
                            prevDestToSrcDistance = sourceDestinationMap[prevDestToSrcPath] + 1;
                        }
                        else if(prevDestToSrcPath === "lp_aez" || prevDestToSrcPath === "aez_lp"){
                            prevDestToSrcDistance = sourceDestinationMap[prevDestToSrcPath] + 0.5;
                        }
                        else if(prevDestToSrcPath === "opz_las" || prevDestToSrcPath === "las_opz"){
                            prevDestToSrcDistance = sourceDestinationMap[prevDestToSrcPath] + 0.5;
                        }
                        else if(prevDestToSrcPath === "apz_los" || prevDestToSrcPath === "los_apz"){
                            prevDestToSrcDistance = sourceDestinationMap[prevDestToSrcPath] + 0.5;
                        }
                        else if(prevDestToSrcPath === "apcz_los" || prevDestToSrcPath === "los_apcz"){
                            prevDestToSrcDistance = sourceDestinationMap[prevDestToSrcPath] + 0.5;
                        }
                        else if(prevDestToSrcPath === "aez_los" || prevDestToSrcPath === "los_aez"){
                            prevDestToSrcDistance = sourceDestinationMap[prevDestToSrcPath] ;
                        }
                        else{
                            prevDestToSrcDistance = sourceDestinationMap[prevDestToSrcPath];
                        }

                        if(srcToDestPath === "lp_ras" || srcToDestPath === "las_lp"){
                            srcToDestDistance = sourceDestinationMap[srcToDestPath] + 1;
                        }
                        else if(srcToDestPath === "lp_aez" || srcToDestPath === "aez_lp"){
                            srcToDestDistance = sourceDestinationMap[srcToDestPath] + 0.5;
                        }
                        else if(srcToDestPath === "opz_las" || srcToDestPath === "las_opz"){
                            srcToDestDistance = sourceDestinationMap[srcToDestPath] + 0.5;
                        }
                        else if(srcToDestPath === "apz_los" || srcToDestPath === "los_apz"){
                            srcToDestDistance = sourceDestinationMap[srcToDestPath] + 0.5;
                        }
                        else if(srcToDestPath === "apcz_los" || srcToDestPath === "los_apcz"){
                            srcToDestDistance = sourceDestinationMap[srcToDestPath] + 0.5;
                        }
                        else if(srcToDestPath === "aez_los" || srcToDestPath === "los_aez"){
                            srcToDestDistance = sourceDestinationMap[srcToDestPath] ;
                        }
                        else{
                            srcToDestDistance = sourceDestinationMap[srcToDestPath];
                        }

                        return distance + prevDestToSrcDistance + srcToDestDistance;
                    }
                }, 0);
                break;
            case 2:         // ROS, LS, RAS
                efficiency = _.reduce(rawData.matchData.cyclePaths, function(distance, value, key, arr){
                                if(key == 0){
                                    var initialPath = _.chain([value.source, value.destination])
                                                    .map(function(point){
                                                        return _.chain(point)
                                                                .toLower()
                                                                .thru(function(str){
                                                                    if(~str.indexOf("switch")){
                                                                        return "right " + str;
                                                                    }
                                                                    else if (~str.indexOf("scale")){
                                                                        return "left scale";
                                                                    }
                                                                    else{
                                                                        return str;
                                                                    }
                                                                })
                                                                .split(' ')
                                                                .reduce(function(resStr, value){
                                                                    return resStr+value[0];
                                                                }, "")
                                                                .value();
                                                    })
                                                    .join('_')
                                                    .value();
                                    var initialDistance;
                                    switch(initialPath){
                                        case "rp_ras":
                                            initialDistance = sourceDestinationMap[initialPath] + 1;
                                            break;
                                        case "rp_aez":
                                            initialDistance = sourceDestinationMap[initialPath] + 0.5;
                                            break;
                                        case "opz_ras":
                                            initialDistance = sourceDestinationMap[initialPath] + 0.5;
                                            break;
                                        case "apz_ros":
                                            initialDistance = sourceDestinationMap[initialPath] + 0.5;
                                            break;
                                        case "apcz_ros":
                                            initialDistance = sourceDestinationMap[initialPath] + 0.5;
                                            break;
                                        case "aez_ros":
                                            initialDistance = sourceDestinationMap[initialPath] + 0.5;
                                            break;
                                        default:
                                            initialDistance = sourceDestinationMap[initialPath];
                                            break; 
                                    }
                                    return distance + initialDistance;
                                }
                                else{
                                    var prevDestToSrcPath = _.chain([arr[key-1].destination, value.source])
                                                    .map(function(point){
                                                        return _.chain(point)
                                                                .toLower()
                                                                .thru(function(str){
                                                                    if(~str.indexOf("switch")){
                                                                        return "right " + str;
                                                                    }
                                                                    else if (~str.indexOf("scale")){
                                                                        return "left scale";
                                                                    }
                                                                    else{
                                                                        return str;
                                                                    }
                                                                })
                                                                .split(' ')
                                                                .reduce(function(resStr, value){
                                                                    return resStr+value[0];
                                                                }, "")
                                                                .value();
                                                    })
                                                    .join('_')
                                                    .value();
                                    var srcToDestPath = _.chain([value.source, value.destination])
                                                    .map(function(point){
                                                        return _.chain(point)
                                                                .toLower()
                                                                .thru(function(str){
                                                                    if(~str.indexOf("switch")){
                                                                        return "right " + str;
                                                                    }
                                                                    else if (~str.indexOf("scale")){
                                                                        return "left scale";
                                                                    }
                                                                    else{
                                                                        return str;
                                                                    }
                                                                })
                                                                .split(' ')
                                                                .reduce(function(resStr, value){
                                                                    return resStr+value[0];
                                                                }, "")
                                                                .value();
                                                    })
                                                    .join('_')
                                                    .value();
                                    var prevDestToSrcDistance;
                                    var srcToDestDistance;
                                    
                                    if(prevDestToSrcPath === "rp_ras" || prevDestToSrcPath === "ras_rp"){
                                        prevDestToSrcDistance = sourceDestinationMap[prevDestToSrcPath] + 1;
                                    }
                                    else if(prevDestToSrcPath === "rp_aez" || prevDestToSrcPath === "aez_rp"){
                                        prevDestToSrcDistance = sourceDestinationMap[prevDestToSrcPath] + 0.5;
                                    }
                                    else if(prevDestToSrcPath === "opz_ras" || prevDestToSrcPath === "ras_opz"){
                                        prevDestToSrcDistance = sourceDestinationMap[prevDestToSrcPath] + 0.5;
                                    }
                                    else if(prevDestToSrcPath === "apz_ros" || prevDestToSrcPath === "ros_apz"){
                                        prevDestToSrcDistance = sourceDestinationMap[prevDestToSrcPath] + 0.5;
                                    }
                                    else if(prevDestToSrcPath === "apcz_ros" || prevDestToSrcPath === "ros_apcz"){
                                        prevDestToSrcDistance = sourceDestinationMap[prevDestToSrcPath] + 0.5;
                                    }
                                    else if(prevDestToSrcPath === "aez_ros" || prevDestToSrcPath === "ros_aez"){
                                        prevDestToSrcDistance = sourceDestinationMap[prevDestToSrcPath] ;
                                    }
                                    else{
                                        prevDestToSrcDistance = sourceDestinationMap[prevDestToSrcPath];
                                    }

                                    if(srcToDestPath === "rp_ras" || srcToDestPath === "ras_rp"){
                                        srcToDestDistance = sourceDestinationMap[srcToDestPath] + 1;
                                    }
                                    else if(srcToDestPath === "rp_aez" || srcToDestPath === "aez_rp"){
                                        srcToDestDistance = sourceDestinationMap[srcToDestPath] + 0.5;
                                    }
                                    else if(srcToDestPath === "opz_ras" || srcToDestPath === "ras_opz"){
                                        srcToDestDistance = sourceDestinationMap[srcToDestPath] + 0.5;
                                    }
                                    else if(srcToDestPath === "apz_ros" || srcToDestPath === "ros_apz"){
                                        srcToDestDistance = sourceDestinationMap[srcToDestPath] + 0.5;
                                    }
                                    else if(srcToDestPath === "apcz_ros" || srcToDestPath === "ros_apcz"){
                                        srcToDestDistance = sourceDestinationMap[srcToDestPath] + 0.5;
                                    }
                                    else if(srcToDestPath === "aez_ros" || srcToDestPath === "ros_aez"){
                                        srcToDestDistance = sourceDestinationMap[srcToDestPath] ;
                                    }
                                    else{
                                        srcToDestDistance = sourceDestinationMap[srcToDestPath];
                                    }

                                    return distance + prevDestToSrcDistance + srcToDestDistance;
                                }
                            }, 0);
                break;
            case 3:         // ROS, RS, RAS
                efficiency = _.reduce(rawData.matchData.cyclePaths, function(distance, value, key, arr){
                    if(key == 0){
                        var initialPath = _.chain([value.source, value.destination])
                                        .map(function(point){
                                            return _.chain(point)
                                                    .toLower()
                                                    .thru(function(str){
                                                        if(~str.indexOf("switch")){
                                                            return "right " + str;
                                                        }
                                                        else if (~str.indexOf("scale")){
                                                            return "right scale";
                                                        }
                                                        else{
                                                            return str;
                                                        }
                                                    })
                                                    .split(' ')
                                                    .reduce(function(resStr, value){
                                                        return resStr+value[0];
                                                    }, "")
                                                    .value();
                                        })
                                        .join('_')
                                        .value();
                        var initialDistance;
                        switch(initialPath){
                            case "lp_las":
                                initialDistance = sourceDestinationMap[initialPath] + 1;
                                break;
                            case "lp_aez":
                                initialDistance = sourceDestinationMap[initialPath] + 0.5;
                                break;
                            case "opz_las":
                                initialDistance = sourceDestinationMap[initialPath] + 0.5;
                                break;
                            case "apz_los":
                                initialDistance = sourceDestinationMap[initialPath] + 0.5;
                                break;
                            case "apcz_los":
                                initialDistance = sourceDestinationMap[initialPath] + 0.5;
                                break;
                            case "aez_los":
                                initialDistance = sourceDestinationMap[initialPath] + 0.5;
                                break;
                            default:
                                initialDistance = sourceDestinationMap[initialPath];
                                break; 
                        }
                        return distance + initialDistance;
                    }
                    else{
                        var prevDestToSrcPath = _.chain([arr[key-1].destination, value.source])
                                        .map(function(point){
                                            return _.chain(point)
                                                    .toLower()
                                                    .thru(function(str){
                                                        if(~str.indexOf("switch")){
                                                            return "right " + str;
                                                        }
                                                        else if (~str.indexOf("scale")){
                                                            return "right scale";
                                                        }
                                                        else{
                                                            return str;
                                                        }
                                                    })
                                                    .split(' ')
                                                    .reduce(function(resStr, value){
                                                        return resStr+value[0];
                                                    }, "")
                                                    .value();
                                        })
                                        .join('_')
                                        .value();
                        var srcToDestPath = _.chain([value.source, value.destination])
                                        .map(function(point){
                                            return _.chain(point)
                                                    .toLower()
                                                    .thru(function(str){
                                                        if(~str.indexOf("switch")){
                                                            return "right " + str;
                                                        }
                                                        else if (~str.indexOf("scale")){
                                                            return "right scale";
                                                        }
                                                        else{
                                                            return str;
                                                        }
                                                    })
                                                    .split(' ')
                                                    .reduce(function(resStr, value){
                                                        return resStr+value[0];
                                                    }, "")
                                                    .value();
                                        })
                                        .join('_')
                                        .value();
                        var prevDestToSrcDistance;
                        var srcToDestDistance;
                        
                        if(prevDestToSrcPath === "lp_las" || prevDestToSrcPath === "las_lp"){
                            prevDestToSrcDistance = sourceDestinationMap[prevDestToSrcPath] + 1;
                        }
                        else if(prevDestToSrcPath === "lp_aez" || prevDestToSrcPath === "aez_lp"){
                            prevDestToSrcDistance = sourceDestinationMap[prevDestToSrcPath] + 0.5;
                        }
                        else if(prevDestToSrcPath === "opz_las" || prevDestToSrcPath === "las_opz"){
                            prevDestToSrcDistance = sourceDestinationMap[prevDestToSrcPath] + 0.5;
                        }
                        else if(prevDestToSrcPath === "apz_los" || prevDestToSrcPath === "los_apz"){
                            prevDestToSrcDistance = sourceDestinationMap[prevDestToSrcPath] + 0.5;
                        }
                        else if(prevDestToSrcPath === "apcz_los" || prevDestToSrcPath === "los_apcz"){
                            prevDestToSrcDistance = sourceDestinationMap[prevDestToSrcPath] + 0.5;
                        }
                        else if(prevDestToSrcPath === "aez_los" || prevDestToSrcPath === "los_aez"){
                            prevDestToSrcDistance = sourceDestinationMap[prevDestToSrcPath] ;
                        }
                        else{
                            prevDestToSrcDistance = sourceDestinationMap[prevDestToSrcPath];
                        }

                        if(srcToDestPath === "lp_ras" || srcToDestPath === "las_lp"){
                            srcToDestDistance = sourceDestinationMap[srcToDestPath] + 1;
                        }
                        else if(srcToDestPath === "lp_aez" || srcToDestPath === "aez_lp"){
                            srcToDestDistance = sourceDestinationMap[srcToDestPath] + 0.5;
                        }
                        else if(srcToDestPath === "opz_las" || srcToDestPath === "las_opz"){
                            srcToDestDistance = sourceDestinationMap[srcToDestPath] + 0.5;
                        }
                        else if(srcToDestPath === "apz_los" || srcToDestPath === "los_apz"){
                            srcToDestDistance = sourceDestinationMap[srcToDestPath] + 0.5;
                        }
                        else if(srcToDestPath === "apcz_los" || srcToDestPath === "los_apcz"){
                            srcToDestDistance = sourceDestinationMap[srcToDestPath] + 0.5;
                        }
                        else if(srcToDestPath === "aez_los" || srcToDestPath === "los_aez"){
                            srcToDestDistance = sourceDestinationMap[srcToDestPath] ;
                        }
                        else{
                            srcToDestDistance = sourceDestinationMap[srcToDestPath];
                        }

                        return distance + prevDestToSrcDistance + srcToDestDistance;
                    }
                }, 0);
                break;
        }

        // Calculate PickUp styles
        var pickUpCounts = _.countBy(rawData.matchData.cyclePaths, function(result){
                                return result.pickUpOrientation;
                            });

        rawData.matchData.cubesScored = cubesScored;
        rawData.matchData.cycleTime = cycleTime ? cycleTime : NaN;
        rawData.matchData.efficiency = efficiency / 135;
        rawData.matchData.pickUpWide = pickUpCounts["Wide"] ? pickUpCounts["Wide"] : 0;
        rawData.matchData.pickUpDiag = pickUpCounts["Diagonal"] ? pickUpCounts["Diagonal"] : 0;
        rawData.matchData.pickUpTall = pickUpCounts["Tall"] ? pickUpCounts["Tall"] : 0;
        rawData.matchData.pickUpTall = pickUpCounts["Drop Off"] ? pickUpCounts["Drop Off"] : 0;

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