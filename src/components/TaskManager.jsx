import { useState, useEffect } from "react";
import axios from "axios";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token"); // Get the token

      try {
        const response = await axios.get("http://localhost:8000/all-tasks", {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        });
        setTasks(response.data); // Set tasks from the response
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  // Add a new task to the list
  const addTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  // Update a task in the list
  const updateTask = (index, updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, i) => (i === index ? updatedTask : task))
    );
  };

  // Delete a task from the list
  const deleteTask = (index) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
      {/* Task Form to add a new task */}
      <TaskForm addTask={addTask} />

      {/* Task List to display, edit, and delete tasks */}
      <TaskList tasks={tasks} updateTask={updateTask} deleteTask={deleteTask} />
    </div>
  );
};

const TaskForm = ({ addTask }) => {
  const [task, setTask] = useState({
    name: "",
    description: "",
    status: "Not Completed",
    assignDate: "",
    lastDate: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Get the token
    console.log("Token:", token); // Log the token to check its validity

    if (
      !task.name.trim() ||
      !task.description.trim() ||
      !task.assignDate ||
      !task.lastDate
    ) {
      setError("Please fill in all fields.");
      return;
    }
    setError(""); // Clear error if form is valid

    try {
      const response = await axios.post(
        "http://localhost:8000/add-task",
        task,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        }
      );
      addTask(response.data); // Update the UI with the newly added task
      setTask({
        name: "",
        description: "",
        status: "Not Completed",
        assignDate: "",
        lastDate: "",
      });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      {error && <p className="text-danger">{error}</p>}

      <div className="form-group">
        <input
          type="text"
          name="name"
          className="form-control mb-2"
          placeholder="Task Name"
          value={task.name}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          name="description"
          className="form-control mb-2"
          placeholder="Task Description"
          value={task.description}
          onChange={handleChange}
        />
      </div>

      <div className="form-group d-flex mb-3">
        <p className="text-center m-2 text-success fw-bolder">Assign Date</p>
        <input
          type="date"
          name="assignDate"
          className="form-control m-2 w-75"
          value={task.assignDate}
          onChange={handleChange}
        />

        <p className="text-center m-2 text-danger fw-bolder">Finish Date</p>
        <input
          type="date"
          name="lastDate"
          className="form-control m-2 w-75"
          value={task.lastDate}
          onChange={handleChange}
        />
      </div>

      <div className="d-flex justify-content-center">
        <button
          type="submit"
          className="btn btn-success text-white fs-5 rounded w-25 h-50"
        >
          Add Task
        </button>
      </div>
    </form>
  );
};

const TaskList = ({ tasks, setTasks, updateTask, deleteTask }) => {
  const [editIndex, setEditIndex] = useState(null); // Track the current editing task
  const [editedTask, setEditedTask] = useState({
    name: "",
    description: "",
    status: "Not Completed",
    assignDate: "",
    lastDate: "",
  });
  const [filter, setFilter] = useState("All"); // Track the status filter

  const handleEditClick = (index, task) => {
    setEditIndex(index);
    setEditedTask(task);
  };

  const handleSaveClick = async (index) => {
    const token = localStorage.getItem("token"); // Get the token

    try {
      const response = await axios.put(
        `http://localhost:8000/edit-task/${tasks[index]._id}`,
        editedTask,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        }
      );
      updateTask(index, response.data); // Update the task in UI
      setEditIndex(null); // Exit edit mode
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteClick = async (index) => {
    const token = localStorage.getItem("token"); // Get the token

    try {
      await axios.delete(
        `http://localhost:8000/delete-task/${tasks[index]._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        }
      );
      deleteTask(index); // Remove task from UI
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;
  const incompleteTasks = tasks.filter(
    (task) => task.status === "Not Completed"
  ).length;

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Completed") return task.status === "Completed";
    if (filter === "Not Completed") return task.status === "Not Completed";
    return true; // For "All"
  });

  return (
    <>
      <div className="d-flex justify-content-between text-center">
        <div className="mb-3">
          <label>
            <h4>Status Filter:</h4>{" "}
          </label>
          <select
            onChange={(e) => setFilter(e.target.value)}
            value={filter}
            className="ms-2"
          >
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="Not Completed">Incomplete</option>
          </select>
        </div>

        <div className="text-center m-2">
          <h3 className="mb-0">Task Lists</h3>
        </div>

        <div className="d-flex align-items-center">
          <span className="bg-primary text-white fw-bold px-3 py-2 mx-1 rounded-circle">
            {totalTasks}
          </span>
          <span className="bg-success text-white fw-bold px-3 py-2 mx-1 rounded-circle">
            {completedTasks}
          </span>
          <span className="bg-danger text-white fw-bold px-3 py-2 mx-1 rounded-circle">
            {incompleteTasks}
          </span>
        </div>
      </div>

      <div className="row">
        {filteredTasks.map((task, index) => (
          <div className="col-md-3" key={index}>
            <div className="card mb-3">
              <div className="card-body">
                {editIndex === index ? (
                  <>
                    <input
                      type="text"
                      name="name"
                      className="form-control mb-2"
                      value={editedTask.name}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="description"
                      className="form-control mb-2"
                      value={editedTask.description}
                      onChange={handleInputChange}
                    />
                    <select
                      name="status"
                      value={editedTask.status}
                      onChange={handleInputChange}
                      className="form-select mb-2"
                    >
                      <option value="Not Completed">Not Completed</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-success"
                        onClick={() => handleSaveClick(index)}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => setEditIndex(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h5 className="card-title">{task.name}</h5>
                    <p className="card-text">{task.description}</p>
                    <p className="card-text">Status: {task.status}</p>
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-warning"
                        onClick={() => handleEditClick(index, task)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteClick(index)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TaskManager;
