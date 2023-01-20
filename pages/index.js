import styles from "../styles/Pomos.module.css";
import { parseCookies } from "@/helpers/index";

import { BACKEND_URL } from "config";
import axios from "axios";
import Layout from "@/components/Layout";
import EachPomo from "@/components/EachPomo";

import { FaPlusCircle } from "react-icons/fa";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import AuthContext from "./../contexts/authContext";
import LoadingSpinner from "@/utils/LoadingSpinner";
import NotLoggedIn from "@/components/NotLoggedIn";

export default function HomePage({ pomos }) {
    const { userLoading, user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (pomos) setLoading(false);
    }, [user, pomos]);

    return (
        <Layout title="Home">
            {!user && !loading ? (
                <NotLoggedIn page="pomodoros" />
            ) : loading ? (
                <LoadingSpinner />
            ) : (
                <div>
                    {userLoading && <LoadingSpinner />}

                    {!userLoading && (
                        <div className="w-full">
                            <h1 className="text-center mb-16">
                                Welcome back, {user.username}
                            </h1>
                            {pomos.length > 0 && (
                                <div
                                    style={{
                                        minWdith: "50rem",
                                        maxWidth: "100rem",
                                        margin: "0 auto",
                                        padding: "0 2rem",
                                    }}
                                >
                                    <p className="font-semibold ">
                                        Total Pomos : {pomos.length}
                                    </p>
                                </div>
                            )}
                            <div className={styles.allPomos}>
                                <Link href="/pomos/add-pomo">
                                    <div
                                        className={`${styles.pomo} flex flex-col gap-4 items-center justify-center cursor-pointer`}
                                    >
                                        <p>Add New Pomodoro</p>
                                        <FaPlusCircle
                                            style={{
                                                height: "5rem",
                                                width: "5rem",
                                                cursor: "pointer",
                                            }}
                                            className={styles.plusCircle}
                                        />
                                    </div>
                                </Link>
                                {pomos.length > 0 &&
                                    pomos.map((pomo) => {
                                        return (
                                            <EachPomo
                                                key={pomo._id}
                                                pomo={pomo}
                                            />
                                        );
                                    })}
                            </div>
                            {pomos.length == 0 && (
                                <h1 className="text-center">No Pomos Yet</h1>
                            )}
                        </div>
                    )}
                </div>
            )}
        </Layout>
    );
}

export async function getServerSideProps({ req }) {
    const { token } = parseCookies(req);
    console.log("Hello there");

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    let pomos = [];

    try {
        const backendRes = await axios.get(
            `${BACKEND_URL}/api/v1/pomos`,
            config
        );
        pomos = backendRes.data.data.pomos;
    } catch (err) {
        console.log(err);
    }

    return {
        props: { pomos },
    };
}
