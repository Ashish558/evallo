import React from 'react';
import SAdminNavbar2 from '../../components/sAdminNavbar/sAdminNavbar2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowDown19, faArrowDown91, faArrowRightFromBracket, faCaretDown, faDollar } from '@fortawesome/free-solid-svg-icons';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import icon from '../../assets/images/Evallo.png';
import styles from './style.module.css';
import image from '../../assets/images/Vector.png';
import image1 from '../../assets/images/Vector (1).png';
import image2 from '../../assets/images/Vector (2).png';
import image3 from '../../assets/images/Vector (3).png';
import image4 from '../../assets/images/Vector (4).png';
import image5 from '../../assets/images/Vector (5).png';
import image6 from '../../assets/images/Vector (6).png';
import AdminNavbar from './AdminNavbar';


const Dashboard = () => {
    return (
        <div class={styles.container}>
            {/* <SAdminNavbar2></SAdminNavbar2> */}
            <AdminNavbar></AdminNavbar>
            <div className=" mt-[28px] bg-#2E2E2E " >
                <div className='mt-[42px] flex justify-center'>
                    <div className='w-full mx-[80px]'>
                        <div className='flex justify-between items-center '>
                            <p className='font-bold text-[#26435F]'>BUSINESS OVERVIEW </p>

                            <div className='flex text-xs '>
                                <p className='font-semibold text-[#26435F]'> 1 May - May 12, 2023 </p>
                                <p><FontAwesomeIcon className='pl-3' icon={faCaretDown}></FontAwesomeIcon></p>
                            </div>
                        </div>
                    </div>

                </div>


                <section className='flex justify-center'>
                    <div className={styles.mainBox}>
                        <div className='grid grid-cols-2' >

                            <div className={`${styles.gridBorder}`}>
                                <div className='flex  justify-evenly'>
                                    <div className='w-[170px] '>
                                        <div className='flex justify-between items-center mb-1 text-[#26435F] text-sm'>
                                            <p className='   font-medium'>Completed Revenue</p>
                                            <p><FontAwesomeIcon icon={faQuestionCircle}></FontAwesomeIcon></p>
                                        </div>
                                        <div className={`h-[85px] flex justify-center items-center text-2xl font-bold bg-[#22A69933] box-border ${styles.boxBorder1}`}>
                                            <p>$90,850</p>
                                        </div>
                                    </div>
                                    <div className='w-[170px] '>
                                        <div className='flex justify-between items-center mb-1 text-[#26435F] text-sm'>
                                            <p className='font-medium'>Leaked Revenue</p>
                                            <p><FontAwesomeIcon icon={faQuestionCircle}></FontAwesomeIcon></p>
                                        </div>
                                        <div className={`h-[85px] flex justify-center items-center text-2xl font-semibold bg-[#FF517533] box-border ${styles.boxBorder2}`}>
                                            <p>$2560</p>
                                        </div>
                                    </div>
                                    <div className='w-[170px]'>
                                        <div className='flex justify-between items-center mb-1 text-[#26435F] text-sm'>
                                            <p className='   font-medium'>Impending Revenue</p>
                                            <p><FontAwesomeIcon icon={faQuestionCircle}></FontAwesomeIcon></p>
                                        </div>
                                        <div className={`h-[85px] flex justify-center items-center text-2xl font-semibold bg-[#7152EB33] box-border ${styles.boxBorder3}`}>
                                            <p>$9870</p>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className={`${styles.gridBorder2}`}>
                                <div className='flex  justify-evenly'>
                                    <div className='w-[170px] '>
                                        <div className='mb-1'>
                                            <p className='text-sm font-medium text-[#26435F80]'>Unpaid Invoices</p>
                                        </div>
                                        <div className={`h-[85px] flex justify-center items-center text-sm text-[#667085] bg-[#F5F8FA]`}>
                                            <p >Coming soon</p>
                                        </div>
                                    </div>
                                    <div className='w-[170px] '>
                                        <div className=' mb-1'>
                                            <p className='text-sm font-medium text-[#26435F80]'>Paid Invoices</p>
                                        </div>
                                        <div className={`h-[85px] flex justify-center items-center text-sm text-[#667085] bg-[#F5F8FA]`}>
                                            <p >Coming soon</p>
                                        </div>
                                    </div>
                                    <div className='w-[170px]'>
                                        <div className='mb-1'>
                                            <p className='text-sm font-medium text-[#26435F80]'>Cancelled Invoices</p>

                                        </div>
                                        <div className={`h-[85px] flex justify-center items-center text-sm text-[#667085] bg-[#F5F8FA]`}>
                                            <p >Coming soon</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section>

                    <div className='flex justify-center'>
                        <div className='mt-[30px] w-screen mx-[120px]'>
                            <div className='mt-2 h-[1px] bg-[#00000033]'>
                            </div>

                        </div>
                    </div>
                    <div className='w-[screen] mx-[80px] mt-[42px] text-[#26435F]'>
                        <div className='flex justify-between items-center '>
                            <p className='font-bold'>USER OVERVIEW </p>

                            <div className='flex font-semibold text-xs'>
                                <p > 1 May - May 12, 2023 </p>
                                <p><FontAwesomeIcon className='pl-3' icon={faCaretDown}></FontAwesomeIcon></p>
                            </div>
                        </div>
                    </div>



                    <div className='grid grid-cols-5 mt-[30px] mx-[80px] gap-x-29'>
                        <div>
                            <p className=' mb-1 font-semibold text-[#26435F]'>User Stats</p>
                            <div className={styles.sidebox}>
                                <div className='pl-[19px]  pt-5 rounded '  >
                                    <p className='text-[#26435F]'>Active / Total Students</p>
                                    <p className='text-xl'><span className='font-bold text-[#FFA28D] text-3xl'>59</span> / 267</p>
                                </div>
                                <div className={`  pl-[19px] pt-7 rounded `}>
                                    <p className='text-[#26435F]'>Active / Total Students</p>
                                    <p className='text-xl'><span className='font-bold text-[#FFA28D] text-3xl'>59</span> / 267</p>
                                </div>
                                <div className={`  pl-[19px] pt-7 rounded pb-6`}>
                                    <p className='text-[#26435F]'>Active / Total Students</p>
                                    <p className='text-xl'><span className='font-bold text-[#FFA28D] text-3xl'>59</span> / 267</p>
                                </div>
                            </div>
                        </div>

                        <div className='col-span-4' >
                            <p className='mb-1 font-semibold text-[#26435F]'>ACTION LOG</p>
                            <div className={styles.actionBox}>
                                <div className='mr-5'>
                                    <p className='uppercase  pl-[56px] pt-[12px] pb-[14px] text-[#26435F]'>May. 1, 2023</p>
                                </div>
                                <div className='h-[1px] bg-[#CBD6E2]' />

                                <div >

                                    <div className='flex ml-7 h-[57px]'>
                                        <p className='text-[#4A556C] pt-5 font-medium text-xs mr-6'>2:10 pm</p>
                                        <div className={`pt-5 ${styles.actionBorder}`}>
                                            <div className={styles.circle}>
                                                <div className={styles.circle2}></div>
                                            </div>
                                            <p className='pl-5 text-sm font-medium text-[#4A556C]'>Lorem ipsum dolor sit amet, consectetur adipiscing elit ,sed do eiusmod tempor incidut labore et dolore magna aliqua.</p>
                                        </div>
                                    </div>
                                    <div className='flex ml-7 h-[57px]'>
                                        <p className='text-[#4A556C] pt-5 font-medium text-xs mr-6'>2:10 pm</p>
                                        <div className={`pt-5 ${styles.actionBorder}`}>
                                            <div className={styles.circle}>
                                                <div className={styles.circle2}></div>
                                            </div>
                                            <p className='pl-5 text-sm font-medium text-[#4A556C]'>Lorem ipsum dolor sit amet, consectetur adipiscing elit ,sed do eiusmod tempor incidut labore et dolore magna aliqua.</p>
                                        </div>
                                    </div><div className='flex ml-7 h-[57px]'>
                                        <p className='text-[#4A556C] pt-5 font-medium text-xs mr-6'>2:10 pm</p>
                                        <div className={`pt-5 ${styles.actionBorder}`}>
                                            <div className={styles.circle}>
                                                <div className={styles.circle2}></div>
                                            </div>
                                            <p className='pl-5 text-sm font-medium text-[#4A556C]'>Lorem ipsum dolor sit amet, consectetur adipiscing elit ,sed do eiusmod tempor incidut labore et dolore magna aliqua.</p>
                                        </div>
                                    </div>
                                    <div className='flex ml-7 h-[57px]'>
                                        <p className='text-[#4A556C] pt-5 font-medium text-xs mr-6'>2:10 pm</p>
                                        <div className={`pt-5 ${styles.actionBorder}`}>
                                            <div className={styles.circle}>
                                                <div className={styles.circle2}></div>
                                            </div>
                                            <p className='pl-5 text-sm font-medium text-[#4A556C]'>Lorem ipsum dolor sit amet, consectetur adipiscing elit ,sed do eiusmod tempor incidut labore et dolore magna aliqua.</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                <section className='mt-[30px] mx-[80px]'>
                    <p className='font-semibold text-[#26435F] '>Latest Sign-ups</p>


                    <div className=''>
                        <table className='table-auto w-full' >
                            <thead>
                                <tr>
                                    <th>Full Name <FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>
                                    <th>User Type <FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>
                                    <th>Email <FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>
                                    <th>Phone <FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>
                                    <th>Assigned Tutor <FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>
                                    <th>Lead Status <FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>
                                    <th>Tutor Status <FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>
                                    <th>Services <FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>
                                    <th>Date Added <FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className=''>Lorem</td>
                                    <td className=''>Student</td>
                                    <td className=''>Loream123@gmail.com </td>
                                    <td className=''>99930350xx</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>May. 12, 2023</td>
                                </tr>
                                <tr>
                                    <td className=''>Lorem</td>
                                    <td className=''>Student</td>
                                    <td className=''>Loream123@gmail.com </td>
                                    <td className=''>99930350xx</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>May. 12, 2023</td>
                                </tr>
                                <tr>
                                    <td className=''>Lorem</td>
                                    <td className=''>Student</td>
                                    <td className=''>Loream123@gmail.com </td>
                                    <td className=''>99930350xx</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>May. 12, 2023</td>
                                </tr>
                                <tr>
                                    <td className=''>Lorem</td>
                                    <td className=''>Student</td>
                                    <td className=''>Loream123@gmail.com </td>
                                    <td className=''>99930350xx</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>May. 12, 2023</td>
                                </tr>
                                <tr>
                                    <td className=''>Lorem</td>
                                    <td className=''>Student</td>
                                    <td className=''>Loream123@gmail.com </td>
                                    <td className=''>99930350xx</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>May. 12, 2023</td>
                                </tr>
                                <tr>
                                    <td className=''>Lorem</td>
                                    <td className=''>Student</td>
                                    <td className=''>Loream123@gmail.com </td>
                                    <td className=''>99930350xx</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>May. 12, 2023</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>



                </section>
                <div className='flex justify-center'>
                    <div className='mt-[30px] w-screen mx-[120px]'>
                        <div className='mt-2 h-[1px] bg-[#00000033]' >
                        </div>

                    </div>
                </div>
                <div className='w-[screen] mx-[80px] mt-[42px] text-[#26435F]'>
                    <div className='flex justify-between items-center '>
                        <p className='font-bold uppercase'>Client Success Overview </p>

                        <div className='flex font-semibold text-xs'>
                            <p > 1 May - May 12, 2023 </p>
                            <p><FontAwesomeIcon className='pl-3' icon={faCaretDown}></FontAwesomeIcon></p>
                        </div>
                    </div>
                </div>

                <section className='mt-[50px] mx-[80px]'>

                    <div className='grid grid-cols-3 gap-12'>
                        <div className='col-span-2'>
                            <p className='font-semibold text-[#26435F] text-[14px]'>Popular services</p>
                            <table className='table-auto w-full' >
                                <thead>
                                    <tr>
                                        <th>Service <FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>
                                        <th>Actively Using <FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>
                                        <th>Total Users <FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>
                                        <th>Scheduled Hours<FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>
                                        <th>Completed Hours <FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>
                                        <th>% of Business <FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>

                                    </tr>
                                    <tr>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>

                                    </tr>
                                    <tr>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>

                                    </tr>
                                    <tr>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>

                                    </tr>
                                    <tr>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>

                                    </tr>
                                    <tr>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>
                                        <td className=''>Lorem</td>

                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div>

                            <p className='mt-1 mb-[10px] font-semibold text-[#26435F] text-[14px] '>Star Clients</p>
                            <div>
                                <table className={` w-full ${styles.sTable} `} >
                                    <thead>
                                        <tr>
                                            <th>Client Name </th>
                                            <th>Code </th>
                                            <th>Referrals </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className='h-[45px]'>
                                            <td className=''>Lorem</td>
                                            <td className=''>$XDR$#</td>
                                            <td className=''>45</td>
                                        </tr>
                                        <tr className='h-[45px]'>
                                            <td className=''>Lorem</td>
                                            <td className=''>$XDR$#</td>
                                            <td className=''>45</td>
                                        </tr>
                                        <tr className='h-[45px]'>
                                            <td className=''>Lorem</td>
                                            <td className=''>$XDR$#</td>
                                            <td className=''>45</td>
                                        </tr>
                                        <tr className='h-[45px]'>
                                            <td className=''>Lorem</td>
                                            <td className=''>$XDR$#</td>
                                            <td className=''>45</td>
                                        </tr>
                                        <tr className='h-[45px]'>
                                            <td className=''>Lorem</td>
                                            <td className=''>$XDR$#</td>
                                            <td className=''>45</td>
                                        </tr>
                                        <tr className='h-[45px]'>
                                            <td className=''>Lorem</td>
                                            <td className=''>$XDR$#</td>
                                            <td className=''>45</td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>



                </section>

                <section className='mt-[30px] mx-[80px]'>
                    <div className='grid grid-cols-2 gap-x-80'>
                        <div className='flex justify-between text-sm text-[#26435F]'>
                            <div>
                                <p className='font-semibold text-sm'>Total # Of referrals</p>
                                <div className={`w-[174px] h-[58px] ${styles.smallBox}`} ></div>
                            </div>
                            <div>
                                <p className='font-semibold text-sm'>Average SAT improvement</p>
                                <div className={`w-[190px] h-[58px] ${styles.smallBox}`} ></div>
                            </div>
                            <div>
                                <p className='font-semibold text-sm'>Average ACT improvement</p>
                                <div className={`w-[190px] h-[58px] ${styles.smallBox}`} ></div>
                            </div>
                        </div>
                        <div className='flex  text-xs justify-between text-[#667085]'>
                            <div>
                                <p >Average GRE improvement</p>
                                <div className={`w-[174px] h-[58px] ${styles.smallBox2} flex items-center justify-center font-medium`} ><p >Coming Soon</p></div>
                            </div>
                            <div>
                                <p >Average GMAT improvement</p>
                                <div className={`w-[174px] h-[58px] ${styles.smallBox2} flex items-center justify-center font-medium`} ><p >Coming Soon</p></div>
                            </div>
                            <div>
                                <p >Average IELTS improvement</p>
                                <div className={`w-[174px] h-[58px] ${styles.smallBox2} flex items-center justify-center font-medium`} ><p >Coming Soon</p></div>
                            </div>
                        </div>
                        <div>
                        </div>
                    </div>
                </section>
                <div className='flex justify-center'>
                    <div className='mt-[41px] w-screen mx-[120px]'>
                        <div className='mt-2 h-[1px] bg-[#00000033]' >
                        </div>

                    </div>
                </div>
                <div className='w-[screen] mx-[80px] mt-[42px] text-[#26435F]'>
                    <div className='flex justify-between items-center '>
                        <p className='font-bold uppercase'>Tutor Performence  Overview </p>

                        <div className='flex font-semibold text-xs'>
                            <p > 1 May - May 12, 2023 </p>
                            <p><FontAwesomeIcon className='pl-3' icon={faCaretDown}></FontAwesomeIcon></p>
                        </div>
                    </div>
                </div>
                <section >
                    <div className='mx-[80px]'>
                        <table className='table-auto w-full' >
                            <thead>
                                <tr>
                                    <th>Tutor Name <FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>
                                    <th>Tutor Status <FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>
                                    <th>Rating <FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>
                                    <th>Referrals <FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>
                                    <th>Hours Completed <FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>
                                    <th>Hours Scheduled <FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>
                                    <th>Hours Cancelled<FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>
                                    <th>Hours Missed <FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>
                                    <th>Avg SAT improvement  <FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem </td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                </tr>
                                <tr>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem </td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                </tr>
                                <tr>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem </td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                    <div className='flex justify-center'>
                        <div className='mt-[36px] mb-[44px] bg-[#CBD6E2] h-[1px] w-[100px]'>

                        </div>
                    </div>
                </section>

                <footer className='bg-[#26435F] text-[#FFFFFF] py-[18px] w-full'>
                    <div className='flex  text-xs font-medium justify-between'>
                        <p className='ml-[74px]'>Copyright © Sevenimagine Education Private Limited</p>
                        <div className='flex mr-[45px]'>
                            <p>Terms of Usage</p>
                            <p className='ml-6'>Privacy Policy</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>

    );
};

export default Dashboard;