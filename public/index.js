// index.js
// This is our main server file
"use strict"

// A static server using Node and Express
const express = require("express");

// Promises-wrapped version of sqlite3
const db = require('./sqlWrap');
// our database operations
const dbo = require('./databaseOps');

const win = require("./pickWinner");

// gets data out of HTTP request body 
// and attaches it to the request object
const bodyParser = require('body-parser');
const { delete_all } = require("./databaseOps");

/* might be a useful function when picking random videos */
function getRandomInt(max) {
  let n = Math.floor(Math.random() * max);
  // console.log(n);
  return n;
}


// create object to interface with express
const app = express();

// Code in this section sets up an express pipeline

// gets text out of the HTTP body and into req.body
app.use(bodyParser.text());

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
})

// make all the files in 'public' available 
app.use(express.static("public"));

// a module to use instead of older body-parser
app.use(express.json());

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/myvideos/myvideos.html");
});

app.get("/getMostRecent", (request, response) => {
  dbo.get_most_recent()
    .then(function(data) {
      console.log(data);
      response.json(data);
    })
    .catch(function(error) {
      console.log("Error occurred:", error)
    });
});

app.get("/getList", (request, response) => {
  dbo.get_all()
    .then(function(data) {
      // console.log(data);
      response.json(data);
    })
    .catch(function(error) {
      console.log("Error occurred:", error)
    });
});

app.post('/deleteVideo', function(req, res, next) {
  console.log("got Post from ", req.url);
  let info = req.body;
  console.log(info);
  dbo.delete_video(info.nickname) //<<< insert video nickname here 
    .then(function(data) {
      // data = what is sent from post in index.js
      res.json("all good");
    })
    .catch(function(error) {
      console.log("Error occurred:", error)
    });
});

app.post('/deletePrefs', function(req, res, next) {
  console.log("got Post from ", req.url);
  let info = req.body;
  console.log(info);
  dbo.delete_prefs() //<<< insert video nickname here 
    .then(function(data) {
      // data = what is sent from post in index.js
      res.json("all good");
    })
    .catch(function(error) {
      console.log("Error occurred:", error)
    });
});

app.get("/getTwoVideos", (request, response) => {
  db.all("SELECT * from VideoTable")
    .then(function(data) {
      let vidOne = getRandomInt(8);
      let vidTwo = vidOne;
      while (vidOne == vidTwo) {
        vidTwo = getRandomInt(8);
      }
      let results = [data[vidOne], data[vidTwo]];
      //console.log(results.stringify());
      response.json(results);
    })
    .catch(function(error) {
      console.log("Error occurred:", error)
    });
});

app.get("/getWinner", async function(req, res) {
  console.log("getting winner");
  try {
    // change parameter to "true" to get it to computer real winner based on PrefTable 
    // with parameter="false", it uses fake preferences data and gets a random result.
    // winner should contain the rowId of the winning video.
    let winner = await win.computeWinner(8, false);
    alert(winner);
    db.get("SELECT * FROM VideoTable WHERE rowIdNum = ?", [winner])
      .then(function(data) {
        res.json(data);
      })
      .catch(function(error) {
        console.log("Error occurred:", error)
      });
  } catch (err) {
    res.status(500).send(err);
  }
});

// end of pipeline specification
//
app.post('/videoData', function(req, res, next) {
  console.log("got Post from ", req.url);
  let info = req.body;
  console.log(info);

  dbo.get_count()
    .then(function(data) {
      // data = what is sent from post in index.js
      console.log("Count data: " + data);
      if (data >= 8) {
        res.json("database full");
      }
      else {
        dbo.post_video(info.url.trim(), info.nickname.trim(), info.userid.trim())
        res.json(info);
      }
    })
    .catch(function(error) {
      console.log("Error occurred:", error)
    });
});

app.post('/insertPref', function(req, res, next) {
  alert("got Post from ", req.url);
  let info = req.body;
  alert(JSON.stringify(info));
  db.run("INSERT INTO PrefTable (better, worse) values (?,?)", [info["better"], info["worse"]]);
  db.get("SELECT COUNT(rowIdNum) FROM PrefTable", [])
    .then(function(data) {
      let result = JSON.stringify(data);
      result = parseInt(result.substring(result.indexOf(":") + 1, result.length));
      if (result < 15) {
        res.json("continue");
      } else {
        res.json("pick winner");
      }
    })
    .catch(function(error) {
      console.log("Error occurred:", error)
    });
});

// Need to add response if page not found!
app.use(function(req, res) {
  res.status(404);
  res.type('txt');
  res.send('404 - File ' + req.url + ' not found');
});

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function() {
  console.log("The static server is listening on port " + listener.address().port);
});
