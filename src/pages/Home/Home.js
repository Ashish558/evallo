import React from 'react'
import ParentDashboard from '../ParentDashboard/ParentDashboard'
import StudentDashboard from '../StudentDashboard/StudentDashboard'
import TutorDashboard from '../TutorDashboard/TutorDashboard'
import Users from '../Users/users'

export default function Home() {

   const persona = sessionStorage.getItem('role')

   return (
      persona === 'parent' ?
         <ParentDashboard />
         :
         persona === 'student' ?
            <StudentDashboard />
            :
            persona === 'tutor' ?
               <TutorDashboard />
               : persona === 'admin' ?
                  <Users /> :
                  <div className='ml-pageLeft bg-lightWhite min-h-screen'>

                  </div>
   )
}
