
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const variables = require("./importantVariables.js");

const https = require("https");

let app = express();
app.set('view engine', 'ejs');  // Now using EJS to help render the application.

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

app.get("/", function (req, res) {
  console.log(variables.GeocodeAPIKey, variables.googleAPIKey);
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  https.get("https://api.wheretheiss.at/v1/satellites/25544", function (response) { // First make an https request to the Where is the ISS API.
    console.log(response.statusCode);
    if (response.statusCode === 200) {  // If the request was successful.
      response.on("data", function (data) {
        const apiDataISS = JSON.parse(data);
        const latitude = apiDataISS.latitude;
        const longitude = apiDataISS.longitude;

        console.log(apiDataISS);

        geocodeURL = "https://www.mapquestapi.com/geocoding/v1/reverse?key=" + variables.GeocodeAPIKey + "&location=" + latitude + "%2C" + longitude + "&outFormat=json&thumbMaps=false"; // // replace variables.GeocodeAPIKey with your own MapQuest API key.
        console.log(geocodeURL);

        https.get(geocodeURL, function (resp) {  // Make a request to the Geocoding api.
          console.log("The Geocode status is " + resp.statusCode);
          if (resp.statusCode === 200) {
            resp.on("data", function (geodata) {
              const apiDataGeocode = JSON.parse(geodata);
              console.log(apiDataGeocode.results[0].locations[0]);
              const country = apiDataGeocode.results[0].locations[0].adminArea1;

              const mapURL = "https://www.google.com/maps/embed/v1/place?key=" + variables.googleAPIKey + "&q=" + latitude + "%2C" + longitude + "&zoom=4"; // replace variables.googleAPIKey with your own Google API key.

              res.render('index', {lat: latitude, long: longitude, ctry: country, mapLink: mapURL});
            });
          } else {
            console.log("Error: the Kanye api did not provide the information properly");
          }
        });

      });
      /*
      https.get("https://api.wheretheiss.at/v1/satellites/25544", function (response) {

      });
      */
    } else {
      console.log("Error: the ISS api did not provide the information properly");
    }
  });
});




















app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000.");
});


//
