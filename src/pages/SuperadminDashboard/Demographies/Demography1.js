import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const Demography1 = () => {
    return (
        <div className='bg-[#FFFFFF] flex justify-center items-center border border-gray-200 p-4 mt-[6px] rounded-md'>
            <div className='grid grid-cols-2'>
                <div>
                    <button className='text-[#FFA28D] border px-6 py-3 border-[#FFA28D] text-[10px] font-medium rounded-full'>User <FontAwesomeIcon className='pl-2' icon={faCaretDown}></FontAwesomeIcon></button>
                    <button className='ml-4 text-[#FFA28D] border px-6 py-3 border-[#FFA28D] rounded-full text-[10px] font-medium'>Country <FontAwesomeIcon className='pl-2' icon={faCaretDown}></FontAwesomeIcon></button>
                </div>
                <div>
                    <p className='text-[#26435F] text-xs font-semibold'>INDIA <FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon></p>
                    <table className='table-auto w-full' >
                        <thead>
                            <tr>
                                <th className='px-10'>State </th>
                                <th className='px-10'># of orgs </th>
                                <th className='px-10'>Avg. # of S / O </th>
                                <th className='px-10'>Avg. # of T / O</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className=''>Delhi</td>
                                <td className=''>25</td>
                                <td className=''>Ipsum</td>
                                <td className=''>Lorem</td>

                            </tr>
                            <tr>
                                <td className=''>Delhi</td>
                                <td className=''>25</td>
                                <td className=''>Ipsum</td>
                                <td className=''>Lorem</td>

                            </tr>
                            <tr>
                                <td className=''>Delhi</td>
                                <td className=''>25</td>
                                <td className=''>Ipsum</td>
                                <td className=''>Lorem</td>

                            </tr>
                            <tr>
                                <td className=''>Delhi</td>
                                <td className=''>25</td>
                                <td className=''>Ipsum</td>
                                <td className=''>Lorem</td>

                            </tr>
                            <tr>
                                <td className=''>Delhi</td>
                                <td className=''>25</td>
                                <td className=''>Ipsum</td>
                                <td className=''>Lorem</td>

                            </tr>
                            <tr>
                                <td className=''>Delhi</td>
                                <td className=''>25</td>
                                <td className=''>Ipsum</td>
                                <td className=''>Lorem</td>

                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
};

export default Demography1;