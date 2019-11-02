// Andy-Warhol Portrait
// Using ml5.js (face api and bodypix)
// Rebecca Zhou, Nov.1, 2019


let video;
// global variables for bodypix.
let bodypix;
let segment;
/// global variables for faceapi
var videoScale = 1;
let faceapi;
let detections;
let c1 = [255,0,0], c2 = [71,228,120]; // color for mouth(c1) and eyes(c2)
var cols, rows;


// ----------------- before setup (parameter settings etc) --------

// options for bodypix
const options = {
  "outputStride": 16, // 8, 16, or 32, default is 16
  "segmentationThreshold": 0.7, // 0 - 1, defaults to 0.5
 };

// options for faceapi
const detection_options = {
    withLandmarks: true,
    withDescriptors: false,
}

// options for bodypix. palette. change all parts to pink and default background is white
function createRGBPalette() {
    colorMode(RGB);
    options.palette = bodypix.config.palette;
    Object.keys(options.palette).forEach(part => {
        const c = [255,213,213];
        options.palette[part].color = c;
    });
}

// indicate model ready.
function modelReadyBody() {
  console.log('model ready');
  createRGBPalette();
  // bodypix.segmentWithParts(options, gotResults);
}

function modelReadyFace() {
    console.log('face ready!')
}

// ----------setup -----------------

function setup() {
  createCanvas(600, 400);
  video = createCapture(VIDEO);
  video.size(600, 400);

  cols = width/videoScale;
  rows = height/videoScale;

  pixelDensity(1);

  video.hide();
  // create objects for bodypix and faceapi
  bodypix = ml5.bodyPix(video, modelReadyBody);
  faceapi = ml5.faceApi(video, detection_options, modelReadyFace)
  // execute function: create bodypix->faceapi->backContour recurrent 
  bodypix.segmentWithParts(video,gotResults);

}
// -------------- Loop function--------------

function gotResults(err,results){
	if (err) {
        console.log(err)
        return
    }
    //store result in segment and call faceapi
    if (results) {
    	segment = results.image;
   		faceapi.detect(gotResultsFace);
    }

}

function gotResultsFace(err,result){
	if (err) {
        console.log(err)
        return
    }

    if (result) {
      //store face result
    	detections = result;
      // draw bodypix layer
      drawBackground();
      //draw faceapi layer
    	if (detections.length > 0) {
            drawLandmarks(detections) 
      }
      //draw black contour layer
      drawBlack();
      //call body pix again.
      bodypix.segmentWithParts(video,gotResults);
  }
}

function drawLandmarks(detections){

    for(let i = 0; i < detections.length; i++){
        const mouth = detections[i].parts.mouth; 
        const leftEye = detections[i].parts.leftEye;
        const rightEye = detections[i].parts.rightEye;

        drawPart(mouth,c1);
        drawPart(leftEye,c2);
        drawPart(rightEye,c2);
    }

}

function drawPart(feature,color){

    beginShape();
    for(let i = 0; i < feature.length; i++){
        const x = feature[i]._x
        const y = feature[i]._y
        noStroke();
        vertex(x, y);
    }
    fill(color);
    endShape(CLOSE);
}

function drawBlack(){
	video.loadPixels();
    for(var i = 0; i < cols; i++){
      for (var j = 0; j < rows; j++){
        var loc = ((cols - i - 1) + j * cols) * 4;
        var r = video.pixels[loc   ]; 
        var g = video.pixels[loc + 1];
        var b = video.pixels[loc + 2];
        var sz = (r+g+b)/3;
        if (sz < 100){
          fill(0);
          noStroke();
          var x = i*videoScale;
          var y = j*videoScale;
          rect(width-x, y, videoScale, videoScale);
        }
      }
    }
}

function drawBackground(){
  segment.loadPixels();
    for(var i = 0; i < cols; i++){
      for (var j = 0; j < rows; j++){
        var loc = ((cols - i - 1) + j * cols) * 4;
        var r = segment.pixels[loc   ]; 
        var g = segment.pixels[loc + 1];
        var b = segment.pixels[loc + 2];
        var sz = (r+g+b)/3;
        if (sz > 250){
          fill(94,223,255);
        }else{
          fill(255,213,213);
        }
        noStroke();
        
        var x = i*videoScale;
        var y = j*videoScale;
        rect(width-x, y, videoScale, videoScale);
        }
      }
    
}