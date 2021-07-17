const ipc = require('electron').ipcRenderer;
const storage = require('electron-json-storage');
const fs = require('fs');
const http = require('follow-redirects').http;
const remote = require('electron').remote;
const defaultDataPath = storage.getDefaultDataPath();
const shelljs = require('shelljs');
var mcdir = defaultDataPath + '/minecraft';
var versionsdir = mcdir + '/versions';
var clientdir = versionsdir + '/Cosmo';
var libdir = mcdir + '/libraries';
var cosmolibdir = libdir + '/com/cosmo/Cosmo/LOCAL';
const win = remote.getCurrentWindow();
const log = require('electron-log');
const jvm = require('./jvm')
const { Authenticator } = require('minecraft-launcher-core');

let tempFile;

createValidTreeStructure();
document.addEventListener("DOMContentLoaded", function (event) {
    ipc.send('temp');
    ipc.on('temp-reply', (event, arg) => {
        tempFile = arg;
        update();
    });
});

document.onreadystatechange = (event) => {
    if (document.readyState == "complete") {
        handleWindowControls();
    }
};
window.onbeforeunload = (event) => {
    win.removeAllListeners();
};
/* Functions */
function handleWindowControls() {
    /* Make minimise/maximise/restore/close buttons work when they are clicked */
    document.getElementById('min-button').addEventListener("click", event => {
        ipc.send('min');
    });
    document.getElementById('max-button').addEventListener("click", event => {
        ipc.send('max');
    });
    document.getElementById('restore-button').addEventListener("click", event => {
        ipc.send('unmax');
    });
    document.getElementById('close-button').addEventListener("click", event => {
        ipc.send('close');
    });
    ipc.send('version');
    ipc.on('version-reply', (event, arg) => {
        const titlespan = document.getElementById('titlespan');
        titlespan.innerHTML = ("Cosmolauncher v" + arg);
    });
    /* Toggle maximise/restore buttons when maximisation/unmaximisation occurs */
    toggleMaxRestoreButtons();
    win.on('maximize', toggleMaxRestoreButtons);
    win.on('unmaximize', toggleMaxRestoreButtons);

    function toggleMaxRestoreButtons() {
        if (win.isMaximized()) {
            document.body.classList.add('maximized');
        } else {
            document.body.classList.remove('maximized');
        }
    }
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

async function update() {
    fs.readFile(tempFile, 'utf8', function (err, data) {
        if (err) throw err;
        if (data == "no") {
            if (!fs.existsSync(jsonstorage.getDefaultDataPath() + "/.mcauth")) {
                document.location.replace("loginpage/index.html");
            } else {
                authObj = JSON.parse(fs.readFileSync(defaultDataPath + "/.mcauth", 'utf-8'));
                Authenticator.validate(authObj["access_token"], authObj["client_token"])
                    .then(() => updateClient())
                    .then(() => fs.writeFileSync(tempFile, "yes"))
                    .catch(error => document.location.replace("loginpage/index.html"));
            }
        }
    });
}

function updateClient() {
    document.getElementById("addons").disabled = true;
    download("http://raw.githubusercontent.com/CosmoNetworks/AddonRepository/master/addons.json", defaultDataPath + "/addons.json", function (error) {
        if (error) throw error;
    })
    launchbutton = document.getElementById("launch");
    launchbutton.disabled = true;
    launchbutton.innerHTML = "Checking for updates...";
    if (!fs.existsSync(clientdir + "/Cosmo.json")) {
        download("http://raw.githubusercontent.com/legendary-cookie/cosmo/main/Cosmo.json", clientdir + '/Cosmo.json', function (error) {
            if (error) throw error;
        });
    }
    if (fs.existsSync(defaultDataPath + "/newLatest.json")) {
        fs.renameSync(defaultDataPath + "/newLatest.json", defaultDataPath + "/oldLatest.json");
    }

    jvm.getNewJvm(document.getElementById("vanilla17"), "Vanilla 1.17")

    download("http://github.com/legendary-cookie/cosmo/releases/latest/download/latest.json", defaultDataPath + "/newLatest.json", function (error) {
        if (error) throw error;
        var newLatest = readFromJson(defaultDataPath + "/newLatest.json");
        var oldLatest = readFromJson(defaultDataPath + "/oldLatest.json");
        if (oldLatest == undefined) oldLatest = { "latest": "not installed" };
        log.info("Newest version available: " + newLatest["latest"]);
        log.info("Version installed: " + oldLatest["latest"]);
        if (oldLatest["latest"] == newLatest["latest"]) {
            log.info("Newest version already installed");
            launchbutton.disabled = false;
            document.getElementById("addons").disabled = false;
            launchbutton.innerHTML = "Launch Cosmo " + newLatest["latest"];
            jvm.getJvm(launchbutton, newLatest["latest"], document.getElementById("addons"))
            return;
        } else {
            launchbutton.innerHTML = "Found newer version! Updating...";
            if (!fs.existsSync(libdir + '/net/minecraft/launchwrapper/1.12/launchwrapper-1.12.jar')) {
                download("http://raw.githubusercontent.com/legendary-cookie/cosmo/main/launchwrapper-1.12.jar", libdir + '/net/minecraft/launchwrapper/1.12/launchwrapper-1.12.jar', function (error) {
                    if (error) throw error;
                    log.info("Downloaded launchwrapper library")
                });
            }
            download("http://github.com/legendary-cookie/cosmo/releases/latest/download/Cosmo-" + newLatest["latest"] + ".jar", cosmolibdir + '/Cosmo-LOCAL.jar', function (error) {
                if (error) throw error;
                launchbutton.disabled = false;
                document.getElementById("addons").disabled = false;
                launchbutton.innerHTML = "Launch Cosmo " + newLatest["latest"];
                log.info("Installed newest version");
                jvm.getJvm(launchbutton, newLatest["latest"], document.getElementById("addons"))
            });
        }
    })
}

function readFromJson(path) {
    if (!fs.existsSync(path)) return undefined;
    var obj = JSON.parse(fs.readFileSync(path, 'utf8'));
    return obj;
}

function createValidTreeStructure() {
    shelljs.mkdir('-p', mcdir);
    shelljs.mkdir('-p', versionsdir);
    shelljs.mkdir('-p', clientdir);
    shelljs.mkdir('-p', cosmolibdir);
    shelljs.mkdir('-p', libdir + '/net/minecraft/launchwrapper/1.12/');
}


module.exports = {
    download
}
