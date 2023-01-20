import Link from "next/link";
import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import Layout from "@/components/Layout";
import AuthContext from "contexts/authContext";

import { FaEye } from "react-icons/fa";

export default function SignupPage() {
    //context values;
    const { user, success, error, reset, signup } = useContext(AuthContext);

    //local state variables
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        passwordConfirm: "",
    });

    //hooks
    const router = useRouter();

    //side Effects
    useEffect(() => {
        if (user && success) {
            router.push("/");
        } else if (error) {
            toast.error(error.message);
        }
        reset();
    }, [user, success, error, reset]);

    //change the state variables as the user types
    const updateInputValues = (e) => {
        setUserData((prev) => {
            return {
                ...prev,
                [`${e.target.id}`]: e.target.value,
            };
        });
    };

    const resetInputValues = (e) => {
        e.preventDefault();
        setUserData({
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            passwordConfirm: "",
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        signup(userData);
    };

    const handleShowPassword = (e) => {
        e.preventDefault();

        document.getElementById("password").type =
            document.getElementById("password").type == "password"
                ? "text"
                : "password";
    };

    const handleShowConfirmPassword = (e) => {
        e.preventDefault();

        document.getElementById("passwordConfirm").type =
            document.getElementById("passwordConfirm").type == "password"
                ? "text"
                : "password";
    };

    return (
        <Layout title="Signup">
            <div className="form-container bg-black">
                <h2>Sign up here to start</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-container-grid">
                        <div className="w-full">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-2xl mb-6 mt-2"
                                id="firstName"
                                type="text"
                                value={userData.firstName}
                                onChange={updateInputValues}
                                placeholder="Enter your first name here..."
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-2xl mb-6 mt-2"
                                id="lastName"
                                type="text"
                                value={userData.lastName}
                                onChange={updateInputValues}
                                placeholder="Enter your last name here..."
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="username">Username</label>
                            <input
                                className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-2xl mb-6 mt-2"
                                id="username"
                                type="text"
                                value={userData.username}
                                onChange={updateInputValues}
                                placeholder="Enter your username here..."
                                required
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="email">Email</label>
                            <input
                                className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-2xl mb-6 mt-2"
                                id="email"
                                type="email"
                                value={userData.email}
                                onChange={updateInputValues}
                                placeholder="Enter your email here..."
                                required
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="password">Password</label>
                            <div
                                style={{
                                    position: "relative",
                                    marginTop: "0.5rem",
                                }}
                            >
                                <input
                                    className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-2xl"
                                    id="password"
                                    type="password"
                                    value={userData.password}
                                    onChange={updateInputValues}
                                    placeholder="Enter your password here..."
                                    required
                                />
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

                        <div className="w-full">
                            <label htmlFor="passwordConfirm">
                                Confirm Your Password
                            </label>
                            <div
                                style={{
                                    position: "relative",
                                    marginTop: "0.5rem",
                                }}
                            >
                                <input
                                    className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-2xl "
                                    id="passwordConfirm"
                                    type="password"
                                    value={userData.passwordConfirm}
                                    onChange={updateInputValues}
                                    placeholder="Confirm your password here..."
                                    required
                                />
                                <FaEye
                                    onClick={handleShowConfirmPassword}
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
                    </div>

                    <div className="flex justify-center gap-8">
                        <button
                            type="submit"
                            className="bg-transparent hover:bg-white text-white-700 font-semibold hover:text-black py-2 px-4 border border-white hover:border-transparent rounded text-2xl"
                        >
                            Sign in
                        </button>
                        <button
                            onClick={resetInputValues}
                            className="bg-transparent hover:bg-white text-white-700 font-semibold hover:text-black py-2 px-4 border border-white hover:border-transparent rounded text-2xl"
                        >
                            cancel
                        </button>
                    </div>
                </form>
                <Link href="/login" className="">
                    <p
                        className="text-center bg-white text-black font-semibold px-12 py-4 border border-2 border-black cursor-pointer hover:text-white hover:bg-black hover:border-transparent"
                        style={{ transform: "translateY(50%)" }}
                    >
                        Existing User ? Login here..
                    </p>
                </Link>
            </div>
        </Layout>
    );
}
