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
         <div className="flex">
            <InputField
               label="Session Link"
               labelClassname="ml-3"
               placeholder="Session Link"
               parentClassName="w-full mr-8"
               inputContainerClassName="bg-lightWhite border-0 pt-3.5 pb-3.5"
               inputClassName="bg-transparent"
               type="text"
               value={data.session}
               onChange={(e) =>
                  setData({
                     ...data,
                     session: e.target.value,
                  })
               }
               disabled={!isEditable}
            />
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
               <div className="w-full flex flex-col items-center">
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
                     inputContainerClassName="bg-lightWhite border-0 font-medium pr-3 pt-3.5 pb-3.5"
                     inputClassName="bg-transparent appearance-none font-medium"
                     placeholder="Session Status"
                     parentClassName="w-full mr-4"
                     type="select"
                  />
                  <div className="flex mb-3 mt-3">
                     <CCheckbox checked={data.rescheduling} name='rescheduling' onChange={() =>
                        setData({
                           ...data,
                           rescheduling: !data.rescheduling,
                        })} disabled={!isEditable} />
                     <p className="font-medium text-primary-60 text-sm">
                        Rescheduled
                     </p>
                  </div>
               </div>
            )}
         </div>
      </>
   )
}
