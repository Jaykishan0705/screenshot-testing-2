import { NextApiRequest, NextApiResponse } from 'next';
import { exec as execCallback } from 'child_process';

const exec = (command: string) =>
  new Promise(resolve => {
    execCallback(command, (err, stdout) => {
      console.log(stdout);
      return resolve(stdout);
    });
  });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { baseUrl, compareUrl } = req.query;

  if (!baseUrl || !compareUrl) {
    return res.status(500).json({ error: 'baseUrl and compareUrl are required' });
  }

  try {
    process.env.TARGET_URL = baseUrl as string;
    await exec('yarn lost-pixel update');

    process.env.TARGET_URL = compareUrl as string;
    await exec('yarn lost-pixel');

    res.status(200).json(null);
  } catch (error) {
    res.status(500).json({ error: `An error occurred while running the commands: ${error}` });
  }
}
