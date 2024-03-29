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

  /* const handleVoiceInput = () => {
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
        console.error("Speech recognition error");
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
  }; */

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
    if (tasks.length === 0) {
      toast.error("Please add tasks before submitting.");
      return;
    }

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
    <div className=" bg-cover bg-center min-h-screen p-20 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ">
      <div className="bg-white dark:bg-slate-800 rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl">
        <div>
          <span className="inline-flex items-center justify-center p-2 bg-indigo-500 rounded-md shadow-lg">
            <svg
              className="h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              😊
            </svg>
          </span>
        </div>
        <ToastContainer />
        <h1 className="text-white text-4xl text-center">To-Do List</h1>
        <div className="mb-4">
          <label className="text-white block mb-2">
            Task:
            <input
              type="text"
              value={taskInput}
              onChange={handleTaskChange}
              placeholder="Enter your task"
              className="w-full p-2 rounded-md border bg-white text-black"
            />
          </label>

          <div className="mb-4">
            <button
              //onClick={handleVoiceInput}
              className="bg-white text-custom-bg px-4 py-2 rounded-md mr-2 hover:bg-indigo-400 transition-transform delay-100"
            >
              Voice Input
            </button>
            {voiceClicked && (
              <button
                // onClick={handleVoiceClose}
                className="bg-white text-custom-bg px-4 py-2 rounded-md hover:bg-indigo-400 transition-transform delay-100"
              >
                Close Voice
              </button>
            )}
          </div>
          <div className="mb-4">
            <label className="text-white block mb-2">
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
              className="bg-white px-4 py-2 rounded-md hover:bg-indigo-400 transition-transform delay-100"
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
              <label className="text-white block mb-2 py-8 no-underline hover:underline ">
                {editingTaskId !== task.id ? (
                  <>
                    Task: {task.task}
                    <button
                      onClick={() => editTask(task.id)}
                      className="absolute top-0 right-0 p-2 text-blue-500 hover:bg-gray-300 rounded-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
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
                className="absolute top-0 right-10 p-2 text-red-500 hover:bg-gray-300 rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
