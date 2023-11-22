import React from 'react'
import InputField from '../../../../components/InputField/inputField';
import InputSelect from '../../../../components/InputSelect/InputSelect';
import { convertTime12to24, tConvert } from '../../../../utils/utils';
import moment from "moment-timezone";
import { times } from '../../../../constants/constants';

export default function DateAndTimeInput({ data, setData, isEditable }) {

   const timeZones = moment.tz.names(); // String[]

   return (
      <div className="flex mb-[30px] items-end">
         <InputField
            parentClassName="w-full mr-6 "
            required="true"
            label="Session Date"
            biggerText={true}
            labelClassname=" ml-3 text-[#26435F] font-medium "
            inputContainerClassName="bg-lightWhite border-0  pt-3.5 pb-3.5 h-[53px] shadow-[0_0_2px_0_rgba(0, 0, 0, 0.25)]"
            inputClassName="bg-transparent appearance-none text-[#507CA8] text-[16px] "
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
            labelClassname="text-[#26435F]  font-medium text-lg"
            parentClassName="w-full max-w-120 mb-0 "
            type="time"
            optionData={times}
            inputContainerClassName="bg-lightWhite border-0  pr-3 pt-3.5 pb-3.5 h-full text-[#507CA8] text-[16px] lowercase shadow-[0_0_2px_0_rgba(0, 0, 0, 0.25)]"
            inputClassName="bg-transparent appearance-none  text-[16px]"
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
            inputContainerClassName="bg-lightWhite border-0  pr-3 pt-3.5 pb-3.5 h-full text-[#507CA8] lowercase shadow-[0_0_2px_0_rgba(0, 0, 0, 0.25)]"
            inputClassName="bg-transparent appearance-none text-[#507CA8] text-[16px]"
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
            labelClassname="font-medium text-lg"
            label="Time Zone"
            value={data.timeZone}
            onChange={(val) =>
               setData({ ...data, timeZone: val })
            }
            optionData={timeZones}
            inputContainerClassName="bg-lightWhite border-0  pl-4 pr-3 pt-3.5 pb-3.5  text-[#507CA8] h-full text-[16px] shadow-[0_0_2px_0_rgba(0, 0, 0, 0.25)]"
            inputClassName="bg-transparent appearance-none  text-[#507CA8]"
            placeholder="Time Zone"
            parentClassName="w-full  ml-8   self-end"
            type="select"
            placeholderClass="text-base-17-5 text-[#507CA8]"

            disabled={!isEditable}
         />
      </div>
   )
}
