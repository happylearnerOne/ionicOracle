  //oradb.getConnection(function(err, connection){
  	/*
  	if(err){
  		console.log(functionName + ' getConnection: ' + err.message);
  		res.status(500).send(err.message);
  	} 
  	connection.execute(sqlStr, function(err, result){
  		if(err){
  			console.log("ins execute:" + err.message);
  			connection.release(function(err){
  				if(err){
  					console.log("ins execute release:" + err.message);
  				}  				
  			});
  		}
  		connection.commit(function(err){
  			if(err){
  				connection.release(function(err){
  					console.log("ins execute release:" + err.message);
  				});
  			}
  			console.log("ins commit complete!");
  			connection.release(function(err){
  				if(err){
  					console.log("ins commit release: " + err.message);
  				}
  				console.log("ins commit release complete! ");
  			});
  			res.status(204).send();
  		});
  	}); 	
*/

  	//save detail record	
  	/*
		AsyncLoop(
			signFlowEmp.length, 
			function(loop){
				SomeFunction(function(){  					  					
					var nowIndex = loop.nowIndex();
					var flowEmp = signFlowEmp[nowIndex];
					if(flowEmp != null){
						var getInsSignFlowIdStr = "BEGIN PROC_IBTKEYCOUNTER('HRTW_LEAVE_FLOW',1, :p_nextid, :p_maxid); END;";
						var mapArrayGetSignFlowId = {  // bind variables
  								p_nextid:{ dir: ora.BIND_OUT, type: ora.NUMBER, maxSize: 40 },
  								p_maxid: { dir: ora.BIND_OUT, type: ora.NUMBER, maxSize: 40 }
								};
						connection.execute(getInsSignFlowIdStr, mapArrayGetSignFlowId, function(err, result){
							if(err){
								console.log('get SignFlow Id execute: ' + err.message);
								connection.rollback(function(err){
									if(err){
										console.log('get SignFlow Id execute-rollback: ' + err.message);
									}
									connection.release(function(err){
										if(err){
											console.log('get SignFlow Id execute-release: ' + err.message);
										}
									});										
								});
								res.status(500).send(err.message);
      					return err;				  								
							}
							var nextId = result.outBinds.p_nextid;
							var insSqlStrSignFlow = "INSERT INTO HRTW_LEAVE_FLOW VALUES ( :p_id, :p_leave_emp_id, :p_emp_no, :p_flowlevel, :p_status, :p_crtclerk, sysdate, :p_modclerk, sysdate)";  							
							var mapArrayInsSignFlow = [nextId, _new.ID, flowEmp, flowEmp, nowIndex, (nowIndex == 1 ? "U" : null), flowEmp, _new.EMP_NO, _new.EMP_NO];
							console.log(mapArrayInsSignFlow);
							connection.execute(
								insSqlStrSignFlow, 
								mapArrayInsSignFlow, 
								outFormatObj, 
								function(err, result){
									if(err){  										
										console.log('insert leave_flow execute:' + err.message);
										console.log('insert leave_flow execute:' + insSqlStrSignFlow);
										connection.rollback(function(err){
											console.log("insert leave_flow rollback==>");
											if(err){
												console.log('insert leave_flow execute-rollback:' + err.message);
											}  		
											connection.release(function(err){
												if(err){
													console.log('insert leave_flow execute-release:' + err.message);
												}
											});									
										});
										res.status(500).send(err.message);
										return err;
									}
									loop.next();
								});
						});
					} else {
						loop.next();
					}
				});
			}, 
			function(){
				console.log("in asyncLoop callback");
				connection.commit(function(err){
					if(err){
						console.log(functionName + ' commit:' + err.message);
						connection.release(function(err){
							if(err){
								console.log(functionName + ' commit-release:' + err.message);
							}
						});
					}
					console.log(functionName + ' commit successful!');
					connection.release(function(err){
						if(err){
							console.log(functionName + ' release:' + err.message);
						}
					});
					res.status(204).send();
				});
			}
		);
		*/	

  	//save master record
  	/*
  	connection.execute(sqlStr, mapArray, outFormatObj, function(err, result){
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

  	});
*/
 // });