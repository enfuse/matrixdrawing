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

var source = 168;
var step = 1;

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
  options: false
});

// called when the serial port opens:
serial.on('open', function () {
  // set options.open so you can track the port statue:
  serial.options.open = true;
  if (config.clog) {
    console.log("-- Port open --");
  }
});

var init = function () {
  for(var i=0; i<=bufferSize; i++){
    buffer[i]=0;
  }
  timer = setInterval(sendPixels, 50);//1000ms/50 = 20fps
}

var sendPixels = function () {
  for(var i=0; i<=bufferSize; i++){
    buffer[i]=0;
  }
  switch(step) {
    case 1:
      buffer[source *3] = 255;
      buffer[(source * 3) + 1] = 255;
      buffer[(source * 3) + 2] = 255;
      break;
    case 2:
      var calc = source +1;
      buffer[calc *3] = 255;
      buffer[(calc * 3) + 1] = 255;
      buffer[(calc * 3) + 2] = 255;
      break;
    case 3:
      var calc = source +16;
      buffer[calc *3] = 255;
      buffer[(calc * 3) + 1] = 255;
      buffer[(calc * 3) + 2] = 255;
      break;
    case 4:
      var calc = source +17;
      step = 1;
      buffer[calc *3] = 255;
      buffer[(calc * 3) + 1] = 255;
      buffer[(calc * 3) + 2] = 255;
      break;
  }

  var initDraw = new Buffer(1);
  initDraw[0] = 1;
  serial.write(initDraw);
  serial.write(buffer);
  //console.log(JSON.stringify(buffer));
}

var drawPixel = function (key, val) {
  var coords = key().split(":");
  var pos = coordsToPos(coords) * 3;
  var rgb = hexToRgb(val);
  buffer[pos] = rgb.g * config.br;
  buffer[pos + 1] = rgb.r * config.br;
  buffer[pos + 2] = rgb.b * config.br;
}

var coordsToPos = function (coords) {
  return parseInt((config.cols * coords[1])) + parseInt(coords[0]);
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