import Layout from "@/components/Layout";

import TaskDetails from "@/components/TaskDetails";

import styles from "@/styles/Pomos.module.css";
import PomoContext from "./../../contexts/pomoContext";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
function AddPomoPage() {
    const {
        pomoData,
        setPomoData,
        resetAllInputs,
        addNewPomo,
        pomoSuccess,
        resetPomo,
        setTasks,
        pomoError,
    } = useContext(PomoContext);

    //HOOKS
    // const router = useRouter();

    //SIDE EFFECTS
    useEffect(() => {
        if (pomoSuccess) {
            window.location.pathname = "/";
        } else if (pomoError) {
            toast.error(pomoError.message);
        }
        resetPomo();
    }, [pomoSuccess]);

    useEffect(() => {
        return () => {
            setTasks([]);
            localStorage.removeItem("tasks");
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        addNewPomo();
        resetAllInputs();
    };

    const changeInputValue = (e) => {
        if (e.target.id == "pomoName") {
            return setPomoData((prev) => {
                return {
                    ...prev,
                    [`${e.target.id}`]: e.target.value,
                };
            });
        }
        return setPomoData((prev) => {
            return {
                ...prev,
                [`${e.target.id}`]: Number(e.target.value),
            };
        });
    };
    return (
        <Layout title="Add New Pomo">
            <div className={styles.PomoDetails}>
                <h2 className="text-center">Add New Pomo here...</h2>
                <form className={styles.PomoForm} onSubmit={handleSubmit}>
                    <div className="flex flex-col w-4/6 items-center justify-center">
                        <label htmlFor="pomoName">Pomodoro Name</label>
                        <input
                            className="shadow appearance-none border rounded w-5/6 py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-2xl mb-6 mt-4 text-center"
                            id="pomoName"
                            type="text"
                            value={pomoData.pomoName}
                            onChange={changeInputValue}
                            placeholder="Enter your pomodoro name"
                            required
                        />
                    </div>

                    <div className={styles.PomoFormGrid}>
                        <div className="flex flex-col items-center justify-center gap-3">
                            <label htmlFor="runTime">Timer</label>
                            <input
                                className="shadow appearance-none border rounded w-3/6 py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-2xl"
                                id="runTime"
                                type="number"
                                onChange={changeInputValue}
                                value={pomoData.runTime}
                                required
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center gap-3">
                            <label htmlFor="breakTime">Break</label>

                            <input
                                className="shadow appearance-none border rounded w-3/6 py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-2xl"
                                id="breakTime"
                                type="number"
                                onChange={changeInputValue}
                                value={pomoData.breakTime}
                                required
                            />
                        </div>

                        <div className="flex flex-col items-center justify-center gap-3">
                            <label htmlFor="longBreakTime">Long Break</label>

                            <input
                                className="shadow appearance-none border rounded w-3/6 py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-2xl"
                                id="longBreakTime"
                                type="number"
                                onChange={changeInputValue}
                                value={pomoData.longBreakTime}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex w-5/6 items-center justify-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                            <label htmlFor="longBreakAt">
                                Long Break After
                            </label>

                            <input
                                className="shadow appearance-none border rounded w-3/6 py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-2xl"
                                id="longBreakAt"
                                type="number"
                                onChange={changeInputValue}
                                value={pomoData.longBreakAt}
                                required
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center gap-3">
                            <label htmlFor="repetitions">Repetitions</label>

                            <input
                                className="shadow appearance-none border rounded w-3/6 py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-2xl"
                                id="repetitions"
                                type="number"
                                onChange={changeInputValue}
                                value={pomoData.repetitions}
                                required
                            />
                        </div>
                    </div>

                    <TaskDetails />

                    <div className="flex justify-center gap-8 ">
                        <button
                            type="submit"
                            className="bg-transparent hover:bg-white text-white-700 font-semibold hover:text-black py-2 px-4 border border-white hover:border-transparent rounded text-2xl"
                        >
                            Add Pomo
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                resetAllInputs();
                            }}
                            className="bg-transparent hover:bg-white text-white-700 font-semibold hover:text-black py-2 px-4 border border-white hover:border-transparent rounded text-2xl"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}

export default AddPomoPage;
