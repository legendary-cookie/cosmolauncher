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
        javaPath: jsonstorage.getDefaultDataPath()+"/jre1.8.0_291/bin/java",
        memory: {
            max: "6G",
            min: "4G"
        }
    }

    launcher.launch(opts);

    launcher.on('debug', (e) => console.log(e));
    launcher.on('data', (e) => console.log(e));
}

function launch165() {
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
        javaPath: jsonstorage.getDefaultDataPath()+"/jre1.8.0_291/bin/java",
        memory: {
            max: "6G",
            min: "4G"
        }
    }

    launcher.launch(opts);

    launcher.on('debug', (e) => console.log(e));
    launcher.on('data', (e) => console.log(e));
}


function launch17() {
    const nameuser = filesystem.readFileSync(jsonstorage.getDefaultDataPath() + "/email.txt", 'utf-8');
    const passuser = filesystem.readFileSync(jsonstorage.getDefaultDataPath() + "/password.txt", 'utf-8');
    let opts = {
        clientPackage: null,
        authorization: Authenticator.getAuth(nameuser, passuser),
        root: jsonstorage.getDefaultDataPath() + "/minecraft",
        version: {
            number: "1.17",
            type: "release"
        },
        javaPath: jsonstorage.getDefaultDataPath()+"/jdk-16.0.1/bin/java",
        memory: {
            max: "6G",
            min: "4G"
        }
    }

    launcher.launch(opts);

    launcher.on('debug', (e) => console.log(e));
    launcher.on('data', (e) => console.log(e));
}
