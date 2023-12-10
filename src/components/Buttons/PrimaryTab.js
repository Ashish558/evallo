import React from 'react';
import Loader from '../Loader';

const PrimaryTab = ({ item,children, className, onClick, disabled, roundedClass, type, loading,absoluteElemClass }) => {
    // console.log(item)
    return (
        <button className={` relative text-[#26435F] py-[7px] px-6 ${className} disabled:opacity-60`}
            onClick={onClick}
            disabled={loading === true ? true : disabled}
            type={type ? type : 'button'}
        >
            {children}
            {
                loading &&
                <Loader />
            }
            <div style={{borderRadius:"3.75px 3.75px 0px 0px"}} className={`absolute left-0 right-0 bottom-0 h-[3.75px] ${absoluteElemClass}`}>

            </div>
        </button>
    )
}


export default PrimaryTab;