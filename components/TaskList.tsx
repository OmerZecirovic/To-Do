// components/TaskList.tsx
import React from "react";
import ListItem from "./ListItem";
import { Todo } from "../interfaces";

type Props = {
  tasks: Todo[];
};

// components/TaskList.tsx
const TaskList: React.FC<Props> = ({ tasks }) => (
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
    {tasks && tasks.map((task) => <ListItem key={task.id} task={task} />)}
  </div>
);

export default TaskList;
