/**
 * Magic zone
 *
 */

var cadena = require('./artworks.json');

 //Check if config file exists
var fs = require('fs');


//Check if this should work as a daemon

var Firebase = require('firebase');

var pixelDataRef = new Firebase("https://pixled.firebaseio.com/live");
var pixels = parseInt(16 * 16);
var bufferSize = parseInt((pixels*3));
var buffer = new Buffer(bufferSize);

// open the serial port. The portname comes from the command line:


var init = function (){
	console.log(cadena.keys());
	/*cadena.presets.keys(o).forEach(function(key) {
	    console.log(key);
	});*/
}

var sendPixels = function(){
	var initDraw = new Buffer(1);
	initDraw[0] = 1;
	serial.write(initDraw);
	serial.write(buffer);
	//console.log(JSON.stringify(buffer));
}

var clearPixels = function(snapshot){
	for(i=0;i<bufferSize;i++){
		buffer[i]=0; // reset
	}
}

var drawPixel = function(snapshot){
	var coords = snapshot.name().split(":");
	var pos = coordsToPos(coords) * 3;
	var rgb = hexToRgb(snapshot.val());		
	buffer[pos] = rgb.g;
	buffer[pos + 1 ] = rgb.r;
	buffer[pos + 2 ] = rgb.b;
}

var coordsToPos = function(coords){
	return parseInt((config.cols * coords[1])) + parseInt(coords[0]);
}

var hexToRgb = function(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

setTimeout(init, 2000);