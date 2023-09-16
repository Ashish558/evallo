import React from 'react'
import InputField from '../../../../components/InputField/inputField';
import InputSelect from '../../../../components/InputSelect/InputSelect';
import { convertTime12to24, tConvert } from '../../../../utils/utils';
import { times } from '../../../../constants/constants';

const timeZones = [
   'IST',
   'AKST',
   'EST',
   'HST',
   'MST',
   'PST',
]

export default function DateAndTimeInput({ data, setData, isEditable }) {


   return (
      <div className="flex mb-6 items-end">
         <InputField
            parentClassName="w-full mr-6 "
            required="true"
            label="Session Date"
            labelClassname="ml-3 text-[#26435F] font-medium text-[18px]"
            inputContainerClassName="bg-lightWhite border-0  pt-3.5 pb-3.5"
            inputClassName="bg-transparent appearance-none text-[#507CA8]"
            value={data.date}
            type="date"
            onChange={(e) =>
               setData({ ...data, date: e.target.value })
            }
            disabled={!isEditable}
           
         />

         <InputSelect
            label="Time"
            required="true"
            placeholderClass="text-[#507CA8]"
            labelClassname="text-[#26435F]  font-semibold text-base-17-5"
            parentClassName="w-full max-w-120 mb-0 "
            type="time"
            optionData={times}
            inputContainerClassName="bg-lightWhite border-0 font-medium pr-3 pt-3.5 pb-3.5 h-full text-[#507CA8]"
            inputClassName="bg-transparent appearance-none font-medium"
            value={`${data.time.start.time} ${data.time.start.timeType}`}
            disabled={!isEditable}
            onChange={(val) => {
               const time = val.split(' ')
               setData({
                  ...data,
                  time: {
                     ...data.time, start: {
                        time: time[0],
                        timeType: time[1],
                     }
                  }
               })
            }}
         />
         <span className="self-end mb-4 mx-4 font-medium">
            -
         </span>
         <InputSelect
            parentClassName="w-full max-w-120 self-end"
            type="time"
            placeholderClass="text-[#507CA8]"
            inputContainerClassName="bg-lightWhite border-0 font-medium pr-3 pt-3.5 pb-3.5 h-full text-[#507CA8]"
            inputClassName="bg-transparent appearance-none font-medium"
            // value={convertTime12to24(
            //    `${data.time.end.time} ${data.time.end.timeType}`
            // )}
            optionData={times}
            value={`${data.time.end.time} ${data.time.end.timeType}`}
            onChange={(val) => {
               const time = val.split(' ')
               setData({
                  ...data,
                  time: {
                     ...data.time, end: {
                        time: time[0],
                        timeType: time[1],
                     }
                  }
               })
            }}
            disabled={!isEditable}
         />
         <InputSelect
            required="true"
            labelClassname=" font-semibold text-base-17-5"
            label="Time Zone"
            value={data.timeZone}
            onChange={(val) =>
               setData({ ...data, timeZone: val })
            }
            optionData={timeZones}
            inputContainerClassName="bg-lightWhite border-0 font-medium pl-4 pr-3 pt-3.5 pb-3.5  text-[#507CA8] h-full"
            inputClassName="bg-transparent appearance-none font-medium text-[#507CA8]"
            placeholder="Time Zone"
            parentClassName="w-full mr-4 ml-8  max-w-[140px] self-end"
            type="select"
            placeholderClass="text-base-17-5 text-[#507CA8]"
            
            disabled={!isEditable}
         />
      </div>
   )
}
