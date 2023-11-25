import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowDown19, faArrowDown91, faArrowRightFromBracket, faCaretDown, faDollar, faPlus, faUpload } from '@fortawesome/free-solid-svg-icons';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import icon from '../../assets/images/Evallo.png';
import image from '../../assets/images/Vector.png';
import image1 from '../../assets/images/Vector (1).png';
import image2 from '../../assets/images/Vector (2).png';
import image3 from '../../assets/images/Vector (3).png';
import image4 from '../../assets/images/Vector (4).png';
import image5 from '../../assets/images/Vector (5).png';
import image6 from '../../assets/images/Vector (6).png';
import styles from './style.module.css';
import AdminNavbar from '../AdminDashboard/AdminNavbar';

const AdminContent = () => {

    const [displayMaterial, setDisplayMaterial] = useState('hidden')
    const [displayRemove, setDisplayRemove] = useState('hidden')
    const AddNewMaterial = () => {
        setDisplayMaterial('block')
        if (displayMaterial === 'block') {
            setDisplayMaterial('hidden')
        }
    }

    const Remove = () => {
        setDisplayRemove('block')
        if (displayRemove === 'block') {
            setDisplayRemove('hidden')
        }
    }

    return (
        <div className={`${styles.container} relative`}>
            <AdminNavbar></AdminNavbar>
            <section className='mx-[80px] min-h-[74vh]'>
                <div className='mt-6'>
                    <p className='text-[#24A3D9]'>{`{Company Name} > `}<span className='font-semibold'>Content</span></p>
                    <div className='flex justify-between items-center mb-[20px]'>
                        <div>
                            <input className={`text-[#667085] py-2 mt-5 text-sm pl-[55px] ${styles.customSearch}`} type="search" name="" id="" placeholder='Search' />
                        </div>
                        <div>
                            <p className='font-normal text-[#FFFFFF]'><button className='py-3 px-4 bg-[#FFA28D] text-xs rounded-lg' type="button " onClick={AddNewMaterial}>Add New Material <FontAwesomeIcon className='pl-1 ' icon={faPlus}></FontAwesomeIcon></button></p>
                        </div>
                    </div>
                    <div>
                        <table className={`w-full ${styles.customTable}`} >
                            <thead>
                                <tr>
                                    <th>Test Name <FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>
                                    <th>Type <FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>
                                    <th>Created On <FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>
                                    <th>Last Modified<FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>
                                    <th>Total Assignments <FontAwesomeIcon className='pl-1 w-[10px]' icon={faArrowDown}></FontAwesomeIcon></th>

                                    <th></th>
                                    <th></th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''><button className='text-xs text-[#FFFFFF] rounded py-2 px-7 bg-[#FFA28D]' type="button">View</button></td>
                                    <td className=''><button className='text-xs text-[#FFFFFF] rounded py-2 px-7 bg-[#26435F4D]' type="button" onClick={Remove}>Remove</button></td>
                                </tr>
                                <tr>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''><button className='text-xs text-[#FFFFFF] rounded py-2 px-7 bg-[#FFA28D]' type="button">View</button></td>
                                    <td className=''><button className='text-xs text-[#FFFFFF] rounded py-2 px-7 bg-[#26435F4D]' type="button" onClick={Remove}>Remove</button></td>
                                </tr>
                                <tr>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''><button className='text-xs text-[#FFFFFF] rounded py-2 px-7 bg-[#FFA28D]' type="button">View</button></td>
                                    <td className=''><button className='text-xs text-[#FFFFFF] rounded py-2 px-7 bg-[#26435F4D]' type="button" onClick={Remove}>Remove</button></td>
                                </tr>
                                <tr>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''><button className='text-xs text-[#FFFFFF] rounded py-2 px-7 bg-[#FFA28D]' type="button">View</button></td>
                                    <td className=''><button className='text-xs text-[#FFFFFF] rounded py-2 px-7 bg-[#26435F4D]' type="button" onClick={Remove}>Remove</button></td>
                                </tr>
                                <tr>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''><button className='text-xs text-[#FFFFFF] rounded py-2 px-7 bg-[#FFA28D]' type="button">View</button></td>
                                    <td className=''><button className='text-xs text-[#FFFFFF] rounded py-2 px-7 bg-[#26435F4D]' type="button" onClick={Remove}>Remove</button></td>
                                </tr>
                                <tr>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''><button className='text-xs text-[#FFFFFF] rounded py-2 px-7 bg-[#FFA28D]' type="button">View</button></td>
                                    <td className=''><button className='text-xs text-[#FFFFFF] rounded py-2 px-7 bg-[#26435F4D]' type="button" onClick={Remove}>Remove</button></td>
                                </tr>
                                <tr>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''>Lorem</td>
                                    <td className=''><button className='text-xs text-[#FFFFFF] rounded py-2 px-7 bg-[#FFA28D]' type="button">View</button></td>
                                    <td className=''><button className='text-xs text-[#FFFFFF] rounded py-2 px-7 bg-[#26435F4D]' type="button" onClick={Remove}>Remove</button></td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>
                <p className='text-[10px] mt-[10px] text-right'><span className='text-[#26435F ]  font-medium '>Prev</span><span className='pl-2 text-[#FFA28D] font-bold'>01</span><span className='pl-2 text-[#B7C2CB] '>02</span><span className='pl-2'>...</span><span className='pl-2 text-[#B7C2CB] '>06</span><span className='text-[#26435F ] font-medium pl-2'>Next</span></p>
            </section>


            <div className={`w-[500px] p-6 bg-[#FFFFFF] rounded absolute top-[25%] right-[35%] ${displayMaterial}`}>
                <p className='text-[#26435F] font-semibold mb-4'>Upload New Material</p>
                <div className='h-[1px] bg-[#00000033] mb-5'></div>
                <div className='flex justify-between'>
                    <div>
                        <label className='text-[#26435F] text-sm' htmlFor="">Assignment Name</label>
                        <input type="text" placeholder='Text' className='py-2 pl-2 block bg-[#F6F6F6] text-xs rounded' />
                    </div>
                    <div>
                        <label className='text-[#26435F] text-sm' htmlFor="">Type</label>
                        <input type="text" placeholder='Select' className='py-2 pl-2 block bg-[#F6F6F6] text-xs rounded' />
                    </div>
                </div>
                <div className='text-xs flex justify-between mt-6 text-[#FFFFFF]'>
                    <p><button type="button" className=' p-4 bg-[#26435F] rounded-7'>Upload PDF <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon></button></p>
                    <p><button type="button" className=' p-4 bg-[#26435F] rounded-7'>Upload Metadata</button></p>
                    <p><button type="button" className=' p-4 bg-[#FFA28D] rounded-7'>Create</button></p>
                </div>
            </div>
            <div className={`w-[500px] p-6 bg-[#FFFFFF] rounded  absolute top-[25%] right-[35%] ${displayRemove}`}>
                <p className='text-[#26435F] font-semibold mb-4'>{`Are you sure you want to remove {Test Name}`}</p>
                <div className='h-[1px] bg-[#00000033] mb-5'></div>

                <div className='text-xs flex justify-center mt-6 text-[#FFFFFF]'>
                    <p><button type="button" className=' p-4 bg-[#26435F1A] rounded-7 text-[#26435F] mr-5'>Cancel</button></p>
                    <p><button onClick={Remove} type="button" className=' p-4 bg-[#FFA28D] rounded-7' >Remove</button></p>
                </div>
            </div>

            <footer className='bg-[#26435F] text-[#FFFFFF] py-[18px]  w-full mt-[55px]'>
                <div className='flex  text-xs font-medium justify-between'>
                    <p className='ml-[74px]'>Copyright © Sevenimagine Education Private Limited</p>
                    <div className='flex mr-[45px]'>
                        <p>Terms of Usage</p>
                        <p className='ml-6'>Privacy Policy</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AdminContent;