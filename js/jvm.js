const os = require('os');
const defaultDataPath = require('electron-json-storage').getDefaultDataPath();
const fs = require('fs');
const http = require('follow-redirects').https;
const tar = require('tar-fs');
const zlib = require('zlib')
const log = require('electron-log');


const linux_url = "https://javadl.oracle.com/webapps/download/AutoDL?BundleId=244573_d7fc238d0cbf4b0dac67be84580cfb4b"
const windows_url = "https://github.com/legendary-cookie/pkg-repo/releases/download/JRE-8-windows/jre-8u291-windows-x64.tar.gz"

function getJvm() {
    download(windows_url, defaultDataPath + "/java-win.tar.gz", (error) => {
        if (error) throw error;
        log.info("Downloaded JRE")
        fs.createReadStream(defaultDataPath + "/java-win.tar.gz")
            .pipe(zlib.createGunzip())
            .pipe(tar.extract(defaultDataPath))
            .on('finish', () => {
                log.info("Extracted JRE")
            });
    });
    /*
        download(linux_url, defaultDataPath + "/java-linx.tar.gz", (error) => {
            if (error) throw error;
        });
    */
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