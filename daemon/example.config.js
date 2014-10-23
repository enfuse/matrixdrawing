/**
 * Config zone
 * 
 * Copy this file to config.js and build your own configuration
 */
module.exports = {
	//Stores live drawing data 
	live_url : 'https://foo.firebaseio.com/live',   	
  	rows : 16,
  	cols : 16,
	//Run as daemon
	daemon : false,

	clog : true,
	
	//Serial port config
	serial_port : "/dev/ttyUSB0",
	baud_rate : '57600'
};