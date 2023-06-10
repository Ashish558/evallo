import React from 'react';
import SAdminNavbar2 from '../../components/sAdminNavbar/sAdminNavbar2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faCaretDown, faDollar } from '@fortawesome/free-solid-svg-icons';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import styles from './style.module.css'


const Dashboard = () => {
    return (
        <div class={styles.container}>
            <SAdminNavbar2></SAdminNavbar2>
            <div className="ml-[124px] mt-[28px] bg-#2E2E2E">
                <div className="flex justify-between items-center">
                    <div>
                        <p className='font-semibold'>Dashboard</p>
                    </div>
                    <div className='flex mr-[20px] bg-[#2B49F01A] py-[10px] px-[15px] rounded'>
                        <div className='flex mr-[24px] text-[#4A556C] text-xs'>
                            <p className=' '>Pricing </p>
                            <p><FontAwesomeIcon className='pl-3' icon={faDollar}></FontAwesomeIcon></p>
                        </div>
                        <div className='flex mr-[24px] text-[#4A556C] text-xs'>
                            <p className=' '>Help</p>
                            <p><FontAwesomeIcon className='pl-3' icon={faQuestionCircle}></FontAwesomeIcon></p>
                        </div>
                        <div className='flex text-xs'>
                            <div>
                                <p className='text-[#4A556C]'>Logout</p>
                            </div>
                            <div>
                                <p><FontAwesomeIcon className='pl-3 text-[#4A556C]' icon={faArrowRightFromBracket}></FontAwesomeIcon></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='mt-[30px] mr-[20px]'>
                    <div className='flex justify-between items-center '>
                        <p className='font-bold'>BUSINESS OVERVIEW </p>

                        <div className='flex'>
                            <p className='font-bold '> 1 May - May 12, 2023 </p>
                            <p><FontAwesomeIcon className='pl-3' icon={faCaretDown}></FontAwesomeIcon></p>
                        </div>
                    </div>
                    <div className='mt-2 ' style={{ height: '1px', backgroundColor: '#00000033' }}>

                    </div>
                </div>


                <section className={styles.mainBox}>
                    <div className='grid grid-cols-2' >

                        <div className={`${styles.gridBorder}`}>
                            <div className='flex py-7 justify-evenly'>
                                <div className='w-[170px] '>
                                    <div className='flex justify-between items-center mb-1'>
                                        <p className='text-sm font-semibold'>COMPLETED REVENUE</p>
                                        <p><FontAwesomeIcon icon={faQuestionCircle}></FontAwesomeIcon></p>
                                    </div>
                                    <div className={`h-[85px] flex justify-center items-center text-2xl font-semibold bg-[#77DD7733] box-border ${styles.boxBorder1}`}>
                                        <p>$90,850</p>
                                    </div>
                                </div>
                                <div className='w-[170px] '>
                                    <div className='flex justify-between items-center mb-1'>
                                        <p className='text-sm font-semibold'>LEAKED REVENUE</p>
                                        <p><FontAwesomeIcon icon={faQuestionCircle}></FontAwesomeIcon></p>
                                    </div>
                                    <div className={`h-[85px] flex justify-center items-center text-2xl font-semibold bg-[#FF696133] box-border ${styles.boxBorder2}`}>
                                        <p>$90,850</p>
                                    </div>
                                </div>
                                <div className='w-[170px]'>
                                    <div className='flex justify-between items-center mb-1'>
                                        <p className='text-sm font-semibold'>IMPENDING REVENUE</p>
                                        <p><FontAwesomeIcon icon={faQuestionCircle}></FontAwesomeIcon></p>
                                    </div>
                                    <div className={`h-[85px] flex justify-center items-center text-2xl font-semibold bg-[#95BDFF33] box-border ${styles.boxBorder3}`}>
                                        <p>$90,850</p>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div>
                            <div className='flex py-7 justify-evenly'>
                                <div className='w-[170px] '>
                                    <div className='flex justify-between items-center mb-1'>
                                        <p className='text-sm font-semibold text-[#00000080]'>UNPAID INVOICES</p>
                                        <p><FontAwesomeIcon icon={faQuestionCircle}></FontAwesomeIcon></p>
                                    </div>
                                    <div className={`h-[85px] flex justify-center items-center text-sm text-[#667085] bg-white`}>
                                        <p className='font-medium'>Coming soon</p>
                                    </div>
                                </div>
                                <div className='w-[170px] '>
                                    <div className='flex justify-between items-center mb-1'>
                                        <p className='text-sm font-semibold text-[#00000080]'>PAID INVOICES</p>
                                        <p><FontAwesomeIcon icon={faQuestionCircle}></FontAwesomeIcon></p>
                                    </div>
                                    <div className={`h-[85px] flex justify-center items-center text-sm text-[#667085] bg-white`}>
                                        <p className='font-medium'>Coming soon</p>
                                    </div>
                                </div>
                                <div className='w-[170px]'>
                                    <div className='flex justify-between items-center mb-1'>
                                        <p className='text-sm font-semibold text-[#00000080]'>CANCELLED INVOICES</p>
                                        <p><FontAwesomeIcon icon={faQuestionCircle}></FontAwesomeIcon></p>
                                    </div>
                                    <div className={`h-[85px] flex justify-center items-center text-sm text-[#667085] bg-white`}>
                                        <p className='font-medium'>Coming soon</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className='mt-[30px] mr-[20px]'>
                        <div className='flex justify-between items-center '>
                            <p className='font-bold'>USERS OVERVIEW </p>

                            <div className='flex'>
                                <p className='font-bold '> 1 May - May 12, 2023 </p>
                                <p><FontAwesomeIcon className='pl-3' icon={faCaretDown}></FontAwesomeIcon></p>
                            </div>
                        </div>
                        <div className='mt-2 ' style={{ height: '1px', backgroundColor: '#00000033' }}>
                        </div>
                    </div>


                    <div className='grid grid-cols-5 mt-[30px]'>
                        <div>
                            <p className='text-sm mb-1 font-semibold'>USER STATS</p>
                            <div className={`w-[190px] bg-[#F6F6F6] pl-[19px] py-[13px] rounded ${styles.smallBoxBorder}`}>
                                <p>Active / Total Students</p>
                                <p className='text-xl'><span className='font-semibold '>59</span> / 267</p>
                            </div>
                            <div className={`w-[190px] bg-[#F6F6F6] pl-[19px] py-[13px] rounded ${styles.smallBoxBorder} mt-6`}>
                                <p>Active / Total Students</p>
                                <p className='text-xl'><span className='font-semibold '>59</span> / 267</p>
                            </div>
                            <div className={`w-[190px] bg-[#F6F6F6] pl-[19px] py-[13px] rounded ${styles.smallBoxBorder} mt-6`}>
                                <p>Active / Total Students</p>
                                <p className='text-xl'><span className='font-semibold '>59</span> / 267</p>
                            </div>
                        </div>

                        <div className='col-span-4' >
                            <p className='text-sm mb-2 font-semibold'>ACTION LOG</p>
                            <div className={styles.actionBox}>
                                <div className='mr-5'>
                                    <p className='text-sm pl-[56px] pt-[12px] pb-[14px]'>May. 1, 2023</p>
                                </div>
                                <div style={{ height: '1px', backgroundColor: '#00000040' }} />

                                <div>
                                    <div className='flex ml-[56px] h-[45px]'>
                                        <p className='pt-2 font-medium text-[10px]'>2:10 pm</p>
                                        <div className={`pt-3 ${styles.actionBorder}`}>
                                            <div className={styles.circle}>
                                                <div className={styles.circle2}></div>
                                            </div>
                                            <p className='pl-5 text-sm font-medium'>Lorem ipsum dolor sit amet, consectetur adipiscing elit ,sed do eiusmod tempor incidut labore et dolore magna aliqua.</p>
                                        </div>
                                    </div>
                                    <div className='flex ml-[56px] h-[45px]'>
                                        <p className='pt-2 font-medium text-[10px]'>2:10 pm</p>
                                        <div className={`pt-3 ${styles.actionBorder}`}>
                                            <div className={styles.circle}>
                                                <div className={styles.circle2}></div>
                                            </div>
                                            <p className='pl-5 text-sm font-medium'>Lorem ipsum dolor sit amet, consectetur adipiscing elit ,sed do eiusmod tempor incidut labore et dolore magna aliqua.</p>
                                        </div>
                                    </div>
                                    <div className='flex ml-[56px] h-[45px]'>
                                        <p className='pt-2 font-medium text-[10px]'>2:10 pm</p>
                                        <div className={`pt-3 ${styles.actionBorder}`}>
                                            <div className={styles.circle}>
                                                <div className={styles.circle2}></div>
                                            </div>
                                            <p className='pl-5 text-sm font-medium'>Lorem ipsum dolor sit amet, consectetur adipiscing elit ,sed do eiusmod tempor incidut labore et dolore magna aliqua.</p>
                                        </div>
                                    </div>
                                    <div className='flex ml-[56px] h-[45px]'>
                                        <p className='pt-2 font-medium text-[10px]'>2:10 pm</p>
                                        <div className={`pt-3 ${styles.actionBorder}`}>
                                            <div className={styles.circle}>
                                                <div className={styles.circle2}></div>
                                            </div>
                                            <p className='pl-5 text-sm font-medium'>Lorem ipsum dolor sit amet, consectetur adipiscing elit ,sed do eiusmod tempor incidut labore et dolore magna aliqua.</p>
                                        </div>
                                    </div>
                                    <div className='flex ml-[56px] h-[45px]'>
                                        <p className='pt-2 font-medium text-[10px]'>2:10 pm</p>
                                        <div className={`pt-3 ${styles.actionBorder}`}>
                                            <div className={styles.circle}>
                                                <div className={styles.circle2}></div>
                                            </div>
                                            <p className='pl-5 text-sm font-medium'>Lorem ipsum dolor sit amet, consectetur adipiscing elit ,sed do eiusmod tempor incidut labore et dolore magna aliqua.</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                <section className='mt-[50px]'>
                    <p className='font-semibold uppercase '>Latest Sign-ups</p>


                    <table className='table-auto w-full'>
                        <thead>
                            <tr>
                                <th>Full Name</th>
                                <th>User Type</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Assigned Tutor</th>
                                <th>Lead Status</th>
                                <th>Tutor Status</th>
                                <th>Services</th>
                                <th>Date Added</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='font-bold'>Lorem</td>
                                <td className='font-bold'>Lorem</td>
                                <td className='font-bold'>Lorem</td>
                                <td className='font-bold'>Lorem</td>
                                <td className='font-bold'>Lorem</td>
                                <td className='font-bold'>Lorem</td>
                                <td className='font-bold'>Lorem</td>
                                <td className='font-bold'>Lorem</td>
                                <td className='font-bold'>Lorem</td>
                            </tr>
                        </tbody>
                    </table>



                </section>

            </div>
        </div>

    );
};

export default Dashboard;