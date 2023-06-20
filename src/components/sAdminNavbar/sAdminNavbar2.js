import React from 'react'
import styles from './style.module.css'
import Logo from '../../assets/Dashboard/logo.svg'
import Dashboard from '../../assets/Dashboard/dashboard.svg'
import Organization from '../../assets/Dashboard/bank (1).png'
import Settings from '../../assets/Dashboard/settings.png'

const arr = [
    {
        Icon: Dashboard,
        selected: true
    },
    {
        Icon: Organization,
        selected: false
    },
    {
        Icon: Settings,
        selected: false
    },
]

export default function SAdminNavbar(props) {

    return (
        <div id={styles.container2} className='bg-#007EF1 h-screen"'>
            <div className={styles.wrapper}>
                <div className='py-2.5 px-7 mb-2'>
                    <img src={Logo} className="w-full py-4 " alt="Logo" />

                </div>
                {
                    arr.map((item, idx) => {
                        return <div className={`py-4 px-7 flex  text-white ${item.selected ? styles.selected : ''} `}>
                            <img src={item.Icon} alt='icon' />

                        </div>
                    })
                }
            </div>
        </div>
    )
}
