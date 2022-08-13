
let video;
let mobileNet;
let classifier;
let collectButton;
let trainButton;
let inp;
let label;


function gotResults(error, results) {

    if(error) {
        console.error(error);
        return;
    } 

    if(results != null) {
        results.sort((a,b) => {
            if(a.confidence > b.confidence) {
               return -1;
            } 
            if(a.confidence < b.confidence) {
              return 1;
            }
            return 0;
           });
        label = `${results[0].label}: ${results[0].confidence * 100}%`;
        classifier.classify(gotResults);
    }

    
}

function whileTraining(loss) {
    if(loss == null) {
        console.log('Training finished.')
        classifier.classify(gotResults);
    } else {
        console.log(loss);
    }
}

function modelReady() {
    console.log('Model is ready');
}

function videoReady() {
    console.log('video is ready');
}

function setup() {
    createCanvas(500, 400);
    video = createCapture(VIDEO);
    video.hide();
    background(0);
    mobileNet = ml5.featureExtractor('MobileNet',modelReady);
    classifier = mobileNet.classification(video, videoReady);

    let container = createDiv().addClass('container');
    createP("Who is this ? ").parent(container).addClass('question');
    inp = createInput().id('collect').parent(container).addClass('inp');

    collectButton = createButton('Add Image').addClass('blueBtn');
    collectButton.mousePressed(function() {

        if(inp.value() !== '') {
            console.log(inp.value().toUpperCase());
            classifier.addImage(inp.value().toUpperCase());
            return;
        } 

        console.log('value is: ', inp.value());
        
    });

    trainButton = createButton('Train').addClass('blueBtn');
    trainButton.mousePressed(function() {
        classifier.train(whileTraining);
    });

    let buttonContainer = createDiv().addClass('container');
    collectButton.parent(buttonContainer);
    trainButton.parent(buttonContainer);

} 

function draw() {
    background(0);
    image(video, 0, 0, width, height);
    fill(255);
    textSize(16);
    text(label, 10, height - 10);
}