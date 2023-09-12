"use strict"

//Post request: data = 
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

async function getList(url) {
  console.log("about to send get request");
  let response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (response.ok) {
    let data = await response.json();
    console.log(data);
    return data;
  } else {
    throw Error(response.status);
  }
}

let example = [];
getList("/getList")
  .then(function(data) {
    for (let i = 0; i < data.length; i++) {
      let nickyname = data[i].nickname;
      example[i] = nickyname;
      console.log(nickyname);
      document.getElementById("vidtext" + (i + 1).toString()).textContent = nickyname;
    }
    for (let i = example.length; i < 8; i++) { //adds dashed lines for empty boxes
      document.getElementById("vidtext" + (i + 1).toString()).style.border = "1px dashed grey";
    }
    if (data.length > 7) {
      document.getElementById("add_new").style.opacity = 0.5;
    }
    else {
      document.getElementById("con").style.opacity = 0.5;
    }
  })
  .catch(function(error) {
    console.log("Error occurred:", error)
  });

function addNew() {
  if (example.length < 8) {
    window.location = "/tiktokpets/tiktokpets.html";
  }
}

function deleteVideo(clicked_id) { //event listener for all X buttons
  console.log("test");
  //send POST request, asking for video to be deleted from database. This function waits for a response, and then removes it from myvideos page. Videos then move 'up' to fill empty space
  let replace = document.getElementById("vidtext" + clicked_id);
  let send = { "nickname": replace.textContent };
  sendPostRequest('/deleteVideo', JSON.stringify(send))
    .then(function(info) {
      //greys out boxes to reset
      for (let i = 0; i < 8; i++) {
        document.getElementById("vidtext" + (i + 1).toString()).textContent = '';
        document.getElementById("vidtext" + (i + 1).toString()).style.border = "1px dashed grey";
      }
      example = [];
      getList("/getList")
        .then(function(data) {
          console.log(data);
          for (let i = 0; i < data.length; i++) {
            let nickyname = data[i].nickname;
            example[i] = nickyname;
            document.getElementById("vidtext" + (i + 1).toString()).textContent = nickyname;
            document.getElementById("vidtext" + (i + 1).toString()).style.border = "1px solid grey";
          }
          for (let i = example.length; i < 8; i++) { //adds dashed lines for empty boxes
            document.getElementById("vidtext" + (i + 1).toString()).style.border = "1px dashed grey";
          }
          if (data.length > 7) {
            document.getElementById("add_new").style.opacity = 0.5;
          }
          else {
            document.getElementById("con").style.opacity = 0.5;
          }
        })
        .catch(function(error) {
          console.log("Error occurred:", error)
        });
    })
    .catch(function(error) {
      console.log("Error occurred:", error)
    });
}

function playGame() { //event listener for play game button
  if (example.length == 8) {
    window.location = "/Game/compare.html";
  }
}