// Setting up the nickname
const replace = document.getElementById("vidname");
let output = sessionStorage.getItem("output");
let outArr = output.split(",");
let nick = outArr[2];
nick = "'" + nick + "'";

console.log("acknowledged");

// It's Replacing Time
let msg = replace.textContent;
msg = msg.replace("nick", nick);
console.log(msg);
replace.textContent = msg;

function con() {
  window.location = "/tiktokpets/tiktokpets.html";
}