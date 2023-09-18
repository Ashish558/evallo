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
         <div className="flex mt-8 ">
            {persona === "student" ? (
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
                     inputClassName="bg-transparent appearance-none font-medium"
                     placeholder="Session Status"
                     label="Session Status"
                     labelClassname="font-semibold text-base-17-5"
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
                        <p className="font-medium text-primary-60 text-base-20">
                           Rescheduled
                        </p>
                     </div>
                     <div className='flex ml-5 items-center'>
                        <CCheckbox checked={data.partialSession} name='partialSession' onChange={() =>
                           setData({
                              ...data,
                              partialSession: !data.partialSession,
                           })} disabled={!isEditable} />
                        <p className="font-medium text-primary-60 text-base-20">
                           Partial Session
                        </p>
                     </div>

                  </div>
               </div>
            ) : (
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
                     inputClassName="bg-transparent appearance-none font-medium"
                     placeholder="Session Status"
                     label="Session Status"
                     labelClassname="font-semibold text-base-17-5"
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
                        <p className="font-medium text-primary-60 text-base-20">
                           Rescheduled
                        </p>
                     </div>
                     <div className='flex ml-5 items-center'>
                        <CCheckbox checked={data.partialSession} name='partialSession' onChange={() =>
                           setData({
                              ...data,
                              partialSession: !data.partialSession,
                           })} disabled={!isEditable} />
                        <p className="font-medium text-primary-60 text-base-20">
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
