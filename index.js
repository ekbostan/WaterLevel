// index.js
// This is our main server file
const fetch = require('cross-fetch');

// include express
const express = require("express");
// create object to interface with express
const app = express();


const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})



app.post("/query/getWaterData", async function(req, res) {
  try{
    console.log("Reciving date");
    //console.log(req);
    req_data = await req.body;
    //console.log(await req_data);
    console.log("Fetching data");
    let date = {"year": req_data.year, "month": req_data.month}
    let data = await getWaterData(date);
    let responseData = {"SHA": await data[0].value,"ORO": await data[1].value,"CLE": await data[2].value,"NML": await data[3].value,"SNL": await data[4].value,"DNP": await data[5].value,"BER": await data[6].value}
    console.log("Sending data");
    res.json(responseData);


    
  } catch(err) {
    console.log(err);
    res.status(500).send(err);
  }
  
});

// No static server or /public because this server
// is only for AJAX requests

// respond to all AJAX querires with this message
app.use(function(req, res, next) {
  res.json({msg: "No such AJAX request"})
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});




async function getWaterData(dateInfo) {
  const stations = "SHA,ORO,CLE,NML,SNL,DNP,BER";
  let dur_code = "M&Start=" + dateInfo.year + "-" + dateInfo.month + "-01&End=" + dateInfo.year + "-" + dateInfo.month + "-02";
  const startOfURL = "https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=";
  let api_url = startOfURL.concat(stations, "&SensorNums=15&dur_code=", dur_code);

  let tempUrl = "https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=SHA,ORO&SensorNums=15&dur_code=M&Start=2022-01-01&End=2022-12-31";
  
  let response = await fetch(api_url);
  let data = await response.json();
  //console.log(await data);
  return await data;
  
}