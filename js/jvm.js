const os = require('os');
const defaultDataPath = require('electron-json-storage').getDefaultDataPath();
const fs = require('fs');
const http = require('follow-redirects').https;
const tar = require('tar-fs');
const zlib = require('zlib')
const log = require('electron-log');


const linux_url = "https://github.com/legendary-cookie/pkg-repo/releases/download/jdk-8-linux/jre-8u291-linux-x64.tar.gz"
const windows_url = "https://github.com/legendary-cookie/pkg-repo/releases/download/JRE-8-windows/jre-8u291-windows-x64.tar.gz"

const linux_new_url = "https://github.com/legendary-cookie/pkg-repo/releases/download/jdk-16.0.1-all/openjdk-16.0.1_linux-x64_bin.tar.gz";
const windows_new_url = "https://github.com/legendary-cookie/pkg-repo/releases/download/jdk-16.0.1-all/jdk-16.0.1-windows.tar.gz";

function getJvm(launchbutton, latest, addonButton) {
    if (!fs.existsSync(defaultDataPath + "/jre1.8.0_291")) {
        launchbutton.disabled = true
        launchbutton.innerHTML = "Downloading JRE..."
        addonButton.disabled = true;
        if (os.platform() == 'win32') {
            download(windows_url, defaultDataPath + "/java-win.tar.gz", (error) => {
                if (error) throw error;
                log.info("Downloaded JRE")
                fs.createReadStream(defaultDataPath + "/java-win.tar.gz")
                    .pipe(zlib.createGunzip())
                    .pipe(tar.extract(defaultDataPath))
                    .on('finish', () => {
                        log.info("Extracted JRE")
                        launchbutton.innerHTML = "Launch Cosmo " + latest;
                        launchbutton.disabled = false;
                        addonButton.disabled = false;
                        fs.unlinkSync(defaultDataPath + "/java-win.tar.gz")
                    });
            });
        } else if (os.platform() == 'linux') {
            download(linux_url, defaultDataPath + "/java-linux.tar.gz", (error) => {
                if (error) throw error;
                log.info("Downloaded JRE")
                fs.createReadStream(defaultDataPath + "/java-linux.tar.gz")
                    .pipe(zlib.createGunzip())
                    .pipe(tar.extract(defaultDataPath))
                    .on('finish', () => {
                        log.info("Extracted JRE")
                        launchbutton.innerHTML = "Launch Cosmo " + latest;
                        launchbutton.disabled = false;
                        addonButton.disabled = false;
                        fs.unlinkSync(defaultDataPath + "/java-linux.tar.gz")
                    });
            });
        }
    }
}

function getNewJvm(launchbutton, latest, addonButton) {
    if (!fs.existsSync(defaultDataPath + "/jdk-16.0.1")) {
        launchbutton.disabled = true
        launchbutton.innerHTML = "Downloading Java 16..."
        addonButton.disabled = true;
        if (os.platform() == 'win32') {
            download(windows_new_url, defaultDataPath + "/java-win-new.tar.gz", (error) => {
                if (error) throw error;
                log.info("Downloaded JRE")
                fs.createReadStream(defaultDataPath + "/java-win-new.tar.gz")
                    .pipe(zlib.createGunzip())
                    .pipe(tar.extract(defaultDataPath))
                    .on('finish', () => {
                        log.info("Extracted JRE")
                        launchbutton.innerHTML = "Launch " + latest;
                        launchbutton.disabled = false;
                        addonButton.disabled = false;
                        fs.unlinkSync(defaultDataPath + "/java-win-new.tar.gz")
                    });
            });
        } else if (os.platform() == 'linux') {
            download(linux_new_url, defaultDataPath + "/java-linux-new.tar.gz", (error) => {
                if (error) throw error;
                log.info("Downloaded JRE")
                fs.createReadStream(defaultDataPath + "/java-linux-new.tar.gz")
                    .pipe(zlib.createGunzip())
                    .pipe(tar.extract(defaultDataPath))
                    .on('finish', () => {
                        log.info("Extracted JRE")
                        launchbutton.innerHTML = "Launch " + latest;
                        launchbutton.disabled = false;
                        addonButton.disabled = false;
                        fs.unlinkSync(defaultDataPath + "/java-linux-new.tar.gz")
                    });
            });
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

module.exports = {
    getJvm,
    getNewJvm
}