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
               <div className="w-full flex flex-col items-start">
                  <InputSelect
                     value={data.sessionStatus}
                     onChange={(val) =>
                        setData({
                           ...data,
                           sessionStatus: val,
                        })
                     }
                     optionData={status}
                     label="Session Status"
                     labelClassname="ml-2"
                     inputContainerClassName="bg-lightWhite border-0 font-medium pr-3 pt-3.5 pb-3.5"
                     inputClassName="bg-transparent appearance-none font-medium"
                     placeholder="Session Status"
                     parentClassName="w-full mr-4"
                     type="select"
                     disabled={!isEditable}
                  />
                  <div className="flex mb-3 mt-3 ml-3">
                     <CCheckbox checked={data.rescheduling} name='rescheduling' onChange={() =>
                        setData({
                           ...data,
                           rescheduling: !data.rescheduling,
                        })}
                        disabled={!isEditable} />
                     <p className="font-medium text-primary-60 text-sm">
                        Rescheduled
                     </p>
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
                     labelClassname="font-semibold"
                     parentClassName="w-[300px] mr-10"
                     type="select"
                  />
                  <div className="flex mt-7">
                     <div className='flex'>
                        <CCheckbox checked={data.rescheduling} name='rescheduling' onChange={() =>
                           setData({
                              ...data,
                              rescheduling: !data.rescheduling,
                           })} disabled={!isEditable} />
                        <p className="font-medium text-primary-60 text-sm">
                           Rescheduled
                        </p>
                     </div>
                     <div className='flex ml-5'>
                        <CCheckbox checked={data.partialSession} name='partialSession' onChange={() =>
                           setData({
                              ...data,
                              partialSession: !data.partialSession,
                           })} disabled={!isEditable} />
                        <p className="font-medium text-primary-60 text-sm">
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
