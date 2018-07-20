var utils = {};

var fs = require('fs');
const path = require('path');
var rimraf = require('rimraf');

utils.cleanFolder = function(folder, age){
    var uploadsDir = folder;

    console.log('clean folder');

    files = fs.readdirSync(uploadsDir)
        files.forEach(function(file) {
            console.log(file);
            fs.stat(path.join(uploadsDir, file), function(err, stat) {
                console.log(file)
                var endTime, now;
                if (err) {
                    return console.error(err);
                }
                now = new Date().getTime();
                endTime = new Date(stat.ctime).getTime() + age * 1000;
                if (now > endTime) {
                    return rimraf(path.join(uploadsDir, file), function(err) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log('successfully deleted');
                    });
                }
            });
        });
}

utils.pixelToColor = function(pixelsArray, width, height, quantity){
    let total = width*4*height;
    var array = [];
    for(let i = 0; i< total; i+=4){
        array.push(`rgba(${pixelsArray[i]},${pixelsArray[i+1]},${pixelsArray[i+2]},${pixelsArray[i+3]})`);
    }
    var arrayLines = [];
    var line = "";
    for(let k = 0; k< array.length; k+=width){
        line = `line-${k/width}: `;
        for(let l= 0; l< width; l++){
            if(array[k+l] == "rgba(0,0,0,0)"){
                line+= "0 ";
            } else {
                line += array[k+l] + " ";
            }
        }
        arrayLines.push(line);
    }

    return {lines: arrayLines.join(","), w: width, h: height, quantity};
};


utils.createScssFile = function(data, filename){
    fs.writeFile(path.join(__dirname, '/../../../server/public/uploads', filename + '.scss'), data, function (err) {
        if (err) return console.log(err);
        console.log('pixel.scss created');
    });
};

utils.exportScss = function(data){
return `
    
@mixin box-shadow($params...) {
    -webkit-box-shadow: $params;
    -moz-box-shadow: $params;
    box-shadow: $params;
}
  
$squareSize: ${data.quantity * 5 }px;
  
@function generate-pixelart($squareSize, $colorpixelmap){
    
    $boxshadowvalues: null;
    $colorIndex: 0;
    $lineIndex: 0;
  
    @each $shadow-key, $shadow-value in $colorpixelmap {
        @each $color-key, $color-value in $shadow-value {	  	
            @if $color-key != 0 {
                $boxshadowvalues: $boxshadowvalues, $colorIndex*$squareSize $lineIndex*$squareSize 0 $color-key;
            } 
            $colorIndex: $colorIndex + 1;
        }
        $colorIndex: 0;
        $lineIndex: $lineIndex + 1;
    }
  
    @return $boxshadowvalues;
}
  
$image: (
    ${data.lines}
);
  
.holder{
    width: $squareSize*${data.w};
    height: $squareSize*${data.h};
    margin: 0 auto;
}
  
.image-css{
    width: $squareSize;
    height: $squareSize;
    background-color: rgba(0,0,0,0.0);
    @include box-shadow(generate-pixelart($squareSize,$image))
}
`
};

module.exports = utils;