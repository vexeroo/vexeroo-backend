// // 'use strict';
// // var controller = require('./controller');
// // module.exports = function(app) {
// //    app.route('/about')
// //        .get(controller.about);
// //    app.route('/distance/:zipcode1/:zipcode2')
// //        .get(controller.get_distance);
// // };

// const express = require("express");
// const bodyParser = require("body-parser")

// const aboutRouter = require("./routes/about");
// const weatherRouter = require("./routes/weather");

// const PORT = 3000;
// const HOST_NAME = "localhost";

// const app = express();
// app.use(express.static("client"));
// app.use(bodyParser.urlencoded({extended: true}));

// app.use("/api-gateway", apiGatewayRouter);

// // app.use("/weather", weatherRouter);
// // app.use("/about", aboutRouter);


// // app.listen(PORT, HOST_NAME, ()=&gt;{
// //     console.log(`Server running at ${HOST_NAME}:${PORT}`)
// // })

// // Start the server
// app.listen(3000, () => {
//     console.log("Server is running on port 3000");
// });
















const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Load the microservices configuration
let microservicesConfig = JSON.parse(fs.readFileSync('microservices.ini', 'utf-8'));

// Store the child processes for each microservice
const microservices = {};

// Function to start a microservice
function startMicroservice(name) {
  const config = microservicesConfig[name];
  if (!config) {
    console.error(`No configuration found for microservice: ${name}`);
    return;
  }

  const microservice = spawn(config.start.command, config.start.args, {
    cwd: path.join(__dirname, name),
  });

  microservice.stdout.on('data', (data) => {
    console.log(`[${name}] ${data}`);
  });

  microservice.stderr.on('data', (data) => {
    console.error(`[${name}] ${data}`);
  });

  microservices[name] = microservice;
}

// Start all microservices
for (const name in microservicesConfig) {
  startMicroservice(name);
}

// Watch the microservices.ini file for changes
fs.watch('microservices.ini', (eventType, filename) => {
  if (eventType === 'change') {
    const newConfig = JSON.parse(fs.readFileSync('microservices.ini', 'utf-8'));

    // Stop microservices that have been removed
    for (const name in microservicesConfig) {
      if (!newConfig[name]) {
        const microservice = microservices[name];
        microservice.kill();
        delete microservices[name];
      }
    }

    // Start new microservices
    for (const name in newConfig) {
      if (!microservicesConfig[name]) {
        startMicroservice(name);
      }
    }

    microservicesConfig = newConfig;
  }
});