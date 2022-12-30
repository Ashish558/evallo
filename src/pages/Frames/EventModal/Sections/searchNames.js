import React, { useEffect, useState } from 'react'
import { useLazyGetStudentsByNameQuery, useLazyGetTutorsByNameQuery, useLazyGetTutorStudentsByNameQuery } from '../../../../app/services/session';
import InputSearch from '../../../../components/InputSearch/InputSearch';

export default function SearchNames({ setStudent, setData, student, tutor, data, setTutor, isEditable }) {

   const [fetchTutors, tutorResponse] = useLazyGetTutorsByNameQuery();
   const [tutors, setTutors] = useState([]);

   const [fetchStudents, studentResponse] = useLazyGetStudentsByNameQuery();
   const [fetchTutorStudents, tutorStudentsResp] = useLazyGetTutorStudentsByNameQuery();
   
   const [students, setStudents] = useState([]);
   const persona = sessionStorage.getItem('role')

   useEffect(() => {
      if (tutor.length > 2) {
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
      if (student.length > 2) {
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
      <div className="flex mb-4">
         <InputSearch
            label="Student Name"
            labelClassname="ml-3"
            placeholder="Student Name"
            parentClassName="w-full mr-[18.48px]"
            inputContainerClassName="bg-lightWhite border-0 pt-3.5 pb-3.5"
            inputClassName="bg-transparent"
            type="text"
            optionPrefix='s'
            value={student}
            onChange={(e) => setStudent(e.target.value)}
            optionData={students}
            disabled={!isEditable}
            onOptionClick={(item) => {
               setStudent(item.value);
               setData({ ...data, studentId: item._id });
            }}
         />
         <InputSearch
            label="Tutor Name"
            labelClassname="ml-3"
            placeholder="Tutor Name"
            parentClassName="w-full"
            inputContainerClassName="bg-lightWhite border-0 pt-3.5 pb-3.5 text-s"
            inputClassName="bg-transparent"
            type="text"
            optionPrefix='t'
            value={tutor}
            disabled={!isEditable}
            onChange={(e) => setTutor(e.target.value)}
            optionData={tutors}
            onOptionClick={(item) => {
               setTutor(item.value);
               setData({ ...data, tutorId: item._id });
            }}
         />
      </div>
   )
}
