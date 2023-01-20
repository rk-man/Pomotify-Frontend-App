import React from "react";
import Head from "next/head";

//importing components
import Header from "./Header";
import Footer from "./Footer";

//importing styles
import styles from "@/styles/Layout.module.css";

function Layout({ title, keywords, description, children }) {
    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
            </Head>

            <Header />
            <div className={styles.container}>{children}</div>
            <Footer />
        </div>
    );
}

Layout.defaultProps = {
    title: "Pomotify | A Productivity System",
    description: "One stop solution to maintaining productivity",
    keywords: "pomodoro, timer, spotify, music, productivity",
};

export default Layout;
