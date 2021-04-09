const { Client, Authenticator } = require('minecraft-launcher-core');
const jsonstorage = require('electron-json-storage');
const filesystem = require('fs');
const launcher = new Client();

function launch() {
    const nameuser = filesystem.readFileSync(jsonstorage.getDefaultDataPath() + "/email.txt", 'utf-8');
    const passuser = filesystem.readFileSync(jsonstorage.getDefaultDataPath() + "/password.txt", 'utf-8');
    let opts = {
        clientPackage: null,
        authorization: Authenticator.getAuth(nameuser, passuser),
        root: jsonstorage.getDefaultDataPath() + "/minecraft",
        version: {
            number: "1.8.9",
            type: "release",
            custom: "Cosmo"
        },
        memory: {
            max: "8G",
            min: "4G"
        }
    }

    launcher.launch(opts);

    launcher.on('debug', (e) => console.log(e));
    launcher.on('data', (e) => console.log(e));
}

function launchlatest() {
    const nameuser = filesystem.readFileSync(jsonstorage.getDefaultDataPath() + "/email.txt", 'utf-8');
    const passuser = filesystem.readFileSync(jsonstorage.getDefaultDataPath() + "/password.txt", 'utf-8');
    let opts = {
        clientPackage: null,
        authorization: Authenticator.getAuth(nameuser, passuser),
        root: jsonstorage.getDefaultDataPath() + "/minecraft",
        version: {
            number: "1.16.5",
            type: "release"
        },
        memory: {
            max: "8G",
            min: "4G"
        }
    }

    launcher.launch(opts);

    launcher.on('debug', (e) => console.log(e));
    launcher.on('data', (e) => console.log(e));
}
