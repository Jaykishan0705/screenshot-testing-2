/**
 * This script creates config of vrt-snapshots and stores it in display-data.json
 * display-data.json will be used by docs' vrt-display page to display all snapshots related to vrt on single page.
 * Helpful in CIs.
 */
const fs = require('fs');
const path = require('path');

function getAllScenarioFiles(directoryPath) {
  const scenarioFiles = [];

  function traverseDirectory(currentPath) {
    const files = fs.readdirSync(currentPath);

    files.forEach(file => {
      const filePath = path.join(currentPath, file);
      const fileStat = fs.statSync(filePath);

      if (fileStat.isDirectory()) {
        traverseDirectory(filePath); // Recursively traverse subdirectories
      } else if (file.endsWith('.png')) {
        const fileName = path.basename(file, '.png');
        scenarioFiles.push(fileName);
      }
    });
  }

  traverseDirectory(directoryPath);

  return scenarioFiles;
}

const basePath = './public/resources/.lostpixel/baseline';
const scenarioFilesBase = getAllScenarioFiles(basePath);

const diffPath = './public/resources/.lostpixel/difference';
const scenarioFilesDiff = getAllScenarioFiles(diffPath);

const arrToConvert = scenarioFilesBase.map(file => {
  let showType = 'unchanged';
  if (scenarioFilesDiff.includes(file)) showType = 'changed';

  return {
    srcBase: `resources/.lostpixel/baseline/${file}.png`,
    srcCur: `resources/.lostpixel/current/${file}.png`,
    srcDiff: `resources/.lostpixel/difference/${file}.png`,
    showType,
    alt: file,
  };
});

const json = JSON.stringify(arrToConvert);
fs.writeFile('./internals/data/display-data.json', json, 'utf8', err => {
  if (err) return console.error(err);
  console.log('JSON data has been imported as a .json file successfully!');
});
