// components/ListItem.tsx
import React from "react";
import Link from "next/link";
import { Todo } from "../interfaces"; // Adjust the import to match your actual interface name

type Props = {
  task: Todo; // Adjust the type to match your actual interface name
};

const ListItem: React.FC<Props> = ({ task }) => (
  <Link href={`/tasks/${task.id}`}>
    <a>
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
        <h2 className="text-2xl font-semibold text-white">{task.title}</h2>
        <p className="text-gray-300">{task.description}</p>
        {/* Add more details or actions as needed */}
      </div>
    </a>
  </Link>
);

export default ListItem;
