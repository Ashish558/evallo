import React, { useEffect, useRef, useState } from "react";
import styles from "./ConceptSection.module.css";
import arrowDown from "../../assets/icons/arrow-down.png";
import Chart from "../Chart/Chart";
import downloadImage from "../../assets/icons/download.png";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import shivam from "../../assets/images/tutors/shivam-shrivastab.png";
import {
  useLazyGetParentTutorsQuery,
  useLazyGetTutorDetailsQuery,
  useLazyGetUserDetailQuery,
} from "../../app/services/users";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import InputSelect from "../InputSelect/InputSelect";
import { useLazyGetParentsAssignedTestsQuery } from "../../app/services/test";
import {
  getDate,
  getDuration,
  getFormattedDate,
  getMonthName,
} from "../../utils/utils";
import ParentTest from "./ParentTest/ParentTest";
import InputSelectNew from "../InputSelectNew/InputSelectNew";
import RangeDate from "../RangeDate/RangeDate";

const initData = [
  {
    firstName: "Shivam",
    lastName: "Shrivastava",
  },
];
const ConceptSection = ({ selectedStudent, setSelectedStudent }) => {
  const [tutors, setTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);

  const tutorCarouselRef = useRef();
  const { id } = useSelector((state) => state.user);
  const [sub, setSub] = useState("Math");
  const [profileProgress, setProfileProgress] = useState("0%");

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");

  const [allTests, setAllTests] = useState([]);

  const [fetchTutors, fetchTutorsResp] = useLazyGetParentTutorsQuery();
  const navigate = useNavigate();
  const [fetchAssignedTests, fetchAssignedTestsResp] =
    useLazyGetParentsAssignedTestsQuery();
  const [filteredAssignedTests, setFilteredAssignedTests] = useState([]);
  const [getTutorDetail, getTutorDetailResp] = useLazyGetTutorDetailsQuery();
  const [totalTutors, setTotalTutors] = useState(0);

  const [selectedConceptIdx, setSelectedConceptIdx] = useState(0);
  const [currentSubData, setCurrentSubData] = useState({});
  const [dates, setDates] = useState([]);
  const [currentDate, setCurrentDate] = useState("");

  const { awsLink } = useSelector((state) => state.user);

  useEffect(() => {
    // console.log('currentSubData', currentSubData)
    if (currentSubData.concepts === undefined) return;
    console.log("currentConcept", currentSubData.concepts);

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
      return `${1}st ${monthName} ${year} - ${1}st ${nextMonthName} ${year}`;
    });
    setDates(listData);
  }, [currentSubData]);

  useEffect(() => {
    fetchAssignedTests(id).then((res) => {
      if (res.error) return console.log("assigned test parent resp", res.error);
      // console.log('assigned test parent resp', res.data);
      let tempAllTests = res.data.data.test.map((test) => {
        const {
          testId,
          studentId,
          isCompleted,
          multiple,
          isStarted,
          dueDate,
          createdAt,
          updatedAt,
        } = test;
        if (testId === null) return;
        return {
          testName: testId ? testId.testName : "-",
          assignedOn: getFormattedDate(new Date(createdAt)),
          studentId: studentId ? studentId : "-",
          dueDate: getFormattedDate(new Date(test.dueDate)),
          duration: multiple ? getDuration(multiple) : "-",
          status:
            isCompleted === true
              ? "completed"
              : isStarted
              ? "started"
              : "notStarted",
          scores: "-",
          _id: test._id,
          pdfLink: testId ? testId.pdf : null,
          testId: testId ? testId._id : "-",
          isCompleted: test.isCompleted,
          isStarted: test.isStarted,
          assignedTestId: test._id,
          updatedAt,
        };
      });
      let sortedArr = tempAllTests.sort(function (a, b) {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
      setAllTests(sortedArr.filter((item) => item !== undefined));
    });
  }, []);

  useEffect(() => {
    setTutors([]);
    fetchTutors({ id }).then((res) => {
      console.log("tutors resp", res.data);
      setTotalTutors(res.data.tutors.length);
      let temp = [];
      res.data.tutors.map((tutor2, idx) => {
        getTutorDetail({ id: tutor2._id }).then((response) => {
          // console.log('tutors response', response.data);
          let details = response.data.data.details;
          if (details === null || details === undefined) {
            details = {};
          }
          temp = [...temp, { ...tutor2, ...details, _id: tutor2._id }];
          if (idx === res.data.tutors.length - 1) {
            // setTutors((prev) => [
            //   ...prev,
            //   { ...tutor2, ...details, _id: tutor2._id },
            // ]);
            setTutors(temp);
          }
        });
      });
    });
  }, []);

  useEffect(() => {
    if (selectedStudent === null) return;
    if (allTests.length === 0) return;
    let filtered = allTests.filter(
      (item) => item.studentId._id === selectedStudent._id
    );
    // console.log('filtered', filtered);
    // console.log('selectedStudent', selectedStudent._id);
    setFilteredAssignedTests(filtered);
  }, [selectedStudent, allTests]);

  const buttons = document.getElementsByClassName("button");
  useEffect(() => {
    for (let i = 0; i < buttons.length; i++) {
      // console.log(buttons[i].innerText);
      buttons[i].innerText === "Not Started" &&
        buttons[i].classList.add("text-[#E02B1D]");
      buttons[i].innerText === "Started" &&
        buttons[i].classList.add("text-[#F6A429]");
      buttons[i].innerText === "1250 / 1250" &&
        buttons[i].classList.add("text-[#0671E0]");
    }
  }, [buttons, buttons.length]);
  const [getUserDetail, userDetailResp] = useLazyGetUserDetailQuery();

  const checkIfFilled = (value) => {
    let filled = false;
    if (value !== "" && value !== undefined && value !== null) {
      filled = true;
    }
    return filled;
  };
  useEffect(() => {
    getUserDetail({ id }).then((res) => {
      // console.log('details -- ', res.data.data.userdetails);
      let { industry, residentialAddress, timeZone, birthyear } =
        res.data.data.userdetails;
      let total = 4;
      let filled = 0;
      if (checkIfFilled(birthyear)) {
        filled += 1;
      }
      if (checkIfFilled(industry)) {
        filled += 1;
      }
      if (checkIfFilled(residentialAddress)) {
        filled += 1;
      }
      if (checkIfFilled(timeZone)) {
        filled += 1;
      }
      let percent = (filled * 100) / total;
      // console.log('filled', Math.round(percent));
      setProfileProgress(`${Math.round(percent)}%`);
    });
  }, [id]);

  useEffect(() => {
    if (selectedStudent === null) return;
    if (tutors.length === 0) return;
    // console.log('tutors', tutors);
    let filtered = tutors.filter((tutor) =>
      tutor.assiginedStudents?.includes(selectedStudent._id)
    );
    setFilteredTutors([]);
    setTimeout(() => {
      setFilteredTutors(filtered);
    }, 0);
    // tutorCarouselRef.current.trigger('refresh.owl.carousel');
  }, [selectedStudent, tutors]);

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

  //  console.log('tutors', tutors,filteredTutors);

  return (
    <div className="flex flex-row justify-between !gap-[calc(68*0.0522vw)] lg:py-[20px] py-[10px] mt-8 design:!mt-12">
      <div className=" flex-1 w-[70%] h-full">
        <div className="flex items-center justify-between">
          <h1 className="text-[#26435F]  text-base-20 font-semibold mb-1">
            Conceptual Accuracy
            <span className="inline-block my-auto ml-2 translate-y-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
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

          <div className="flex  justify-end absolute z-40 top-[51.5%] right-[38%]">
            <InputSelectNew
              placeholder={""}
              parentClassName="ml-0  scale-[0.8] items-center flex text-[#FFA28D] text-xs border px-1 py-2 border-[#FFA28D] rounded-full  "
              inputContainerClassName=" my-0 py-[5px] px-[35px]"
              placeHolderClass="text-[#FFA28D] "
              labelClassname="text-sm"
              inputClassName="bg-transparent"
              value={selectedSubject}
              IconDemography={true}
              optionData={subjects.map((item) => item.name)}
              onChange={(e) => handleSubjectChange(e)}
            />

            <RangeDate
              className="ml-0"
              optionClassName="!w-min"
              inputContainerClassName="!w-min"
              handleRangeData={setSelectedConceptIdx}
            />
          </div>
        </div>
        <div
          id={styles.chartContainer}
          className="!rounded-md  bg-white w-full flex-1 shadow-[0px_0px_2.500001907348633px_0px_#00000040] custom-scroller !w-[calc(1050*0.0522vw)]"
        >
          <Chart
            selectedStudent={selectedStudent}
            selectedSubject={selectedSubject}
            setSubjects={setSubjects}
            selectedConceptIdx={selectedConceptIdx}
            setSelectedConceptIdx={setSelectedConceptIdx}
            currentSubData={currentSubData}
            setCurrentSubData={setCurrentSubData}
          />
        </div>
      </div>

      <div className="w-full lg:w-1/3 flex flex-col gap-3 mt-1 h-full">
        <div className="concept" id={styles.studentCarousel}>
          <div>
            <h1 className="text-[#26435F]  text-base-20 font-semibold ">
              Tutor Profile
            </h1>
            <div className="mb-3 bg-[#26435F] flex items-center h-[180px] rounded-md !w-[calc(489*0.0522vw)]">
              {filteredTutors.length > 0 ? (
                <OwlCarousel
                  ref={tutorCarouselRef}
                  className="owl-theme h-full"
                  loop
                  margin={8}
                  items={1}
                >
                  {filteredTutors.map((tutor, idx) => {
                    return (
                      <div
                        key={idx}
                        className="item flex gap-2 my-auto  h-full"
                      >
                        <div className="w-[40%] ml-10 flex justify-center flex-col h-full ">
                          <h3 className="mb-1 mt-2.5 text-[#FFA28D] font-semibold max-w-[130px] overflow-x-auto">
                            {" "}
                            {`${tutor.firstName}  ${tutor.lastName} `}
                          </h3>
                          {/* <h5 className={`text-white`}>
                          
                          {tutor.tutorLevel && `${tutor.tutorLevel} Belt`}
                        </h5> */}
                          <p className="text-white text-base-17-5 max-w-[100px] overflow-x-auto ">
                            {tutor?.tutorServices[0]?.service
                              ? tutor?.tutorServices[0]?.service
                              : tutor?.tutorServices[1]?.service
                              ? tutor?.tutorServices[1]?.service
                              : "None"}
                          </p>
                          <p className="text-white text-base-15 max-w-[100px] overflow-x-auto mt-1">
                            {tutor?.tagline}
                          </p>
                          <button
                            className="p-2 mt-7 !w-fit rounded-lg whitespace-nowrap text-sm px-4 bg-[#FFA28D] text-white text-base-17-5"
                            onClick={() =>
                              tutor._id &&
                              navigate(`/profile/tutor/${tutor._id}`)
                            }
                          >
                            View Profile
                          </button>
                        </div>
                        <div className="w-[60%] flex items-center h-full flex-1">
                          <img
                            src={
                              tutor.photo
                                ? `${awsLink}${tutor.photo}`
                                : "/images/tutorDefault.svg"
                            }
                            className="mx-auto object-cover !w-[100px] !h-[100px] rounded-full"
                            alt="profile-icon"
                          />
                        </div>
                      </div>
                    );
                  })}
                </OwlCarousel>
              ) : (
                <div className="item flex gap-2 my-auto  h-full w-full">
                  <div className="w-[40%] ml-10 flex justify-center flex-col h-full ">
                    <h3 className="mb-1 mt-2.5 text-[#FFA28D] font-semibold max-w-[130px] overflow-x-auto">
                      {"No Tutor Assigned "}
                    </h3>
                    {/* <h5 className={`text-white`}>
                          
                          {tutor.tutorLevel && `${tutor.tutorLevel} Belt`}
                        </h5> */}
                  </div>
                  <div className="w-[60%] flex items-center h-full flex-1">
                    <img
                      src={"/images/tutorDefault.svg"}
                      className="mx-auto object-cover !w-[100px] !h-[100px] rounded-full"
                      alt="profile-icon"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div id={styles.practiceTestContainer}>
          <h1 className="text-[#26435F]  text-base-20 font-semibold mb-1">
            Assignments
          </h1>
          <div
            id={styles.listedData}
            className=" overflow-y-auto custom-scroller !w-[calc(489*0.0522vw)]"
          >
            {filteredAssignedTests?.length > 0 ? (
              filteredAssignedTests?.map((test) => {
                return <ParentTest styles={styles} {...test} />;
              })
            ) : (
              <div id="stest2" className=" w-full  z-[5000] h-full rounded-md bg-white flex justify-center items-center flex-col text-center items-center">
                <div className="w-[70%] mx-auto   flex flex-col items-center">
                  <button className="bg-[#FF7979] text-white rounded-md p-2 py-1 mb-3">
                    No Assignments Yet
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConceptSection;
