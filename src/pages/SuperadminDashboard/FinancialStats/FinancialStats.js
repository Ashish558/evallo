import React from "react";
import styles from './styles.module.css';
import image from '../../../assets/icons/Vectorschedule.svg';
import image1 from '../../../assets/icons/Vectorcompleted.svg';
import image2 from '../../../assets/icons/Vectormissed.svg';
import image3 from '../../../assets/icons/Vectorcancel.svg';
import image4 from '../../../assets/icons/mdi_file-rotate-counter-clockwise-outlinetotalTrans.svg';
import image5 from '../../../assets/stats/Vector (5).png';
import image6 from '../../../assets/stats/Vector (6).png';
import image7 from '../../../assets/icons/ic_round-paymentnotransaction.svg';
import image8 from '../../../assets/stats/Vector (8).png';
import image9 from '../../../assets/icons/basil_invoice-outlineinvoice.svg';
import image10 from '../../../assets/stats/Vector (10).png';
import image11 from '../../../assets/icons/carbon_chart-averageaveragetransaction.svg';
import rectangle from '../../../assets/stats/Rectangle 2061.png';

import {useGetFinancialStatsQuery, useGetFinancialStatsRangeMutation} from "../../../app/services/superAdmin"
import { useEffect } from "react";
import { useState } from "react";
export default function FinancialStats({dateRange}) {
  const [financialStats,setFinantialStats] = useState({})
  const [getFinancialStats,status]=useGetFinancialStatsRangeMutation()
  const financialData = [
    { title: "Card 1", value: "$100" },
    { title: "Card 2", value: "$200" },
    { title: "Card 3", value: "$300" },
    { title: "Card 4", value: "$400" },
    { title: "Card 5", value: "$500" },
    { title: "Card 6", value: "$600" },
    { title: "Card 7", value: "$700" },
    { title: "Card 8", value: "$800" },
  ];
useEffect(()=>{
  if (dateRange === ""||!dateRange) return ;
  const fetchActivity=()=>{
   
    getFinancialStats(dateRange).then((res)=>{
     console.log("finantial",{dateRange},{res:res?.data})
     setFinantialStats(res?.data)
    })
  }
  fetchActivity()
},[dateRange])
  return (
    <div className="max-w-[652px] flex-1">
      <h2 className="font-semibold mb-1 text-[#26435F] text-[21.33px]">Financial Stats</h2>
      {/* <div className="grid grid-cols-2 gap-4 w-150 border border-solid border-grey-200 p-5">
        <div className="bg-blue-700 rounded p-4 shadow w-150 h-150">
          <h3 className="text-lg font-bold text-white">
            {financialData[0].title}
          </h3>
          <p className="text-gray-100">{financialData[0].value}</p>
        </div>
        <div className="bg-blue-700 rounded p-4 shadow w-150 h-50">
          <h3 className="text-lg font-bold text-gray-100">{financialData[1].title}</h3>
          <p className="text-gray-100">{financialData[1].value}</p>
        </div>
        <div className="bg-blue-700 rounded p-4 shadow w-150">
          <h3 className="text-lg font-bold text-gray-100">{financialData[2].title}</h3>
          <p className="text-gray-100">{financialData[2].value}</p>
        </div>
        <div className="bg-blue-700 rounded p-4 shadow w-150">
          <h3 className="text-lg font-bold text-gray-100">{financialData[3].title}</h3>
          <p className="text-gray-100">{financialData[3].value}</p>
        </div>
        <div className="bg-white rounded p-4 shadow w-150">
          <h3 className="text-lg font-bold">{financialData[4].title}</h3>
          <p className="text-gray-500">{financialData[4].value}</p>
        </div>
        <div className="bg-white rounded p-4 shadow w-150">
          <h3 className="text-lg font-bold">{financialData[5].title}</h3>
          <p className="text-gray-500">{financialData[5].value}</p>
        </div>
        <div className="bg-white rounded p-4 shadow w-150">
          <h3 className="text-lg font-bold">{financialData[6].title}</h3>
          <p className="text-gray-500">{financialData[6].value}</p>
        </div>
        <div className="bg-white rounded p-4 shadow w-150">
          <h3 className="text-lg font-bold">{financialData[7].title}</h3>
          <p className="text-gray-500">{financialData[7].value}</p>
        </div>
      </div> */}

      <div className="grid grid-cols-4 gap-x-7 gap-y-[18px]">
        <div className={`text-[#00ADD3] w-[146.66px] h-[193.33px] ${styles.card} flex flex-col justify-center items-center`}>
          <p className="p-3 bg-[#FFFFFF] rounded"><img src={image} alt="" /></p>
          <p className="text-18.66 mt-4">Scheduled</p>
          <p className="font-semibold text-2xl">{financialStats?.scheduledSessions}</p>
        </div>
        <div className={`text-[#42CD00] w-[146.66px] h-[193.33px] ${styles.card} flex flex-col justify-center items-center`}>
          <p className="p-3 bg-[#FFFFFF] rounded"><img src={image1} alt="" /></p>
          <p className="text-18.66 mt-4">Completed</p>
          <p className="font-semibold text-2xl">{financialStats?.completeSessions}</p>
        </div>
        <div className={`text-[#FF4D4D] w-[146.66px] h-[193.33px] ${styles.card} flex flex-col justify-center items-center`}>
          <p className="p-3 bg-[#FFFFFF] rounded"><img src={image2} alt="" /></p>
          <p className="text-18.66 mt-4">Missed</p>
          <p className="font-semibold text-2xl">{financialStats?.missedSessions}</p>
        </div>
        <div className={`text-[#969696] w-[146.66px] h-[193.33px] ${styles.card} flex flex-col justify-center items-center`}>
          <p className="p-3 bg-[#FFFFFF] rounded"><img src={image3} alt="" /></p>
          <p className="text-18.66 mt-4">Cancelled</p>
          <p className="font-semibold text-2xl">{financialStats?.canceledSessions}</p>
        </div>
        <div className={`text-[#26435F] w-[146.66px] h-[240px] ${styles.card2} `}>
          <p className="bg-[#26435F] rounded p-2 w-[40px] h-[40px] mx-auto mt-[28px]"><span><img src={image9} alt="" /></span></p>
          <p className="text-18.66 text-center px-2 h-[50px] mb-1 mt-5">Invoice</p>
          <p className="font-semibold text-2xl text-center ">51</p>
        </div>
        <div className={`text-[#26435F] w-[146.66px] h-[240px] ${styles.card2} `}>
          <p className="bg-[#26435F] rounded p-2 w-[40px] h-[40px] mx-auto mt-[28px]"><span><img src={image7} alt="" /></span></p>
          <p className="text-18.66 text-center px-2 h-[50px] mb-1 mt-5"># of Transaction</p>
          <p className="font-semibold text-2xl text-center ">51</p>
        </div>
        <div className={`text-[#26435F] w-[146.66px] h-[240px] ${styles.card2}`}>
          <p className="bg-[#26435F] rounded p-2 w-[40px] h-[40px] mx-auto mt-[28px]"><img src={image4} alt="" /></p>
          <p className="text-18.66 text-center px-2 h-[50px] mb-1 mt-5">Transaction
            Amount Total</p>
          <p className="font-semibold text-2xl text-center ">51</p>
        </div>
        <div className={`text-[#26435F] w-[146.66px] h-[240px] ${styles.card2} `}>
          <p className="bg-[#26435F] rounded p-2 w-[40px] h-[40px] mx-auto mt-[28px]"><img src={image11} alt="" /></p>
          <p className="text-18.66 text-center px-2 h-[50px] mb-1 mt-5 px-1">Avg transaction</p>
          <p className="font-semibold text-2xl text-center ">51</p>
        </div>
      </div>
    </div>
  );
}
