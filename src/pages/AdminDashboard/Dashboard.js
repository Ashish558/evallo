import React from "react";
import SAdminNavbar2 from "../../components/sAdminNavbar/sAdminNavbar2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowDown19,
  faArrowDown91,
  faArrowRightFromBracket,
  faCaretDown,
  faDollar,
} from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import icon from "../../assets/images/Evallo.png";
import styles from "./style.module.css";
import image from "../../assets/images/Vector.png";
import image1 from "../../assets/images/Vector (1).png";
import image2 from "../../assets/images/Vector (2).png";
import image3 from "../../assets/images/Vector (3).png";
import image4 from "../../assets/images/Vector (4).png";
import image5 from "../../assets/images/Vector (5).png";
import image6 from "../../assets/images/Vector (6).png";
import AdminNavbar from "./AdminNavbar";
import Table from "../SuperadminDashboard/Table/table";
import ActionLog from "./ActionLog";
import { useGetLatestSignUpQuery } from "../../app/services/adminDashboard";
const tableHeaders = [
  "Tutor Name",
  "Tutor Status",
  "Rating",
  "Referrals",
  "Hours Completed",
  "Hours Scheduled",
  "Hours Cancelled",
  "Hours Missed",
  "Avg SAT improvement",
];
const Dashboard = () => {
  const { data: latestSignUp } = useGetLatestSignUpQuery();
  // console.log(latestSignUp?.data);
  return (
    <div className={styles.container}>
      {/* <SAdminNavbar2></SAdminNavbar2> */}

      <div className=" mt-[28px] bg-#2E2E2E ">
        <div className="mt-[42px] flex justify-center">
          <div className="w-full mx-[80px]">
            <p className="text-[#24A3D9] mb-3">
              {"Company Name > Admin Full Name > Dashboard"}
            </p>

            <div className="flex justify-between items-center ">
              <p className="font-bold text-[#26435F]">BUSINESS OVERVIEW </p>

              <div className="flex text-xs ">
                <p className="font-semibold text-[#FFA28D]">
                  {" "}
                  1 May - May 12, 2023{" "}
                </p>
                <p>
                  <FontAwesomeIcon
                    className="pl-3"
                    icon={faCaretDown}
                  ></FontAwesomeIcon>
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="flex justify-center">
          <div className={styles.mainBox}>
            <div className="grid grid-cols-2 gap-2">
              <div className={`${styles.gridBorder} `}>
                <div className="flex  justify-evenly ">
                  <div className="w-[170px]">
                    <div className="flex justify-between items-center mb-1 text-[#26435F] text-sm">
                      <p className="   font-medium">Completed Revenue</p>
                      <p>
                        <FontAwesomeIcon
                          icon={faQuestionCircle}
                        ></FontAwesomeIcon>
                      </p>
                    </div>
                    <div
                      className={`h-[85px] flex justify-center rounded-md items-center text-2xl font-bold bg-[#22A69933] box-border ${styles.boxBorder1}`}
                    >
                      <p className="text-[#38C980]">$90,850</p>
                    </div>
                  </div>
                  <div className="w-[170px] ">
                    <div className="flex justify-between rounded-md items-center mb-1 text-[#26435F] text-sm">
                      <p className="font-medium">Leaked Revenue</p>
                      <p>
                        <FontAwesomeIcon
                          icon={faQuestionCircle}
                        ></FontAwesomeIcon>
                      </p>
                    </div>
                    <div
                      className={`h-[85px] flex rounded-md justify-center items-center text-2xl font-semibold bg-[#FF517533] box-border ${styles.boxBorder2}`}
                    >
                      <p className="text-[#FF7979]">$2560</p>
                    </div>
                  </div>
                  <div className="w-[170px]">
                    <div className="flex justify-between items-center mb-1 text-[#26435F] text-sm">
                      <p className="   font-medium">Impending Revenue</p>
                      <p>
                        <FontAwesomeIcon
                          icon={faQuestionCircle}
                        ></FontAwesomeIcon>
                      </p>
                    </div>
                    <div
                      className={`h-[85px] flex rounded-md justify-center items-center text-2xl font-semibold bg-[#7152EB33] box-border ${styles.boxBorder3}`}
                    >
                      <p className="text-[#7152EB]">$9870</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${styles.gridBorder2}`}>
                <div className="flex  justify-evenly">
                  <div className="w-[170px] ">
                    <div className="mb-1">
                      <p className="text-sm font-medium text-[#26435F80]">
                        Unpaid Invoices
                      </p>
                    </div>
                    <div
                      className={`h-[85px] flex justify-center items-center text-sm text-[#667085] bg-[#F5F8FA]`}
                    >
                      <p>Coming soon</p>
                    </div>
                  </div>
                  <div className="w-[170px] ">
                    <div className=" mb-1">
                      <p className="text-sm font-medium text-[#26435F80]">
                        Paid Invoices
                      </p>
                    </div>
                    <div
                      className={`h-[85px] flex justify-center items-center text-sm text-[#667085] bg-[#F5F8FA]`}
                    >
                      <p>Coming soon</p>
                    </div>
                  </div>
                  <div className="w-[170px]">
                    <div className="mb-1">
                      <p className="text-sm font-medium text-[#26435F80]">
                        Cancelled Invoices
                      </p>
                    </div>
                    <div
                      className={`h-[85px] flex justify-center items-center text-sm text-[#667085] bg-[#F5F8FA]`}
                    >
                      <p>Coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex justify-center">
            <div className="mt-[30px] w-screen mx-[120px]">
              <div className="mt-2 h-[1px] bg-[#00000033]"></div>
            </div>
          </div>
          <div className="w-[screen] mx-[80px] mt-[42px] text-[#26435F]">
            <div className="flex justify-between items-center ">
              <p className="font-bold">USER OVERVIEW </p>

              <div className="flex font-semibold text-[#FFA28D] text-xs">
                <p> 1 May - May 12, 2023 </p>
                <p>
                  <FontAwesomeIcon
                    className="pl-3"
                    icon={faCaretDown}
                  ></FontAwesomeIcon>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7 mt-[30px] mx-[80px] gap-x-5">
            <div className="col-span-2">
              <p className=" mb-1 font-semibold text-[#26435F]">User Stats</p>
              <div className={styles.sidebox}>
                <div className="pl-[19px]  pt-5 rounded ">
                  <p className="text-[#26435F]">Active / Total Students</p>
                  <p className="text-xl">
                    <span className="font-bold text-[#FFA28D] text-3xl">
                      59
                    </span>{" "}
                    / <span className="text-[#24A3D9]">267</span>
                  </p>
                </div>
                <div className={`  pl-[19px] pt-7 rounded `}>
                  <p className="text-[#26435F]">Active / Total Students</p>
                  <p className="text-xl">
                    <span className="font-bold text-[#FFA28D] text-3xl">
                      59
                    </span>{" "}
                    / <span className="text-[#24A3D9]">267</span>
                  </p>
                </div>
                <div className={`  pl-[19px] pt-7 rounded pb-6`}>
                  <p className="text-[#26435F]">Active / Total Students</p>
                  <p className="text-xl">
                    <span className="font-bold text-[#FFA28D] text-3xl">
                      59
                    </span>{" "}
                    / <span className="text-[#24A3D9]">267</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="col-span-5">
              <p className="mb-1 font-semibold text-[#26435F]">ACTION LOG</p>
              <ActionLog />
            </div>
          </div>
        </section>

        <section className="mt-[30px] mx-[80px]">
          <p className="font-semibold text-[#26435F] ">Latest Sign-ups</p>

          <div className="">
            <Table
              data={latestSignUp?.data ? latestSignUp?.data : []}
              AdminLatestSignUp={true}
              Icon={
                <FontAwesomeIcon
                  className="pl-1 w-[10px]"
                  icon={faArrowDown}
                ></FontAwesomeIcon>
              }
              tableHeaders={[
                "FullName",
                "User Type",
                "Email",
                "Phone",
                "Assigned Tutor",
                "Lead Status",
                "Tutor Status",
                "Services",
                "Date Added",
              ]}
              maxPageSize={5}
            />
          </div>
        </section>
        <div className="flex justify-center">
          <div className="mt-[30px] w-screen mx-[120px]">
            <div className="mt-2 h-[1px] bg-[#00000033]"></div>
          </div>
        </div>
        <div className="w-[screen] mx-[80px] mt-[42px] text-[#26435F]">
          <div className="flex justify-between items-center ">
            <p className="font-bold uppercase">Client Success Overview </p>

            <div className="flex font-semibold text-[#FFA28D] text-xs">
              <p> 1 May - May 12, 2023 </p>
              <p>
                <FontAwesomeIcon
                  className="pl-3"
                  icon={faCaretDown}
                ></FontAwesomeIcon>
              </p>
            </div>
          </div>
        </div>

        <section className="mt-[10px] mx-[80px]">
          <div className="grid grid-cols-4 gap-7">
            <div className="col-span-3">
              <p className="font-semibold text-[#26435F] text-[14px]">
                Popular services
              </p>
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th>
                      Service{" "}
                      <FontAwesomeIcon
                        className="pl-1 w-[10px]"
                        icon={faArrowDown}
                      ></FontAwesomeIcon>
                    </th>
                    <th>
                      Actively Using{" "}
                      <FontAwesomeIcon
                        className="pl-1 w-[10px]"
                        icon={faArrowDown}
                      ></FontAwesomeIcon>
                    </th>
                    <th>
                      Total Users{" "}
                      <FontAwesomeIcon
                        className="pl-1 w-[10px]"
                        icon={faArrowDown}
                      ></FontAwesomeIcon>
                    </th>
                    <th>
                      Scheduled Hours
                      <FontAwesomeIcon
                        className="pl-1 w-[10px]"
                        icon={faArrowDown}
                      ></FontAwesomeIcon>
                    </th>
                    <th>
                      Completed Hours{" "}
                      <FontAwesomeIcon
                        className="pl-1 w-[10px]"
                        icon={faArrowDown}
                      ></FontAwesomeIcon>
                    </th>
                    <th>
                      % of Business{" "}
                      <FontAwesomeIcon
                        className="pl-1 w-[10px]"
                        icon={faArrowDown}
                      ></FontAwesomeIcon>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                  </tr>
                  <tr>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                  </tr>
                  <tr>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                  </tr>
                  <tr>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                  </tr>
                  <tr>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                  </tr>
                  <tr>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                    <td className="">Lorem</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <p className="mt-1 mb-[10px] font-semibold text-[#26435F] text-[14px] ">
                Star Clients
              </p>
              <div>
                <table className={` w-full ${styles.sTable} `}>
                  <thead>
                    <tr>
                      <th>Client Name </th>
                      <th>Code </th>
                      <th>Referrals </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="h-[45px]">
                      <td className="">Lorem</td>
                      <td className="">$XDR$#</td>
                      <td className="">45</td>
                    </tr>
                    <tr className="h-[45px]">
                      <td className="">Lorem</td>
                      <td className="">$XDR$#</td>
                      <td className="">45</td>
                    </tr>
                    <tr className="h-[45px]">
                      <td className="">Lorem</td>
                      <td className="">$XDR$#</td>
                      <td className="">45</td>
                    </tr>
                    <tr className="h-[45px]">
                      <td className="">Lorem</td>
                      <td className="">$XDR$#</td>
                      <td className="">45</td>
                    </tr>
                    <tr className="h-[45px]">
                      <td className="">Lorem</td>
                      <td className="">$XDR$#</td>
                      <td className="">45</td>
                    </tr>
                    <tr className="h-[45px]">
                      <td className="">Lorem</td>
                      <td className="">$XDR$#</td>
                      <td className="">45</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-[30px] mx-[80px]">
          <div className="grid grid-cols-2 gap-x-80">
            <div className="flex justify-between gap-3 mt-2 text-sm text-[#26435F]">
              <div>
                <p className="font-semibold text-sm">Total # Of referrals</p>
                <div
                  className={`w-[150px] mt-2  h-[67px] bg-[rgba(255,162,141,0.2)] ${styles.smallBox}`}
                >
                  <p className="text-[#FFA28D] h-full w-full justify-center font-semibold text-3xl flex items-center text-center">
                    76
                  </p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-sm">Average SAT improvement</p>
                <div
                  className={`w-[190px] mt-2 h-[67px] bg-[rgba(36,163,217,0.2)]  ${styles.smallBox}`}
                >
                  <p className="text-[#24A3D9] h-full w-full justify-center font-semibold text-3xl flex items-center text-center">
                    677
                  </p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-sm">Average ACT improvement</p>
                <div
                  className={`w-[190px] mt-2 h-[67px] bg-[rgba(36,163,217,0.2)]  ${styles.smallBox}`}
                >
                  <p className="text-[#24A3D9] h-full w-full justify-center font-semibold text-3xl flex items-center text-center">
                    677
                  </p>
                </div>
              </div>
            </div>
            <div className="flex mt-4  text-xs justify-between text-[#667085]">
              <div>
                <p>Average GRE improvement</p>
                <div
                  className={`w-[150px] h-[67px] ${styles.smallBox2} flex items-center justify-center font-medium`}
                >
                  <p>Coming Soon</p>
                </div>
              </div>
              <div>
                <p>Average GMAT improvement</p>
                <div
                  className={`w-[150px] h-[67px] ${styles.smallBox2} flex items-center justify-center font-medium`}
                >
                  <p>Coming Soon</p>
                </div>
              </div>
              <div>
                <p>Average IELTS improvement</p>
                <div
                  className={`w-[150px] h-[67px] ${styles.smallBox2} flex items-center justify-center font-medium`}
                >
                  <p>Coming Soon</p>
                </div>
              </div>
            </div>
            <div></div>
          </div>
        </section>
        <div className="flex justify-center">
          <div className="mt-[41px] w-screen mx-[120px]">
            <div className="mt-2 h-[1px] bg-[#00000033]"></div>
          </div>
        </div>
        <div className="w-[screen] mx-[80px] mt-[42px] text-[#26435F]">
          <div className="flex justify-between items-center ">
            <p className="font-bold uppercase">Tutor Performence Overview </p>

            <div className="flex font-semibold text-[#FFA28D] text-xs">
              <p> 1 May - May 12, 2023 </p>
              <p>
                <FontAwesomeIcon
                  className="pl-3"
                  icon={faCaretDown}
                ></FontAwesomeIcon>
              </p>
            </div>
          </div>
        </div>
        <section>
          <div className="mx-[80px] w-[90vw] scroll-m-3 overflow-x-auto">
            <Table
              data={[]}
              Icon={
                <FontAwesomeIcon
                  className="pl-1 w-[10px]"
                  icon={faArrowDown}
                ></FontAwesomeIcon>
              }
              tableHeaders={tableHeaders}
              maxPageSize={5}
            />
          </div>
          <div className="flex justify-center">
            <div className="mt-[36px] mb-[44px] bg-[#CBD6E2] h-[1px] w-[100px]"></div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
