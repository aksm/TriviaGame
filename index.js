const express = require('express');
const path = require("path");
const axios = require("axios");
const app = express();

app.set("port", process.env.PORT || 8080);
app.use("/", express.static(path.join(__dirname, "public")));

app.get("/", function(req, res) {
  res.sendFile("index.html");
});

app.get("/jservice", function(req, res) {
  axios.get('http://jservice.io/api/random?count=100')
  .then(function(response) {
    const jdata = response.data;
    // console.log(jdata);
    res.json(jdata);
  })
  .catch(function(error) {
    console.log(error);
    res.redirect("/");
  });
});
app.listen(app.get("port"), function() {console.log("Hollaback on port: "+app.get("port"));});
