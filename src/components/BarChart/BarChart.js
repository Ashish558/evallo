import React from 'react';
import stars from '../../assets/icons/stars.svg'
import starLight from '../../assets/icons/star-light.png'
import starGold from '../../assets/icons/star-gold.png'
import { useState } from 'react';

const BarChart = ({ studentFeedbacks }) => {
    // console.log(studentFeedbacks)
    const ratings = studentFeedbacks?.data?.ratingCounts
    const totalStudents = studentFeedbacks?.data?.feedback
    // console.log(totalStudents.length)

    let count = 0
    let percentage = []
    for (const key in ratings) {
        if (ratings.hasOwnProperty(key)) {
            count += ratings[key];
        }
    }

    for (const key in ratings) {
        if (Object.prototype.hasOwnProperty.call(ratings, key)) {
            const multipliedKey = (Number(key) * 100) / count;
            percentage.push(multipliedKey);
        }
    }
    console.log(count)
    const percentArray = percentage.map(value => `${value}%`);
    // console.log(percentArray)
    // console.log(studentFeedbacks?.data?.overallAverageRating)
    const stars = studentFeedbacks?.data?.overallAverageRating
    let element
    if (stars >= 4 && stars < 5) {
        // console.log('true')
        element =
            <div className='flex '>
                <img className='inline-block w-[13.5px] mr-[4px] ' src={starGold} alt="" />
                <img className='inline-block w-[13.5px] mr-[4px]' src={starGold} alt="" />
                <img className='inline-block w-[13.5px] mr-[4px]' src={starGold} alt="" />
                <img className='inline-block w-[13.5px] mr-[4px]' src={starGold} alt="" />
                <img className='inline-block w-[13.5px] mr-[4px]' src={starLight} alt="" />
            </div>
    }
    else if (stars >= 3 && stars < 4) {
        element =
            <div className='flex '>
                <img className='inline-block w-[13.5px] mr-[4px] ' src={starGold} alt="" />
                <img className='inline-block w-[13.5px] mr-[4px]' src={starGold} alt="" />
                <img className='inline-block w-[13.5px] mr-[4px]' src={starGold} alt="" />
                <img className='inline-block w-[13.5px] mr-[4px]' src={starLight} alt="" />
                <img className='inline-block w-[13.5px] mr-[4px]' src={starLight} alt="" />
            </div>
    }
    else if (stars >= 2 && stars < 3) {
        element =
            <div className='flex '>
                <img className='inline-block w-[13.5px] mr-[4px] ' src={starGold} alt="" />
                <img className='inline-block w-[13.5px] mr-[4px]' src={starGold} alt="" />
                <img className='inline-block w-[13.5px] mr-[4px]' src={starLight} alt="" />
                <img className='inline-block w-[13.5px] mr-[4px]' src={starLight} alt="" />
                <img className='inline-block w-[13.5px] mr-[4px]' src={starLight} alt="" />
            </div>
    }
    else if (stars >= 1 && stars < 2) {
        element =
            <div className='flex '>
                <img className='inline-block w-[13.5px] mr-[4px] ' src={starGold} alt="" />
                <img className='inline-block w-[13.5px] mr-[4px]' src={starLight} alt="" />
                <img className='inline-block w-[13.5px] mr-[4px]' src={starLight} alt="" />
                <img className='inline-block w-[13.5px] mr-[4px]' src={starLight} alt="" />
                <img className='inline-block w-[13.5px] mr-[4px]' src={starLight} alt="" />
            </div>
    }
    else if (stars >= 0 && stars < 1) {
        element =
            <div className='flex '>
                <img className='inline-block w-[13.5px] mr-[4px] ' src={starLight} alt="" />
                <img className='inline-block w-[13.5px] mr-[4px]' src={starLight} alt="" />
                <img className='inline-block w-[13.5px] mr-[4px]' src={starLight} alt="" />
                <img className='inline-block w-[13.5px] mr-[4px]' src={starLight} alt="" />
                <img className='inline-block w-[13.5px] mr-[4px]' src={starLight} alt="" />
            </div>
    }
    else {
        element =
            <div className='flex '>
                <img className='inline-block w-[13.5px] mr-[4px] ' src={starGold} alt="" />
                <img className='inline-block w-[13.5px] mr-[4px]' src={starGold} alt="" />
                <img className='inline-block w-[13.5px] mr-[4px]' src={starGold} alt="" />
                <img className='inline-block w-[13.5px] mr-[4px]' src={starGold} alt="" />
                <img className='inline-block w-[13.5px] mr-[4px]' src={starGold} alt="" />
            </div>
    }
    return (
        <div>
            <p className='text-[#26435F] text-xl font-semibold' >Student Feedback Overview</p>
            <div className='bg-[#FFFFFF] border-[1.458px] rounded-5 shadow-[0px_0px_2.91667px_0px_rgba(0,0,0,0.25)] pt-[28px] pb-[48px]  px-[11.28%]'>
                <div className='flex justify-between mb-[30px] text-[0.9114583333vw]'>
                    <p className='font-light text-[#092327]'> Total Ratings: {count}</p>
                    <div className='flex  items-center'>
                        {element}
                        <p className='text-[#667085] text-[0.9114583333vw]'>{studentFeedbacks?.data?.overallAverageRating}</p>
                    </div>
                    {/* <p className='text-[#667085]'><img className='inline-block' src={stars} alt="" />{studentFeedbacks?.data?.overallAverageRating}</p> */}
                </div>
                <div className='flex justify-between text-center text-[#667085] text-[0.9114583333vw] pb-3'>
                    {
                        (percentArray.reverse()).map(p =>
                            <div className='w-[13.32%] '>{p}</div>
                        )
                    }

                </div>
                <div className='flex justify-between'>
                    {
                        (percentArray).map((p, index) =>
                            <div key={index} className='w-[13.32%] h-[300px] rounded-[3px] relative border-[1.33px] border-[rgba(217,217,217,1)]'>
                                <div className={`bg-[#ebc034] w-full h-[${p}] absolute bottom-0 rounded-[3px]`}></div>
                            </div>
                        )
                    }
                </div>
                <div className='flex justify-between text-center text-[#455A64] text-[0.723vw] pt-2'>
                    <div className='w-[13.32%]  transform -rotate-45 -translate-x-3'>5 star</div>
                    <div className='w-[13.32%] transform -rotate-45 -translate-x-3'>4 star</div>
                    <div className='w-[13.32%] transform -rotate-45 -translate-x-3'>3 star</div>
                    <div className='w-[13.32%] transform -rotate-45 -translate-x-3'>2 star</div>
                    <div className='w-[13.32%] transform -rotate-45 -translate-x-3'>1 star</div>
                </div>
                <div className='mt-[30px] text-[0.9114583333vw]'>
                    <p className='text-center font-light mb-[11px]'>Top Service: {`{${studentFeedbacks?.data?.highestRatedService?.sessionId?.service}}`}</p>
                    <div className='flex justify-between mb-[30px] text-[0.9114583333vw]'>
                        <p className='font-light text-[#092327]'> Total Ratings: {count}</p>
                        <div className='flex  items-center'>
                            {element}
                            <p className='text-[#667085] text-[0.9114583333vw]'>{studentFeedbacks?.data?.overallAverageRating}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BarChart;