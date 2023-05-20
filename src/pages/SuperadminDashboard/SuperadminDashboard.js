import React from 'react'
import SAdminNavbar from '../../components/sAdminNavbar/sAdminNavbar'
import styles from './styles.module.css'
import OrgCard from './orgCard/orgCard'

const orgContents = [
   {
      heading: 'Total # of Orgs',
      text: '350'
   },
   {
      heading: 'C:I Ratio',
      text: '350'
   },
   {
      heading: '11 days',
      text: '350'
   },
   {
      heading: 'Inactive',
      text: '350'
   },
]

const userTypes = [
   {
      text: 'Admin',
      selected: true
   },
   {
      text: 'Contributor',
      selected: false
   },
   {
      text: 'Student',
      selected: false
   },
   {
      text: 'Parent',
      selected: false
   },
   {
      text: 'Tutor',
      selected: false
   },
]

export default function SuperadminDashboard() {


   return (
      <div className=''>
         <SAdminNavbar />
         <div className='ml-[260px] mt-[60px]'>
            <div className='flex'>
               <section className='flex flex-col flex-1'>
                  <div>
                     <p className={styles.subheading}> Organizations </p>
                     <div className='flex'>
                        {orgContents.map((item, idx) => {
                           return <OrgCard {...item} />
                        })}
                     </div>
                  </div>
                  <div className='w-full'>
                     <p className={`${styles.subheading} mt-[18px] mb-2.5`}> User Stats </p>
                     <div className={styles.userStatsContainer}>
                        <div className='flex'>
                           {userTypes.map(item => {
                              return <div className={`${styles.userStat} ${item.selected ? styles.selected : ''} `}>
                                 {item.text}
                              </div>
                           })}
                        </div>
                        <div>
                           <div className='flex w-3/5 flex-wrap'>
                              <div className='w-1/2 flex items-end justify-center py-5'>
                                 <p className={styles.statHead}> Total </p>
                                 <p> 190 </p>
                              </div>
                              <div className='w-1/2 flex items-end justify-center py-5'>
                                 <p className={styles.statHead}> Active </p>
                                 <p> 190 </p>
                              </div>
                              <div className='w-1/2 flex items-end justify-center py-5'>
                                 <p className={styles.statHead}> New </p>
                                 <p> 190 </p>
                              </div>
                              <div className='w-1/2 flex items-end justify-center py-5'>
                                 <p className={styles.statHead}> # of Tests </p>
                                 <p> 190 </p>
                              </div>
                           </div>
                           <div className='w-2/5'>

                           </div>
                        </div>
                     </div>
                  </div>
               </section>
               <section className='flex-1'>
                  d
               </section>
            </div>
         </div>
      </div>
   )
}
