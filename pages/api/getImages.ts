import { NextApiRequest, NextApiResponse } from 'next';

const fs = require('fs');
const path = require('path');

function getAllScenarioFiles(directoryPath: string): string[] {
  const scenarioFiles: string[] = [];

  function traverseDirectory(currentPath: string) {
    const files: string[] = fs.readdirSync(currentPath);

    files.forEach((file: string) => {
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const basePath = './public/resources/.lostpixel/baseline';
  const scenarioFilesBase = getAllScenarioFiles(basePath);

  const diffPath = './public/resources/.lostpixel/difference';
  const scenarioFilesDiff = getAllScenarioFiles(diffPath);

  const images = scenarioFilesBase.map(file => {
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

  res.status(200).json(images);
}
