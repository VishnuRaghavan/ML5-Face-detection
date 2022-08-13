
let faceapi;
let faceBrain;
let state = 'collection';
let video;
let points = [];
let mouth = [];
let nose = [];
let leftEye = [];
let rightEye = [];
let leftEyeBrow = [];
let rightEyeBrow = [];
let jaw = [];
let textInp = '';
let inp;
let counter = 0;


function setup() {
    let cnv = createCanvas(550, 400 + 100).addClass('canvas');
    let container = createDiv().addClass('container');
    createP("Who is this ? ").parent(container).addClass('question');
    inp = createInput().id('collect').parent(container).addClass('inp');

    video = createCapture(VIDEO);
    video.size(width, 400);
    video.hide();

    const detectOptions = {
        withLandmarks: true,
        withDescriptors: true
    };

    faceapi = ml5.faceApi(video, detectOptions, faceReady);

    const options = {
        inputs: ['x', 'y'],
        outputs: ['label'],
        learningRate: 0.07,
        task: 'classification',
        hiddenUnits: 2,
        debug: 'true'
    };

    faceBrain = ml5.neuralNetwork(options);
}

function faceReady() {
    faceapi.detect(gotFace);
}

function gotFace(err, results) {
    if (err) {
        console.log(err);
    }

    if (results.length) {
        const facialMap = results[0];
        points = facialMap.landmarks.positions;
        mouth = facialMap.parts.mouth;
        nose = facialMap.parts.nose;
        leftEye = facialMap.parts.leftEye;
        rightEye = facialMap.parts.rightEye;
        leftEyeBrow = facialMap.parts.leftEyeBrow;
        rightEyeBrow = facialMap.parts.rightEyeBrow;
        jaw = facialMap.parts.jawOutline;
    }

    faceReady();
}

function keyPressed() {

    if (key == 'c') {
        state = "collection";
        console.log(`MODE: ${state}`);
    } else if (key == 't') {
        state = "training";
        console.log(`MODE: ${state}`);
    } else if (key == "p") {
        state = "prediction"
        console.log(`MODE: ${state}`);
    } else if (key == 'Enter') {
        if (state == 'collection') {
            textInp = inp.value().toUpperCase();
            let obj = { label: textInp };
            let inputs = getInputs();
            console.log('adding input ', inputs);
            if (inputs) {
                faceBrain.addData(inputs, obj);
            }
        } else if (state == 'training') {
            faceBrain.normalizeData();
            faceBrain.train({ epochs: 100 }, whileTraining, finishedTraining);
        } else if (state == 'prediction') {
            predict();
        }
    }

}

function getInputs() {
    console.log('points', points);
    if (points.length) {
        let sumX = 0;
        let sumY = 0;
        for (let i = 0; i < points.length; i++) {
            sumX += map(round(points[i]._x), 0, width, 0, 1);
            sumY += map(round(points[i]._y), 0, 400, 0, 1);
        }
        return obj = {
            x: sumX,
            y: sumY
        };
    }
}

function draw() {
    // image(video, 0, 0);

    background(0);
    drawLines(mouth);
    drawLines(nose);
    drawLines(leftEye);
    drawLines(leftEyeBrow);
    drawLines(rightEye);
    drawLines(rightEyeBrow);

    if (jaw.length) {
        for (let i = 0; i < jaw.length; i++) {
            stroke(95, 251, 230);
            strokeWeight(1);
            if (i != jaw.length - 1) {
                line(jaw[i]._x, jaw[i]._y, jaw[i + 1]._x, jaw[i + 1]._y);
            }
        }
    }

}

function drawLines(arr) {
    if (arr.length) {
        for (let i = 0; i < arr.length; i++) {
            stroke(95, 251, 230);
            strokeWeight(1);
            strokeJoin(ROUND);
            if (i == arr.length - 1) {
                line(arr[i]._x, arr[i]._y, arr[0]._x, arr[0]._y);
            } else {
                line(arr[i]._x, arr[i]._y, arr[i + 1]._x, arr[i + 1]._y);
            }
        }
    }
}

function whileTraining(epoch, loss) {
    console.log('epoch', epoch);
}

function finishedTraining() {
    console.log('Training Finished');
}

function predict() {
    let inputs = getInputs();
    faceBrain.classify(inputs, gotResults);
}

function gotResults(error, results) {
    if (error) {
        console.error("Err: ", error);
        return;
    }
    console.log("results: ", results);
}