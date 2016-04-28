var express = require('express');
var router = express.Router();

var oradb = require('../lib/oradb.js');
var ora = oradb.oracledb();
var router = express.Router();
var outFormatObj = {outFormat: ora.OBJECT,maxRows:2001};

/* 我所有的請假紀錄 */
router.get('/api/getMyLeaveList', function(req, res) {
    getMyLeaveList(req, res);
});

/* 依照狀態查詢我所有請假紀錄 */
router.get('/api/getMyLeaveListByType/:p_employee/:p_type', function(req, res){
	console.log("in router");
	getMyLeaveListByType(req, res);
});

/* 待我簽核的紀錄 */
router.get('/api/getNeedMeSignLeaveList/:p_employee',function(req, res){
	getNeedMeSignLeaveList(req, res);
});

/* 我曾簽核的紀錄 */
router.get('/api/getSignedLeaveList', function(req, res){
	getSignedLeaveList(req, res);
});

/* 將新的請假紀錄存檔 */
router.post('/api/saveNewLeave', function(req, res){
	saveNewLeave(req, res);
});


/* 取得新的假單ID */
router.get('/api/getNextLeaveId', function(req, res){
	getNextLeaveId(req, res);
});

/* 取得假單簽核流程的4個ID */
router.get('/api/getNextFlowId', function(req, res){
	getNextFlowId(req, res);
});


function getMyLeaveList(req, res){
  var functionName = "getMyLeaveList";
  var p_employee = req.body.userid;    
  var sqlStr = "SELECT * FROM menu_account WHERE user_no = :p_employee AND user_password = :p_user_password";
  var mapArray=[p_employee,p_user_password];	
  oradb.getConnection ();	
}

function getMyLeaveListByType(req, res){
  var functionName = "getMyLeaveListByType";
  var p_employee = req.params.p_employee;    
  var p_type = req.params.p_type;
  console.log("employee=" + p_employee);
  console.log("type=" + p_type);
  var sqlStr = "SELECT a.*, DECODE(a.STATUS, 'U', '簽核中', 'Y', '簽核通過', 'X', '註銷', '') AS STATUS_NAME, b.EMP_NAME, e.EMP_NAME AS DEPUTY_EMP_NAME, c.ASKFORLEAVEREASON_NAME, d.*, DECODE(d.SIGN_STATUS, 'U','簽核中', 'Y', '簽核通過', 'N', '簽核不通過', '') AS SIGN_STATUS_NAME " +               
               "FROM hrtw_leave_emp a, hrpa_emp b, hrtw_askforleavereason c, " + 
               "(SELECT x.LEAVE_EMP_ID, x.EMP_NO AS SIGN_EMP_NO, x.FLOWLEVEL AS SIGN_FLOW_LEVEL, x.STATUS AS SIGN_STATUS, y.EMP_NAME AS SIGN_EMP_NAME FROM hrtw_leave_flow x, hrpa_emp y WHERE x.emp_no = y.emp_no AND x.id IN (SELECT MAX(id) FROM hrtw_leave_flow WHERE leave_emp_id = x.leave_emp_id AND status IN ('U','Y'))) d, " + 
               "hrpa_emp e " + 
               "WHERE a.emp_no = :p_employee AND a.status = :p_type AND a.emp_no = b.emp_no " + 
               "AND a.leavereason_no = c.askforleavereason_no AND a.id = d.leave_emp_id AND a.deputy = e.emp_no ";                

  var mapArray=[p_employee,p_type];	
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
        	if(err){
        		console.log(functionName + ' execute: ' + err.message);
        		connection.release(function(err){
        			if(err){
        				console.log(functionName + ' execute-release: ' + err.message);
        			}        			
        		});
        		res.status(500).send(err.message);
            return err;
        	}
        	connection.release(function(err){
        		if(err){
        			console.log(functionName + ' release: ' + err.message);
        		}
        	});

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

function getNeedMeSignLeaveList(req, res){
  var functionName = "getNeedMeSignLeaveList";
  var p_employee = req.params.p_employee;    
  var sqlStr = "SELECT m.*, h.emp_name FROM hrtw_leave_emp m, hrpa_emp h WHERE m.emp_no = h.emp_no AND exists (SELECT 'x' FROM hrtw_leave_flow WHERE leave_emp_id = m.id AND emp_no = :p_employee AND status = 'U')";
  var mapArray=[p_employee];	
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
  		{outFormat: ora.OBJECT,maxRows:2001}, 
  		function(err, result){
  			if(err){
  				console.log(functionName + ' execute: ' + err.message);
  				connection.release(function(err){
  					if(err){
  						console.log(functionName + ' execute-release: ' + err.message);
  					}
  				});
  				res.status(500).send(err.message);
          return err;
  			}
  			connection.release(function(err){
  				if(err){
  					console.log(functionName + ' release: ' + err.message);
  				}
  			});

  			if(result.rows.length > 0){
  				console.log("ora result=" + result);
         	res.send(result.rows);  		
  			} else {
  				console.log("rows <= 0");
          res.status(409).send();  
  			}
  		});
  });		
}

function getSignedLeaveList(req, res){}

function saveNewLeave(req, res){
  var functionName = "saveNewLeave";
  var _new = req.body; 
  console.log(req.body); 
  var signFlowEmp=[_new.DEPUTY, _new.MANAGERL1, _new.MANAGERL2, _new.HR];  
  var sqlStrAry = [];
  var sqlStr = "INSERT INTO HRTW_LEAVE_EMP VALUES (" 
  						 + _new.ID + ", '" + _new.EMP_NO + "', '" + _new.LEAVEREASON_NO + "', sysdate, " 
  						 + "to_date('" + _new.SDATE + "', 'YYYY-MM-DD'), '" + _new.SHOUR + "', to_date('" + _new.EDATE + "', 'YYYY-MM-DD'), '" + _new.EHOUR + "'," 
  						 + _new.TOTAL_DAY + ", " + _new.TOTAL_HOUR + ", '" + _new.REASON + "', '" + _new.STATUS + "', "
  						 + _new.FLOW_ID + ", '" + _new.DEPUTY + "', '" + _new.CRTCLERK + "', sysdate, '" + _new.MODCLERK + "', sysdate)";
	console.log(sqlStr);
	sqlStrAry.push(sqlStr);
	for(var i=0; i<4; i++){
		var newNextFlowId = _new.NEXTFLOWID + i;
		console.log("the signFlowEmp = " + signFlowEmp[i]);
		if(signFlowEmp[i] != null){
			var _level = i + 1;
			sqlStr = "INSERT INTO HRTW_LEAVE_FLOW VALUES (" 
							 + newNextFlowId + ", " + _new.ID + ", '" + signFlowEmp[i] + "', " + _level + ", " 
							 + (i== 0 ? "'U'" : null) + ", '" + _new.CRTCLERK + "', SYSDATE, '" + _new.MODCLERK + "', SYSDATE)";
			console.log(sqlStr);
			sqlStrAry.push(sqlStr);
		}		
	}
	//console.log(sqlStrAry);
	oradb.getConnection(function(err, connection){
		console.log(functionName + ' getConnection!! ');
		if(err){
			console.log(functionName + ' getConnection: ' + err.message);
  		res.status(500).send(err.message);
		}
		for(var i=0; i<sqlStrAry.length;i++){
			console.log("in execute for loop, " + i);
			console.log(sqlStrAry[i]);
			connection.execute(
				sqlStrAry[i], 
				function(err, result){
					if(err){						
						console.log(functionName + ' execute: ' + err.message);
						console.log(sqlStrAry[i]);
						connection.release(function(err){
							if(err){
								console.log(functionName + ' execute-release: ' + err.message);																
							}
						});
						res.status(500).send(err.message);
						return err;
					}							
				}
			);

			if(i == (sqlStrAry.length - 1)){
				console.log("commit here");
				
				connection.commit(function(err){
					console.log("in commit");
					if(err){
						console.log(functionName + ' commit: ' + err.message);
						res.status(500).send(err.message);
						return err;
					}
					connection.release(function(err){
						if(err){
							console.log(functionName + ' commit-release: ' + err.message);																					
						}
					});
					console.log(functionName + ' commit successful! ');
					res.status(200).send();
				});				

			}		
		}
	});	
}

/*

*/

function getNextLeaveId(req, res){
	var functionName = "getNextLeaveId";
	var sqlStr = "BEGIN PROC_IBTKEYCOUNTER('HRTW_LEAVE_EMP',1, :p_nextid, :p_maxid); END;";
	var mapArray = {  // bind variables
    		p_nextid:{ dir: ora.BIND_OUT, type: ora.NUMBER, maxSize: 40 },
    		p_maxid: { dir: ora.BIND_OUT, type: ora.NUMBER, maxSize: 40 }
  		};
	oradb.getConnection(function(err, connection){
		if(err){
  		console.log(functionName + ' getConnection: ' + err.message);
      //logger.error('GetMenuAccount getConnection: ' + err.message);
      res.status(500).send(err.message);
      return err;
		}
		connection.execute(sqlStr, mapArray, function(err, result){
			if(err){
				console.log(functionName + ' execute: ' + err.message);
				connection.release(function(err){
					console.log(functionName + ' execute-release: ' + err.message);
				});
  			res.status(500).send(err.message);
        return err;				
			}
			connection.release(function(err){
				if(err){
					console.log(functionName + ' release: ' + err.message);					
				}
			});

			
			if(result.outBinds != null){
				console.log("ora result=" + result);
       	res.send(result.outBinds);  		
			} else {
				console.log("rows <= 0");
        res.status(409).send();  
			}
			
			
		});
	});
}

function getNextFlowId(req, res){
	var functionName = "getNextFlowId";
	var sqlStr = "BEGIN PROC_IBTKEYCOUNTER('HRTW_LEAVE_FLOW',4, :p_nextid, :p_maxid); END;";
	var mapArray = {  // bind variables
    		p_nextid:{ dir: ora.BIND_OUT, type: ora.NUMBER, maxSize: 40 },
    		p_maxid: { dir: ora.BIND_OUT, type: ora.NUMBER, maxSize: 40 }
  		};
	oradb.getConnection(function(err, connection){
		if(err){
  		console.log(functionName + ' getConnection: ' + err.message);
      //logger.error('GetMenuAccount getConnection: ' + err.message);
      res.status(500).send(err.message);
      return err;
		}
		connection.execute(sqlStr, mapArray, function(err, result){
			if(err){
				console.log(functionName + ' execute: ' + err.message);
				connection.release(function(err){
					console.log(functionName + ' execute-release: ' + err.message);
				});
  			res.status(500).send(err.message);
        return err;				
			}
			connection.release(function(err){
				if(err){
					console.log(functionName + ' release: ' + err.message);					
				}
			});
			
			if(result.outBinds != null){
				console.log("ora result=" + result);
       	res.send(result.outBinds);  		
			} else {
				console.log("rows <= 0");
        res.status(409).send();  
			}						
		});
	});
}

function AsyncLoop(iterations, func, callback) {    
    var index = 0;
    var done = false;
    var loop = {
    		nowIndex: function(){
    			return index;
    		},
        next: function() {
            if (done) {
                return;
            }

            if (index < iterations) {
                index++;
                func(loop);

            } else {
                done = true;
                callback();
            }
        },
        
        iteration: function() {
            return index - 1;
        },

        break: function() {
            done = true;
            callback(loop);
        }
    };
    loop.next();
    return loop;
}

function SomeFunction(callback) {    
    callback();
}
module.exports = router;