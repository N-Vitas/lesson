const brain = require('brain.js');
var net = new brain.NeuralNetwork();
const fs = require('fs');
const path = './data/mnistTrain.json';
try {
    if (fs.existsSync('./src/data/mnistTrain.json')) {
        net.fromJSON(require('./data/mnistTrain.json'));
        console.log(`load neural network from ${path}`);
    }
} catch(err) {
  console.error(err)
}
const mnist = require('mnist');
const set = mnist.set(8000, 2000);
const trainingSet = set.training;
net.train(trainingSet,
    {
        errorThresh: 0.005,  // error threshold to reach
        iterations: 20000,   // maximum training iterations
        log: true,           // console.log() progress periodically
        logPeriod: 1,       // number of iterations between logging
        learningRate: 0.003    // learning rate
    }
);

let wstream = fs.createWriteStream('./src/data/mnistTrain.json');
wstream.write(JSON.stringify(net.toJSON(),null,2));
wstream.end();

console.log('MNIST dataset with Brain.js train done.')