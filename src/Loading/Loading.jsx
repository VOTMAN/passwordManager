import { useEffect, useState } from "react"
import styles from "./Loading.module.css"
import load from "./loading.png"

const Loading = ({ message = "Loading", showProgress = false, onComplete }) => {
    const [progress, setProgress] = useState(0)
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        // Simulate progress if showProgress is enabled
        if (showProgress) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    const newProgress = prev + Math.random() * 10
                    if (newProgress >= 100) {
                        clearInterval(interval)
                        if (onComplete) {
                            setTimeout(() => {
                                setIsVisible(false)
                                onComplete()
                            }, 500)
                        }
                        return 100
                    }
                    return newProgress
                })
            }, 200)

            return () => clearInterval(interval)
        }
    }, [showProgress, onComplete])

    if (!isVisible) return null

    return (
        <div className={`${styles.wrapper} ${!isVisible ? styles.fadeOut : ''}`}>
            {/* Floating particles */}
            <div className={styles.particle}></div>
            <div className={styles.particle}></div>
            <div className={styles.particle}></div>

            <div className={styles.container}>
                <div className={styles.iconContainer}>
                    <img
                        src={load}
                        alt="loading icon"
                        className={styles.rotate}
                    />
                </div>

                <h2 className={styles.text}>
                    {message}
                    <span className={styles.dots}></span>
                </h2>

                {showProgress && (
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Loading