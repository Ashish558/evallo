import React from 'react'
import styles from './style.module.css'
import Logo from '../../assets/Navbar/evallo-logo.svg'
import Dashboard from '../../assets/Navbar/sAdmin-dashboard.svg'
import Organization from '../../assets/Navbar/sAdmin-org.svg'
import Settings from '../../assets/Navbar/sAdmin-settings.svg'

const arr = [
   {
      Icon: Dashboard,
      text: 'Dashboard',
      selected: true
   },
   {
      Icon: Organization,
      text: 'All Organization',
      selected: false
   },
   {
      Icon: Settings,
      text: 'Settings',
      selected: false
   },
]

export default function SAdminNavbar(props) {

   return (
      <div className={styles.container}>
         <div className={styles.wrapper}>
            <div className='py-2.5 px-7 mb-2'>
               <img src={Logo} />
            </div>
            {
               arr.map((item, idx) => {
                  return <div className={`py-4 px-7 flex ${item.selected ? styles.selected : ''} `}>
                     <img src={item.Icon} />
                     <p className='pl-5'> {item.text} </p>
                  </div>
               })
            }
         </div>
      </div>
   )
}
