import React from 'react';

const AssignedTestIndicator = ({ color, text }) => {
    return (
        <div className='flex gap-[10px] items-center'>
            <div className={`w-[20px] h-[20px] rounded-full`} style={{ backgroundColor: color }}></div>
            <span className='text-[17.5px] font-medium text-[#26435F]'>{text}</span>
        </div>
    );
};

export default AssignedTestIndicator;