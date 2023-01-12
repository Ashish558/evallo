import React from 'react';

const AssignedTestIndicator = ({color, text}) => {
    return (
        <div className='flex gap-[20px] items-center'>
            <div className={`w-[20px] h-[20px] rounded-full`} style={{backgroundColor: color}}></div>
            <span className='text-[16px] font-medium text-[#4C4C4C]'>{text}</span>
        </div>
    );
};

export default AssignedTestIndicator;