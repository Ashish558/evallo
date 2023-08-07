import React from 'react';
import Loader from '../Loader';

const PrimaryTab = ({ children, className, onClick, disabled, roundedClass, type, loading }) => {
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
        </button>
    )
}


export default PrimaryTab;