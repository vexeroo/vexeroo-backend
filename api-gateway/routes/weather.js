const express = require("express");
const https = require('https')

const weatherRoute = express.Router();
weatherRoute.get("/", (req, res)=>{
    res.sendFile(__dirname, + "index.html")   
})


// res.sendFile(path.join(__dirname, "tests/frontend", "weather.html")

weatherRoute.post("/", (req, res)=>{
        const city = req.body.cityName
        const appiKey = "Your API Key" 
        const unit = req.body.unit

        const url = "https://api.openweathermap.org/data/2.5/weather?q="+ city + "&amp;appid="+appiKey+"&amp;units="+unit+""
        https.get(url, (response)=>{
            response.on("data", (chunk)=>{
                const responseData = JSON.parse(chunk);
                const temperature = responseData.main.temp;
                const weatherDes = responseData.weather[0].description;
                const icon = responseData.weather[0].icon;
                const imageURL = "http://openweathermap.org/img/wn/"+ icon + "@2x.png";
                const cityName = responseData.name;
                res.write(`&lt;h1>The weather is ${temperature} degree celsius in ${cityName} and the description is ${weatherDes} &lt;/h1>`)
                res.write("&lt;img src="+ imageURL +">")
                res.send()
            })
        })
})
module.exports = weatherRoute