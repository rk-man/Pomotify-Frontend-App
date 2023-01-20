import Link from "next/link";
import React from "react";
import styles from "../styles/Pomos.module.css";
import { useRouter } from "next/router";
import { useContext } from "react";
import PomoContext from "contexts/pomoContext";
import LoadingSpinner from "@/utils/LoadingSpinner";

function EachPomo({ pomo }) {
    const { setPomoLoading, pomoLoading } = useContext(PomoContext);
    const router = useRouter();

    const handleSinglePage = (e) => {
        e.preventDefault();
        setPomoLoading(true);
        router.push(`/pomos/${pomo.slug}`);
    };

    return (
        <div className={styles.pomo}>
            {pomoLoading && <LoadingSpinner />}
            <div>
                <h3 className="text-center">{pomo.pomoName}</h3>
                <div className="flex flex-col items-start justify-center gap-4 mt-8">
                    <p>Timer Duration : {pomo.runTime}</p>
                    <p>Break Duration : {pomo.breakTime}</p>
                </div>
                <div className="w-full flex items-center justify-center mt-6">
                    <button
                        onClick={handleSinglePage}
                        className="bg-white hover:bg-transparent text-black font-semibold hover:text-white py-2 px-4 border border-white rounded text-2xl"
                    >
                        Show Details
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EachPomo;
