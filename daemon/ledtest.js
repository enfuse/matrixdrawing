/**
 * Magic zone
 *
 */

var serialport = require("serialport"),	// include the serialport library
        SerialPort = serialport.SerialPort,	// make a local instance of it
        portName = process.argv[2],				// get the serial port name from the command line
        ledState = false;


// open the serial port. The portname comes from the command line:
var serial = new SerialPort("/dev/ttyUSB0", {
  baudRate: 1000000,
  // add an option in the serial port object
  // so that you can keep track of whether or not the serial port is open:
  options: false,
  // look for return and newline at the end of each data packet:
  parser: serialport.parsers.readline("\r\n")
});

// called when the serial port opens:
serial.on('open', function () {
  // set options.open so you can track the port statue:
  serial.options.open = true;
  console.log("-- Port open --");
});

// called when the serial port closes:
serial.on('close', function () {
  // set options.open so you can track the port statue:
  serial.options.open = false;
  console.log("-- Port closed --");
});

// called when there's an error with the serial port:
serial.on('error', function (error) {
  serial.close();
  console.log('there was an error with the serial port: ' + serial_port + ' --> ' + error);
});

// called when there's new incoming serial data:  

 serial.on('data', function (data) {
 // for debugging, you should see this in Terminal:
 console.log('Si estas viendo esto, algo va mal:', data);
 });

var drawPixel = function (snapshot) {

  if (serial.options.open) {
    //console.log(hexToRgb(snapshot.val()));
    var buffer = new Buffer(10);

    buffer[0] = 1

    buffer[1] = 64
    buffer[2] = 0
    buffer[3] = 0

    buffer[4] = 0
    buffer[5] = 64
    buffer[6] = 0

    buffer[7] = 0
    buffer[8] = 0
    buffer[9] = 64
    /*serial.write("a");
    serial.write("a");
    serial.write("c");*/
    serial.write(buffer);

  }

};
setInterval(drawPixel, 100);
