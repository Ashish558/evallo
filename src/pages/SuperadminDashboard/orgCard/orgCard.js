import React from 'react'
import styles from './orgcard.module.css'

export default function OrgCard({heading, text}) {
    

    return (
       <div className={`${styles.container}`}>
        <p className={styles.heading} > {heading} </p>
        <p className={styles.text} > {text} </p>
       </div>
    )
}
