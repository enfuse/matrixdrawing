var fs = require('fs'),
 PNG = require('pngjs').PNG,
 jf = require('jsonfile'),
 fb = require('firebase'),
 easyimg = require('easyimage'),
 C = require('c0lor');

var fbref = new fb("https://pixled.firebaseio.com/");

var imagesPath = 'images/';
var jsonPath = 'json/';
 fs.readdir(imagesPath, processFiles);

function processFiles(err, files){	
	for(i=0;i<files.length;i++){
		console.log("Procesando " + files[i]);		
		convertToJson(files[i]);
	}
}

function convertToJson(fileName){
	easyimg.info(imagesPath + fileName).then(
	  function(file) {
	    if(file.width != 16 || file.height != 16 || file.type != 'PNG' || file.depth != '8'){
	    	easyimg.resize({
			     src:imagesPath + fileName, dst: imagesPath + fileName + ".PNG",
			     width:16, height:16
			  });
	    }
	  }, function (err) {
	    console.log(err);
	  }
	);

	/*
	var out = {};	
	fs.createReadStream(imagesPath + fileName)
	  .pipe(new PNG({
	      filterType: 4
	  }))
	  .on('parsed', function() {

	    for (var y = 0; y < this.height; y++) {
	        for (var x = 0; x < this.width; x++) {
	            var idx = (this.width * y + x) << 2;
	            var color = C.RGB(this.data[idx,] this.data[idx+1], this.data[idx+2]);	
	            var hex = color.hex();
				out[x+":"+y] = hex;
	        }
	    }
	    
	    var baseName = fileName.replace(/\.[^/.]+$/, "");
		var file = jsonPath + baseName + '.json';

		var artworks = fbref.child("artworks");
		var child = artworks.child(baseName);

		child.set( out , function(error) {
		  if (error) {
		    console.log("Data could not be saved." + error);
		  } else {
		    console.log("Data saved successfully.");
		  }
		});




		jf.writeFile(file, out, function(err) {
		  if(String(null) === "null"){
		  	console.log(imagesPath + fileName + " convertido a " + file);
		  }else{
		  	console.log(err)
		  }
		  	
		})

	});*/
}

function resize(file){

}

function convert(file){

}