var oracledb = require('oracledb'); //把oracledb模組載入
var dbConfig = require('./dbconfig.js');

var connectData = {
    user          : dbConfig.user,
    password      : dbConfig.password,
    connectString : dbConfig.connectString,
    poolMax       : dbConfig.poolMax,
    poolMin       : dbConfig.poolMin,
    poolIncrement : dbConfig.poolIncrement,
    poolTimeout   : dbConfig.poolTimeout
}

console.log("conn data");
console.log(connectData);
 
//var conn="" 建立 Oracle DB 連線;
var conn_pool;
oracledb.createPool(connectData, function(err, pool) {    
    if (err) {
      console.error('ERROR: ', new Date(), 'createPool() callback: ' + err.message);
      return;
    }
    console.log(new Date(),'connection pool was created!');
    conn_pool = pool;
});

exports.getConnection = function(callback) {
    conn_pool.getConnection(function(err, connection) {
        if (err) {
            console.log(new Date(), 'ERROR: Cannot get a connection: ', err);
            return callback(err);
        }

        // If pool is defined - show connectionsOpen and connectionsInUse
        // if (typeof conn_pool !== "undefined") {
        //     console.log(new Date(),'INFO: Connections open: ' + conn_pool.connectionsOpen);
        //     console.log(new Date(),'INFO: Connections in use: ' + conn_pool.connectionsInUse);
        // }
        callback(err, connection);
    });
};

exports.oracledb = function() {
    return oracledb;
};