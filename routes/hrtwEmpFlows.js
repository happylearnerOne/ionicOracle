var express = require('express');
var router = express.Router();

var oradb = require('../lib/oradb.js');
var ora = oradb.oracledb();
var router = express.Router();
var outFormatObj = {outFormat: ora.OBJECT,maxRows:2001};

/* 取得我預設的簽核流程 */
router.get('/api/getMyLeaveSignFlow/:p_year/:p_employee', function(req, res) {
    getMyLeaveSignFlow(req, res);
});

function getMyLeaveSignFlow(req, res){
    var functionName = "getMyLeaveSignFlows";
    var p_employee = req.params.p_employee;
    var p_year = req.params.p_year;
    var sqlStr = "SELECT * FROM hrtw_emp_flows WHERE year = :p_year AND emp_no = :p_employee";
    var mapArray=[p_year, p_employee];	
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