import Layout from "@/components/Layout";

import TaskDetails from "@/components/TaskDetails";
import { BACKEND_URL } from "@/config/index";
import { parseCookies } from "@/helpers/index";
import axios from "axios";
import React, { useContext, useEffect } from "react";

import styles from "@/styles/Pomos.module.css";
import PomoContext from "contexts/pomoContext";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Link from "next/link";

export default function SinglePomoPage({ pomo }) {
    const {
        setPomoData,
        resetAllInputs,
        pomoSuccess,
        resetPomo,
        setTasks,
        pomoData,
        pomoError,
        editPomo,
        removeTasksLS,
    } = useContext(PomoContext);

    const router = useRouter();
    //side effects
    useEffect(() => {
        if (pomoSuccess) {
            router.push(`/pomos/${pomoData.slug}`);
            toast.success("Pomodoro timer updated successfully");
        } else if (pomoError) {
            toast.error(pomoError.message);
        }
        resetPomo();
    }, [pomoSuccess, resetPomo]);

    useEffect(() => {
        if (pomo) {
            setPomoData({
                pomoName: pomo.pomoName || "",
                runTime: pomo.runTime || 25,
                breakTime: pomo.breakTime || 5,
                longBreakTime: pomo.longBreakTime || 15,
                longBreakAt: pomo.longBreakAt || 3,
                repetitions: pomo.repetitons || 6,
                slug: pomo.slug || "",
            });
            setTasks(pomo.tasks || []);
        }
    }, [pomo]);
    useEffect(() => {
        return () => {
            setTasks([]);
            localStorage.removeItem("tasks");
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        removeTasksLS();
        editPomo(pomo.slug);
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
        <Layout title={`${pomo.user.fullName} | ${pomo.pomoName}`}>
            <div className={styles.PomoDetails}>
                <Link href="/">
                    <a
                        className="bg-black hover:bg-white text-white font-semibold hover:text-black py-4 px-6 border border-white border-2 hover:border-black rounded text-2xl"
                        style={{
                            position: "absolute",
                            top: "0",
                            left: "50%",
                            transform: "translate(-50%,-50%)",
                        }}
                    >
                        View Timer
                    </a>
                </Link>
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

                    <div className="flex justify-center gap-8 mb-8 mt-8">
                        <button
                            type="submit"
                            className="bg-transparent hover:bg-white text-white-700 font-semibold hover:text-black py-2 px-4 border border-white hover:border-transparent rounded text-2xl"
                        >
                            Save Changes
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

export async function getServerSideProps({ req, query }) {
    const { token } = parseCookies(req);
    let pomo = {};
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    try {
        const res = await axios.get(
            `${BACKEND_URL}/api/v1/pomos/${query.slug}`,
            config
        );
        pomo = res.data.data.pomo;
    } catch (err) {
        console.log(err);
    }
    // console.log(pomo);

    return {
        props: { pomo },
    };
}
