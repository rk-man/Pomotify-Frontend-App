import Layout from "@/components/Layout";
import styles from "@/styles/NotFound.module.css";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";

function notFoundPage() {
    return (
        <Layout>
            <div className={styles.errorContainer}>
                <div
                    className={`${styles.error} flex flex-col gap-10 items-center justify-center`}
                >
                    <FaExclamationTriangle
                        style={{ width: "3rem", height: "3rem" }}
                    />

                    <h2>Sorry there is nothing here...</h2>

                    <Link href="/">
                        <button className="bg-white hover:bg-transparent text-black font-semibold hover:text-white py-4 px-6 border border-white  rounded flex items-center justify-center gap-4">
                            <FaHome
                                style={{ width: "2.4rem", height: "2.4rem" }}
                            />
                            Go Back Home
                        </button>
                    </Link>
                </div>
            </div>
        </Layout>
    );
}

export default notFoundPage;
