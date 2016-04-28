var logger = require("./logger");
function HttpErrCallBack(res,err,functionName){	
	if (err) {
		console.error(functionName+' callback: ' + err.message);
		logger.error(functionName+' callback: ' + err.message);
		res.status(500).send();
		res.end();
		return true;
	}
	return false;
}

function ErrCallBack(err,functionName){
	if (err) {
		console.error(functionName+' callback: ' + err.message);
		logger.error(functionName+' callback: ' + err.message);
		return true;
	};
	return false;
}
/* exports area */
exports.HttpErrCallBack=HttpErrCallBack;
exports.ErrCallBack=ErrCallBack;