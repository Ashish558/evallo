import React from 'react'
import './loader.css'
export default function Loader({ size }) {


    return (
        <div className={`lds-ring ${size ? size : ''} `}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}
