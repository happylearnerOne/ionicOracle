var express = require('express');
var router = express.Router();

var oradb = require('../lib/oradb.js');
var ora = oradb.oracledb();
var router = express.Router();



router.post('/api/menuAccount', function(req, res) {
    userLogin(req, res);
});

function userLogin(req, res){
    var functionName = "userLogin";
    var p_employee = req.body.userid;
    var p_user_password = req.body.password;
    var sqlStr = "SELECT * FROM menu_account WHERE user_no = :p_employee AND user_password = :p_user_password";
    var mapArray=[p_employee,p_user_password];	
    oradb.getConnection (
    	function(err, connection){
            if( err ){
                console.log(functionName + ' getConnection: ' + err.message);
                //logger.error('GetMenuAccount getConnection: ' + err.message);
                res.status(500).send(err.message);
                return err;
            };       

            connection.execute(
                sqlStr, 
                mapArray, 
                {outFormat: ora.OBJECT,maxRows:2001},
                function(err, result){
                    if( err ){
                        console.log(functionName + ' execute: ' + err.message);
                        //logger.error('GetMenuAccount execute: ' + err.message);
                        connection.release(
                            function(err){
                                if( err ){
                                    console.log(functionName + ' release1: ' + err.message);
                                    //logger.error('GetMenuAccount release: ' + err.message);
                                };
                            }
                        );
                        res.status(500).send(err.message);
                        return err;
                    };     
                    connection.release(
                        function(err){
                            if( err ){
                                console.log(functionName + ' release2: ' + err.message);
                                //logger.error(functionName + ' release2: ' + err.message);
                            };
                        }
                    );                   
                        console.log("123456");      
                    if(result.rows.length>0){
                    	console.log("ora result=" + result);
                    	res.send(result.rows);  		
                    }
                    else {
                        console.log("rows <= 0");
                    	res.status(409).send();  
                    }
                    
                }
            );
    	}
    );
}

module.exports = router;