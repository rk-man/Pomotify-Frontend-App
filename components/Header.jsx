import React, { useState } from "react";
import Link from "next/link";

import { useRouter } from "next/router";

import styles from "@/styles/Header.module.css";

import { FaClock, FaBars, FaTimes } from "react-icons/fa";
import { useContext } from "react";
import AuthContext from "contexts/authContext";
import { useEffect } from "react";
import { toast } from "react-toastify";
import SpotifyContext from "contexts/spotifyContext";

function Header() {
    const {
        reset,
        user,
        logout,
        success,
        userLoading,
        setUserLoading,
        spotifyConnected,
    } = useContext(AuthContext);
    const { accessToken } = useContext(SpotifyContext);

    const [toggleOpen, setToggleOpen] = useState(false);

    //hooks
    const router = useRouter();

    //side effects
    useEffect(() => {
        if (!user && success) {
            toast.success("Successfully logged out");
            router.push("/login");
            setUserLoading(false);
        }
        reset();
    }, [user, success]);

    useEffect(() => {
        () => {
            return () => {
                setToggleOpen(false);
            };
        };
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        setUserLoading(true);
        logout();
    };
    return (
        <header className={`${styles.header} bg-black`}>
            <h1
                onClick={(e) => {
                    e.preventDefault();
                    window.location.pathname = "/";
                }}
                className="flex gap-3 items-center justify-center cursor-pointer"
                href="/"
            >
                <FaClock style={{ width: "3rem", height: "3rem" }} />
                Pomotify
            </h1>

            <nav>
                {user ? (
                    <ul className={styles.navMenuToggle}>
                        {toggleOpen ? (
                            <FaTimes
                                style={{
                                    height: "4rem",
                                    width: "3rem",
                                    cursor: "pointer",
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setToggleOpen(false);
                                }}
                            />
                        ) : (
                            <FaBars
                                style={{
                                    height: "4rem",
                                    width: "3rem",
                                    cursor: "pointer",
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setToggleOpen(true);
                                }}
                            />
                        )}

                        {toggleOpen && (
                            <div className={styles.navMenuToggleItems}>
                                <li>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setUserLoading(true);
                                            router.push(
                                                `/users/${user.username}/account`
                                            );
                                        }}
                                        className="bg-transparent  text-white py-3 px-6 text-2xl"
                                    >
                                        Account
                                    </button>
                                </li>
                                <li>
                                    <Link href="/how-to-pomotify">
                                        <button className="bg-transparent  text-white  py-3 px-6 text-2xl">
                                            How To Pomotify ?
                                        </button>
                                    </Link>
                                </li>
                                {!spotifyConnected && (
                                    <li>
                                        <Link href="/spotify">
                                            <button className="bg-transparent  text-white  py-3 px-6 text-2xl">
                                                {accessToken
                                                    ? "Spotify Dashboarad"
                                                    : "Connect to Spotify"}
                                            </button>
                                        </Link>
                                    </li>
                                )}

                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-transparent hover:bg-white text-white font-semibold hover:text-black py-3 px-6 parent text-2xl"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </div>
                        )}
                    </ul>
                ) : (
                    <ul className={styles.navMenuToggle}>
                        {toggleOpen ? (
                            <FaTimes
                                style={{
                                    height: "4rem",
                                    width: "3rem",
                                    cursor: "pointer",
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setToggleOpen((prev) => {
                                        return !prev;
                                    });
                                }}
                            />
                        ) : (
                            <FaBars
                                style={{
                                    height: "4rem",
                                    width: "3rem",
                                    cursor: "pointer",
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setToggleOpen((prev) => {
                                        return !prev;
                                    });
                                }}
                            />
                        )}
                        {toggleOpen && (
                            <div className={styles.navMenuToggleItems}>
                                <li>
                                    <Link href="/login">
                                        <button className="bg-transparent hover:bg-white text-white font-semibold hover:text-black py-3 px-6 border border-white hover:border-transparent rounded text-2xl">
                                            Login
                                        </button>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/signup">
                                        <button className="bg-transparent hover:bg-white text-white font-semibold hover:text-black py-3 px-6 border border-white hover:border-transparent rounded text-2xl">
                                            Signup
                                        </button>
                                    </Link>
                                </li>
                            </div>
                        )}
                    </ul>
                )}
            </nav>
        </header>
    );
}

export default Header;
