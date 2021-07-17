const storage = require("electron-json-storage");
const fs = require("fs");
const { Authenticator } = require('minecraft-launcher-core');
const defaultDataPath = storage.getDefaultDataPath();

async function setCredsMojang() {
   username = document.getElementById("email").value;
   password = document.getElementById("password").value;
   try {
	auth = await Authenticator.getAuth(username, password);	
   	fs.writeFileSync(defaultDataPath+"/.mcauth", JSON.stringify(auth)); 
	document.location.replace("../index.html");
   }
    catch(e){
	console.error(e);
        alert("Something went wrong while logging in, try checking if your password/email are correct!");
    }
}



document.getElementById("mojang-login").onclick = loginfunc;
function loginfunc() {
   setCredsMojang();
}

$('form').on('submit', function(event) {
   event.preventDefault();
});

