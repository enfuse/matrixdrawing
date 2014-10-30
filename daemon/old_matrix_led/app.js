/**
 * Magic zone
 *
 */
var fs = require('fs');
if (!fs.existsSync('./config.js')) {
  console.log("* Error * \nCopy example.config.js to config.js and build your own config.");
  process.exit();
}
var config = require('./../config.js');

if (config.daemon)
  require('daemon')();

var Firebase = require('firebase');
var serialport = require("serialport"),	// include the serialport library
        SerialPort = serialport.SerialPort,	// make a local instance of it
        portName = process.argv[2],				// get the serial port name from the command line
        ledState = false;

var pixelDataRef = new Firebase(config.live_url);

// open the serial port. The portname comes from the command line:
var myPort = new SerialPort(config.serial_port, {
  baudRate: config.baud_rate,
  // add an option in the serial port object
  // so that you can keep track of whether or not the serial port is open:
  options: false,
  // look for return and newline at the end of each data packet:
  parser: serialport.parsers.readline("\r\n")
});

// called when the serial port opens:
myPort.on('open', function () {
  // set options.open so you can track the port statue:
  myPort.options.open = true;
  if (config.clog) console.log("-- Port open --");
});

// called when the serial port closes:
myPort.on('close', function () {
  // set options.open so you can track the port statue:
  myPort.options.open = false;
  if (config.clog) console.log("-- Port closed --");
});

// called when there's an error with the serial port:
myPort.on('error', function (error) {
  myPort.close();
  if (config.clog) console.log('there was an error with the serial port: ' + serial_port + ' --> ' + error);
});

// called when there's new incoming serial data:  
/*
 myPort.on('data', function (data) {
 // for debugging, you should see this in Terminal:
 console.log('data: ', data);
 });
 */
var drawPixel = function (snapshot) {
  console.log("!Draw!");
  var coords = snapshot.name().split(":");
  var r = hexToRgb(snapshot.val()).r;
  var g = hexToRgb(snapshot.val()).g;
  var b = hexToRgb(snapshot.val()).b;
  if (myPort.options.open) {
    myPort.write("\n" + coords[0]);
    myPort.write("\t" + coords[1]);
    //console.log(hexToRgb(snapshot.val()));
    myPort.write("\f" + r);
    myPort.write("\\" + g);
    myPort.write("\b" + b);
  }
  if (config.clog) console.log("Pixel:[" + coords[0] + "," + coords[1] + "] => rgb(" + r + ", " + g + ", " + b + ")");
};

var clearPixel = function (snapshot) {
  var coords = snapshot.name().split(":");
  if (myPort.options.open) {
    myPort.write("\n" + coords[0]);
    myPort.write("\t" + coords[1]);
    //console.log(hexToRgb(snapshot.val()).r);
    myPort.write("\f" + 0);
    myPort.write("\\" + 0);
    myPort.write("\b" + 0);
  }
};

pixelDataRef.on('child_added', drawPixel);
pixelDataRef.on('child_changed', drawPixel);
pixelDataRef.on('child_removed', clearPixel);

function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
