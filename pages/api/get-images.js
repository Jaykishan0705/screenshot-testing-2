import fs from 'fs';
import { exec as execCallback } from 'child_process';

const exec = (command: string) =>
  new Promise(resolve => {
    execCallback(command, (err, stdout) => {
      console.log(stdout);
      console.error('err:', err);
      return resolve(stdout);
    });
  });

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { filename } = req.query; // Get filename from query parameter

    console.log('__dir', __dirname, __filename);
    await exec('ls');

    const imagePath1 = `pages/api/database/.lostpixel/baseline/pricing-consumer-intelligence.png`;

    try {
      const imageData = await fs.promises.readFile(imagePath1);
      res.setHeader('Content-Type', 'image/jpeg'); // Set content type
      res.status(200).send(imageData);
    } catch (error) {
      console.error(error);
      res.status(404).json({ message: 'Image not found' }); // Inform about missing image
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}