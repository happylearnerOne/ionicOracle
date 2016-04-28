var oradb = require('./oradb.js');
var oracledb = oradb.oracledb();
var Q= require('q');
var logger = require("./logger");
var callBackModules=require("./callBackModules");
var queryReservationMaxRows=2001;
function GetDataFromDb(sqlStr){
	var deferred = Q.defer();    
    oradb.getConnection (
        function(err, connection) {
            var isConnErr=callBackModules.ErrCallBack(err,'getConnection()');
            if ( !isConnErr ){
            	connection.execute(
            		sqlStr, 
	                [], 
	                {outFormat: oracledb.OBJECT,maxRows:queryReservationMaxRows},
	                function(err, result) {
	                    var isErr=callBackModules.ErrCallBack(err,'GetDataFromDb()');
	                    isErr=DbRelease(connection);	                    
	                    if( !isErr ){
	                    	deferred.resolve(result.rows);
	                    }else{	                    	
	                    	deferred.reject(new Error(err));
	                    };	                  
	                }
	            );
	        }else{	        	
        		deferred.reject(new Error(err));
        	}  
        }
    );
    return deferred.promise;
}

function GetDataFromDbMap(sqlStr,mapArray){
	var deferred = Q.defer();    	
    oradb.getConnection (
        function(err, connection) {
            var isConnErr=callBackModules.ErrCallBack(err,'getConnection()');
            if ( !isConnErr ){
            	connection.execute(
            		sqlStr, 
	                mapArray, 
	                {outFormat: oracledb.OBJECT,maxRows:queryReservationMaxRows},
	                function(err, result) {
	                    var isErr=callBackModules.ErrCallBack(err,'GetDataFromDbMap()');
	                    isErr=DbRelease(connection);
	                    if( !isErr ){
	                    	deferred.resolve(result.rows);
	                    }else{
	                    	deferred.reject(new Error(err));
	                    };	                  
	                }
	            );
	        }else{
        		deferred.reject(new Error(err));
        	}  
        }
    );
    return deferred.promise;
}

function HttpDbRelease(res,connection){
	connection.release(
	    function(err)
	    {
	        if (err) {
	        	console.error('oracledb DbRelease Error: ' + err.message);
	        	logger.error('oracledb DbRelease Error'+err);
				res.status(500).send();
				res.end();
				return true;
	        }
	    }
    );
    return false;
}

function DbRelease(connection){
	connection.release(
	    function(err)
	    {
	        if (err) {
	        	logger.error('oracledb DbRelease Error'+err);
	        	console.error(' release() callback: ' + err.message);				
				return true;
	        }
	    }
    );
    return false;
}

function CheckConcurrent(newDateTime,oldDateTime){	
	var data=replaceDateTime(newDateTime);
	var newModDate=new Date(data).toString();
	var oldModDate=new Date(oldDateTime).toString();	
	if( newModDate != oldModDate ){
		return false;
	}else{
		return true;
	}
}
function replaceDateTime(date){
	return date.replace('T',' ');
}
/* release area */
exports.GetDataFromDb=GetDataFromDb;
exports.GetDataFromDbMap=GetDataFromDbMap;
exports.DbRelease=DbRelease;
exports.HttpDbRelease=HttpDbRelease;
exports.replaceDateTime=replaceDateTime;
exports.CheckConcurrent=CheckConcurrent;
exports.queryReservationMaxRows=queryReservationMaxRows;
