//Call module to use in this app.js file
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const config = require(__dirname + '/conf.js')

const port = 3000;
const app = express();

//Parse request from body in HTML via body-parser (node module package)
app.use(bodyParser.urlencoded({extended: true}));
//Response to request when get the get request from browser in root
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html")
});

app.post("/", function(req, res) {
  //Pass variable from post request via body-parser module;
  const city = req.body.cityInput;
  const apiURL = config.url + "?q=" + city + "&appid=" + config.apiKey + "&units=metric";
  //Send get request to other API and Get response from other API server to be able use via HTTPS protocal
  https.get(apiURL, function(response) {
    //Check Status Code from API in Console log
    console.log(response.statusCode);
    //Pass variable from API to be able to use
    response.on("data", function(data) {
      //Parse JSON via Native Nodejs
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const desc = weatherData.weather[0].description;
      const imageID = weatherData.weather[0].icon;
      const imageUrl = "http://openweathermap.org/img/wn/" + imageID + "@2x.png";
      //Sending Response to Client .send method cant seng multiple line,so .write method can write info
      res.write("<h1>Temp in " + city + " is " + temp + " Celcius.</h1>");
      res.write("<p>Description: " + desc + "</p>");
      res.write("<img src=" + imageUrl + ">");
      res.send();
    });
  });
});

//Setting port to listening request.
app.listen(port, function(req, res) {
  console.log("Server is running on port " + port + ".");
});
