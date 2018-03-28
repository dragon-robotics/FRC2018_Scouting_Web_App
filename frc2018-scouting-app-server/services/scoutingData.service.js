// Getting the Newly created Mongoose Model we just created 
var ScoutingData = require('../models/scoutingData.model');
var YPRData = require('../models/yprData.model');
var _ = require('lodash');
var jStat = require('jStat').jStat;
var requestPromise = require('request-promise');

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

exports.getYPRData = async function(event){
    try {

        // Return the YPR list that was retured by the mongoose promise
        var YPR = YPRData.find({event: event}).sort({YPR: -1});
        return YPR;

    } catch (e) {
        // return a Error message describing the reason
        throw Error('Error while creating YPR')
    }
}

// Async function to get the To do List
exports.getScoutingData = async function(query){    
    // Try Catch the awaited promise to handle the error 
    
    try {
        var scoutingDatas = await ScoutingData.aggregate(query)
        
        // Return the todod list that was retured by the mongoose promise
        return scoutingDatas;

    } catch (e) {

        // return a Error message describing the reason 
        throw Error('Error while obtaining scouting data')
    }
}

exports.createScoutingData = async function(rawData){
    try{

        /* Calculate additional match data metrics before adding to database */
        // Calculate Cubes Scored
        var cubesScored = rawData.matchData.cyclePaths.length;
        // Calculate Cycle Time
        var cycleTime = cubesScored / 135;

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
        rawData.matchData.pickUpDropOff = pickUpCounts["Drop Off"] ? pickUpCounts["Drop Off"] : 0;

        // Creating a new Mongoose Object by using the new keyword
        var newScoutingData = new ScoutingData({
            team: rawData.team,
            event: rawData.event,
            match: rawData.match,
            matchData: rawData.matchData,
            comments: rawData.comments,
            timeOfDataEntry: (new Date()).toJSON().slice(0, 19).replace(/[-T]/g, ':'),
        })

        // Saving the Todo 
        var savedScoutingData = await newScoutingData.save();

        // Compile YPR Data
        var query = [
            {
                "$match" :{
                    "event": rawData.event,
                },
            },
            {
                "$project" : {
                    "event": 1,
                    "team": 1,
                    "match": 1,
                    "autoLine": "$matchData.autoLine",
                    "autoSwitchCubeCount": "$matchData.autoSwitchCubeCount",
                    "autoScaleCubeCount": "$matchData.autoScaleCubeCount", 
                    "autoExchangeCubeCount": "$matchData.autoExchangeCubeCount", 
                    "cubesScored": "$matchData.cubesScored",
                    "cycleTime": "$matchData.cycleTime", 
                    "efficiency": "$matchData.efficiency", 
                    "pickUpWide": "$matchData.pickUpWide", 
                    "pickUpDiag": "$matchData.pickUpDiag", 
                    "pickUpTall": "$matchData.pickUpTall",
                    "pickUpDropOff": "$matchData.pickUpDropOff",
                    "climbing": "$matchData.climbing",                     
                },
            },
            {
                "$group" : {
                    "_id": {"event": "$event", "team": "$team"},
                    "avgAutoLine" : { "$avg": "$autoLine"},
                    "avgAutoSwitchCubeCount" : { "$avg": "$autoSwitchCubeCount"},
                    "avgAutoScaleCubeCount" : { "$avg": "$autoScaleCubeCount"},
                    "avgAutoExchangeCubeCount" : { "$avg": "$autoExchangeCubeCount"},
                    "avgCubesScored" : { "$avg": "$cubesScored"},
                    "avgEfficiency" : { "$avg": "$efficiency"},
                    "avgCycleTime" : { "$avg": "$cycleTime"},
                    "avgClimbing" : { "$avg" : "$climbing"},
                    "totalPickUpWide" : {"$sum" : "$pickUpWide"},
                    "totalPickUpDiag" : {"$sum" : "$pickUpDiag"},
                    "totalPickUpTall" : {"$sum" : "$pickUpTall"},
                    "totalPickUpDropOff" : {"$sum" : "$pickUpDropOff"},
                },
            },
            {
                "$project" : {
                    "_id" : 0,
                    "event" : "$_id.event",
                    "team" : "$_id.team",
                    "avgAutoLine" : 1,
                    "avgAutoSwitchCubeCount" : 1,
                    "avgAutoScaleCubeCount" : 1,
                    "avgAutoExchangeCubeCount" : 1,
                    "avgCubesScored" : 1,
                    "avgClimbing": 1,
                    "avgEfficiency" : 1,
                    "avgCycleTime" : 1,
                    "totalPickUpWide" : 1,
                    "totalPickUpDiag" : 1,
                    "totalPickUpTall" : 1,
                    "totalPickUpDropOff" : 1,
                },
            },
        ];

        var yprDatas = await ScoutingData.aggregate(query)

        // Start calculating YPR using LODASH
        var maxYPRDatas = _.chain(yprDatas)
        .reduce(function(result, value, key, arr){
            result["maxAvgAutoSwitchCubeCount"] = key == 0 ? value.avgAutoSwitchCubeCount : Math.max(result["maxAvgAutoSwitchCubeCount"], value.avgAutoSwitchCubeCount);
            result["maxAvgAutoScaleCubeCount"] = key == 0 ? value.avgAutoScaleCubeCount : Math.max(result["maxAvgAutoScaleCubeCount"], value.avgAutoScaleCubeCount);
            result["maxAvgAutoExchangeCubeCount"] = key == 0 ? value.avgAutoExchangeCubeCount : Math.max(result["maxAvgAutoExchangeCubeCount"], value.avgAutoExchangeCubeCount);
            result["maxAvgCubesScored"] = key == 0 ? value.avgCubesScored : Math.max(result["maxAvgCubesScored"], value.avgCubesScored);
            result["maxAvgEfficiency"] = key == 0 ? value.avgEfficiency : Math.max(result["maxAvgEfficiency"], value.avgEfficiency);
            result["maxAvgCycleTime"] = key == 0 ? value.avgCycleTime : Math.max(result["maxAvgCycleTime"], value.avgCycleTime);
            return result;
        }, {})
        .value();

        var oprAndDprAndCcwm = await requestPromise({
            method: 'GET',
            url: 'https://www.thebluealliance.com/api/v3/event/'+rawData.eventID+'/oprs',
            headers:{
                'X-TBA-Auth-Key': 'dS9knumpOPRZJkI1FvSCSYhdnIj9dk2mfpqPMb50JbCQc9roaG9Hl3oZKTRYYOe0',
            },
        });
        oprAndDprAndCcwm = JSON.parse(oprAndDprAndCcwm);

        var maxOprAndDprAndCcwm = _.reduce(oprAndDprAndCcwm, function(result, value, key, arr){
            result["max"+key] = _.reduce(value, function(maxResult, value, key, arr){
                maxResult = key == 0 ? value : Math.max(value, maxResult);
                return maxResult;
            }, 0)
            return result;
        }, {});

        var YPR = _.chain(yprDatas)
        .forEach(function(result){
            var maxAvgAutoScaleCubeCount = maxYPRDatas.maxAvgAutoScaleCubeCount == 0 ? 1 : maxYPRDatas.maxAvgAutoScaleCubeCount;
            var maxAvgAutoSwitchCubeCount = maxYPRDatas.maxAvgAutoSwitchCubeCount == 0 ? 1 : maxYPRDatas.maxAvgAutoSwitchCubeCount; 
            var maxAvgAutoExchangeCubeCount = maxYPRDatas.maxAvgAutoExchangeCubeCount == 0 ? 1 : maxYPRDatas.maxAvgAutoExchangeCubeCount;
            var maxAvgCubesScored = maxYPRDatas.maxAvgCubesScored == 0 ? 1 : maxYPRDatas.maxAvgCubesScored;
            var maxAvgEfficiency = maxYPRDatas.maxAvgEfficiency == 0 ? 1 : maxYPRDatas.maxAvgEfficiency;
            var maxAvgCycleTime = maxYPRDatas.maxAvgCycleTime == 0 ? 1 : maxYPRDatas.maxAvgCycleTime;            

            var cycleTimeRating = 20 * (result.avgCycleTime / maxAvgCycleTime);
            var autoRating = result.avgAutoLine * ((5*(result.avgAutoScaleCubeCount / maxAvgAutoScaleCubeCount)) + (3*(result.avgAutoSwitchCubeCount / maxAvgAutoSwitchCubeCount)) + (2*(result.avgAutoExchangeCubeCount / maxAvgAutoExchangeCubeCount)) + 10);
            
            var pickUpData = [result.totalPickUpWide, result.totalPickUpDiag, result.totalPickUpTall, result.totalPickUpDropOff];
            var pickUpMean = jStat.mean(pickUpData);
            var pickUpMAD = jStat.meandev(pickUpData);
            var pickUpGini = pickUpMean == 0 ? 0 : (pickUpMAD / pickUpMean) / 2;
            // // With an array of 4, least versatile = 0.75, most versatile = 0
            var pickUpRating = pickUpMean == 0 ? 0 : 20 - (pickUpGini * 80 / 3);

            var climbRating = result.avgClimbing * 4;
            var efficiencyRating = 20 * (result.avgEfficiency / maxAvgEfficiency);
            var numberOfCubesRating = 20 * (result.avgCubesScored / maxAvgCubesScored);
            var OPR = oprAndDprAndCcwm.oprs['frc'+result.team] < 0 ? 0 : 20 * (oprAndDprAndCcwm.oprs['frc'+result.team] / maxOprAndDprAndCcwm.maxoprs);
            var DPR = oprAndDprAndCcwm.dprs['frc'+result.team] < 0 ? 0 : 20 * (oprAndDprAndCcwm.dprs['frc'+result.team] / maxOprAndDprAndCcwm.maxdprs);
            var CCWM = oprAndDprAndCcwm.ccwms['frc'+result.team] < 0 ? 0 : 20 * (oprAndDprAndCcwm.ccwms['frc'+result.team] / maxOprAndDprAndCcwm.maxccwms); 
            var YPR = cycleTimeRating + autoRating + pickUpRating + climbRating + efficiencyRating + numberOfCubesRating + OPR + DPR + CCWM;

            var yprPerTeam = {
                event: result.event,
                team: result.team,
                YPR: YPR,
                OPR: OPR,
                DPR: DPR,
                CCWM: CCWM,
                cycleTimeRating: cycleTimeRating,
                autoRating: autoRating,
                pickUpRating: pickUpRating,
                climbRating: climbRating,
                efficiencyRating: efficiencyRating,
                numberOfCubesRating: numberOfCubesRating,
            };

            YPRData.update(
                { event: result.event, team: result.team },
                yprPerTeam,
                { upsert: true },
                function(error, raw){
                }
            );
        })
        .value();

        return savedScoutingData;
    }catch(e){
      
        // return a Error message describing the reason     
        throw Error("Error while Creating ScoutingData");
    }
}

exports.updateScoutingData = async function(rawData){
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

    console.log(rawData)

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
    rawData.matchData.cycleTime = cubesScored / 135;
    rawData.matchData.efficiency = efficiency / 135;
    rawData.matchData.pickUpWide = pickUpCounts["Wide"] ? pickUpCounts["Wide"] : 0;
    rawData.matchData.pickUpDiag = pickUpCounts["Diagonal"] ? pickUpCounts["Diagonal"] : 0;
    rawData.matchData.pickUpTall = pickUpCounts["Tall"] ? pickUpCounts["Tall"] : 0;
    rawData.matchData.pickUpDropOff = pickUpCounts["Drop Off"] ? pickUpCounts["Drop Off"] : 0;

    //Edit the Todo Object
    oldScoutingData.team = rawData.team
    oldScoutingData.event = rawData.event
    oldScoutingData.match = rawData.match
    oldScoutingData.matchData = rawData.matchData
    oldScoutingData.comments = rawData.comments
    oldScoutingData.timeOfDataEntry = (new Date()).toJSON().slice(0, 19).replace(/[-T]/g, ':')

    try{
        var savedScoutingData = await oldScoutingData.save();

        // Compile YPR Data
        var query = [
            {
                "$match" :{
                    "event": rawData.event,
                },
            },
            {
                "$project" : {
                    "event": 1,
                    "team": 1,
                    "match": 1,
                    "autoLine": "$matchData.autoLine",
                    "autoSwitchCubeCount": "$matchData.autoSwitchCubeCount",
                    "autoScaleCubeCount": "$matchData.autoScaleCubeCount", 
                    "autoExchangeCubeCount": "$matchData.autoExchangeCubeCount", 
                    "cubesScored": "$matchData.cubesScored",
                    "cycleTime": "$matchData.cycleTime", 
                    "efficiency": "$matchData.efficiency", 
                    "pickUpWide": "$matchData.pickUpWide", 
                    "pickUpDiag": "$matchData.pickUpDiag", 
                    "pickUpTall": "$matchData.pickUpTall",
                    "pickUpDropOff": "$matchData.pickUpDropOff",
                    "climbing": "$matchData.climbing",                     
                },
            },
            {
                "$group" : {
                    "_id": {"event": "$event", "team": "$team"},
                    "avgAutoLine" : { "$avg": "$autoLine"},
                    "avgAutoSwitchCubeCount" : { "$avg": "$autoSwitchCubeCount"},
                    "avgAutoScaleCubeCount" : { "$avg": "$autoScaleCubeCount"},
                    "avgAutoExchangeCubeCount" : { "$avg": "$autoExchangeCubeCount"},
                    "avgCubesScored" : { "$avg": "$cubesScored"},
                    "avgEfficiency" : { "$avg": "$efficiency"},
                    "avgCycleTime" : { "$avg": "$cycleTime"},
                    "avgClimbing" : { "$avg" : "$climbing"},
                    "totalPickUpWide" : {"$sum" : "$pickUpWide"},
                    "totalPickUpDiag" : {"$sum" : "$pickUpDiag"},
                    "totalPickUpTall" : {"$sum" : "$pickUpTall"},
                    "totalPickUpDropOff" : {"$sum" : "$pickUpDropOff"},
                },
            },
            {
                "$project" : {
                    "_id" : 0,
                    "event" : "$_id.event",
                    "team" : "$_id.team",
                    "avgAutoLine" : 1,
                    "avgAutoSwitchCubeCount" : 1,
                    "avgAutoScaleCubeCount" : 1,
                    "avgAutoExchangeCubeCount" : 1,
                    "avgCubesScored" : 1,
                    "avgClimbing": 1,
                    "avgEfficiency" : 1,
                    "avgCycleTime" : 1,
                    "totalPickUpWide" : 1,
                    "totalPickUpDiag" : 1,
                    "totalPickUpTall" : 1,
                    "totalPickUpDropOff" : 1,
                },
            },
        ];
        var yprDatas = await ScoutingData.aggregate(query)

        // Start calculating YPR using LODASH
        var maxYPRDatas = _.chain(yprDatas)
        .reduce(function(result, value, key, arr){
            result["maxAvgAutoSwitchCubeCount"] = key == 0 ? value.avgAutoSwitchCubeCount : Math.max(result["maxAvgAutoSwitchCubeCount"], value.avgAutoSwitchCubeCount);
            result["maxAvgAutoScaleCubeCount"] = key == 0 ? value.avgAutoScaleCubeCount : Math.max(result["maxAvgAutoScaleCubeCount"], value.avgAutoScaleCubeCount);
            result["maxAvgAutoExchangeCubeCount"] = key == 0 ? value.avgAutoExchangeCubeCount : Math.max(result["maxAvgAutoExchangeCubeCount"], value.avgAutoExchangeCubeCount);
            result["maxAvgCubesScored"] = key == 0 ? value.avgCubesScored : Math.max(result["maxAvgCubesScored"], value.avgCubesScored);
            result["maxAvgEfficiency"] = key == 0 ? value.avgEfficiency : Math.max(result["maxAvgEfficiency"], value.avgEfficiency);
            result["maxAvgCycleTime"] = key == 0 ? value.avgCycleTime : Math.max(result["maxAvgCycleTime"], value.avgCycleTime);
            return result;
        }, {})
        .value();

        var oprAndDprAndCcwm = await requestPromise({
            method: 'GET',
            url: 'https://www.thebluealliance.com/api/v3/event/'+rawData.eventID+'/oprs',
            headers:{
                'X-TBA-Auth-Key': 'dS9knumpOPRZJkI1FvSCSYhdnIj9dk2mfpqPMb50JbCQc9roaG9Hl3oZKTRYYOe0',
            },
        });
        oprAndDprAndCcwm = JSON.parse(oprAndDprAndCcwm);

        var maxOprAndDprAndCcwm = _.reduce(oprAndDprAndCcwm, function(result, value, key, arr){
            result["max"+key] = _.reduce(value, function(maxResult, value, key, arr){
                maxResult = key == 0 ? value : Math.max(value, maxResult);
                return maxResult;
            }, 0)
            return result;
        }, {});

        var YPR = _.chain(yprDatas)
        .forEach(function(result){
            var maxAvgAutoScaleCubeCount = maxYPRDatas.maxAvgAutoScaleCubeCount == 0 ? 1 : maxYPRDatas.maxAvgAutoScaleCubeCount;
            var maxAvgAutoSwitchCubeCount = maxYPRDatas.maxAvgAutoSwitchCubeCount == 0 ? 1 : maxYPRDatas.maxAvgAutoSwitchCubeCount; 
            var maxAvgAutoExchangeCubeCount = maxYPRDatas.maxAvgAutoExchangeCubeCount == 0 ? 1 : maxYPRDatas.maxAvgAutoExchangeCubeCount;
            var maxAvgCubesScored = maxYPRDatas.maxAvgCubesScored == 0 ? 1 : maxYPRDatas.maxAvgCubesScored;
            var maxAvgEfficiency = maxYPRDatas.maxAvgEfficiency == 0 ? 1 : maxYPRDatas.maxAvgEfficiency;
            var maxAvgCycleTime = maxYPRDatas.maxAvgCycleTime == 0 ? 1 : maxYPRDatas.maxAvgCycleTime;            

            var cycleTimeRating = 20 * (result.avgCycleTime / maxAvgCycleTime);
            var autoRating = result.avgAutoLine * ((5*(result.avgAutoScaleCubeCount / maxAvgAutoScaleCubeCount)) + (3*(result.avgAutoSwitchCubeCount / maxAvgAutoSwitchCubeCount)) + (2*(result.avgAutoExchangeCubeCount / maxAvgAutoExchangeCubeCount)) + 10);
            
            var pickUpData = [result.totalPickUpWide, result.totalPickUpDiag, result.totalPickUpTall, result.totalPickUpDropOff];
            var pickUpMean = jStat.mean(pickUpData);
            var pickUpMAD = jStat.meandev(pickUpData);
            var pickUpGini = pickUpMean == 0 ? 0 : (pickUpMAD / pickUpMean) / 2;
            // // With an array of 4, least versatile = 0.75, most versatile = 0
            var pickUpRating = pickUpMean == 0 ? 0 : 20 - (pickUpGini * 80 / 3);

            var climbRating = result.avgClimbing * 4;
            var efficiencyRating = 20 * (result.avgEfficiency / maxAvgEfficiency);
            var numberOfCubesRating = 20 * (result.avgCubesScored / maxAvgCubesScored);
            var OPR = oprAndDprAndCcwm.oprs['frc'+result.team] < 0 ? 0 : 20 * (oprAndDprAndCcwm.oprs['frc'+result.team] / maxOprAndDprAndCcwm.maxoprs);
            var DPR = oprAndDprAndCcwm.dprs['frc'+result.team] < 0 ? 0 : 20 * (oprAndDprAndCcwm.dprs['frc'+result.team] / maxOprAndDprAndCcwm.maxdprs);
            var CCWM = oprAndDprAndCcwm.ccwms['frc'+result.team] < 0 ? 0 : 20 * (oprAndDprAndCcwm.ccwms['frc'+result.team] / maxOprAndDprAndCcwm.maxccwms); 
            var YPR = cycleTimeRating + autoRating + pickUpRating + climbRating + efficiencyRating + numberOfCubesRating + OPR + DPR + CCWM;

            var yprPerTeam = {
                event: result.event,
                team: result.team,
                YPR: YPR,
                OPR: OPR,
                DPR: DPR,
                CCWM: CCWM,
                Pickup: pickUpRating,
                NumOfCubes: numberOfCubesRating,
                CycleTime: cycleTimeRating,
                Efficiency: efficiencyRating,
                Auto: autoRating,
                Climb: climbRating,
            };

            YPRData.update(
                { 
                    event: result.event, 
                    team: result.team 
                },
                yprPerTeam,
                { 
                    upsert: true 
                },
                function(error, raw){
                    console.log(raw);
                }
            );
        })
        .value();

        return savedScoutingData;
    }catch(e){
        throw Error("And Error occured while updating the Todo");
    }
}

/* Per Match Chart Service */

exports.getReadyStatusPerMatch = async function(query){    
    // Try Catch the awaited promise to handle the error 
    
    try {
        var readyStatusData = await ScoutingData.aggregate(query)
        readyStatusData = _.sortBy(readyStatusData, function(res){ return +res.name.split(" ")[1] });
        
        // Return the todod list that was retured by the mongoose promise
        return readyStatusData;

    } catch (e) {

        // return a Error message describing the reason 
        throw Error('Error while obtaining ready status')
    }
}

exports.getRobotPlacementPerMatch = async function(query){    
    // Try Catch the awaited promise to handle the error 
    
    try {
        var robotPlacementData = await ScoutingData.aggregate(query)
        robotPlacementData = _.sortBy(robotPlacementData, function(res){ return +res.name.split(" ")[1] });

        // Return the todod list that was retured by the mongoose promise
        return robotPlacementData;

    } catch (e) {

        // return a Error message describing the reason 
        throw Error('Error while obtaining robot placement')
    }
}

exports.getFieldConfigurationPerMatch = async function(query){    
    // Try Catch the awaited promise to handle the error 
    
    try {
        var fieldConfigurationData = await ScoutingData.aggregate(query)
        fieldConfigurationData = _.sortBy(fieldConfigurationData, function(res){ return +res.name.split(" ")[1] });

        // Return the todod list that was retured by the mongoose promise
        return fieldConfigurationData;

    } catch (e) {

        // return a Error message describing the reason 
        throw Error('Error while obtaining robot placement')
    }
}

exports.getAutoLinePerMatch = async function(query){    
    // Try Catch the awaited promise to handle the error 
    
    try {
        var autoLineData = await ScoutingData.aggregate(query)
        autoLineData = _.sortBy(autoLineData, function(res){ return +res.name.split(" ")[1] });

        // Return the todod list that was retured by the mongoose promise
        return autoLineData;

    } catch (e) {

        // return a Error message describing the reason 
        throw Error('Error while obtaining robot placement')
    }
}

exports.getAutoSwitchScaleExchangeZoneChartPerMatch = async function(query){    
    // Try Catch the awaited promise to handle the error 
    
    try {
        var autoSwitchScaleExchangeZoneData = await ScoutingData.aggregate(query)
        autoSwitchScaleExchangeZoneData = _.chain(autoSwitchScaleExchangeZoneData)
                                            .reduce(function(result, value, key, arr){
                                                if(key == 0){
                                                    result[0] = {
                                                        name: "autoSwitchCubeCount",
                                                        data: [{
                                                            name: value.match,
                                                            y: value.autoSwitchCubeCount,
                                                        }]
                                                    }
                                                    result[1] = {
                                                        name: "autoScaleCubeCount",
                                                        data: [{
                                                            name: value.match,
                                                            y: value.autoScaleCubeCount,
                                                        }]
                                                    }
                                                    result[2] = {
                                                        name: "autoExchangeZoneCubeCount",
                                                        data: [{
                                                            name: value.match,
                                                            y: value.autoExchangeCubeCount,
                                                        }]
                                                    }
                                                }
                                                else{
                                                    result[0].data = _.concat(result[0].data,
                                                        [{
                                                            name: value.match,
                                                            y: value.autoSwitchCubeCount,
                                                        }]
                                                    )
                                                    result[1].data = _.concat(result[1].data,
                                                        [{
                                                            name: value.match,
                                                            y: value.autoScaleCubeCount,
                                                        }]
                                                    )
                                                    result[2].data = _.concat(result[2].data,
                                                        [{
                                                            name: value.match,
                                                            y: value.autoExchangeCubeCount,
                                                        }]
                                                    )
                                                }
                                                return result;
                                                
                                            }, [{}, {}, {}])
                                            .thru(function(result){
                                                var categories = _.chain(autoSwitchScaleExchangeZoneData)
                                                .map(function(matches){
                                                    return matches.match;
                                                })
                                                .uniq()
                                                .sortBy(function(res){ return +res.split(" ")[1] })
                                                .value()

                                                return {
                                                    categories: categories,
                                                    result: result,
                                                }
                                            })
                                            .value();

        // Return the todod list that was retured by the mongoose promise
        return autoSwitchScaleExchangeZoneData;

    } catch (e) {

        // return a Error message describing the reason 
        // throw Error('Error while obtaining auto switch/scale/exchange zone cube count')
        throw Error(e.message)
    }
}

exports.getClimbPointsChartPerMatch = async function(query){    
    // Try Catch the awaited promise to handle the error 
    
    try {
        var climbPointsData = await ScoutingData.aggregate(query)
        climbPointsData = _.sortBy(climbPointsData, function(res){ return +res.name.split(" ")[1] });

        // Return the todod list that was retured by the mongoose promise
        return climbPointsData;

    } catch (e) {

        // return a Error message describing the reason 
        throw Error('Error while obtaining climb point data')
    }
}

exports.getpickUpTypeChartPerMatch = async function(query){

}

exports.getEfficiencyChartPerMatch = async function(query){
    
}

exports.getCycleTimeChartPerMatch = async function(query){
    
}

exports.getSourceDestinationChartPerMatch = async function(query){
    
}

/* Overall Chart Service */

exports.getRobotReadyStatusOverall = async function(query){

}

exports.getRobotPlacementOverall = async function(query){
    
}

exports.getAutoLineOverall = async function(query){
    
}

exports.getAutoSwitchScaleExchangeZoneChartOverall = async function(query){
    
}

exports.getClimbPointsChartOverall = async function(query){

}

exports.getPickUpTypeChartOverall = async function(query){
    
}

exports.getSourceDestinationChartOverall = async function(query){
    
}

// exports.deleteTodo = async function(id){
    
//     // Delete the Todo
//     try{
//         var deleted = await ToDo.remove({_id: id})
//         if(deleted.result.n === 0){
//             throw Error("Todo Could not be deleted")
//         }
//         return deleted
//     }catch(e){
//         throw Error("Error Occured while Deleting the Todo")
//     }
// }