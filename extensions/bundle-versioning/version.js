const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ROOT = path.join(__dirname, '../../');


var manifest = {
    packageUrl: 'http://localhost/tutorial-hot-update/remote-assets/',
    remoteManifestUrl: 'http://localhost/tutorial-hot-update/remote-assets/project.manifest',
    remoteVersionUrl: 'http://localhost/tutorial-hot-update/remote-assets/version.manifest',
    version: '1.0.0',
    assets: {},
    searchPaths: []
};

let [, , bundleName, bundleVersion, remoteUrl, manifestPath] = process.argv;
const src = path.join(ROOT, manifestPath, bundleName);
const destManifest = path.join(src, 'project.manifest');
const destVersion = path.join(src, 'version.manifest');

if (remoteUrl[remoteUrl.length - 1] === '/') {
    remoteUrl = remoteUrl.substring(0, remoteUrl.length - 1);
}

if (manifestPath[manifestPath.length - 1] === '/') {
    manifestPath = manifestPath.substring(0, manifestPath.length - 1);
}

manifest.packageUrl = remoteUrl;
manifest.version = bundleVersion;
manifest.remoteManifestUrl = remoteUrl + '/project.manifest';
manifest.remoteVersionUrl = remoteUrl + '/version.manifest';

function readDir(dir, obj) {
    try {
        var stat = fs.statSync(dir);
        if (!stat.isDirectory()) {
            return;
        }
        var subpaths = fs.readdirSync(dir), subpath, size, md5, compressed, relative;
        for (var i = 0; i < subpaths.length; ++i) {
            if (subpaths[i][0] === '.') {
                continue;
            }
            subpath = path.join(dir, subpaths[i]);
            stat = fs.statSync(subpath);
            if (stat.isDirectory()) {
                readDir(subpath, obj);
            }
            else if (stat.isFile()) {
                if (subpath.split('.')[1] === 'manifest') {
                    continue;
                }

                // Size in Bytes
                size = stat['size'];
                md5 = crypto.createHash('md5').update(fs.readFileSync(subpath)).digest('hex');
                compressed = path.extname(subpath).toLowerCase() === '.zip';

                relative = path.relative(src, subpath);
                relative = relative.replace(/\\/g, '/');
                relative = encodeURI(relative);

                obj[relative] = {
                    'size': size,
                    'md5': md5
                };
                if (compressed) {
                    obj[relative].compressed = true;
                }
            }
        }
    } catch (err) {
        console.error(err)
    }
}

const mkdirSync = function (path) {
    try {
        fs.mkdirSync(path);
    } catch (e) {
        if (e.code != 'EEXIST') throw e;
    }
}

//---------------------------------------
fs.copyFile(path.join(src, 'cc.config.json'), path.join(src, 'config.json'), (err) => {
});

// Iterate assets and src folder
readDir(src, manifest.assets);
// readDir(path.join(src, 'native'), manifest.assets);

mkdirSync(src);

fs.writeFile(destManifest, JSON.stringify(manifest, null, 2), (err) => {
    if (err) throw err;
});

delete manifest.assets;
delete manifest.searchPaths;
fs.writeFile(destVersion, JSON.stringify(manifest), (err) => {
    if (err) throw err;

    console.log("OK");
});