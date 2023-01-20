import React, { useContext, useEffect, useState } from "react";
import styles from "@/styles/Timer.module.css";
import Layout from "@/components/Layout";
import { parseCookies } from "@/helpers/index";
import axios from "axios";
import { BACKEND_URL } from "@/config/index";
import PomoContext from "./../../../contexts/pomoContext";
import LoadingSpinner from "@/utils/LoadingSpinner";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import CompletedMessage from "@/components/CompletedMessage";
import SpotifyContext from "contexts/spotifyContext";
import SpotifyWebApi from "spotify-web-api-node";
import { useRouter } from "next/router";

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
});

export default function TimerPage({ pomo }) {
    //pomo context state values
    const { pomoLoading, setPomoLoading } = useContext(PomoContext);
    const { accessToken, handlePlayAllSongs, setPlay, setSelectedSongs, play } =
        useContext(SpotifyContext);

    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [secondsRemaining, setSecondsRemaining] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);
    const [timerData, setTimerData] = useState({
        totalTimerRounds: pomo.repetitions * 2,
        pomoRunning: false,
        breakRunning: false,
        longBreakRunning: false,
        longBreakAfter: pomo.longBreakAt * 2,
        roundsCompleted: 0,
    });
    const [upNext, setUpNext] = useState("Break");
    const breakMotivations = [
        "Take a walk to refresh your mind",
        "Listen to your favorite song",
        "Keep your mind off of work during this long break",
    ];

    const timerMotivations = [
        "All you need to do is just keep going",
        "Outwork the world to become the best",
        "If it's hard, do it hard but just get it done",
    ];
    const [curMotivation, setCurMotivation] = useState(timerMotivations[0]);
    const [completedMessage, setCompletedMessage] = useState(false);

    const [allPlaylists, setAllPlaylists] = useState([]);
    const [likedSongs, setAllLikedSongs] = useState([]);
    const [spotifyUsername, setSpotifyUsername] = useState("");
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [songRunning, setSongRunning] = useState(false);

    const router = useRouter();

    useEffect(() => {
        let interval;
        if (timerRunning) {
            interval = setInterval(() => {
                clearInterval(interval);
                updateRemainingSeconds(secondsRemaining - 1);
            }, 1000);
        }

        return () => {
            clearInterval(interval);
        };
    }, [secondsRemaining, timerRunning]);

    // setting all playlists options
    useEffect(() => {
        if (accessToken) {
            spotifyApi.setAccessToken(accessToken);
        }
    }, [accessToken]);

    useEffect(() => {
        if (accessToken) {
            spotifyApi.getMe().then((data) => {
                setSpotifyUsername(data.body.id);
            });
        }
    }, [accessToken]);

    useEffect(() => {
        if (spotifyUsername) {
            spotifyApi
                .getUserPlaylists(spotifyUsername)
                .then((data) => {
           
                    setAllPlaylists(data.body.items);
                })
                .catch((err) => {
                    console.log(err);
                });

            spotifyApi
                .getMySavedTracks({
                    limit: 50,
                })
                .then((data) => {
            
                    setAllLikedSongs(data.body.items);
                });
        }
    }, [spotifyUsername]);

    useEffect(() => {
        setPomoLoading(false);
        setTimerData((prev) => {
            return {
                ...prev,
                pomoRunning: true,
            };
        });
    }, []);

    useEffect(() => {
        findUpNext();
   
        if (timerData.longBreakRunning) {
            setSecondsRemaining(pomo.longBreakTime * 60);
            setSeconds(0);
            setMinutes(pomo.longBreakTime);
            return;
        }

        if (!timerData.longBreakRunning && timerData.pomoRunning) {
            setMinutes(pomo.runTime);
            setSeconds(0);
            setSecondsRemaining(pomo.runTime * 60);
        } else if (!timerData.longBreakRunning && timerData.breakRunning) {
            setMinutes(pomo.breakTime);
            setSeconds(0);
            setSecondsRemaining(pomo.breakTime * 60);
        }
    }, [timerData]);

    //useEffect for fullScreen
    useEffect(() => {
        if (!completedMessage && fullScreen) {
            document
                .getElementById("timer")
                .classList.add(`${styles.timerFullScreen}`);
        } else if (!completedMessage) {
            document
                .getElementById("timer")
                .classList.remove(`${styles.timerFullScreen}`);
        }
    }, [fullScreen]);

    //useEffect for changing motivations
    useEffect(() => {
        if (timerData.pomoRunning) {
            setCurMotivation(timerMotivations[getRandom(3)]);
        } else {
            setCurMotivation(breakMotivations[getRandom(3)]);
        }
    }, [timerData]);

    //useEffect for spotify Running
    useEffect(() => {
        if (completedMessage) {
            // setSelectedSongs([]);
            setPlay(false);
            return;
        }
        if (songRunning && timerData.breakRunning) {
            setPlay(false);
            return;
        }
        if (songRunning && timerRunning) {
            setPlay(true);
            return;
        }
        if (songRunning && !timerRunning) {
            setPlay(false);
            return;
        }
    }, [timerRunning, songRunning, completedMessage, timerData]);

    //basically to check if the entire pomodoro is completed
    const checkIfRoundsCompleted = (remSecs) => {
        if (
            timerData.roundsCompleted + 1 === timerData.totalTimerRounds &&
            remSecs <= 0
        ) {
            resetEntireTimer();
            return true;
        } else return false;
    };

    //check if the long break timer should run at the specified round
    const checkIfLongBreakTimerShouldRun = (remSecs) => {
        if (
            remSecs <= 0 &&
            (timerData.roundsCompleted + 1) % timerData.longBreakAfter == 0
        ) {
            // setTimerRunning(false);
            setTimerData((prev) => {
                return {
                    ...prev,
                    pomoRunning: false,
                    breakRunning: true,
                    longBreakRunning: true,
                    roundsCompleted: prev.roundsCompleted + 1,
                };
            });
            return true;
        } else {
            return false;
        }
    };

    //check if pomo timer or break timer should run...
    const checkPomoOrBreakTimer = (remSecs) => {
        if (remSecs <= 0) {
            //used for not auto-starting the timer
            // setTimerRunning(false);
            setTimerData((prev) => {
                return {
                    ...prev,
                    pomoRunning: !prev.pomoRunning,
                    breakRunning: !prev.breakRunning,
                    longBreakRunning: false,
                    roundsCompleted: prev.roundsCompleted + 1,
                };
            });
            return true;
        } else return false;
    };

    const updateRemainingSeconds = (remSecs) => {
        if (checkIfRoundsCompleted(remSecs)) {
            return;
        }

        if (checkIfLongBreakTimerShouldRun(remSecs)) {
            return;
        }

        if (checkPomoOrBreakTimer(remSecs)) {
            return;
        }

        setSecondsRemaining((prev) => {
            return prev - 1;
        });
        let mins = Math.floor(remSecs / 60);
        let secs = Math.floor(remSecs % 60);
        setMinutes(mins);
        setSeconds(secs);
    };

    //skip feature where the user can skip to the next timer
    function handleSkipToNextTimer(e) {
        e.preventDefault();

        if (
            timerData.breakRunning &&
            timerData.roundsCompleted + 1 == timerData.totalTimerRounds
        ) {
            setCompletedMessage(true);
            resetEntireTimer();
        }
        if (timerData.pomoRunning) {
            //used for not autostarting
            // setTimerRunning(false);
            setTimerData((prev) => {
                return {
                    ...prev,
                    pomoRunning: false,
                    breakRunning: true,
                    roundsCompleted: prev.roundsCompleted + 1,
                };
            });
            return;
        }

        if (timerData.longBreakRunning) {
            //used for not autostarting

            // setTimerRunning(false);
            setTimerData((prev) => {
                return {
                    ...prev,
                    pomoRunning: true,
                    breakRunning: false,
                    longBreakRunning: false,
                };
            });
            return;
        }

        if (
            timerData.breakRunning &&
            (timerData.roundsCompleted + 1) % timerData.longBreakAfter == 0
        ) {
            //used for not autostarting
            // setTimerRunning(false);
            setTimerData((prev) => {
                return {
                    ...prev,
                    pomoRunning: false,
                    breakRunning: true,
                    longBreakRunning: true,
                    roundsCompleted: prev.roundsCompleted + 1,
                };
            });
            return;
        }

        if (timerData.breakRunning) {
            //used for not autostarting
            // setTimerRunning(false);
            setTimerData((prev) => {
                return {
                    ...prev,
                    pomoRunning: true,
                    breakRunning: false,
                    longBreakRunning: false,
                    roundsCompleted: prev.roundsCompleted + 1,
                };
            });
            return;
        }
    }

    //get random integers within a range
    function getRandom(num) {
        return Math.floor(Math.random() * num);
    }

    //finding the upNext timer
    function findUpNext() {
        if (
            timerData.breakRunning &&
            timerData.roundsCompleted + 1 == timerData.totalTimerRounds
        ) {
            setUpNext("Completed");
            return;
        }
        if (timerData.longBreakRunning) {
            setUpNext("Timer");
            return;
        }

        if (timerData.pomoRunning) {
            setUpNext("Break");
            return;
        }

        if (
            timerData.breakRunning &&
            (timerData.roundsCompleted + 1) % timerData.longBreakAfter == 0
        ) {
            setUpNext("Long Break");
            return;
        }

        if (timerData.breakRunning) {
            setUpNext("Timer");
        }
    }

    //resetAllStateValues
    function resetEntireTimer() {
        setSongRunning(false);
        setPlay(false);
        setMinutes(pomo.runTime);
        setSeconds(0);
        setSecondsRemaining(pomo.runTime * 60);
        setTimerData((prev) => {
            return {
                ...prev,
                pomoRunning: true,
                longBreakRunning: false,
                breakRunning: false,
                roundsCompleted: 0,
            };
        });
        setCurMotivation(timerMotivations[1]);
        setTimerRunning(false);
        setSelectedPlaylist(null);
        document.querySelector("select").firstChild.selected = true;
        window.location.reload();
    }

    function completedMessageInHoursAndMinutes() {
        let totalMinutes = (pomo.runTime + pomo.breakTime) * pomo.repetitions;
        let hours = totalMinutes / 60;
        let mins = totalMinutes % 60;
        return `${hours} hours ${mins} minutes`;
    }

    function handleRunSelectedPlaylist() {
        if (songRunning) return;
        if (selectedPlaylist == "" || selectedPlaylist == null) return;

        if (selectedPlaylist == "liked-songs") {
            handlePlayAllSongs(likedSongs);
            setSongRunning(true);
            setPlay(true);
            return;
        }

        spotifyApi
            .getPlaylist(selectedPlaylist.id)
            .then((data) => {
  
                handlePlayAllSongs(data.body.tracks.items);
                setSongRunning(true);
                setPlay(true);
            })
            .then((err) => {
                console.log(err);
            });
    }

    return (
        <Layout title={`Timer | ${pomo ? pomo.pomoName : ""} `}>
            {pomoLoading && <LoadingSpinner />}
            <div className="mb-20">
                {!completedMessage ? (
                    <div className="flex flex-col items-center justify-center gap-16">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setFullScreen((prev) => {
                                    return !prev;
                                });
                            }}
                            className="bg-black hover:bg-white text-white font-semibold hover:text-black py-4 px-8 border border-2 border-black rounded text-4xl"
                        >
                            {!fullScreen
                                ? "Show Full Screen"
                                : "Hide Full Screen"}
                        </button>

                        <div className={styles.timer} id="timer">
                            <div className="w-full flex flex-col items-center justify-center gap-8">
                                <p className="bg-white py-6 px-12 text-black font-bold flex flex-col items-center justify-center gap-2">
                                    #{" "}
                                    {`ROUND ${Math.floor(
                                        timerData.roundsCompleted / 2 + 1
                                    )}`}
                                </p>

                                <p className="font-semibold bg-white w-full text-black text-center py-4 border-4 border-black">
                                    {timerData.pomoRunning
                                        ? "POMODORO"
                                        : timerData.longBreakRunning
                                        ? "LONG BREAK"
                                        : "BREAK"}
                                </p>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-2">
                                <h2>{pomo.pomoName}</h2>

                                <div
                                    className="flex items-center justify-center gap-4"
                                    id={styles.timerDisplay}
                                >
                                    <h1>
                                        {minutes < 10 ? `0${minutes}` : minutes}
                                    </h1>

                                    <h1>:</h1>

                                    <h1>
                                        {seconds < 10 ? `0${seconds}` : seconds}
                                    </h1>
                                </div>

                                <div className="flex gap-12">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setTimerRunning((prev) => {
                                                return !prev;
                                            });
                                            handleRunSelectedPlaylist();
                                        }}
                                        className="bg-transparent hover:bg-white text-white-700 font-semibold hover:text-black py-4 px-8 border border-white hover:border-transparent rounded text-4xl"
                                    >
                                        {timerRunning ? "Pause" : "Start"}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            resetEntireTimer();
                                        }}
                                        className="bg-transparent hover:bg-white text-white-700 font-semibold hover:text-black py-4 px-8 border border-white hover:border-transparent rounded text-4xl"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>

                            <select
                                className={styles.PlaylistOptions}
                                onChange={(e) => {
                                    setSelectedPlaylist(
                                        JSON.parse(
                                            e.target.options[
                                                e.target.selectedIndex
                                            ].dataset.playlist
                                        )
                                    );
                                }}
                            >
                                <option data-playlist={JSON.stringify("")}>
                                    Select a playlist
                                </option>
                                {allPlaylists.map((playlist) => {
                                    return (
                                        <option
                                            key={playlist.id}
                                            data-playlist={JSON.stringify(
                                                playlist
                                            )}
                                        >
                                            {playlist.name}
                                        </option>
                                    );
                                })}
                                <option
                                    data-playlist={JSON.stringify(
                                        "liked-songs"
                                    )}
                                    defaultChecked
                                >
                                    Liked Songs
                                </option>
                            </select>

                            <div
                                className="bg-white px-6 py-8 text-black"
                                id={styles.timerMotivation}
                            >
                                <p>{curMotivation}</p>
                            </div>
                        </div>
                        {/* This is for the upcoming timer */}
                        <div className="w-full flex flex-col items-center justify-center gap-4">
                            <button
                                onClick={handleSkipToNextTimer}
                                className="bg-black hover:bg-white text-white hover:text-black py-3 px-8 border border-2 border-black rounded text-2xl flex justify-center items-center gap-2"
                            >
                                {upNext} <FaArrowRight />
                            </button>
                        </div>
                    </div>
                ) : (
                    <CompletedMessage
                        styles={styles}
                        pomo={pomo}
                        completedMessageInHoursAndMinutes={
                            completedMessageInHoursAndMinutes
                        }
                        resetEntireTimer={resetEntireTimer}
                        setFullScreen={setFullScreen}
                        setCompletedMessage={setCompletedMessage}
                    />
                )}
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


    return {
        props: { pomo },
    };
}
