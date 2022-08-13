let model;
let targetLabel = 'C';
let state = 'collection';

function setup() {
    createCanvas(400, 400);
    let options = {
        inputs: ['x','y'],
        outputs: ['label'],
        task: 'classification',
        debug: 'true' 
    };
    model = ml5.neuralNetwork(options);
    background("#f5f5f5");
}

function keyPressed() {
    if(key == 't') {
        state = 'training';
        console.log('start training');
        model.normalizeData();
        let options = {
            epochs: 200
        };
        model.train(options, whileTraining, finishedTraining);
    } else {
        targetLabel = key.toUpperCase();
    }
}

function whileTraining(epoch, loss) {
    console.log(epoch);
}

function finishedTraining() {
    console.log('finished training');
    state = 'prediction';
}

function mousePressed() {

    let inputs = {
        x: mouseX,
        y: mouseY
    };

    if(state == 'collection') {
        let target = {
            label: targetLabel
        };
        // console.log(inputs);
        model.addData(inputs, target);
        stroke(0);
        noFill();
        ellipse(mouseX,mouseY,24);
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        text(targetLabel, mouseX, mouseY);
    } else if(state == 'prediction') {
        model.classify(inputs, gotResults);
    }

}

function gotResults(error, results) {
    if(error) {
        console.error(error);
        return;
    }

    if(results[0].label == 'C') {
        drawOutput("#FF7F00", results[0].label);
    } else if (results[0].label == 'A') {
        drawOutput("#FFFF00",results[0].label);
    } else if (results[0].label == 'B') {
        drawOutput("#00ff00",results[0].label);
    } else {
        drawOutput("#add8e6",results[0].label)
    }
    
}

function drawOutput(color,label) {
    stroke(0);
    fill(color);
    ellipse(mouseX,mouseY,24);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(label, mouseX, mouseY);
}