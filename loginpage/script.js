const storage = require('electron-json-storage');
const fs = require('fs');

const defaultDataPath = storage.getDefaultDataPath();


function setCreds() {
   username = document.getElementById('email').value;
   password = document.getElementById('password').value;
   fs.writeFileSync(defaultDataPath + "/email.txt", username);
   fs.writeFileSync(defaultDataPath + "/password.txt", password);
}



document.getElementById('loginbutton').onclick = loginfunc;
function loginfunc() {
   setCreds();
}
