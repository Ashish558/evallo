import React from 'react'
import { useSelector } from 'react-redux'
import ParentDashboard from '../ParentDashboard/ParentDashboard'
import StudentDashboard from '../StudentDashboard/StudentDashboard'
import TutorDashboard from '../TutorDashboard/TutorDashboard'
import Users from '../Users/users'

export default function Home() {

   const {role : persona } = useSelector(state => state.user)

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
