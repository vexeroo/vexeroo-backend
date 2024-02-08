// 'use strict';
// var controller = require('./controller');
// module.exports = function(app) {
//    app.route('/about')
//        .get(controller.about);
//    app.route('/distance/:zipcode1/:zipcode2')
//        .get(controller.get_distance);
// };

const express = require("express");
const bodyParser = require("body-parser")

const aboutRouter = require("./routes/about");
const weatherRouter = require("./routes/weather");

const PORT = 3000;
const HOST_NAME = "localhost";

const app = express();
app.use(express.static("client"));
app.use(bodyParser.urlencoded({extended: true}));

app.use("/api-gateway", apiGatewayRouter);

// app.use("/weather", weatherRouter);
// app.use("/about", aboutRouter);


// app.listen(PORT, HOST_NAME, ()=&gt;{
//     console.log(`Server running at ${HOST_NAME}:${PORT}`)
// })

// Start the server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});