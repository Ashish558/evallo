import React, { useEffect, useState } from "react";
import styles from "./StudentDashboard.module.css";
import ChartStudent from "./../../components/Chart/ChartStudent";
import arrowDown from "./../../assets/icons/arrow-down.png";
import StudentDashboardHeader from "../../components/StudentDashboardHeader/StudentDashboardHeader";
import TutorCarousel from "../../components/TutorCarousel/TutorCarousel";
import CompleteProfile from "../../components/CompleteProfile/CompleteProfile";
import SessionFeedback from "../../components/SessionFeedback/SessionFeedback";
import InputSelect from "../../components/InputSelect/InputSelect";
import { getMonthName } from "../../utils/utils";
import { useSelector } from "react-redux";
import RangeDate from "../../components/RangeDate/RangeDate";
import InputSelectNew from "../../components/InputSelectNew/InputSelectNew";
import questionMark from "../../assets/images/Vector (6).svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
const StudentDashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [slot, setSlot] = useState("Jun 20, 2022 - Jul 30, 2022 ");
  const [showSub, setShowSub] = useState(false);
  const [showSlot, setShowSlot] = useState(false);
  const [selectedConceptIdx, setSelectedConceptIdx] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [currentSubData, setCurrentSubData] = useState({});
  const [dates, setDates] = useState([]);
  const { organization } = useSelector((state) => state.organization);
  const user = useSelector((state) => state.user);
  const [currentDate, setCurrentDate] = useState("");
  useEffect(() => {
    // console.log('currentSubData', currentSubData)
    if (currentSubData.concepts === undefined) return;
    //console.log("currentConcept", currentSubData);

    let currentConcept = currentSubData.concepts[selectedConceptIdx];
    if (currentConcept === undefined) return;
    let month = parseInt(currentConcept.month);
    let year = parseInt(currentConcept.year);

    let monthName = getMonthName(month);
    let nextMonthName = getMonthName(month + 1);
    const currdate = `${1}st ${monthName} ${year} - ${1}st ${nextMonthName} ${year}`;
    setCurrentDate(currdate);
  }, [currentSubData, selectedConceptIdx]);

  useEffect(() => {
    let concepts = currentSubData.concepts;
    if (concepts === undefined) return;
    const listData = concepts.map((concept) => {
      let month = parseInt(concept.month);
      let year = parseInt(concept.year);
      let monthName = getMonthName(month);
      let nextMonthName = getMonthName(month + 1);
      if (!month && !year) {
        return "prev";
      } else {
        return `${1}st ${monthName} ${year} - ${1}st ${nextMonthName} ${year}`;
      }
    });
    setDates(listData);
  }, [currentSubData]);

  useEffect(() => {
    subjects.map((sub) => {
      if (sub.selected === true) {
        setSelectedSubject(sub.name);
      }
    });
  }, [subjects]);

  const handleSubjectChange = (name) => {
    let updated = subjects.map((sub) => {
      if (sub.name === name) {
        return { ...sub, selected: true };
      } else {
        return { ...sub, selected: false };
      }
    });
    setSubjects(updated);
  };
  // console.log('dates', dates)
  // console.log('selectedSubject', selectedSubject)
  //console.log({subjects,selectedSubject,selectedConceptIdx})
  return (
    <div className={`w-[83.3vw] mx-auto pb-[70px]`} >
      <p className="text-[#24A3D9] mt-[50px]  text-xl">
        {organization?.company +
          " > " +
          user?.firstName +
          " " +
          user?.lastName +
          " > "}
        <span className="font-semibold">Dashboard</span>
      </p>

      <StudentDashboardHeader />

      <div className="flex mt-10 pt-[10px] justify-between">
        <div className=" flex-1 w-[70%]">
          <div className="flex items-center justify-between mb-1 w-[54.43vw]">
            <h1 className="text-[#26435F]  text-xl font-semibold ">
              Concept Chart
              <span className="inline-block my-auto ml-2 translate-y-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  viewBox="0 0 19 19"
                  fill="none"
                >
                  <path
                    d="M18.2844 9.64347C18.2844 14.5545 14.3032 18.536 9.39219 18.536C4.48115 18.536 0.5 14.5551 0.5 9.64347C0.5 4.73213 4.48086 0.750977 9.39219 0.750977C14.3032 0.750977 18.2844 4.73243 18.2844 9.64347ZM9.39219 2.73877C5.57862 2.73877 2.48721 5.83018 2.48721 9.64376C2.48721 13.457 5.57832 16.549 9.39219 16.549C13.2058 16.549 16.2972 13.457 16.2972 9.64376C16.2975 5.83047 13.2058 2.73877 9.39219 2.73877ZM7.57198 7.57716C7.57198 6.17442 8.47168 5.68194 9.3708 5.68194C9.90606 5.68194 10.3643 5.73145 10.7305 6.18497C11.5871 7.24522 10.6312 8.27413 9.5419 8.81876C8.7711 9.20431 8.40694 9.85763 8.40694 10.7673V12.8023H10.441V11.6028C10.441 9.77179 11.6188 10.232 12.4754 9.08683C13.6338 7.53761 13.3833 5.79122 11.8112 4.54698C10.013 3.12285 7.97803 3.8295 7.41084 4.21504C6.93946 4.53526 5.26953 5.72471 5.59063 8.2835L7.56729 8.28761C7.56729 8.28761 7.57139 8.04825 7.57139 7.57716H7.57198ZM10.4416 15.5861V13.4984H8.40752V15.5861H10.4416Z"
                    fill="#26435F"
                  />
                </svg>
              </span>
            </h1>

            <div className="flex  justify-end">
              {/* <InputSelect
                value={currentDate}
                labelClassname="hidden"
                parentClassName="w-[200px] mr-5"
                inputContainerClassName="bg-[#d9d9d980] pt-2 pb-2"
                optionData={dates}
                onChange={(val, idx) => setSelectedConceptIdx(idx)}
              /> */}
              <InputSelectNew
                placeholder={""}
                parentClassName="ml-0  scale-[0.9] items-center flex text-[#FFA28D] text-xs border px-1 py-2 border-[#FFA28D] rounded-full  "
                inputContainerClassName=" my-0 py-[5px] px-[35px]"
                placeHolderClass="text-[#FFA28D] "
                labelClassname="text-sm"
                inputClassName="bg-transparent"
                value={selectedSubject}
                IconDemography={true}
                optionData={subjects.map((item) => item.name)}

                onChange={(e) => handleSubjectChange(e)}
              />
              {/* <InputSelect
                value={selectedSubject}
                labelClassname="hidden"
                parentClassName="w-[200px] mr-5"
                inputContainerClassName="bg-[#d9d9d980] pt-2 pb-2"
                optionData={subjects.map((item) => item.name)}
                onChange={(val) => handleSubjectChange(val)}
              /> */}


              <RangeDate className="ml-0  font-normal" manualHide={true} optionClassName="!w-min " inputContainerClassName="!w-min font-normal " handleRangeData={setSelectedConceptIdx} />

            </div>
          </div>
          <div
            id={styles.chartContainer}
            className="!rounded-md  bg-white w-[54.43vw] flex-1 shadow-[0px_0px_2.500001907348633px_0px_#00000040] custom-scroller "
          >
            <ChartStudent
              setSubjects={setSubjects}
              subjects={subjects}
              YHeader="Score"
              selectedSubject={selectedSubject}
              selectedConceptIdx={selectedConceptIdx}
              setSelectedConceptIdx={setSelectedConceptIdx}
              currentSubData={currentSubData}
              setCurrentSubData={setCurrentSubData}
            />
          </div>
        </div>

        <div className="w-[25vw]  h-fit">
          <SessionFeedback />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
