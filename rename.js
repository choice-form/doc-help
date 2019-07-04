


const fs = require('fs');

const rename = (files = []) => {
    files.forEach(file => {
        const newName = file.replace(/\/\d+_/g, '/');
        if (file !== newName) {
            fs.renameSync(file, newName);
            const status = fs.statSync(newName);
            if (status.isDirectory()) {
                const subNames = fs.readdirSync(newName);
                const subFiles = subNames.map(name => newName + '/' + name);
                rename(subFiles);
            }
        }
    })
}
const topDir = process.cwd();
const topNames = fs.readdirSync(topDir);
const topFiles = topNames.map(name => topDir + '/' + name);

rename(topFiles);