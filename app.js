const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
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

      res.send();
    });
  });
});




















app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000.");
});


//
