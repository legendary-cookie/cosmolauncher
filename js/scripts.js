const storage = require('electron-json-storage');
const fs = require('fs');
const http = require('http');
const os = require('os');

const defaultDataPath = storage.getDefaultDataPath();


var mcdir = defaultDataPath + '/minecraft';
var versionsdir = mcdir + '/versions';
var clientdir = versionsdir + '/Ventoclient'

// onload
createValidTreeStructure();
updateClient();
// funcs
function updateClient() {
   document.addEventListener("DOMContentLoaded", function (event) {
      fs.writeFileSync(defaultDataPath + "/lastupdate", "Date.now()")
      launchbutton = document.getElementById("launch");
      launchbutton.disabled = true;
      launchbutton.innerHTML = "Updating!";
      if (!fs.existsSync(defaultDataPath + "/downloadurl.txt")) {
         fs.writeFileSync(defaultDataPath + "/downloadurl.txt", "http://mc.vincentschweiger.de:9199/cook1e/ventoclient-releases/-/raw/master/");
      };
      var downloadurl = fs.readFileSync(defaultDataPath + "/downloadurl.txt", 'utf-8');
      download(downloadurl + "Ventoclient.json", clientdir + '/Ventoclient.json', function (error) {
         if (error) throw error;
      })
      download(downloadurl + "Client.jar", clientdir + '/Ventoclient.jar', function (error) {
         if (error) throw error;
         launchbutton.disabled = false;
         launchbutton.innerHTML = "Launch Client";
      })
   });
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


function manualUpdate() {
   launchbutton = document.getElementById("launch");
   launchbutton.disabled = true;
   launchbutton.innerHTML = "Updating!";
   var downloadurl = fs.readFileSync(defaultDataPath + "/downloadurl.txt", 'utf-8');

   download(downloadurl + "Ventoclient.json", clientdir + '/Ventoclient.json', function (error) {
      if (error) throw error;
   })
   download(downloadurl + "Client.jar", clientdir + '/Ventoclient.jar', function (error) {
      if (error) throw error;
      launchbutton.disabled = false;
      launchbutton.innerHTML = "Launch Client";
   })
   function download(url, dest, cb) {
      var file = fs.createWriteStream(dest);
      var request = http.get(url, function (response) {
         response.pipe(file);
         file.on('finish', function () {
            file.close(cb);
         });
      });
   }
}


function createValidTreeStructure() {
   if (!fs.existsSync(mcdir)) {
      fs.mkdirSync(mcdir, { recursive: true });
   }
   if (!fs.existsSync(versionsdir)) {
      fs.mkdirSync(versionsdir, { recursive: true });
   }
   if (!fs.existsSync(clientdir)) {
      fs.mkdirSync(clientdir, { recursive: true });
   }
}

