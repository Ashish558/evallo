import React from 'react'
import { useSelector } from 'react-redux'
import { useLazyCancelSessionQuery } from '../../../../app/services/session'
import CCheckbox from '../../../../components/CCheckbox/CCheckbox'
import InputField from '../../../../components/InputField/inputField'
import InputSelect from '../../../../components/InputSelect/InputSelect'

export default function SessionInputs({ data, setData, status, isEditable }) {

   const { role: persona } = useSelector(state => state.user)

   return (
      <>
         <div className="flex mt-[28px] ">

            {persona == "admin" &&  <div className="w-full flex  pt-[0px]">
                  <InputSelect
                     value={data.sessionStatus}
                     onChange={(val) =>
                        setData({
                           ...data,
                           sessionStatus: val,
                        })
                     }
                     disabled={!isEditable}
                     optionData={status}
                     inputContainerClassName={`${
                        data.sessionStatus == "Completed"
                          ? "bg-[#38C980] text-white"
                          : "bg-lightWhite text-[#507CA8]"
                      } ${
                        data.sessionStatus == "Scheduled"
                          ? "bg-[#7C98B6] text-white"
                          : "bg-lightWhite text-[#507CA8]"
                      } ${
                       data.sessionStatus == "Cancelled"
                         ? "bg-[#FFCE84] text-[#26435F]"
                         : "bg-lightWhite text-[#507CA8]"
                     } ${
                       data.sessionStatus == "Missed"
                         ? "bg-[#FF7979] text-[#fff]"
                         : "bg-lightWhite text-[#507CA8]"
                     } border-0 font-medium pr-3 pt-4 pb-4 `}
                     inputClassName={`bg-transparent appearance-none font-medium  text-[#507CA8]`}
                     placeholder="Session Status"
                     label="Session Status"
                     labelClassname="font-medium text-[18.6px] text-[#26435F]"
                     parentClassName="w-[333px] mr-10"
                     type="select"
                  />
                  <div className="flex mt-7">
                     <div className='flex items-center'>
                        <CCheckbox checked={data.rescheduling} name='rescheduling' onChange={() =>
                           setData({
                              ...data,
                              rescheduling: !data.rescheduling,
                           })} disabled={!isEditable} />
                        <p className="font-medium text-[18.6px] text-[#26435F]">
                           Rescheduled
                        </p>
                     </div>
                     <div className='flex ml-[24px] items-center'>
                        <CCheckbox checked={data.partialSession} name='partialSession' onChange={() =>
                           setData({
                              ...data,
                              partialSession: !data.partialSession,
                           })} disabled={!isEditable} />
                        <p className="font-medium text-[18.6px] text-[#26435F]">
                           Partial Session
                        </p>
                     </div>

                  </div>
               </div> }

            {persona === "student" && (
               <div className="w-full flex  pt-[0px]">
                  <InputSelect
                     value={data.sessionStatus}
                     onChange={(val) =>
                        setData({
                           ...data,
                           sessionStatus: val,
                        })
                     }
                     disabled={!isEditable}
                     optionData={status}
                     inputContainerClassName={`${data.sessionStatus=="Completed"?'bg-[#38C980]':'bg-lightWhite'}  border-0 font-medium pr-3 pt-4 pb-4 ${data.sessionStatus==="Completed"?'text-white':'text-[#507CA8]'}`}
                     inputClassName={`bg-transparent appearance-none font-medium  text-[#507CA8]`}
                     placeholder="Session Status"
                     label="Session Status"
                     labelClassname="font-medium text-[18.6px] text-[#26435F]"
                     parentClassName="w-[333px] mr-10"
                     type="select"
                  />
                  <div className="flex mt-7">
                     <div className='flex items-center'>
                        <CCheckbox checked={data.rescheduling} name='rescheduling' onChange={() =>
                           setData({
                              ...data,
                              rescheduling: !data.rescheduling,
                           })} disabled={!isEditable} />
                        <p className="font-medium text-[18.6px] text-[#26435F]">
                           Rescheduled
                        </p>
                     </div>
                     <div className='flex ml-[24px] items-center'>
                        <CCheckbox checked={data.partialSession} name='partialSession' onChange={() =>
                           setData({
                              ...data,
                              partialSession: !data.partialSession,
                           })} disabled={!isEditable} />
                        <p className="font-medium text-[18.6px] text-[#26435F]">
                           Partial Session
                        </p>
                     </div>

                  </div>
               </div>
            ) }

            {persona !== "admin" && persona !== "student" && (
               <div className="w-full flex  pt-[0px]">
                  <InputSelect
                     value={data.sessionStatus}
                     onChange={(val) =>
                        setData({
                           ...data,
                           sessionStatus: val,
                        })
                     }
                     disabled={!isEditable}
                     optionData={status}
                     inputContainerClassName="bg-lightWhite border-0 font-medium pr-3 pt-4 pb-4"
                     inputClassName="bg-transparent appearance-none font-medium text-[#507CA8]"
                     placeholder="Session Status"
                     label="Session Status"
                     labelClassname="font-semibold text-[18.6px] text-[#26435F]"
                     parentClassName="w-[300px] mr-10"
                     type="select"
                  />
                  <div className="flex mt-7">
                     <div className='flex items-center'>
                        <CCheckbox checked={data.rescheduling} name='rescheduling' onChange={() =>
                           setData({
                              ...data,
                              rescheduling: !data.rescheduling,
                           })} disabled={!isEditable} />
                        <p className="font-medium text-[18.6px] text-[#26435F]">
                           Rescheduled
                        </p>
                     </div>
                     <div className='flex ml-5 items-center'>
                        <CCheckbox checked={data.partialSession} name='partialSession' onChange={() =>
                           setData({
                              ...data,
                              partialSession: !data.partialSession,
                           })} disabled={!isEditable} />
                        <p className="font-medium text-[18.6px] text-[#26435F]">
                           Partial Session
                        </p>
                     </div>

                  </div>
               </div>
            )}
         </div>
      </>
   )
}
