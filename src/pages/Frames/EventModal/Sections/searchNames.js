import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLazyGetStudentsByNameQuery, useLazyGetTutorsByNameQuery, useLazyGetTutorStudentsByNameQuery } from '../../../../app/services/session';
import InputSearch from '../../../../components/InputSearch/InputSearch';

export default function SearchNames({ setStudent, setData, student, tutor, data, setTutor, isEditable }) {

   const [fetchTutors, tutorResponse] = useLazyGetTutorsByNameQuery();
   const [tutors, setTutors] = useState([]);

   const [fetchStudents, studentResponse] = useLazyGetStudentsByNameQuery();
   const [fetchTutorStudents, tutorStudentsResp] = useLazyGetTutorStudentsByNameQuery();
   const [students, setStudents] = useState([]);
   const { role: persona } = useSelector(state => state.user)


   useEffect(() => {
      if (tutor.length > 0) {
         fetchTutors(tutor).then((res) => {
            // console.log(res.data.data.tutor)
            let tempData = res.data.data.tutor.map((tutor) => {
               return {
                  _id: tutor._id,
                  value: `${tutor.firstName} ${tutor.lastName}`,
               };
            });
            setTutors(tempData);
         });
      }
   }, [tutor]);

   useEffect(() => {
      if (student.length > 0) {
         if (persona === 'tutor') {
            fetchTutorStudents(student).then((res) => {
               // console.log(res.data.data)
               let tempData = res.data.data.students.map((tutor) => {
                  return {
                     _id: tutor._id,
                     value: `${tutor.firstName} ${tutor.lastName}`,
                  };
               });
               setStudents(tempData);
            });
         } else {
            fetchStudents(student).then((res) => {
               // console.log(res.data.data)
               let tempData = res.data.data.students.map((tutor) => {
                  return {
                     _id: tutor._id,
                     value: `${tutor.firstName} ${tutor.lastName}`,
                  };
               });
               setStudents(tempData);
            });
         }
      }
   }, [student]);

   return (
      <div className="flex mb-[30px]">
         <InputSearch
            label="Student Name"
            required="true"
            labelClassname="font-medium text-lg"
            placeholder="Student Name"
            parentClassName="w-full mr-[66px] text-[#26435F] "
            inputContainerClassName="bg-lightWhite border-0 pt-3.5 pb-3.5 text-[#507CA8] h-[53px] text-base"
            inputClassName="bg-transparent text-[#507CA8]"
            type="text"
            optionPrefix='s'
            value={student}
            onChange={(e) => setStudent(e.target.value)}
            optionData={students}
            disabled={!isEditable}
            onOptionClick={(item) => {
               setStudent(item.value);
               setData({ ...data, studentId: item._id,studentName: item.value});
            }}
            
         />
         <InputSearch
            label="Tutor Name"
            required="true"
            labelClassname="font-medium text-lg"
            placeholder="Tutor Name"
            parentClassName="w-full text-[#26435F]"
            inputContainerClassName="bg-lightWhite border-0 pt-3.5 pb-3.5 text-[#507CA8] h-[53px] text-base"
            inputClassName="bg-transparent text-[#507CA8]"
            type="text"
            optionPrefix='t'
            value={tutor}
            disabled={persona === 'admin' ? false : true}
            onChange={(e) => setTutor(e.target.value)}
            optionData={tutors}
            onOptionClick={(item) => {
               setTutor(item.value);
               setData({ ...data, tutorId: item._id,tutorName: item.value });
            }}
         />
      </div>
   )
}
