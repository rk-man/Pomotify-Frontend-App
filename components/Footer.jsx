import React from "react";
import styles from "@/styles/Footer.module.css";
import { FaClock } from "react-icons/fa";
import Link from "next/link";

function Footer() {
    return (
        <div className={styles.footer}>
            <h1 className="flex justify-center items-center gap-3">
                {" "}
                <FaClock />
                Pomotify
            </h1>
            <p>copyrights &copy; by Naveen RK </p>

            <div className="flex items-center justify-center gap-2">
                <Link href="/how-to-pomotify">
                    <button className="bg-transparent  text-white py-3 px-6 border border-transparent hover:border-white rounded text-2xl">
                        Contact Us
                    </button>
                </Link>
                <Link href="/how-to-pomotify">
                    <button className="bg-transparent  text-white py-3 px-6 border border-transparent hover:border-white rounded text-2xl">
                        About Pomotify
                    </button>
                </Link>
                <Link href="/how-to-pomotify">
                    <button className="bg-transparent  text-white  py-3 px-6 border border-transparent hover:border-white rounded text-2xl">
                        How To Pomotify ?
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default Footer;
