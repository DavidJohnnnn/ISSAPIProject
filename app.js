
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const variables = require("./importantVariables.js");

const https = require("https");

let app = express();
app.set('view engine', 'ejs');  // Now using EJS to help render the application.

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

var coordinates = [];

app.get("/", positionOfTheISS);

app.post("/", function (req, res) {
  res.redirect("/");
});

function positionOfTheISS (req, res) {
  https.get("https://api.wheretheiss.at/v1/satellites/25544", function (response) { // First make an https request to the Where is the ISS API.
    console.log(response.statusCode);
    if (response.statusCode === 200) {  // If the request was successful.
      response.on("data", function (data) {
        const apiDataISS = JSON.parse(data);
        const latitude = apiDataISS.latitude;
        const longitude = apiDataISS.longitude;
        coordinates.push([latitude, longitude]);

        //console.log(apiDataISS);

        var mapURL = "https://www.google.com/maps/embed/v1/place?key=" + variables.googleAPIKey + "&zoom=4&q=" + latitude + "%2C" + longitude; // replace variables.googleAPIKey with your own Google API key.

        var mapURL = "https://www.google.com/maps/embed/v1/place?key=" + variables.googleAPIKey + "&zoom=4&q=" + latitude + "%2C" + longitude; // replace variables.googleAPIKey with your own Google API key.


        var multipointURL = "https://www.google.com/maps/dir/";

        for (var i = 0; i < coordinates.length; i++) {
          if (i === coordinates.length - 1) {
            multipointURL = multipointURL + coordinates[i][0] + "," + coordinates[i][1] + "//@" + coordinates[i][0] + "," + coordinates[i][1] + ",2z";
          } else {
            multipointURL = multipointURL + coordinates[i][0] + "," + coordinates[i][1] + "/";
          }
        }

        console.log(multipointURL);

        res.render('index', {lat: latitude, long: longitude, mapLink: mapURL, ISSCoordinates: coordinates, ISSmultipointURL: multipointURL});


      });
    } else {
      console.log("Error: the ISS api did not provide the information properly");
    }
  });
}



















app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000.");
});


//
