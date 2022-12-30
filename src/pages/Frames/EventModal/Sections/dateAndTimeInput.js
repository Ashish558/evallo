import React from 'react'
import InputField from '../../../../components/InputField/inputField';
import InputSelect from '../../../../components/InputSelect/InputSelect';
import { convertTime12to24, tConvert } from '../../../../utils/utils';

const timeZones = [
   'Asia/Kolkata',
   // 'America/New_York',
   'US/Alaska',
   'US/Central',
   'US/Eastern',
   'US/Hawaii',
   'US/Mountain',
   'US/Pacific',
]

export default function DateAndTimeInput({ data, setData, isEditable }) {


   return (
      <div className="flex mb-6">
         <InputField
            parentClassName="w-full mr-6"
            label="Date"
            labelClassname="ml-3"
            inputContainerClassName="bg-lightWhite border-0  pt-3.5 pb-3.5"
            inputClassName="bg-transparent appearance-none"
            value={data.date}
            type="date"
            onChange={(e) =>
               setData({ ...data, date: e.target.value })
            }
            disabled={!isEditable}
         />

         <InputField
            label="Time"
            labelClassname="ml-3"
            parentClassName="w-full max-w-120"
            type="time"
            inputContainerClassName="bg-lightWhite border-0 font-medium pr-3 pt-3.5 pb-3.5"
            inputClassName="bg-transparent appearance-none font-medium"
            value={convertTime12to24(
               `${data.time.start.time} ${data.time.start.timeType}`
            )}
            disabled={!isEditable}
            onChange={(e) =>
               setData({
                  ...data,
                  time: { ...data.time, start: tConvert(e.target.value) }
               })
            }
         />
         <span className="self-end mb-4 mx-4 font-medium">
            -
         </span>
         <InputField
            parentClassName="w-full max-w-120"
            type="time"
            inputContainerClassName="bg-lightWhite border-0 font-medium pr-3 pt-3.5 pb-3.5"
            inputClassName="bg-transparent appearance-none font-medium"
            value={convertTime12to24(
               `${data.time.end.time} ${data.time.end.timeType}`
            )}
            onChange={(e) => {
               setData({
                  ...data, time: { ...data.time, end: tConvert(e.target.value) },
               });
            }}
            disabled={!isEditable}
         />
         <InputSelect
            value={data.timeZone}
            onChange={(val) =>
               setData({ ...data, timeZone: val })
            }
            optionData={timeZones}
            inputContainerClassName="bg-lightWhite border-0 font-medium pl-4 pr-3 pt-3.5 pb-3.5"
            inputClassName="bg-transparent appearance-none font-medium"
            placeholder="Time Zone"
            parentClassName="w-full mr-4 ml-8  max-w-[140px]"
            type="select"
            disabled={!isEditable}
         />
      </div>
   )
}
