let videoElmts = document.getElementsByClassName("tiktokDiv");

let reloadButtons = document.getElementsByClassName("reload");
let heartButtons = document.querySelectorAll("div.heart");
let innerHearts = document.getElementsByClassName("dif");
let next = document.getElementsByClassName("enabledButton");
let nickname = document.querySelectorAll("div#nickname");

for (let i = 0; i < 2; i++) {
  let reload = reloadButtons[i];
  reload.addEventListener("click", function() { reloadVideo(videoElmts[i]) });
  heartButtons[i].classList.add("unloved");
} // for loop

let stored;
// You will need to get pairs of videos from the server to play the game.
sendGetRequest("/getTwoVideos")
  .then(function(data) {
    stored = data;
    for (let i = 0; i < 2; i++) {
      addVideo(data[i].url, videoElmts[i]);
      nickname[i].textContent = data[i].nickname;
    }
    // load the videos after the names are pasted in! 
    loadTheVideos();
  })
  .catch(function(error) {
    console.log("Error occurred:", error)
  });

let pref;

heartButtons[0].onclick = function() {
  heartButtons[0].classList.remove("unloved");
  heartButtons[0].classList.add("loved");
  innerHearts[0].classList.remove("far");
  innerHearts[0].classList.add("fas");
  heartButtons[1].classList.remove("loved");
  heartButtons[1].classList.add("unloved");
  innerHearts[1].classList.remove("fas");
  innerHearts[1].classList.add("far");
  pref = 0;
}

heartButtons[1].onclick = function() {
  heartButtons[1].classList.remove("unloved");
  heartButtons[1].classList.add("loved");
  innerHearts[1].classList.remove("far");
  innerHearts[1].classList.add("fas");
  heartButtons[0].classList.remove("loved");
  heartButtons[0].classList.add("unloved");
  innerHearts[0].classList.remove("fas");
  innerHearts[0].classList.add("far");
  pref = 1;
}

next[0].onclick = function() {
  let result;
  if (pref == 1) {
    result = { "better": stored[1].rowIdNum, "worse": stored[0].rowIdNum };
  } else {
    result = { "better": stored[0].rowIdNum, "worse": stored[1].rowIdNum };
  }
  let output = JSON.stringify(result);
  sendPostRequest("/insertPref", result)
    .then(function(data) {
      if (data[1] === "c") {
        window.location = "/Game/compare.html";
      } else if (data[1] === "p") {
        window.location = "/Game/winner.html";
      }
    })
    .catch(function(error) {
      console.log("Error occurred:", error);
    });
}