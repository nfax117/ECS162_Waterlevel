// index.js
// This is our main server file

// include express
const express = require("express");

// Import node implementation of fetch API -- we do this so our server has the power to fetch!
const fetch = require("node-fetch");

const bodyParser = require('body-parser');


// create object to interface with express
const app = express();


// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})

app.use(bodyParser.json());

// No static server or /public because this server
// is only for AJAX requests


app.post("/query/getMonthYear", async function(req, res){
  try {

    console.log("Req has: ", req.body);

    let month = req.body.month;
    let year = req.body.year
   
    console.log("in getMonthYear");
    let monthData = await getMonth(month, year);
    console.log("Sending back:", monthData);
    res.json(monthData)
  }
  catch(err) {
    console.log("Post Request Error")
    res.status(500).send(err)
  }
})

// respond to all AJAX querires with this message (needs to be last!)
app.use(function(req, res, next) {
  res.json({msg: "No such AJAX request"})
next()
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});

async function getMonth(month, year){

  //temporary variables
  let stations = "SHA,ORO,CLE,NML,LUS,DNP,BER"
  let api_url = ""
  if(month == 2){
    api_url = `https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=${stations}&SensorNums=15&dur_code=M&Start=${year}-0${month}-01&End=${year}-0${month}-28`;
  }
  else{
    api_url = `https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=${stations}&SensorNums=15&dur_code=M&Start=${year}-${month}-01&End=${year}-${month}-30`;
  }

  console.log("API URL:", api_url)
  
  let fetch_data = await fetch(api_url)
  let reservoir_data = fetch_data.json();
  return reservoir_data;
}

//https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=SHA,ORO,CLE,NML,LUS,DNP,BER&SensorNums=15&dur_code=M&Start=2022-4-01&End=2022-4-30

//https://cdec.water.ca.gov/reportapp/javareports?name=ResInfo