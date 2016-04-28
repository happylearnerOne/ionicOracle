var express = require('express');
var router = express.Router();

var oradb = require('../lib/oradb.js');
var ora = oradb.oracledb();
var router = express.Router();
var outFormatObj = {outFormat: ora.OBJECT,maxRows:2001};

router.get('/api/allServingEmps', function(req, res) {
    allServingEmps(req, res);
});

function allServingEmps(req, res){
    var functionName = "allServingEmps";
    var sqlStr = "SELECT * FROM hrpa_emp WHERE situation = 'P'";    
    var mapArray=[];	
    oradb.getConnection (function(err, connection){
    	if(err){
    		console.log(functionName + ' getConnection: ' + err.message);
        //logger.error('GetMenuAccount getConnection: ' + err.message);
        res.status(500).send(err.message);
        return err;
    	}
    	connection.execute(
    		sqlStr, 
    		mapArray,
    		outFormatObj,
    		function(err, result){
    			if(err){
    				console.log(functionName + ' execute:' + err.message);
    				connection.release(function(err){
    					if(err){
    						console.log(functionName + ' execute-release:' + err.message);
    					}
    				});
    				res.status(500).send(err.message);
    				return err;
    			}
    			connection.release(function(err){
    				if(err){
    					console.log(functionName + ' release:' + err.message);
    				}
    			});
    			if(result.rows.length > 0){
    				res.send(result.rows);  	
    			} else {
    				res.status(409).send();  
    			}
    		}
    	);
    });
}

module.exports = router;