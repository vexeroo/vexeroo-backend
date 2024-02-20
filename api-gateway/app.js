"use strict";
// In your api-gateway service
const express = require('express');
const app = express();
const config = require('./config/config'); 
const axios = require('axios');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');



// Setup Swagger options
const options = {
    swaggerDefinition: {
        info: {
            title: 'My API Gateway',
            version: '1.0.0',
            description: 'API Documentation for my project',
        },
        apis: ['./routes/*.js'], // Adjust path if your routes are located elsewhere
    },
    apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options); 



// Basic dynamic routing using configuration
config.routes.forEach(route => {
//    app.route(route.path)[route.method](async (req, res) => {
//        // Use an HTTP client library (Axios, fetch, etc.) to make
//        // the request to the target microservice
//    });



   app.route(route.path)[route.method](async (req, res) => {
    try {
        const response = await axios.request({
            method: route.method,
            url: route.target,
            data: req.body, // Pass through request body if applicable
            headers: req.headers 
        });
        res.json(response.data);
     } catch (error) {
        // Robust error handling for failed requests!
        console.error(error);
        res.status(500).send('Error contacting target service'); 
     }
});


});

app.listen(config.gatewayPort, () => {
    console.log(`API Gateway running on ${config.gatewayPort}`);
});








// /**
//  * @swagger
//  * /products:
//  *   get:
//  *     description: Returns a list of products
//  *     responses:
//  *       200:
//  *         description: Successfully retrieved products
//  */
// app.get('/products', (req, res) => {
//     // ... Implementation to forward request to your product-service
//  });
 


// ... other requires
const productsRoutes = require('./routes/products'); 

// ...
app.use('/products', productsRoutes); 
