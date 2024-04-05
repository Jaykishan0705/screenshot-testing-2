import fs from 'fs';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { filename } = req.query; // Get filename from query parameter

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