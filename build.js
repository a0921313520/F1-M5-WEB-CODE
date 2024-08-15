const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

async function build() {
    console.log('Cleaning up previous build and export directories...');
    await runCommand('rimraf build && rimraf export');

    console.log('Building default version...');
    await runCommand('next build && next export -o export');

    console.log('Building hi version...');
    await runCommand('BASE_PATH=/hi ASSET_PREFIX=../ next build && BASE_PATH=/hi ASSET_PREFIX=../ next export -o export-temp');

    console.log('Moving hi version to export/hi');
    const exportDir = path.join(__dirname, 'export');
    const hiDir = path.join(exportDir, 'hi');
    const tempHiDir = path.join(__dirname, 'export-temp', 'hi');

    // Ensure export/hi directory exists and is empty
    await fs.ensureDir(hiDir);
    await fs.emptyDir(hiDir);

    // Move contents from export-temp/hi to export/hi
    if (await fs.pathExists(tempHiDir)) {
        await fs.copy(tempHiDir, hiDir);
    } else {
        console.error('Warning: Hi version directory not found in export-temp');
    }

    // Clean up temporary directory
    await fs.remove(path.join(__dirname, 'export-temp'));

    console.log('Build completed');
}

function runCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return reject(error);
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
            }
            console.log(`Stdout: ${stdout}`);
            resolve();
        });
    });
}

build().catch(console.error);