/**
 * Magic zone
 *
 */
//Check if config file exists
var fs = require('fs');
if (!fs.existsSync('./config.js')) {
  console.log("* Error * \nCopy example.config.js to config.js and build your own config.");
  process.exit();
}
var config = require('./config.js');
var pic = require('./tools/warning.json');

//Check if this should work as a daemon
if (config.daemon) {
  require('daemon')();
}

var serialport = require("serialport"),	// include the serialport library
  SerialPort = serialport.SerialPort,	// make a local instance of it
  portName = process.argv[2],				// get the serial port name from the command line
  ledState = false;

var pixels = parseInt(config.rows * config.cols);
var bufferSize = parseInt((pixels * 3));
var buffer = new Buffer(bufferSize);

// open the serial port. The portname comes from the command line:
var serial = new SerialPort(config.serial_port, {
  baudRate: config.baud_rate,
  // add an option in the serial port object
  // so that you can keep track of whether or not the serial port is open:
  options: false,
  // look for return and newline at the end of each data packet:
  //parser: serialport.parsers.readline("\r\n")
});

// called when the serial port opens:
serial.on('open', function () {
  // set options.open so you can track the port statue:
  serial.options.open = true;
  if (config.clog) {
    console.log("-- Port open --");
  }
});

// called when there's an error with the serial port:
serial.on('error', function (error) {
  serial.close();
  if (config.clog) {
    console.log('there was an error with the serial port: ' + serial_port + ' --> ' + error);
  }
});


var init = function () {
  for(var i=0; i<=bufferSize; i++){
    buffer[i]=0;
  }
  console.log("Buffer size:" + bufferSize);
  for(var key in pic) {
console.log("Draw: " + key + " with: " + pic[key]);
    drawPixel(key, pic[key]);
  }
  timer = setInterval(sendPixels, 50);//1000ms/50 = 20fps
  //Just one Frame
//  sendPixels();
}

var sendPixels = function () {
  var initDraw = new Buffer(1);
  initDraw[0] = 1;
  serial.write(initDraw);
  serial.write(buffer);
  console.log(JSON.stringify(buffer));
}

var drawPixel = function (key, val) {
  var coords = key.split(":");
  var pos = coordsToPos(coords) * 3;
  var rgb = hexToRgb(val);
console.log(coords + " --> " + pos);
  buffer[pos] = rgb.g * config.br;
  buffer[pos + 1] = rgb.r * config.br;
  buffer[pos + 2] = rgb.b * config.br;
}

var coordsToPos = function (coords) {
console.log(config.cols);
console.log(parseInt((config.cols * parseInt(coords[1]))));
console.log(parseInt(coords[0]));
console.log();
  return parseInt(parseInt(config.cols) * parseInt(coords[1])) + parseInt(coords[0]);
}

var hexToRgb = function (hex) {
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



setTimeout(init, 500);
