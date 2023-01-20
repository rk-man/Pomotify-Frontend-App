import React from "react";
import Link from "next/link";

function CompletedMessage({
    styles,
    pomo,
    completedMessageInHoursAndMinutes,
    resetEntireTimer,
    setFullScreen,
    setCompletedMessage,
}) {
    return (
        <div className={styles.completedMessage}>
            <div className="flex flex-col justify-center items-center text-center">
                <h3>Congratulations</h3>
                <h1> {pomo.user.fullName}</h1>
            </div>

            <div className="flex flex-col items-center justify-center gap-12">
                <p className="text-center w-5/6" style={{ fontSize: "2rem" }}>
                    You have successfully completed the pomodoro timer
                </p>
                <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-center">LOGS</h3>
                    <p className="mx-auto text-center mb-2">
                        Total Pomodoro Rounds completed :{" "}
                        <span
                            style={{
                                color: "#0AFA96",
                            }}
                        >
                            {pomo.repetitions}
                        </span>
                    </p>
                    <p className="text-center">
                        The total duration you have spent working on this
                        pomodoro session is <br></br>
                        <span
                            style={{
                                color: "#0AFA96",
                                fontSize: "2.4rem",
                                lineHeight: "1.3",
                            }}
                        >
                            {completedMessageInHoursAndMinutes()}
                        </span>
                    </p>
                </div>

                <div className="flex gap-8 w-full items-center justify-center">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setCompletedMessage((prev) => {
                                return !prev;
                            });
                            resetEntireTimer();
                            setFullScreen(false);
                        }}
                        className="bg-transparent hover:bg-white text-white font-semibold hover:text-black py-3 px-6 border border-white hover:border-transparent rounded text-2xl"
                    >
                        Restart
                    </button>

                    <Link href="/">
                        <button className="bg-transparent hover:bg-white text-white font-semibold hover:text-black py-3 px-6 border border-white hover:border-transparent rounded text-2xl">
                            Homepage
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default CompletedMessage;
