"use strict"

async function sendPostRequest(url, data) {
  console.log("about to send post request");
  let response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data
  });
  if (response.ok) {
    let data = await response.json();
    return data;
  } else {
    throw Error(response.status);
  }
}

function con() {
  let user = document.getElementById('label1').value;
  let tiktok = document.getElementById('label2').value;
  let nick = document.getElementById('label3').value;
  let output = { "url": tiktok, "nickname": nick, "userid": user };
  let outputJSON = JSON.stringify(output);
  sendPostRequest('/videoData', outputJSON)
    .then(function(data) {
      // data = what is sent from post in index.js
      if (data == "database full") {
        window.alert("database full");
        window.location = "/myvideos/myvideos.html";
      }
      else {
        console.log(data);
        window.location = "/preview/preview.html";
      }
    })
    .catch(function(error) {
      console.log("Error occurred:", error)
    });
}

function vids() {
  window.location = "/myvideos/myvideos.html";
}