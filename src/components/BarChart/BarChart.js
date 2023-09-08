import React from 'react';
import stars from '../../assets/icons/stars.svg'

const BarChart = ({ studentFeedbacks }) => {
    console.log(studentFeedbacks)
    return (
        <div>
            <p className='text-[#26435F] text-xl font-semibold' >Student Feedback Overview</p>
            <div className='bg-[#FFFFFF] border-[1.458px] rounded-5 shadow-[0px_0px_2.91667px_0px_rgba(0,0,0,0.25)] pt-[28px] pb-[48px]  px-[11.28%]'>
                <div className='flex justify-between mb-[30px] text-[0.9114583333vw]'>
                    <p className='font-light text-[#092327]'> Total Ratings: 55</p>
                    <p className='text-[#667085]'><img className='inline-block' src={stars} alt="" />4.1</p>
                </div>
                <div className='flex justify-between text-center text-[#667085] text-[0.9114583333vw] pb-3'>
                    <div className='w-[13.32%] '>70%</div>
                    <div className='w-[13.32%] '>90%</div>
                    <div className='w-[13.32%] '>60%</div>
                    <div className='w-[13.32%] '>40%</div>
                    <div className='w-[13.32%] '>30%</div>
                </div>
                <div className='flex justify-between'>
                    <div className='w-[13.32%] h-[300px] rounded-[3px] relative border-[1.33px] border-[rgba(217,217,217,1)]'>
                        <div className=' bg-[#ebc034] w-full h-[70%] absolute bottom-0 rounded-[3px]'></div>
                    </div>
                    <div className='w-[13.32%] h-[300px] rounded-[3px] relative border-[1.33px] border-[rgba(217,217,217,1)]'>
                        <div className=' bg-[#ebc034] w-full h-[90%] absolute bottom-0 rounded-[3px]'></div>
                    </div>
                    <div className='w-[13.32%] h-[300px] rounded-[3px] relative border-[1.33px] border-[rgba(217,217,217,1)]'>
                        <div className=' bg-[#ebc034] w-full h-[60%] absolute bottom-0 rounded-[3px]'></div>
                    </div>
                    <div className='w-[13.32%] h-[300px] rounded-[3px] relative border-[1.33px] border-[rgba(217,217,217,1)]'>
                        <div className=' bg-[#ebc034] w-full h-[40%] absolute bottom-0 rounded-[3px]'></div>
                    </div>
                    <div className='w-[13.32%] h-[300px] rounded-[3px] relative border-[1.33px] border-[rgba(217,217,217,1)]'>
                        <div className=' bg-[#ebc034] w-full h-[30%] absolute bottom-0 rounded-[3px]'></div>
                    </div>
                </div>
                <div className='flex justify-between text-center text-[#455A64] text-[0.723vw] pt-2'>
                    <div className='w-[13.32%]  transform -rotate-45 -translate-x-3'>5 star</div>
                    <div className='w-[13.32%] transform -rotate-45 -translate-x-3'>4 star</div>
                    <div className='w-[13.32%] transform -rotate-45 -translate-x-3'>3 star</div>
                    <div className='w-[13.32%] transform -rotate-45 -translate-x-3'>2 star</div>
                    <div className='w-[13.32%] transform -rotate-45 -translate-x-3'>1 star</div>
                </div>
                <div className='mt-[30px] text-[0.9114583333vw]'>
                    <p className='text-center font-light mb-[11px]'>Top Service: {`{Service Name}`}</p>
                    <div className='flex justify-between '>
                        <p className='font-light text-[#092327]'> Total Ratings: 55</p>
                        <p className='text-[#667085]'><img className='inline-block' src={stars} alt="" />4.1</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BarChart;