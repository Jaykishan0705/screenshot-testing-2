// Inside your /api/taskHandler.ts file:
import { NextApiRequest, NextApiResponse } from 'next';
import { exec as execCallback } from 'child_process';
import { v4 as uuidv4 } from 'uuid';

const tasks: Record<string, string> = {}; // Store task status

const exec = (command: string) =>
  new Promise(resolve => {
    execCallback(command, (err, stdout) => {
      console.log(stdout);
      return resolve(stdout);
    });
  });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { baseUrl, compareUrl } = req.body;

    if (!baseUrl || !compareUrl) {
      return res.status(500).json({ error: 'baseUrl and compareUrl are required' });
    }

    // Generate a unique task ID
    const newTaskId = uuidv4();
    tasks[newTaskId] = 'in progress'; // Set initial status

    // Start the task asynchronously
    process.nextTick(async () => {
      try {
        process.env.TARGET_URL = baseUrl;
        await exec('yarn lost-pixel update');

        process.env.TARGET_URL = compareUrl;
        await exec('yarn lost-pixel');

        tasks[newTaskId] = 'completed'; // Update status
      } catch (error) {
        tasks[newTaskId] = 'error'; // Update status
      }
    });

    // Return the task ID to the client
    res.status(200).json({ taskId: newTaskId });
  } else if (req.method === 'GET') {
    // This is the /checkTaskStatus endpoint
    const taskId = req.query.taskId as string;

    if (!taskId || !tasks[taskId]) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Return the status of the task
    res.status(200).json({ status: tasks[taskId] });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
