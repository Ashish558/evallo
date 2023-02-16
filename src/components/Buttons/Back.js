import React from 'react'
import { useNavigate } from 'react-router-dom'
import BackIcon from '../../assets/assignedTests/back.svg'
import SecondaryButton from './SecondaryButton'

export default function BackBtn({ to }) {

   const navigate = useNavigate()

   return (
      <SecondaryButton
         className='flex items-center pl-3 pr-4 pt-2 pb-2 mb-6'
         onClick={() => navigate(to)}
         children={
            <>
               <img src={BackIcon} className='mr-2' alt='back-icon' />
               <span>
                  Back
               </span>
            </>
         } />
   )
}
