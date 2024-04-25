import { NextApiRequest, NextApiResponse } from 'next';
import { exec as execCallback } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import { runner } from 'lost-pixel/dist/runner'

import tasks from '@/src/tasks';

const exec = (command: string) =>
  new Promise(resolve => {
    execCallback(command, (err, stdout) => {
      console.log(stdout);
      return resolve(stdout);
    });
  });

const config = {
  pageShots: {
    pages: [
      { path: '/pricing/customer-service/', name: 'pricing-customer-service' },
      { path: '/pricing/social-media-management/', name: 'pricing-social-media-management' },
      { path: '/pricing/consumer-intelligence', name: 'pricing-consumer-intelligence' },
      { path: '/pricing/marketing-and-advertising', name: 'pricing-marketing-and-advertising' },
    ],
    baseUrl: process.env.TARGET_URL || 'https://www.sprinklr.com',
  },
  imagePathBaseline: 'pages/api/database/.lostpixel/baseline',
  imagePathCurrent: 'pages/api/database/.lostpixel/current',
  imagePathDifference: 'pages/api/database/.lostpixel/difference',
  generateOnly: true,
  failOnDifference: false,
  compareEngine: 'odiff',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { baseUrl, compareUrl } = req.body;

  if (!baseUrl || !compareUrl) {
    return res.status(500).json({ error: 'baseUrl and compareUrl are required' });
  }

  const newTaskId = uuidv4();

  tasks.setTaskStatus(newTaskId, 'in progress');

  process.nextTick(async () => {
    try {
      process.env.TARGET_URL = baseUrl;
      await runner(config);

      process.env.TARGET_URL = compareUrl;
      await exec('yarn lost-pixel');

      tasks.setTaskStatus(newTaskId, 'completed');
    } catch (error) {
      tasks.setTaskStatus(newTaskId, 'error');
    }
  });

  res.status(200).json({ taskId: newTaskId });
}
