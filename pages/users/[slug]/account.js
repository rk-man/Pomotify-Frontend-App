import Layout from "@/components/Layout";
import { BACKEND_URL } from "@/config/index";
import { parseCookies } from "@/helpers/index";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import styles from "@/styles/Account.module.css";
import AuthContext from "./../../../contexts/authContext";
import LoadingSpinner from "@/utils/LoadingSpinner";
import { useRouter } from "next/router";
import {
    FaTimes,
    FaUser,
    FaEye,
    FaUpload,
    FaImage,
    FaKey,
} from "react-icons/fa";
import { toast } from "react-toastify";
import NotLoggedIn from "@/components/NotLoggedIn";

function AccountPage({ user }) {
    //authcontext values
    const { userLoading, setUserLoading } = useContext(AuthContext);

    //state varaibles
    const [storedProfileImage, setStoredProfileImage] = useState(
        user ? user.profileImage : null
    );
    const [curProfileImage, setCurProfileImage] = useState(null);
    const [urlEncodedImage, setUrlEncodedImage] = useState(null);
    const [userData, setUserData] = useState({
        username: user ? user.username : "",
        firstName: user ? user.firstName : "",
        lastName: user ? user.lastName : "",
        email: user ? user.email : "",
    });
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        passwordConfirm: "",
    });

    //hooks
    const router = useRouter();

    //side effects
    useEffect(() => {
        if (user) setUserLoading(false);
    }, [user]);

    //FUNCTIONS -> INPUT CHANGES
    const hanldeInputFileChange = (e) => {
        setCurProfileImage(e.target.files[0]);
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onloadend = () => {
            setUrlEncodedImage(reader.result);
        };
    };

    const handleInputAccountDetailsChange = (e) => {
        setUserData((prev) => {
            return {
                ...prev,
                [`${e.target.id}`]: e.target.value,
            };
        });
    };

    const handleInputPasswordDataChanges = (e) => {
        setPasswordData((prev) => {
            return {
                ...prev,
                [`${e.target.id}`]: e.target.value,
            };
        });
    };

    //FUNCTIONS -> SUBMIT HANDLERS
    const handleFileUploadSubmit = async (e) => {
        e.preventDefault();
        setUserLoading(true);
        if (!curProfileImage || !urlEncodedImage) {
            return;
        }

        try {
            const res = await axios.post(`/api/users/upload-profile-image`, {
                username: user.username,
                file: urlEncodedImage,
            });
            setStoredProfileImage(res.data.user.profileImage);
         
            router.push(`/users/${user.username}/account`);
        } catch (err) {
            toast.error(err);
            console.log(err);
        }
        setUserLoading(false);
        setCurProfileImage(null);
        setUrlEncodedImage(null);
        document.getElementById("profileImageInput").value = "";
    };

    const handleAccountDetailsUpdateSubmit = async (e) => {
        e.preventDefault();
        setUserLoading(true);
        try {
            const res = await axios.post(`/api/users/account-update`, userData);
        
            router.push(`/users/${res.data.user.username}/account`);
        } catch (err) {
            toast.error(err.response.data.message);
        }

        setUserLoading(false);
    };

    const handlePasswordUpdateSubmit = async (e) => {
        e.preventDefault();
        setUserLoading(true);
        try {
            const res = await axios.post(
                `/api/users/password-update`,
                passwordData
            );
          
            toast.success("Successfully updated the password");
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message);
        }
        setPasswordData({
            oldPassword: "",
            newPassword: "",
            passwordConfirm: "",
        });
    };

    //OTHER FUNCTIONS
    const handleShowOldPassword = (e) => {
        e.preventDefault();

        document.getElementById("oldPassword").type =
            document.getElementById("oldPassword").type == "password"
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

    const handleShowNewPassword = (e) => {
        e.preventDefault();

        document.getElementById("newPassword").type =
            document.getElementById("newPassword").type == "password"
                ? "text"
                : "password";
    };

    return (
        <Layout title={`${user.username} | Account`}>
            {userLoading && <LoadingSpinner />}
            {!user ? (
                <NotLoggedIn page="account page" />
            ) : (
                <div className={styles.AccountContainer}>
                    <div className={styles.AccountSubContainer}>
                        <div className="flex flex-col items-center justify-center gap-6">
                            <div>
                                <FaImage
                                    style={{
                                        height: "4rem",
                                        width: "4rem",
                                        margin: "0 auto",
                                        marginBottom: "0.4rem",
                                    }}
                                />
                                <h2>Update your profile image </h2>
                            </div>
                            <img
                                className={styles.profileImage}
                                src={
                                    user.profileImage &&
                                    user.profileImage.startsWith(
                                        "/user-profile-images"
                                    )
                                        ? `https://pomotify-backend-app.herokuapp.com${user.profileImage}`
                                        : storedProfileImage &&
                                          storedProfileImage
                                }
                            />
                            <form
                                className="flex flex-col items-center justify-center gap-4"
                                onSubmit={handleFileUploadSubmit}
                            >
                                <input
                                    onChange={hanldeInputFileChange}
                                    type="file"
                                    id="profileImageInput"
                                    className="text-center mx-auto text-xl rounded bg-white py-4 text-black px-4"
                                />

                                <p
                                    className="mt-1 text-base text-gray-300 dark:text-gray-300 -mt-3 mb-4 "
                                    id="file_input_help"
                                >
                                    SVG, PNG, JPG or GIF (MAX. 800x400px).
                                </p>

                                {curProfileImage && urlEncodedImage ? (
                                    <div className="flex flex-col items-center justify-center gap-3 relative">
                                        <p>Image Preview</p>
                                        <img
                                            type="file"
                                            src={URL.createObjectURL(
                                                curProfileImage
                                            )}
                                            className={styles.profileImage}
                                        />
                                        <FaTimes
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurProfileImage(null);
                                                setUrlEncodedImage(null);
                                            }}
                                            style={{
                                                position: "absolute",
                                                top: "20%",
                                                right: 0,
                                                height: "2.4rem",
                                                width: "2.4rem",
                                                cursor: "pointer",
                                            }}
                                        />
                                        <button
                                            type="submit"
                                            className="bg-white hover:bg-black text-black font-semibold hover:text-white py-4 px-8 border hover:border-white border-2 border-white text-1xl mt-6 border-b-0 flex items-center justify-center gap-4"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                ) : (
                                    <p className="mb-12">No Image to preview</p>
                                )}
                            </form>
                        </div>
                    </div>
                    <div className={styles.AccountSubContainer}>
                        <FaUser
                            style={{
                                height: "4rem",
                                width: "4rem",
                                margin: "0 auto",
                                marginBottom: "1rem",
                            }}
                        />
                        <h2>Update your account details</h2>
                        <form
                            className="flex flex-col items-center justify-center gap-4 mt-16"
                            onSubmit={handleAccountDetailsUpdateSubmit}
                        >
                            <div className="w-full">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-2xl mb-6 mt-2"
                                    id="firstName"
                                    type="text"
                                    placeholder="Enter your first name here..."
                                    required
                                    value={userData.firstName}
                                    onChange={handleInputAccountDetailsChange}
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-2xl mb-6 mt-2"
                                    id="lastName"
                                    type="text"
                                    placeholder="Enter your last name here..."
                                    required
                                    value={userData.lastName}
                                    onChange={handleInputAccountDetailsChange}
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="username">Username</label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-2xl mb-6 mt-2"
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username here..."
                                    required
                                    onChange={handleInputAccountDetailsChange}
                                    value={userData.username}
                                />
                            </div>

                            <div className="w-full">
                                <label htmlFor="email">Email</label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-2xl mb-6 mt-2"
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email here..."
                                    required
                                    onChange={handleInputAccountDetailsChange}
                                    value={userData.email}
                                />
                            </div>
                            <div className="flex gap-12">
                                <button
                                    type="submit"
                                    className="bg-white hover:bg-black text-black font-semibold hover:text-white py-4 px-8 border hover:border-white border-2 border-white text-1xl mt-8 border-b-0"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setUserData({
                                            username: user.username || "",
                                            firstName: user.firstName || "",
                                            lastName: user.lastName || "",
                                            email: user.email || "",
                                        });
                                    }}
                                    className="bg-white hover:bg-black text-black font-semibold hover:text-white py-4 px-8 border hover:border-white border-2 border-white text-1xl mt-8 border-b-0"
                                >
                                    Reset Changes
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className={styles.AccountSubContainer}>
                        <FaKey
                            style={{
                                height: "4rem",
                                width: "4rem",
                                margin: "0 auto",
                                marginBottom: "1rem",
                            }}
                        />
                        <h2>Update your password here</h2>

                        <form
                            className="flex flex-col items-center justify-center gap-4 mt-16 mb-16"
                            onSubmit={handlePasswordUpdateSubmit}
                        >
                            <div className="w-full mb-6">
                                <label htmlFor="oldPassword">
                                    Current Password
                                </label>
                                <div
                                    style={{
                                        position: "relative",
                                        marginTop: "0.5rem",
                                    }}
                                >
                                    <input
                                        className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-2xl"
                                        id="oldPassword"
                                        type="password"
                                        value={passwordData.oldPassword}
                                        onChange={
                                            handleInputPasswordDataChanges
                                        }
                                        placeholder="Enter your current password here..."
                                        required
                                    />
                                    <FaEye
                                        onClick={handleShowOldPassword}
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

                            <div className="w-full mb-8">
                                <label htmlFor="newPassword">
                                    New Password
                                </label>
                                <div
                                    style={{
                                        position: "relative",
                                        marginTop: "0.5rem",
                                    }}
                                >
                                    <input
                                        className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-2xl "
                                        id="newPassword"
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={
                                            handleInputPasswordDataChanges
                                        }
                                        placeholder="Enter your new password here"
                                        required
                                    />
                                    <FaEye
                                        onClick={handleShowNewPassword}
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

                            <div className="w-full mb-8">
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
                                        value={passwordData.passwordConfirm}
                                        onChange={
                                            handleInputPasswordDataChanges
                                        }
                                        placeholder="Confirm your password here.."
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

                            <div className="flex gap-12">
                                <button
                                    type="submit"
                                    className="bg-white hover:bg-black text-black font-semibold hover:text-white py-4 px-8 border hover:border-white border-2 border-white text-1xl mt-8 border-b-0"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setPasswordData({
                                            oldPassword: "",
                                            newPassword: "",
                                            passwordConfirm: "",
                                        });
                                    }}
                                    className="bg-white hover:bg-black text-black font-semibold hover:text-white py-4 px-8 border hover:border-white border-2 border-white text-1xl mt-8 border-b-0"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default AccountPage;

export async function getServerSideProps({ req, query }) {
    const { token } = parseCookies(req);
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    let user = null;
    try {
        const backendRes = await axios.get(
            `${BACKEND_URL}/api/v1/users/${query.slug}`,
            config
        );
        user = backendRes.data.data.user;
    } catch (err) {
        console.log(err);
    }

    return {
        props: { user },
    };
}
