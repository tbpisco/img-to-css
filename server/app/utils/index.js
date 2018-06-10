var utils = {};

var fs = require('fs');

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


utils.createScssFile = function(data){
    fs.writeFile('pixel.scss', data, function (err) {
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
  
    $squareSize: ${data.quantity}px;
  
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