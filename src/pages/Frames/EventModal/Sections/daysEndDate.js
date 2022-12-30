import React from 'react'
import Checkbox from '../../../../components/Checkbox/Checkbox';
import InputField from '../../../../components/InputField/inputField';


export default function DaysEndDate({ days, setDays, data, setData, isEditable }) {

   const handleDayChange = id => {
      if(isEditable === false) return
      let tempdays = days.map(day => {
         return day.id === id
            ? { ...day, checked: !day.checked }
            : { ...day };
      });
      setDays(tempdays);
   };

   return (
      <div className="flex mb-10">
         <div className="mr-8">
            <p className="font-medium text-primary-60 mb-1">
               Repeat every week on
            </p>
            <div className="flex">
               {days.map((day, idx) => {
                  return (
                     <Checkbox
                        key={idx}
                        id={day.id}
                        body={day.text}
                        bodyClassName={`font-medium flex ${day.checked ? ' bg-primary text-white' : 'bg-lightWhite'} mr-1.4 justify-center items-center text-lg w-[54px] h-[54px] rounded-10 `}
                        className={`${!data.recurring ? 'opacity-50 pointer-events-none' : ''}`}
                        checked={day.checked}
                        onChange={handleDayChange}
                     />
                  );
               })}
            </div>
         </div>
         <InputField
            label="End Date"
            labelClassname="ml-3"
            parentClassName={`w-full self-end ${!data.recurring ? 'opacity-50 pointer-events-none' : ''}} `}
            type="date"
            inputContainerClassName="bg-lightWhite border-0 font-medium pr-3 pt-3.5 pb-3.5"
            inputClassName="bg-transparent appearance-none font-medium"
            value={data.endDate}
            onChange={(e) =>
               setData({
                  ...data,
                  endDate: e.target.value,
               })
            }
            disabled={!isEditable}
         />
      </div>
   )
}
