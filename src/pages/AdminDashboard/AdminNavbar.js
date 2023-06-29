import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowDown19, faArrowDown91, faArrowRightFromBracket, faCaretDown, faDollar, faPlus, faUpload } from '@fortawesome/free-solid-svg-icons';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import icon from "../../assets/icons/FIGMA 3.svg";
import image from '../../assets/images/Vector.png';
import image1 from '../../assets/images/Vector (1).png';
import image2 from '../../assets/images/Vector (2).png';
import image3 from '../../assets/images/Vector (3).png';
import image4 from '../../assets/images/Vector (4).png';
import image5 from '../../assets/images/Vector (5).png';
import image6 from '../../assets/images/Vector (6).png';

const AdminNavbar = () => {
    return (
        <div className='flex justify-around bg-[#26435F] h-[54px] items-center w-full'>
            <div><img src={icon} alt="" /></div>
            <div className='flex  text-[#FFFFFF] font-semibold text-[13px]'>
                <div className='flex items-center mr-6'>
                    <p><img src={image} alt="" /></p>
                    <p className='pl-[10px]'>Dashboard</p>
                </div>
                <div className='flex items-center mr-6'>
                    <p><img src={image1} alt="" /></p>
                    <p className='pl-[10px]'>CRM</p>
                </div>
                <div className='flex items-center mr-6'>
                    <p><img src={image2} alt="" /></p>
                    <p className='pl-[10px]'>Schedule</p>
                </div>
                <div className='flex items-center mr-6'>
                    <p><img src={image3} alt="" /></p>
                    <p className='pl-[10px]'>Assignments</p>
                </div>
                <div className='flex items-center mr-6'>
                    <p><img src={image4} alt="" /></p>
                    <p className='pl-[10px]'>Content</p>
                </div>
                <div className='flex items-center mr-6'>
                    <p><img src={image5} alt="" /></p>
                    <p className='pl-[10px]'>Invoicing</p>
                </div>
                <div className='flex items-center mr-6'>
                    <p><img src={image6} alt="" /></p>
                    <p className='pl-[10px]'>Settings</p>
                </div>
            </div>
            <div className='flex font-bold'>
                <div className='flex mr-[24px] text-[#24A3D9] text-xs '>
                    <p className=' '>Pricing </p>
                    <p><FontAwesomeIcon className='pl-2' icon={faDollar}></FontAwesomeIcon></p>
                </div>
                <div className='flex mr-[24px] text-[#24A3D9] text-xs'>
                    <p className=' '>Help</p>
                    <p><FontAwesomeIcon className='pl-2' icon={faQuestionCircle}></FontAwesomeIcon></p>
                </div>
                <div className='flex text-xs'>
                    <div>
                        <p className='text-[#24A3D9]'>Logout</p>
                    </div>
                    <div>
                        <p><FontAwesomeIcon className='pl-2 text-[#24A3D9]' icon={faArrowRightFromBracket}></FontAwesomeIcon></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminNavbar;