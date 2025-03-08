import styles from "./Loading.module.css"
import load from "./loading.png"

const Loading = () => {

    return(
        <div className={styles.wrapper}>
            <img src={load} alt="loading icon" className={styles.rotate}/>
            {/* <h2 className={styles.text}>Loading...</h2> */}
        </div>
    )
}

export default Loading