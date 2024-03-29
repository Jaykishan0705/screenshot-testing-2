class Tasks {
  data: Record<string, string>;

  constructor() {
    this.data = {};
  }

  setTaskStatus(taskId: string, taskStatus: string) {
    this.data[taskId] = taskStatus;
  }

  getTaskStatus(taskId: string): string | undefined {
    return this.data[taskId];
  }
}

let tasks: Tasks;

if (process.env.NODE_ENV === 'production') {
  tasks = new Tasks();
} else {
  //@ts-ignore
  if (!global.tasks) {
    //@ts-ignore
    global.tasks = new Tasks();
  }
  //@ts-ignore
  tasks = global.tasks;
}

export default tasks;
