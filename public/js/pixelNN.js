
let video; 
let pixelBrain;
let ready = false;
let videoSize = 50;
let greet = '';

function setup() {

    createCanvas(400, 400);
    video = createCapture(VIDEO,videoReady);
    video.size(videoSize,videoSize);
    video.hide();
    pixelDensity(1);


    let options = {
        inputs: videoSize * videoSize * 3,
        outputs: 2,
        task: 'classification',
        debug: true
    };

    pixelBrain = ml5.neuralNetwork(options);

    //load training data
    // pixelBrain.loadData('./js/data.json',() => {
    //     pixelBrain.normalizeData();
    //     pixelBrain.train({epochs: 50}, whileTraining,finishedTraining);
    // });

}

function keyPressed() {

    if(key == 't') {
        pixelBrain.normalizeData();
        pixelBrain.train({epochs: 50}, whileTraining,finishedTraining);
    } else if(key == 's'){
        pixelBrain.saveData();
    } else {
        addExample(key);
    }
}





function whileTraining(epochs, loss) {
    // console.log(epochs);
}

function finishedTraining() {
    console.log('finished Training');
    classifyVideo();
}

function classifyVideo() { 

    let inputs = [];
    for(let i = 0; i < video.pixels.length; i+=4){
        let r = video.pixels[i];
        let g  = video.pixels[i+1];
        let b  = video.pixels[i+2];
        inputs.push(r,g,b);
    }

    pixelBrain.classify(inputs, gotResults);

}

function gotResults(err, results) {
    if(err) {
        console.error(err);
        return;
    }
    console.log(results[0].label);
    greet = results[0].label;
    classifyVideo();
}

function addExample(label) {
    let inputs  = [];
    for(let i = 0; i < video.pixels.length; i+=4) {
        let r = video.pixels[i];
        let g = video.pixels[i + 1];
        let b = video.pixels[i + 2];
        inputs.push(r,g,b);
    }
    let target = [label.toUpperCase()];
    pixelBrain.addData(inputs, target);
    console.log("Added", label);
}

function videoReady() {
    ready = true;
}

function draw() {

    // gets the pixels of video.
    video.loadPixels();

    if(ready) {
        let w = width / videoSize;
        for(let x = 0; x < video.width; x++) {
            for(let y = 0; y < video.height; y++) {
                let index  = (x + y * video.width) * 4;
                let r = video.pixels[index];
                let g = video.pixels[index + 1];
                let b = video.pixels[index + 2];
                noStroke();
                fill(r,g,b);
                rect(x * w,y * w,w,w);
            }
        }
    }

    textSize(64);
    textAlign(CENTER,CENTER);
    fill(255);

    if(greet == 'H') {    
        text('Hi !',width / 2, height /2);
    } else if(greet == 'O') {
        text('Oops !',width / 2, height /2);
    } else if(greet == 'N') {
        text('No one here !',width / 2, height /2);
    }

}