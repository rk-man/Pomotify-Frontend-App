import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { FaEye } from "react-icons/fa";

import Layout from "../components/Layout";

//import context
import AuthContext from "contexts/authContext";
import LoadingSpinner from "@/utils/LoadingSpinner";

export default function LoginPage() {
    //Auth context values
    const { login, user, success, error, reset, userLoading, setUserLoading } =
        useContext(AuthContext);

    //local state variables
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");

    //hooks
    const router = useRouter();

    //side effects
    useEffect(() => {
        if (user && success) {
            toast.success("Successfully logged in");
            setUserLoading(false);

            router.push("/");
        } else if (error) {
            setUserLoading(false);
            toast.error(error.message);
        }

        reset();
    }, [user, success, error, reset]);

    const resetInputValues = (e) => {
        e.preventDefault();
        setIdentifier("");
        setPassword("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        document.getElementById("password").type = "password";

        if (identifier.length > 0 && password.length > 0) {
            login({ identifier, password });
        }
    };

    const handleShowPassword = (e) => {
        e.preventDefault();
        document.getElementById("password").type =
            document.getElementById("password").type == "password"
                ? "text"
                : "password";
    };

    return (
        <Layout title="Login">
            {userLoading && <LoadingSpinner />}
            {!userLoading && (
                <div className="form-container bg-black">
                    <h2>Login here to continue</h2>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="identifier">Email or username</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-2xl mb-6 mt-2"
                            id="identifier"
                            type="text"
                            placeholder="Enter your email or username here..."
                            value={identifier}
                            onChange={(e) => {
                                setIdentifier(e.target.value);
                            }}
                            required
                        />
                        <label htmlFor="password" style={{ display: "block" }}>
                            Password
                        </label>
                        <div
                            style={{
                                position: "relative",
                                marginBottom: "4rem",
                                marginTop: "0.5rem",
                            }}
                        >
                            <input
                                className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-2xl"
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                                placeholder="Enter your password here..."
                                required
                            />
                            <div>
                                <FaEye
                                    onClick={handleShowPassword}
                                    style={{
                                        position: "absolute",
                                        top: "50% ",
                                        right: "0%",
                                        transform: "translate(-50%,-50%)",
                                        color: "black",
                                        height: "1.6rem",
                                        width: "1.6rem",
                                    }}
                                    id="showPassword"
                                />
                            </div>
                        </div>

                        <div className="flex justify-center gap-8">
                            <button
                                type="submit"
                                className="bg-transparent hover:bg-white text-white-700 font-semibold hover:text-black py-2 px-4 border border-white hover:border-transparent rounded text-2xl"
                            >
                                Login
                            </button>
                            <button
                                onClick={resetInputValues}
                                className="bg-transparent hover:bg-white text-white-700 font-semibold hover:text-black py-2 px-4 border border-white hover:border-transparent rounded text-2xl"
                            >
                                cancel
                            </button>
                        </div>
                    </form>
                    <Link href="/signup" className="">
                        <p
                            className="text-center bg-white text-black font-semibold px-12 py-4 border border-2 border-black cursor-pointer hover:text-white hover:bg-black hover:border-transparent"
                            style={{ transform: "translateY(50%)" }}
                        >
                            New User ? Sign up here...
                        </p>
                    </Link>
                </div>
            )}
        </Layout>
    );
}
