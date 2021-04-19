const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const async = require("async"); // This is required to do multiple API requests at the same time. Make sure it is installed.

const https = require("https");

const app = express();

var requests = [{
  url: "https://api.wheretheiss.at/v1/satellites/25544"
}, {
  url: "https://api.kanye.rest/"
}];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

app.get("/", function (req, res) {
  const url = "https://api.wheretheiss.at/v1/satellites/25544";

  https.get(url, function (response) {
    console.log(response.statusCode);
    response.on("data", function (data) {
      const apiData = JSON.parse(data);
      const latitude = apiData.latitude;
      const longitude = apiData.longitude;

      console.log(apiData);

      res.write("<p>The current latitude and longitude of the ISS is:<p>");
      res.write("<p>Latitude: " + latitude + "<p>");
      res.write("<p>Longitude: " + longitude + "<p>");
      
    });
  });
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const urls = [
    "https://api.wheretheiss.at/v1/satellites/25544",
    "https://api.kanye.rest/"
  ];

  for (i = 0; i < 2; i++) {

    https.get(urls[i], function (response) {
      console.log(response.statusCode);
      if (i === 0) {
        response.on("data", function (data) {
          const apiData = JSON.parse(data);
          const latitude = apiData.latitude;
          const longitude = apiData.longitude;

          console.log(apiData);

          res.write("<p>The current latitude and longitude of the ISS is:<p>");
          res.write("<p>Latitude: " + latitude + "<p>");
          res.write("<p>Longitude: " + longitude + "<p>");

          res.send();

        });
    }
      if (i === 1) {
        response.on("data", function (data) {
          const apiData = JSON.parse(data);
          const latitude = apiData.quote;
          //const longitude = apiData.longitude;

          console.log(apiData);

          res.write("<p>The current latitude and longitude of the ISS is:<p>");
          res.write("<p>Latitude: " + latitude + "<p>");
          //res.write("<p>Longitude: " + longitude + "<p>");

          res.send();

        });
      }
    });
  }

/*
  https.get(urlNASA, function (response) {
    console.log(response.statusCode);

    response.on("data", function (data) {
      const apiData = JSON.parse(data);
      const latitude = apiData.quote;
      //const longitude = apiData.longitude;

      console.log(apiData);

      res.write("<p>The current latitude and longitude of the ISS is:<p>");
      res.write("<p>Latitude: " + latitude + "<p>");
      //res.write("<p>Longitude: " + longitude + "<p>");

      res.send();

    });
  });
*/

});




















app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000.");
});


//
