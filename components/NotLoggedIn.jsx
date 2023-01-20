import React from "react";
import { FaUser, FaBan } from "react-icons/fa";

function NotLoggedIn({ page }) {
    return (
        <div className=" mt-40 text-center w-4/6 mx-auto text-white bg-black p-16">
            <FaBan
                style={{
                    height: "4rem",
                    width: "4rem",
                    margin: "0 auto",
                    marginBottom: "1rem",
                }}
            />

            <h2 className="mb-2">You are not logged in..</h2>
            <h3 className="">Please log in to access your {page}</h3>
        </div>
    );
}

export default NotLoggedIn;
