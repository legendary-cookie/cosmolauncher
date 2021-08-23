/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const storage = require("electron-json-storage");
const fs = require("fs");
const { Authenticator } = require("minecraft-launcher-core");
const defaultDataPath = storage.getDefaultDataPath();

fs.writeFileSync(storage.getDefaultDataPath() + "/.lastlog", `{"lastlog": ${(new Date).getHours()}}`);

async function setCredsMojang() {
	username = document.getElementById("email").value;
	password = document.getElementById("password").value;
	try {
		auth = await Authenticator.getAuth(username, password);
		fs.writeFileSync(defaultDataPath + "/.mcauth", JSON.stringify(auth));
		document.location.replace("../index.html");
	}
	catch (e) {
		console.error(e);
		alert("Something went wrong whilst logging in, try checking if your password/email are correct!");
	}
}
document.getElementById("mojang-login").onclick = loginfunc;
function loginfunc() {
	setCredsMojang();
}

document.getElementById("microsoft-login").onclick = microsoft_login;
async function microsoft_login() {
   
}

$("form").on("submit", function (event) {
	event.preventDefault();
});