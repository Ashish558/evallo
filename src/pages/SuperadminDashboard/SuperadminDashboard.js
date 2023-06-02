import React from "react";
import SAdminNavbar from "../../components/sAdminNavbar/sAdminNavbar";
import styles from "./styles.module.css";
import OrgCard from "./orgCard/orgCard";
import Table from "./Table/table";
import { orgData, tableHeaders } from "./temp";
import Chart from "./DataChart/Chart";

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
    <div className="">
      <SAdminNavbar />
      <div className="ml-[140px] mt-[60px] bg-#2E2E2E">
        <div className="flex">
          <section className="flex flex-col">
            <div>
              <p className={styles.subheading}> Organizations </p>
              <div className="flex">
                {orgContents.map((item, idx) => {
                  return <OrgCard {...item} />;
                })}
              </div>
            </div>
            <div className="w-full">
              <p className={`${styles.subheading} mt-[20px] mb-2.5`}>
                {" "}
                User Stats{" "}
              </p>
              <div className={styles.userStatsContainer}>
                <div className="flex">
                  {userTypes.map((item) => {
                    return (
                      <div
                        className={` bg-white border-b border-blue-500 ${styles.userStat} ${
                          item.selected ? styles.selected : ""
                        } `}
                      >
                        {item.text}
                      </div>
                    );
                  })}
                </div>
                <div>
                  <div className="flex w-full bg-white">
                    <div className="w-1/5 flex flex-col items-center py-5">
                      <p className={`${styles.statHead} text-lg font-bold`}>
                        190
                      </p>
                      <p className="text-xs text-blue-700">Total</p>
                    </div>
                    <div className="w-1/5 flex flex-col items-center py-5">
                      <p className={`${styles.statHead} text-lg font-bold`}>
                        190
                      </p>
                      <p className="text-xs text-blue-700">Active</p>
                    </div>
                    <div className="w-1/5 flex flex-col items-center py-5">
                      <p className={`${styles.statHead} text-lg font-bold`}>
                        190
                      </p>
                      <p className="text-xs text-blue-700">New</p>
                    </div>
                    <div className="w-1/5 flex flex-col items-center py-5">
                      <p className={`${styles.statHead} text-lg font-bold`}>
                        190
                      </p>
                      <p className="text-xs text-blue-700">Avg. # of Tests</p>
                    </div>
                    <div className="w-1/5 flex flex-col items-center py-5">
                      <p className={`${styles.statHead} text-lg font-bold`}>
                        190
                      </p>
                      <p className="text-xs text-blue-700">Avg. Session duration</p>
                    </div>
                  </div>

                  <div className="w-2/5"></div>
                </div>
              </div>
            </div>
          </section>
          <section className="flex-1 px-5 bg-[#ffffff] mx-6 py-4">
            <p className={styles.subheading}> Latest org signup </p>
            <Table data={orgData} tableHeaders={tableHeaders} maxPageSize={5} />
          </section>
        </div>
      <Chart/>
      </div>
    </div>
  );
}
