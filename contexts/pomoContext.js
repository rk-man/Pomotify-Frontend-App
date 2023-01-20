import axios from "axios";
import { createContext, useEffect, useState } from "react";

import { toast } from "react-toastify";
import { useRouter } from "next/router";

const PomoContext = createContext();

export function PomoProvider({ children }) {
    const [pomoSuccess, setPomoSuccess] = useState(false);
    const [pomoError, setPomoError] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [pomoData, setPomoData] = useState({
        pomoName: "",
        runTime: 25,
        breakTime: 5,
        longBreakTime: 15,
        longBreakAt: 3,
        repetitions: 6,
    });
    const [pomoLoading, setPomoLoading] = useState(false);

    const router = useRouter();

    const addNewPomo = async () => {
        try {
            const res = await axios.post(`/api/pomos/add`, {
                ...pomoData,
                tasks,
            });
            setPomoSuccess(true);
           
        } catch (err) {
            setPomoError({
                err: err.response.data,
                message: err.response.data.message,
            });
            console.log(err);
        }
    };

    const editPomo = async (pomoSlug) => {
        setPomoLoading(true);
        try {
            const res = await axios.patch(`/api/pomos/edit`, {
                ...pomoData,
                slug: pomoSlug,
                tasks,
            });
            setPomoSuccess(true);
            setPomoData(res.data.pomo);
            setTasks(res.data.pomo.tasks);
           
        } catch (err) {
            setPomoError({
                err: err.response.data.err,
                message: err.response.data.message,
            });
            console.log(err);
        }
        setPomoLoading(false);
    };

    const deletePomo = async (slug) => {
        setPomoLoading(true);
        try {
            await axios.post(`/api/pomos/delete`, {
                slug,
            });
            resetAllInputs();
            router.push("/");
        } catch (err) {
            toast.error(err.response.data.message);
        }
        setPomoLoading(false);
    };

    const resetPomo = () => {
        setPomoSuccess(false);
        setPomoError(null);
    };

    const resetAllInputs = (e) => {
        setPomoData({
            pomoName: "",
            runTime: 25,
            breakTime: 5,
            longBreakTime: 15,
            longBreakAt: 3,
            repetitions: 6,
        });
        localStorage.removeItem("tasks");
        setTasks([]);
    };

    const removeTasksLS = (e) => {
        localStorage.removeItem("tasks");
        setTasks([]);
    };

    return (
        <PomoContext.Provider
            value={{
                addNewPomo,
                pomoSuccess,
                resetPomo,
                tasks,
                setTasks,
                pomoData,
                setPomoData,
                resetAllInputs,
                editPomo,
                pomoError,
                removeTasksLS,
                pomoLoading,
                setPomoLoading,
                deletePomo,
            }}
        >
            {children}
        </PomoContext.Provider>
    );
}

export default PomoContext;
