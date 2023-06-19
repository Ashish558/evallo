import React from "react";
import SAdminNavbar from "../../components/sAdminNavbar/sAdminNavbar";
import styles from "./styles.module.css";
import OrgCard from "./orgCard/orgCard";
import Table from "./Table/table";
import { orgData, tableHeaders } from "./temp";
import Chart from "./DataChart/Chart";
import Index from "./FinancialStats/Index1";
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

const orgContents = [
  {
    heading: "Total # of Orgs",
    text: "350",
  },
  {
    heading: "C:I Ratio",
    text: "350",
  },
  {
    heading: "11 days",
    text: "350",
  },
  {
    heading: "Inactive",
    text: "350",
  },
];

const userTypes = [
  {
    text: "Admin",
    selected: true,
  },
  {
    text: "Contributor",
    selected: false,
  },
  {
    text: "Student",
    selected: false,
  },
  {
    text: "Parent",
    selected: false,
  },
  {
    text: "Tutor",
    selected: false,
  },
];

export default function SuperadminDashboard() {
  return (
    <div className={styles.container}>
      <div className='flex justify-between px-[80px] bg-[#26435F] h-[54px] items-center w-full'>
        <div><img src={icon} alt="" /></div>

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
      <div className=" mt-[60px] bg-#2E2E2E mx-[80px]">
        <p className="text-[#24A3D9]">Dashboard</p>
        <div className="flex mt-7">
          <section className="flex flex-col">
            <div>
              <p className={styles.subheading}> Organizations </p>
              <div className={`flex ${styles.orgCard}`}>
                {orgContents.map((item, idx) => {
                  return <OrgCard {...item} />;
                })}
              </div>
            </div>
            <div className="w-full">
              <p className='mt-[20px] mb-2.5 font-medium text-[#26435F]' >
                {" "}
                User Stats{" "}
              </p>
              <div className={styles.userStatsContainer}>
                <div className="flex">
                  {userTypes.map((item) => {
                    return (
                      <div
                        className={` bg-white border-b border-[#000000] ${styles.userStat
                          } ${item.selected ? styles.selected : ""} `}
                      >
                        {item.text}
                      </div>
                    );
                  })}
                </div>
                <div className="bg-[#F5F8FA]">
                  <div className={`flex w-full bg-white ${styles.customBorder}`}>
                    <div className="w-1/5 flex flex-col items-center pt-3 pb-2">
                      <p className={`${styles.statHead} text-xl font-semibold`}>
                        190
                      </p>
                      <p className="text-xs text-[#26435F]">Total</p>
                    </div>
                    <div className="w-1/5 flex flex-col items-center pt-3 pb-2">
                      <p className={`${styles.statHead} text-xl font-semibold`}>
                        190
                      </p>
                      <p className="text-xs text-[#26435F]">Active</p>
                    </div>
                    <div className="w-1/5 flex flex-col items-center pt-3 pb-2">
                      <p className={`${styles.statHead} text-xl font-semibold`}>
                        190
                      </p>
                      <p className="text-xs text-[#26435F]">New</p>
                    </div>
                    <div className="w-1/5 flex flex-col items-center pt-3 pb-2">
                      <p className={`${styles.statHead} text-xl font-semibold`}>
                        190
                      </p>
                      <p className="text-xs text-[#26435F] ">Avg. # of Tests</p>
                    </div>
                    <div className="w-1/5 flex flex-col items-center pt-3 pb-2">
                      <p className={`${styles.statHead} text-xl font-semibold`}>
                        190
                      </p>
                      <p className="text-xs text-[#26435F] text-center">
                        Avg. Session duration
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-center  justify-around pt-3 pb-2 text-[#26435F] bg-[#FFFFFF] mt-4 ${styles.customBorder}`}>
                    <div>
                      <p className="font-medium text-xl">202</p>
                      <p className="text-xs"># of Tests Assigned</p>
                    </div>
                    <div>
                      <p className="font-medium text-xl">202</p>
                      <p className="text-xs"># of Tests Created</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="flex-1 px-5 mx-6 ">
            <p className='text-[#26435F] font-medium text-sm'> Latest Org Signup </p>
            <Table data={orgData} tableHeaders={tableHeaders} maxPageSize={5} />
          </section>
        </div>
        <p className="text-[#26435F] font-medium mt-9">Daily active users</p>
        <Chart />
        <Index />
        <Chart />
      </div>
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
  );
}
