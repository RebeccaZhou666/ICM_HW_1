// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Example 16-6: Drawing a grid of squares

// Size of each cell in the grid, ratio of window size to video size
// 40 * 16 = 640
// 30 * 16 = 480
var videoScale = 1;
let faceapi;
let video;
let detections;
let c1 = [255,0,0], c2 = [71,228,120];


// Number of columns and rows in our system
var cols, rows;

function setup() {
  createCanvas(640, 480);

  // Initialize columns and rows
  cols = width/videoScale;
  rows = height/videoScale;

  pixelDensity(1);
  video = createCapture(VIDEO);
  video.size(cols, rows);
  video.hide();
  faceapi = ml5.faceApi(video, detection_options, modelReady)
}



function draw() {
   
}

const detection_options = {
    withLandmarks: true,
    withDescriptors: false,
}

function modelReady() {
    console.log('ready!')
    console.log(faceapi)
    faceapi.detect(gotResults)

}


function gotResults(err, result) {
    if (err) {
        console.log(err)
        return
    }
    // console.log(result)
    detections = result;

    // background(220);
    //background(255);
      background(255,215,57);

    // image(video, 0,0, width, height)
    if (detections) {
        if (detections.length > 0) {
            
            drawLandmarks(detections)
        }

    }
      
    video.loadPixels();
    for(var i = 0; i < cols; i++){
      for (var j = 0; j < rows; j++){
        var loc = ((cols - i - 1) + j * cols) * 4;
        var r = video.pixels[loc   ]; 
        var g = video.pixels[loc + 1];
        var b = video.pixels[loc + 2];
        var sz = (r+g+b)/3;
        if (sz < 80){
          fill(0);
          noStroke();
        var x = i*videoScale;
        var y = j*videoScale;
        rect(width-x, y, videoScale, videoScale);
        }
      }
    }
      
    faceapi.detect(gotResults)
      
    
}

  
function drawLandmarks(detections){
    noFill();
    stroke(161, 95, 251)
    strokeWeight(2)

    for(let i = 0; i < detections.length; i++){
        const mouth = detections[i].parts.mouth; 
       // const nose = detections[i].parts.nose;
        const leftEye = detections[i].parts.leftEye;
        const rightEye = detections[i].parts.rightEye;

        drawPart(mouth, true,c1);
        // drawPart(nose, true,c3);
        drawPart(leftEye, true,c2);
        // drawPart(leftEyeBrow, true,c2);
        drawPart(rightEye, true,c2);
        // drawPart(rightEyeBrow, true,c2);

    }

}

function drawPart(feature, closed,color){
    
    beginShape();
    for(let i = 0; i < feature.length; i++){
        const x = feature[i]._x
        const y = feature[i]._y
        noStroke();
        vertex(x, y);
    }

    fill(color);
    
    if(closed === true){
        endShape(CLOSE);
    } else {
        endShape();
    }
    
}

