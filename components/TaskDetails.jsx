import styles from "@/styles/Pomos.module.css";
import PomoContext from "./../contexts/pomoContext";
import { useContext, useState, useEffect } from "react";
import { FaPlusCircle, FaTimes } from "react-icons/fa";

export default function TaskDetails() {
    const { tasks, setTasks } = useContext(PomoContext);

    const [showAddTask, setShowAddTask] = useState(false);
    const [taskContent, setTaskContent] = useState("");

    useEffect(() => {
        setTasks(JSON.parse(localStorage.getItem("tasks")) || []);
    }, []);

    const handleAddTask = (e) => {
        e.preventDefault();
        setTasks((prev) => {
            localStorage.setItem(
                "tasks",
                JSON.stringify([...prev, taskContent])
            );
            return [...prev, taskContent];
        });
        setShowAddTask(false);
        setTaskContent("");
    };
    const handleDeleteTask = (taskID) => {
        setTasks(() => {
            let updatedTasks = tasks.filter((content, id) => {
                return taskID != id;
            });
            localStorage.setItem("tasks", JSON.stringify(updatedTasks));
            return updatedTasks;
        });
    };

    return (
        <div
            className="flex flex-col items-center justify-center"
            id="tasks-container"
        >
            <h3 className="mb-4">Tasks</h3>
            {!showAddTask && (
                <div
                    className={styles.addTaskBtn}
                    onClick={(e) => {
                        e.preventDefault();
                        setShowAddTask(true);
                    }}
                >
                    <FaPlusCircle style={{ width: "3rem", height: "3rem" }} />

                    <p>New Task</p>
                </div>
            )}

            {showAddTask && (
                <div className={styles.EnterTaskContent}>
                    <textarea
                        cols="35"
                        rows="2"
                        className={styles.taskContent}
                        placeholder="Enter your task here.."
                        value={taskContent}
                        onChange={(e) => {
                            e.preventDefault();
                            setTaskContent(e.target.value);
                        }}
                    ></textarea>
                    <div className="flex gap-8">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                handleAddTask(e);
                            }}
                            className="bg-transparent hover:bg-black text-black font-semibold hover:text-white py-2 px-4 border border-black hover:border-transparent rounded text-2xl border-2"
                        >
                            Add Task
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setShowAddTask(false);
                            }}
                            className="bg-transparent hover:bg-black text-black font-semibold hover:text-white py-2 px-4 border border-black hover:border-transparent rounded text-2xl border-2"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div
                className="flex flex-col gap-8 items-center justify-center"
                id="tasks"
            >
                {tasks.length > 0 ? (
                    tasks.map((content, id) => {
                        return (
                            <div
                                className={styles.task}
                                key={id}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDeleteTask(id);
                                }}
                            >
                                <p className={styles.taskBody}>{content}</p>
                                <div className={styles.taskIconWrapper}>
                                    <FaTimes className={styles.taskIcon} />
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>No Tasks Created</p>
                )}
            </div>
        </div>
    );
}
