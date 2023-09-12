// when this page is opened, get the most recently added video and show it.
let winningUrl;
let nickname = document.getElementById("nickname");

sendGetRequest("/getWinner")
  .then(function(data) {
    winningUrl = data.url;
    nickname.textContent = data.nickname;

    // function is defined in video.js
    let divElmt = document.getElementById("tiktokDiv");

    let reloadButton = document.getElementById("reload");
    // set up button to reload video in "tiktokDiv"
    reloadButton.addEventListener("click", function() {
      reloadVideo(tiktokDiv);
    });

    // always shows the same hard-coded video.  You'll need to get the server to 
    // compute the winner, by sending a 
    // GET request to /getWinner,
    // and send the result back in the HTTP response.

    showWinningVideo()

    function showWinningVideo() {
      addVideo(winningUrl, divElmt);
      loadTheVideos();
    }
  })
  .catch(function(error) {
    console.log("Error occurred:", error)
  });

function gameReturn() {
  let replace = document.getElementById("nickname").value;
  sendPostRequest('/deletePrefs', JSON.stringify(replace))
    .then(function(info) {
      window.location = "/myvideos/myvideos.html";
    })
}