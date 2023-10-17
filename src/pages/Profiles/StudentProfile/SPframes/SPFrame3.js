import React from "react";
import Chart from "./ChartStudent";
import Chart2 from "../../../../components/Chart/Chart";
import LineChart from "./LineChart"
import styles from "../style.module.css";
import { useState } from "react";
import { useChartBubbleStudentMutation, useScoreProgressionStudentMutation } from "../../../../app/services/users";
import { useEffect } from "react";
import RangeDate from "../../../../components/RangeDate/RangeDate";
import InputSelectNew from "../../../../components/InputSelectNew/InputSelectNew";
import { useParams } from "react-router-dom";
const SPFrame3 = ({ userDetail, isOwn, user }) => {
  const [getProgression, Progstatus] = useScoreProgressionStudentMutation();
  const [getBubbleChart, bubbleChartStatus] = useChartBubbleStudentMutation()
  const [TimeChartData, setTimeChartData] = useState()
  const [ConceptualChartData, setConceptualChartData] = useState()
  const [scoreProgression, setScore] = useState([]);
  const [spSubject, setspSubject] = useState([]);
  const [selectedspSubject, setSelectedspSubject] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedConceptIdx, setSelectedConceptIdx] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [currentspSubData, setCurrentspSubData] = useState({})
  const [currentSubData, setCurrentSubData] = useState({});
  const [accsubjects, setAccSubject] = useState([])
  const param = useParams()
  const [id, setId] = useState(param?.id)

  useEffect(() => {
    if (!param.id) {
      setId(userDetail?._id)
    }
    else {
      setId(param?.id)
    }
  }, [userDetail])
  const [officialTest, setOfficial] = useState("SAT")
  useEffect(() => {
    if (id) {
      // //console.log({id,hud:userDetail?._id})
      // 
      let idd = "";
      if (isOwn) {
        idd = userDetail?._id;
      } else {
        idd = param.id;
      }
      // console.log({idd,hid:userDetail?._id,iff:user?._id})
      getProgression({ studentId: user?._id, startDate: new Date(2023, 1, 1), endDate: new Date(), role: "student", testType: officialTest }).then(
        (res) => {
          console.log("progression res", res);
          if (res?.data?.scoreProgression) setScore(res?.data?.scoreProgression);
        }
      );
      getBubbleChart({ studentId: user?._id, startDate: new Date(2023, 1, 1), endDate: new Date(), role: "student", chartType: "timeManagement" }).then(
        (res) => {
          console.log("time res", res);
          if (res?.data?.chartData) setTimeChartData(res?.data?.chartData);
        }
      );

    }
  }, [userDetail, id, officialTest, user]);

  useEffect(() => {
    if (spSubject[0]?.name) {
      //setspSubject(spSubject[0]?.name);
      setSelectedspSubject(spSubject[0]?.name)
    }
  }, [spSubject]);
  useEffect(() => {
    if (accsubjects[0]?.name) {
      //setaccsubjects(accsubjects[0]?.name);
      setSelectedSubject(accsubjects[0]?.name)
    }
  }, [accsubjects]);
  const convertDateToRange = (startDate) => {
    let startD = startDate.split("-")[0];

    startD = new Date(startD);
    startD = startD.setDate(startD.getDate() + 1);
    startD = new Date(startD).toISOString().split("T")[0];

    let endD = startDate.split("-")[1];
    endD = new Date(endD);
    endD = endD.setDate(endD.getDate() + 1);
    endD = new Date(endD).toISOString().split("T")[0];
    const body = { startDate: startD, endDate: endD };

    return body;
  };
  const handleConceptAccuracy = (startDate) => {
    let body = convertDateToRange(startDate);
    body.studentId = user?._id;
    console.log({ startDate })
    body.chartType = "conceptAccuracy"
    getBubbleChart(body).then(
      (res) => {
        console.log("conceptual res", res);
        if (res?.data?.chartData) {
          let temp = []
          res?.data?.chartData?.map((it) => {
            temp.push({
              concepts: {
                [it?.conceptName]: it?.total,
              },
              timeTaken: it?.accuracy * 100,
              no_of_correct: it?.noOfCorrect
              , name: it?.conceptName

            })
          })
          setAccSubject(temp)
          setConceptualChartData(temp)
        }// setConceptualChartData(res?.data?.chartData);
      }
    );
  }
  const handleTimeManagement = (startDate) => {
    let body = convertDateToRange(startDate);
    body.studentId = user?._id;
    body.chartType = "timeManagement";
    getBubbleChart(body).then(
      (res) => {
        console.log("time res", res);
        if (res?.data?.chartData) {
          let temp = []
          res?.data?.chartData?.map((it) => {
            temp.push({
              concepts: {
                [it?.conceptName]: it?.total,
              },
              timeTaken:it?.avgTimeTaken*60,
              no_of_correct:it?.noOfCorrect
              ,name:it?.conceptName

            })
          })
          setspSubject(temp)
          setTimeChartData(temp)
        }
        // setTimeChartData(res?.data?.chartData);
      }
    );
  }
  useEffect(() => {
    spSubject.map((sub) => {
      if (sub.selected === true) {
        setSelectedspSubject(sub.name);
      }
    });
  }, [spSubject]);
  useEffect(() => {
    accsubjects.map((sub) => {
      if (sub.selected === true) {
        setSelectedSubject(sub.name);
      }
    });
  }, [accsubjects]);
  const handlespSubjectChange = (name) => {
    let updated = spSubject.map((sub) => {
      if (sub.name === name) {
        return { ...sub, selected: true };
      } else {
        return { ...sub, selected: false };
      }
    });

    setspSubject(updated);
  };
  useEffect(() => {
    subjects.map((sub) => {
      if (sub.selected === true) {
        setSelectedSubject(sub.name);
      }
    });
  }, [subjects]);
  const handleSubjectChange = (name) => {
    let updated = accsubjects.map((sub) => {
      if (sub.name === name) {
        return { ...sub, selected: true };
      } else {
        return { ...sub, selected: false };
      }
    });
    setSubjects(updated);
  };
 console.log("sprame3",{accsubjects,selectedspSubject,spSubject,subjects,scoreProgression,TimeChartData,ConceptualChartData});
  return (
    <div className="flex flex-col gap-5 -mt-5 design:gap-10">
      {" "}
      <h1 className="text-[#26435F] translate-y-4  text-sm font-semibold cursor-pointer text-base-20">
        Score progression
        <span className="inline-block my-auto ml-2 translate-y-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
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
      <div
        id={styles.chartContainer}
        className="!rounded-md bg-white shadow-[0px_0px_2.500001907348633px_0px_#00000040] custom-scroller py-5 pl-5"
      >
         <div className="flex-1 relative z-[6000] flex justify-end translate-y-4 mr-3">
            <InputSelectNew
              placeholder={""}
              parentClassName="ml-0  scale-[0.9] items-center flex text-[#FFA28D] text-xs border px-1 py-2 border-[#FFA28D] rounded-full  "
              inputContainerClassName=" my-0 py-[5px] px-[40px]"
              placeHolderClass="text-[#FFA28D] "
              labelClassname="text-sm"
              inputClassName="bg-transparent"
              value={officialTest}
              IconDemography={true}
              optionData={["SAT","ACT"]}
              onChange={(e) => setOfficial(e)}
            />
            {/* <InputSelect
              value={selectedSubject}
              labelClassname="hidden"
              parentClassName="w-fit mr-5"
              inputContainerClassName="bg-[#d9d9d980] pt-2 pb-2"
              optionData={subjects.map((item) => item.name)}
              onChange={(val) => handleSubjectChange(val)}
            /> */}


        </div>
        <LineChart
          scoreProgression={scoreProgression}

        />
      </div>
      <div className=" flex-1 w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-[#26435F]  text-sm font-semibold mb-1 text-base-20">
            Time Management
            <span className="inline-block my-auto ml-2 translate-y-1 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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
        </div>
        <div
          id={styles.chartContainer}
          className="!rounded-md w-full bg-white flex-1 shadow-[0px_0px_2.500001907348633px_0px_#00000040] custom-scroller pb-5 pl-4"
        >
          <div className="flex-1 relative z-[6000] flex justify-end translate-y-4 mr-3">
            <InputSelectNew
              placeholder={""}
              parentClassName="ml-0  scale-[0.9] items-center flex text-[#FFA28D] text-xs border px-1 py-2 border-[#FFA28D] rounded-full  "
              inputContainerClassName=" my-0 py-[5px] px-[35px]"
              placeHolderClass="text-[#FFA28D] "
              labelClassname="text-sm"
              inputClassName="bg-transparent"
              value={selectedspSubject}
              IconDemography={true}
              optionData={spSubject.map((item) => item.name)}
              onChange={(e) => handlespSubjectChange(e)}
            />
            {/* <InputSelect
              value={selectedSubject}
              labelClassname="hidden"
              parentClassName="w-fit mr-5"
              inputContainerClassName="bg-[#d9d9d980] pt-2 pb-2"
              optionData={subjects.map((item) => item.name)}
              onChange={(val) => handleSubjectChange(val)}
            /> */}

            <RangeDate
              removeUnderline={true}
              className="ml-0 !font-normal"
              manualHide={true}
              optionClassName="!w-min"
              inputContainerClassName="!w-min font-normal"
              handleRangeData={handleTimeManagement}
            />
          </div>
          <Chart
            setSubjects={setspSubject}
            subjects={spSubject}
            selectedSubject={selectedspSubject}
            selectedConceptIdx={selectedConceptIdx}
            setSelectedConceptIdx={setSelectedConceptIdx}
            currentSubData={currentspSubData}
            setCurrentSubData={setCurrentspSubData}
          />
        </div>
      </div>
      <div className=" flex-1 w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-[#26435F]  text-sm font-semibold mb-1 text-base-20">
            Conceptual Accuracy
            <span className="inline-block my-auto ml-2 translate-y-1 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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
        </div>
        <div
          id={styles.chartContainer}
          className="!rounded-md w-full bg-white flex-1 shadow-[0px_0px_2.500001907348633px_0px_#00000040] custom-scroller pb-5 pl-4"
        >
          <div className="flex-1 relative z-[6000] flex justify-end translate-y-4 mr-3">
            <InputSelectNew
              placeholder={""}
              parentClassName="ml-0  scale-[0.9] items-center flex text-[#FFA28D] text-xs border px-1 py-2 border-[#FFA28D] rounded-full  "
              inputContainerClassName=" my-0 py-[5px] px-[35px]"
              placeHolderClass="text-[#FFA28D] "
              labelClassname="text-sm"
              inputClassName="bg-transparent"
              value={selectedSubject}
              IconDemography={true}
              optionData={accsubjects.map((item) => item.name)}
              onChange={(e) => handleSubjectChange(e)}
            />
            {/* <InputSelect
              value={selectedSubject}
              labelClassname="hidden"
              parentClassName="w-fit mr-5"
              inputContainerClassName="bg-[#d9d9d980] pt-2 pb-2"
              optionData={subjects.map((item) => item.name)}
              onChange={(val) => handleSubjectChange(val)}
            /> */}
            <RangeDate
              removeUnderline={true}
              className="ml-0 !font-normal"
              manualHide={true}

              optionClassName="!w-min"
              inputContainerClassName="!w-min font-normal"
              handleRangeData={handleConceptAccuracy}
            />

          </div>
          <Chart
            accuracy={true}
            setSubjects={setSubjects}
            subjects={accsubjects}
            selectedSubject={selectedSubject}
            selectedConceptIdx={selectedConceptIdx}
            setSelectedConceptIdx={setSelectedConceptIdx}
            currentSubData={currentSubData}
            setCurrentSubData={setCurrentSubData}
          />
        </div>
      </div>
    </div>
  );
};

export default SPFrame3;
