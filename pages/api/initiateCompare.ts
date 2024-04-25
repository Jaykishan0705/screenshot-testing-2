import { NextApiRequest, NextApiResponse } from 'next';
import { exec as execCallback } from 'child_process';
const fs = require('fs');

const exec = (command: string) =>
  new Promise(resolve => {
    execCallback(command, (err, stdout) => {
      console.log(stdout);
      return resolve(stdout);
    });
  });


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Source and destination paths
  const sourcePath = 'pages/api/database/v1/vercel.svg';
  const destinationPath = 'pages/api/database/v2/vercel.svg';

  // Copy the image
  fs.copyFile(sourcePath, destinationPath, (err: any) => {
    if (err) {
      console.error('Error copying image:', err);
      return;
    }
    console.log('Image copied successfully!');
  });

  res.status(200).json({  });
}
