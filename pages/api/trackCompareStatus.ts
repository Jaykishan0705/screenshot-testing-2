import { NextApiRequest, NextApiResponse } from 'next';

import tasks from '@/src/tasks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const taskId = req.query.taskId as string;

  if (!taskId || !tasks.getTaskStatus(taskId)) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Return the status of the task
  res.status(200).json({ status: tasks.getTaskStatus(taskId) });
}
