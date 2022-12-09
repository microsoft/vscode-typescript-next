// @ts-check
const fs = require('fs');
const path = require('path');

const json = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json')).toString());
const jsonLock = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package-lock.json')).toString());

// Set version to TS Version
let versionSuffix = (process.argv[2] || '').trim();

const baseVersion = jsonLock['dependencies']['typescript']['version'].replace(/0?\-\w*\./g, '');

// Hack to work around bad published version that has a trailing 0
if (baseVersion.startsWith('5.0.')) {
    versionSuffix = '0' + versionSuffix;
}

const version = baseVersion + versionSuffix;
if (version === json['version']) {
    console.log(`Already at latest version ${version}`);
    process.exit(1);
}

console.log(`Bumping to version ${version}`);
json['version'] = version;
fs.writeFileSync('./package.json', JSON.stringify(json, null, 2));

process.exit(0);