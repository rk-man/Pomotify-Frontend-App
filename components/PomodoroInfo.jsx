import React from "react";
import styles from "@/styles/PomoInfo.module.css";

function PomdoroInfo() {
    return (
        <div className={styles.PomoInfoContainer}>
            <h1 className="text-center mb-8">How to set up pomo ? </h1>

            <p className="text-center mb-20 leading-9 ">
                Pomodoro timer enables us to work in sessions with regular
                intervals that recharges our brain to be more productive. Each
                session consists of work time and break time. A long break is
                neccessary after a set of consecutive pomodoro sessions
            </p>

            <ul className={styles.HowToPomos}>
                <div className="flex gap-12 items-center justify-center">
                    <p className="bg-white text-black px-8 py-4">Timer</p>
                    <li>Denotes how long you wanna be working per session</li>
                </div>
                <div className="flex gap-12 items-center justify-center">
                    <p className="bg-white text-black px-8 py-4">Break</p>
                    <li>
                        Denotes the duration of your break ...Make it not more
                        than 10 minutes
                    </li>
                </div>
                <div className="flex gap-12 items-center justify-center">
                    <p className="bg-white text-black px-8 py-4 ">Tasks</p>
                    <li>Denotes the tasks you wanna accomplish</li>
                </div>

                <div className="flex gap-12 items-center justify-center">
                    <p className="bg-white text-black w-80 py-4 flex items-center justify-center">
                        Long Break
                    </p>
                    <li>
                        Denotes the duration of your long break after a set of
                        pomodoros
                    </li>
                </div>

                <div className="flex gap-12 items-center justify-center">
                    <p className="bg-white text-black w-80 py-4 flex items-center justify-center px-2">
                        Long Break At
                    </p>
                    <li>
                        Denotes after how many consecutive sessions, you want a
                        long break.
                    </li>
                </div>

                <div className="flex gap-12 items-center justify-center">
                    <p className="bg-white text-black px-8 py-4">Repetitions</p>
                    <li>Denotes the total number of pomodoro sessions</li>
                </div>
            </ul>

            <p className="text-center">
                Click on the view timer to start your pomodoro sessions
            </p>
        </div>
    );
}

export default PomdoroInfo;

//denotes the duration of your break ...Make it not more than 10 minutes

//A long break is neccessary after a set of sessions. Here you specify the duration of the long break .

//Specifies after how many consecutive sessions, you want a long break.

//Denotes the total number of pomodoro sessions
