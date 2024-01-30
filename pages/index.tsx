import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomePage: React.FC = () => {
  const [tasks, setTasks] = useState<
    { id: number; task: string; time: string }[]
  >([]);
  const [taskInput, setTaskInput] = useState("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [voiceClicked, setVoiceClicked] = useState(false);
  const [submittedTask, setSubmittedTask] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskInput(e.target.value);
  };

  const handleVoiceInput = () => {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        console.error("Speech recognition not supported");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.start();

      let transcript = "";

      recognition.onresult = (event: SpeechRecognitionResult) => {
        transcript = event.results[0][0].transcript;
        setTaskInput(transcript);
      };

      recognition.onerror = (event: SpeechRecognitionResult) => {
        console.error("Speech recognition error", event.error);
      };

      recognition.onend = () => {
        console.log("Speech recognition ended");
        setVoiceClicked(true);
        toast.success("Voice recognition started");
      };
    } catch (error) {
      console.error("Error initializing speech recognition", error);
    }
  };

  const handleVoiceClose = () => {
    setVoiceClicked(false);
    toast.info("Voice recognition closed");
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
  };

  const addTask = () => {
    if (taskInput.trim() === "" || selectedTime === "") {
      toast.error("Please enter a task and select a time.");
      return;
    }

    if (editingTaskId !== null) {
      // If editing, update the existing task
      const updatedTasks = tasks.map((task) =>
        task.id === editingTaskId
          ? { ...task, task: taskInput, time: selectedTime }
          : task
      );
      setTasks(updatedTasks);
      setEditingTaskId(null);
      toast.success("Task updated successfully");
    } else {
      // If not editing, add a new task
      const newTask = {
        id: tasks.length + 1,
        task: taskInput,
        time: selectedTime,
      };

      setTasks([...tasks, newTask]);
      setSubmittedTask(`${newTask.task} at ${newTask.time}`);
      showNotification(`Task submitted: ${newTask.task} at ${newTask.time}`);
    }

    setTaskInput("");
    setSelectedTime("");
    setVoiceClicked(false);
  };

  const deleteTask = (taskId: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    setEditingTaskId(null);
  };

  const editTask = (taskId: number) => {
    setEditingTaskId(taskId);
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      setTaskInput(taskToEdit.task);
      setSelectedTime(taskToEdit.time);
    }
  };

  const handleSubmit = () => {
    const allTasksSubmitted = tasks.every(
      (task) => task.task.trim() !== "" && task.time !== ""
    );

    if (allTasksSubmitted) {
      const reminderTime = getReminderTime(tasks[0].time);

      setTimeout(() => {
        toast.info(`Reminder: ${tasks[0].task} at ${reminderTime}`);
        showNotification(`Reminder: ${tasks[0].task} at ${reminderTime}`);
      }, reminderTime.getTime() - Date.now() - 120000);

      setTimeout(() => {
        toast.info(`Task: ${tasks[0].task} at ${tasks[0].time}`);
        showNotification(`Task: ${tasks[0].task} at ${tasks[0].time}`);
      }, reminderTime.getTime() - Date.now());

      const isImportant = window.confirm("Is this task important?");
      const taskColor = isImportant ? "red" : "blue";
      console.log(`Task color: ${taskColor}`);
    } else {
      toast.error("Please fill in all task details before submitting.");
    }
  };

  const getReminderTime = (selectedTime: string): Date => {
    const [hours, minutes] = selectedTime.split(":").map(Number);

    const reminderTime = new Date();
    reminderTime.setHours(hours);
    reminderTime.setMinutes(minutes - 2);

    return reminderTime;
  };

  const showNotification = (message: string) => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(message);
        }
      });
    } else {
      new Notification(message);
    }
  };

  useEffect(() => {
    if (voiceClicked && taskInput.split(" ").length % 3 === 0) {
      setTaskInput(taskInput + " ");
    }
  }, [taskInput, voiceClicked]);

  return (
    <div className="bg-custom-bg p-4 rounded-md">
      <ToastContainer />
      <h1 className="text-black text-4xl text-center">To-Do List</h1>
      <div className="mb-4">
        <label className="text-black block mb-2">
          Task:
          <input
            type="text"
            value={taskInput}
            onChange={handleTaskChange}
            placeholder="Enter your task"
            className="w-full p-2 rounded-md border bg-white"
          />
        </label>
      </div>
      <div className="mb-4">
        <button
          onClick={handleVoiceInput}
          className="bg-white text-custom-bg px-4 py-2 rounded-md mr-2 hover:bg-gray-300"
        >
          Voice Input
        </button>
        {voiceClicked && (
          <button
            onClick={handleVoiceClose}
            className="bg-white text-custom-bg px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Close Voice
          </button>
        )}
      </div>
      <div className="mb-4">
        <label className="text-black block mb-2">
          Select Time:
          <input
            type="time"
            value={selectedTime}
            onChange={handleTimeChange}
            className="w-full p-2 rounded-md border bg-white text-black"
          />
        </label>
      </div>
      <div>
        <button
          onClick={() => {
            addTask();
            handleSubmit();
          }}
          className="bg-white text-custom-bg px-4 py-2 rounded-md hover:bg-gray-300"
        >
          {editingTaskId !== null ? "Update Task" : "Submit"}
        </button>
      </div>
      {tasks.map((task) => (
        <div key={task.id} className="relative mb-4">
          {editingTaskId === task.id && (
            <input
              type="text"
              value={taskInput}
              onChange={handleTaskChange}
              placeholder="Enter your task"
              className="w-full p-2 rounded-md border bg-white absolute top-0 left-0"
            />
          )}
          <label className="text-black block mb-2">
            {editingTaskId !== task.id ? (
              <>
                Task: {task.task}
                <button
                  onClick={() => editTask(task.id)}
                  className="absolute top-0 right-0 p-2 text-blue-500 hover:bg-gray-300"
                >
                  Edit
                </button>
              </>
            ) : (
              "Task:"
            )}
          </label>
          {editingTaskId === task.id && (
            <label className="text-white block mb-2">
              Select Time:
              <input
                type="time"
                value={selectedTime}
                onChange={handleTimeChange}
                className="w-full p-2 rounded-md border bg-white text-black"
              />
            </label>
          )}
          <button
            onClick={() => deleteTask(task.id)}
            className="absolute top-0 right-10 p-2 text-red-500 hover:bg-gray-300"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
