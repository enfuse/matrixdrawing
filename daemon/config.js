/**
 * Config zone
 * 
 * Copy this file to config.js and build your own configuration
 */
module.exports = {
	//Stores live drawing data 
	live_url : 'https://pixled.firebaseio.com/live',
  	rows : 16,
  	cols : 16,

	//Run as daemon
	daemon : false,

	verbose : true,
	
	//Serial port config
	serial_port : "/dev/ttyUSB0",
	baud_rate : '1000000'
};