import { FaSpinner } from "react-icons/fa";
import styles from "@/styles/Spinner.module.css";

function LoadingSpinner() {
    return (
        <div className={styles.spinnerOverlay}>
            <FaSpinner className={styles.Spinner} />
        </div>
    );
}

export default LoadingSpinner;
