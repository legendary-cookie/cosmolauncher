const storage = require('electron-json-storage');
const fs = require('fs');
const http = require('follow-redirects').https;


const defaultDataPath = storage.getDefaultDataPath();


const addons = readFromJson(defaultDataPath + "/addons.json");

document.addEventListener("DOMContentLoaded", function (event) {
    const root = document.getElementById("addonpageroot")
    for (var i = 0; i < addons.length; i++) {
        var name = addons[i].name;
        var ver = addons[i].version;
        var desc = addons[i].desc;
        var addonNode = document.createElement("div");
        var addonGetButton = document.createElement("button");
        var addonText = document.createElement("p")
        addonText.innerHTML = name + " version " + ver + ": " + desc;
        if (fs.existsSync(defaultDataPath + "/minecraft/cosmo/addons/" + name + ".jar")) {
            addonGetButton.innerHTML = "Uninstall"
        } else {
            addonGetButton.innerHTML = "Install"
        }
        addonGetButton.id = name + ver;
        addonNode.appendChild(addonText)
        addonNode.appendChild(addonGetButton);
        root.appendChild(addonNode);
    }
    for (var i = 0; i < addons.length; i++) {
        var name = addons[i].name;
        var ver = addons[i].version;
        var button = document.getElementById(name + ver);
        button.onclick = function (event) {
            if (button.innerHTML == "Install") {
                download("https://github.com/CosmoNetworks/AddonRepository/releases/download/" + name + ver + "/" + name + ver + ".jar", defaultDataPath + "/minecraft/cosmo/addons/" + name + ".jar", (err) => {
                    alert("Done with installing " + name);
                    button.innerHTML = "Uninstall"
                });
            } else {
                fs.unlink(defaultDataPath + "/minecraft/cosmo/addons/" + name + ".jar", (err) => {
                    if (err) throw err;
                    alert("Done with uninstalling " + name);
                    button.innerHTML = "Install"
                });
            }
        }
    }
});

function test() {
    console.log("TEST")
};

function readFromJson(path) {
    if (!fs.existsSync(path)) return undefined;
    var obj = JSON.parse(fs.readFileSync(path, 'utf8'));
    return obj;
}

function download(url, dest, cb) {
    var file = fs.createWriteStream(dest);
    var request = http.get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            file.close(cb);
        });
    });
}