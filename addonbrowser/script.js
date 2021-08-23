/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const storage = require("electron-json-storage");
const fs = require("fs");
const http = require("follow-redirects").https;
const defaultDataPath = storage.getDefaultDataPath();
const addons = readFromJson(defaultDataPath + "/addons.json");
document.addEventListener("DOMContentLoaded", function (event) {
	const root = document.getElementById("addonpageroot");
	for (var i = 0; i < addons.length; i++) {
		addonName = addons[i].name;
		ver = addons[i].version;
		desc = addons[i].desc;
		process(root, addonName, ver, desc);
	}
});


function readFromJson(path) {
	if (!fs.existsSync(path)) return undefined;
	var obj = JSON.parse(fs.readFileSync(path, "utf8"));
	return obj;
}

function download(url, dest, cb) {
	var file = fs.createWriteStream(dest);
	var request = http.get(url, function (response) {
		response.pipe(file);
		file.on("finish", function () {
			file.close(cb);
		});
	});
}

function process(root, addonName, ver, desc) {
	addonNode = document.createElement("div");
	addonGetButton = document.createElement("button");
	addonText = document.createElement("p");
	addonText.innerHTML = addonName + " version " + ver + ": " + desc;
	addonText.id = "text-" + addonName;
	if (fs.existsSync(defaultDataPath + "/minecraft/cosmo/addons/" + addonName + ".jar")) {
		addonGetButton.innerHTML = "Uninstall";
	} else {
		addonGetButton.innerHTML = "Install";
	}
	addonNode.id = "root-" + addonName;
	addonGetButton.id = "button-" + addonName;
	addonNode.appendChild(addonText);
	addonNode.appendChild(addonGetButton);
	root.appendChild(addonNode);
	document.getElementById("button-" + addonName).addEventListener("click", function () {
		if (document.getElementById("button-" + addonName).innerHTML == "Install") {
			download("https://github.com/CosmoNetworks/AddonRepository/releases/download/" + addonName + ver + "/" + addonName + ver + ".jar", defaultDataPath + "/minecraft/cosmo/addons/" + addonName + ".jar", (err) => {
				alert("Done with installing " + addonName);
				document.getElementById("button-" + addonName).innerHTML = "Uninstall";
			});
		} else {
			fs.unlink(defaultDataPath + "/minecraft/cosmo/addons/" + addonName + ".jar", (err) => {
				if (err) throw err;
				alert("Done with uninstalling " + addonName);
				document.getElementById("button-" + addonName).innerHTML = "Install";
			});
		}
	});
}