/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const storage = require("electron-json-storage");
const fs = require("fs");
var http = require("follow-redirects").http;
const { post } = require("jquery");
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
	var options = {
		"method": "POST",
		"hostname": "mc.vincentschweiger.de",
		"port": 25566,
		"path": "/msauth",
		"headers": {
			"Content-Type": "application/json"
		},
		"maxRedirects": 20
	};
	var req = http.request(options, function (res) {
		var chunks = [];
		res.on("data", function (chunk) {
			chunks.push(chunk);
		});
		res.on("end", function (chunk) {
			var body = Buffer.concat(chunks);
			const token = JSON.parse(body.toString())["access_token"];

		});
		res.on("error", function (error) {
			alert(error);
			console.error(error);
		});
	});
	var postData = JSON.stringify({
		"username": document.getElementById("email").value,
		"password": document.getElementById("password").value
	});
	req.write(postData);
	req.end();
	
}

$("form").on("submit", function (event) {
	event.preventDefault();
});