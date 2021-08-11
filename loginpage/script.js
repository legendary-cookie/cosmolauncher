const storage = require("electron-json-storage");
const fs = require("fs");
const { Authenticator } = require('minecraft-launcher-core');
const defaultDataPath = storage.getDefaultDataPath();

let state;

if (fs.existsSync(defaultDataPath + "/.pw-saving")) {
   const dat = fs.readFileSync(defaultDataPath + "/.pw-saving", "utf-8");
   state = dat;
} else {
   state = false;
}

updatePassState();

async function setCredsMojang() {
   username = document.getElementById("email").value;
   password = document.getElementById("password").value;
   try {
      if (state) {
         const json = '{"username":"' + username + '","password":"' + password + '"}';
         fs.writeFileSync(defaultDataPath + "/.mc-creds", json);
      }
      auth = await Authenticator.getAuth(username, password);
      fs.writeFileSync(defaultDataPath + "/.mcauth", JSON.stringify(auth));
      document.location.replace("../index.html");
   }
   catch (e) {
      console.error(e);
      alert("Something went wrong whilst logging in, try checking if your password/email are correct!");
   }
}

async function togglePwSafe() {
   state = !state;
   updatePassState();
}


function updatePassState() {
   fs.writeFileSync(defaultDataPath + "/.pw-saving", state);
   document.getElementById("safepass-state").innerHTML = "Password saving: " + state;
}


document.getElementById("safe-password").onclick = togglePwSafe;
document.getElementById("mojang-login").onclick = loginfunc;
function loginfunc() {
   setCredsMojang();
}

$('form').on('submit', function (event) {
   event.preventDefault();
});

async function foo() {
   if (state == true) {
      try {
         const dat = fs.readFileSync(defaultDataPath + "/.mc-creds");
         auth = await Authenticator.getAuth(dat["username"], dat["password"]);
         fs.writeFileSync(defaultDataPath + "/.mcauth", JSON.stringify(auth));
         document.location.replace("../index.html");
      }
      catch (e) {
         console.error(e);
         alert("Something went wrong whilst automatically logging in, try checking if your password/email are correct!");
      }
   }
};
foo();