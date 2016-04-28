var winston = require('winston');
winston.emitErrs = true;

var logger = new winston.Logger({
    transports: [
        // new winston.transports.File({
        //     // level: 'info',
        //     filename: './logs/all-logs.log',
        //     handleExceptions: true,
        //     json: true,
        //     maxsize: 5242880, //5MB
        //     maxFiles: 5,
        //     colorize: false
        // })
		new (winston.transports.File)({
	      name: 'info',
	      filename: '../logs/info.log',
	      level: 'info'
	    }),
	    new (winston.transports.File)({
	      name: 'error',
	      filename: '../logs/error.log',
	      level: 'error'
	    })
    ],
    exitOnError: false
});

module.exports = logger;
