const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const https = require("https");

const app = express();

app.user(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "























//
