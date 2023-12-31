import React, { useEffect, useRef, useState } from "react";
import StudentImg from "../../assets/images/tutor-student.png";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import styles from "./style.module.css";
import RightIcon from "../../assets/icons/right.svg";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import DashboardCard from "../../components/DashboardCard/DashboardCard";
import { scheduleData } from "./tempData";
import TutorSchedule from "../../components/TutorSchedule/TutorSchedule";
import HatIcon from "../../assets/images/hat.svg";
import download from "../../assets/images/basil_file-download-outline.svg";
import {
  useLazyGetSessionsQuery,
  useLazyGetSingleSessionQuery,
} from "../../app/services/session";
import { useSelector } from "react-redux";
import Message from "../../components/Message/Message";
import {
  useLazyGetTutorDetailsQuery,
  useLazyGetUserDetailQuery,
} from "../../app/services/users";
import { useLazyGetFeedbacksQuery } from "../../app/services/dashboard";
import { useNavigate } from "react-router-dom";
import { useLazyGetTutorAssignedTestsQuery } from "../../app/services/test";
import { getDate, getDuration, getFormattedDate } from "../../utils/utils";
import leftArrow from "../../assets/icons/carousel_left-arrow.svg";
import rightArrow from "../../assets/icons/carousel_right-arrow.svg";

import defaultProfile from "../../assets/images/defaultProfile.png";

const studentsArr = [
  {
    src: StudentImg,
    name: "Joseph",
  },
  {
    src: StudentImg,
    name: "Lilly",
  },
  {
    src: StudentImg,
    name: "Emily",
  },
  {
    src: StudentImg,
    name: "Sam",
  },
  {
    src: StudentImg,
    name: "Kate",
  },
];

// const studentsData = [
//    {
//       name: 'Joseph Brown',
//       img: StudentImg,
//       dueDate: 'June 20, 2022'
//    },
//    {
//       name: 'Joseph Brown',
//       img: StudentImg,
//       dueDate: 'June 20, 2022'
//    },
//    {
//       name: 'Joseph Brown',
//       img: StudentImg,
//       dueDate: 'June 20, 2022'
//    },
// ]
export default function TutorDashboard() {
  const { dateFormat } = useSelector((state) => state.user);
  const [profileProgress, setProfileProgress] = useState(0);
  const [fetchUserSessions, fetchUserSessionsResponse] =
    useLazyGetSessionsQuery();
  // const [getUserDetail, userDetailResp] = useLazyGetUserDetailQuery()
  const [getUserDetail, userDetailResp] = useLazyGetTutorDetailsQuery();
  const [fetchTutorAssignedTests, fetchTutorAssignedTestsResp] =
    useLazyGetTutorAssignedTestsQuery();
  const [allAssignedTests, setAllAssignedTests] = useState([]);
  const [tutorHours, setTutorHours] = useState(0);
  const navigate = useNavigate();
  const { firstName, lastName } = useSelector((state) => state.user);
  const [sessions, setSessions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useSelector((state) => state.user);
  const [students, setStudents] = useState([]);
  const [tutorRank, setTutorRank] = useState("-");
  const { awsLink } = useSelector((state) => state.user);
  const { organization } = useSelector((state) => state.organization);
  useEffect(() => {
    const url = `/api/session/tutor/${id}`;
    fetchUserSessions(url).then((res) => {
      console.log('sessions', res)
      if(res.error){
        return 
      }
      let temp = res.data.data.session.filter((session) => {
        let date = new Date(session.date).getDate();
        let now = new Date().getDate();
        return date === now;
        // console.log('d -- ', now);
        // console.log('sd -- ', date);
      });
      setSessions(temp);
    });
  }, []);
  const checkIfFilled = (value) => {
    let filled = false;
    if (value !== "" && value !== undefined && value !== null) {
      filled = true;
    }
    return filled;
  };
  useEffect(() => {
    getUserDetail({ id }).then((resp) => {
      // console.log(resp.data.data.user.assiginedStudents)
      console.log(resp.data.data, "tutor");
      let awsLink = resp.data.data.baseLink;
      const { details } = resp.data.data;
      // console.log('tutor details', details);
      if (resp.data.data.user.tutorHours) {
        let currMonth = new Date().getMonth();
        let currYear = new Date().getFullYear();
        console.log("currMonth", currMonth);
        console.log("currYear", currYear);
        resp.data.data.user.tutorHours?.forEach((item) => {
          if (item.month === currMonth + 1 && item.year === currYear) {
            setTutorHours(item.hours);
          }
        });
      }
      if (details !== null || details !== undefined) {
        setTutorRank(details.tutorRank ? details.tutorRank : "-");
      }
      if (details !== null) {
        const {
          about,
          address,
          interest,
          paymentInfo,
          videoLink,
          tagLine,
          serviceSpecializations,
        } = details;
        let total = 7;
        let filled = 0;
        if (checkIfFilled(about)) {
          filled += 1;
        }
        if (checkIfFilled(tagLine)) {
          filled += 1;
        }
        if (checkIfFilled(address)) {
          filled += 1;
        }
        if (checkIfFilled(paymentInfo)) {
          filled += 1;
        }
        if (
          serviceSpecializations !== undefined &&
          serviceSpecializations?.length >= 1
        ) {
          filled += 1;
        }
        if (interest !== undefined && interest?.length >= 1) {
          filled += 1;
        }
        if (checkIfFilled(videoLink)) {
          filled += 1;
        }
        let percent = (filled * 100) / total;
        setProfileProgress(Math.round(percent));
      }
      let studentsData = [];
      const fetch = (cb) => {
        resp.data.data.user.assiginedStudents.map((studentId, idx) => {
          getUserDetail({ id: studentId }).then((res) => {
            const { _id, firstName, lastName } = res.data.data.user;
            studentsData.push({
              _id,
              name: `${firstName} ${lastName}`,
              photo: res.data.data.user.photo
                ? `${res.data.data.user.photo}`
                : null,
            });
            if (idx === resp.data.data.user.assiginedStudents.length - 1) cb();
          });
        });
      };
      fetch(() => {
        console.log(students);
        setStudents(studentsData.reverse());
      });
    });
  }, []);

  const handleLinkClick = (text) => {
    setIsOpen(true);
    navigator.clipboard.writeText(text);
    setTimeout(() => {
      setIsOpen(false);
    }, 5000);
  };

  const fetchTutorTests = () => {
    fetchTutorAssignedTests(id).then((res) => {
      if (res.error) return console.log("tutor assignedtest", res.error);
      console.log("tutor assignedtest", res.data);
      let data = res.data.data.test.map((item) => {
        const {
          createdAt,
          studentId,
          dueDate,
          photo,
          testId,
          multiple,
          timeLimit,
          isCompleted,
          isStarted,
        } = item;
        let profile = studentId.photo ? studentId.photo : null;
        let status = "notStarted";
        if (isCompleted === true) {
          status = "completed";
        } else if (isStarted) {
          status = "started";
        }
        return {
          studentName: studentId
            ? `${studentId.firstName} ${studentId.lastName}`
            : "-",
          studentId: studentId ? studentId._id : "-",
          assignedOn: getFormattedDate(createdAt),
          testName: testId ? testId.testName : "-",
          testId: testId ? testId._id : null,
          pdf: testId ? item.testId.pdf : null,
          scores: "-",
          duration: multiple ? getDuration(multiple) : "Unlimited",
          status: status,
          createdAt,
          photo: profile,
          dueDate: getFormattedDate(dueDate),
          assignedTestId: item._id,
        };
      });
      let sortedArr = data.sort(function (a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setAllAssignedTests(sortedArr);
    });
  };

  useEffect(() => {
    fetchTutorTests();
  }, []);

  const handlePdfDownload = (pdf) => {
    if (pdf) {
      const anchor = document.createElement("a");
      anchor.href = `${awsLink}${pdf}`;
      anchor.target = "_blank";
      anchor.download = `${pdf}.pdf`; // Replace with the desired file name and extension
      anchor.click();
    } else {
      alert("The PDF file is no longer available.");
    }
  };
  // console.log(students);
  // console.log(tutorRank);
  // console.log('allAssignedTests', allAssignedTests);
  // console.log('prof', profileProgress);
  const sliderRef = useRef(null);

  const options = {
    items: 1,
    loop: false,
    nav: false,
    responsiveClass: true,
    dots: false,
  };

  const handlePrev = () => {
    if (sliderRef.current) {
      sliderRef.current.prev();
    }
  };

  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.next();
    }
  };
  return (
    <div className="w-[1920px] h-auto flex justify-center items-center">
    <div className="bg-[#F5F8FA] w-[1600px] h-auto mb-[100px] flex justify-center items-center">
        <div className="flex flex-col justify-start items-start relative">
          <p className="text-[#24A3D9] text-[20px] mb-[30px] mt-[50px]">
            {organization?.company +
              "  >  " +
              firstName +
              "  " +
              lastName +
              "  >  "}
            <span className="font-bold">Dashboard</span>
          </p>
          <div className="w-full flex">
            <div className="w-[1063px] flex flex-col me-[40px]">
              <div className=" mb-[38.5px] relative ">
                <p className="text-[#26435F] font-semibold text-xl mb-[12px] ">
                  Latest Students
                </p>
                <div className="rounded-[5.333px] bg-[#FFF] shadow-[0px_0px_2px_rgba(0,0,0,0.25)] py-5 px-5  h-[163px] flex justify-center items-center overflow-hidden">
                  <div className={styles.studentImages} style={{position : "relative" , padding : "10px", minWidth : "90%"}}>
                    {students?.length > 0 ? (
                      <OwlCarousel
                        ref={sliderRef}
                        className="owl-theme min-w-[800px]"
                        {...options}
                        items={5}
                        autoWidth
                        margin={10}
                      >
                        {students.map((student) => {
                          return (
                            <div className="flex flex-col justify-center items-center text-center bg-white mr-[50px]">
                              <img
                                src={`${
                                  student.photo
                                    ? `${awsLink}${student.photo}`
                                    : defaultProfile
                                } `}
                                className="h-[93px] w-[93px]"
                                alt="studentImage"
                              />
                              <p
                                className=" text-[#517CA8]  mt-[10.31px] cursor-pointer w-full text-center"
                                onClick={() =>
                                  navigate(`/profile/student/${student._id}`)
                                }
                              >
                                {/* {student.name.split(" ")[0]} <br /> {student.name.split(" ")[1]}  */}
                                {student.name}
                              </p>
                            </div>
                          );
                        })}
                      </OwlCarousel>
                    ) : (
                      <div className=" w-full  z-[5000] min-h-[300px] rounded-md bg-white flex justify-center flex-col text-center items-center">
                        <div className="w-[70%] mx-auto   flex flex-col items-start">
                          <button className="bg-[#FF7979] text-white rounded-md p-2 py-1 mb-3">
                            No Students Mapped
                          </button>
                          <p className=" !whitespace-normal !text-left">
                            You have not been mapped with a student yet. Once
                            your organization’s Admin maps your profile to a
                            student, you will start seeing the latest students
                            populate here.{" "}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  {students?.length > 0 && (
                    <div className="custom-navigation">
                      <button
                        className="prev absolute top-[55%] left-[3%] z-10"
                        onClick={handlePrev}
                      >
                        <img src={leftArrow} alt="" />
                      </button>
                      <button
                        className="next absolute top-[55%] right-[3%] z-10"
                        onClick={handleNext}
                      >
                        <img className="!w-full" src={rightArrow} alt="" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-x-[59px] self-stretch justify-between">
                <DashboardCard
                  data={{
                    title: tutorHours,
                    subtitle: `${tutorHours > 1 ? "Hours" : "Hour"}`,
                    titleClassName: "text-[27.52px]"
                  }}
                  header="Completed"
                  subHeader="This Month"
                  className="bg-[#FFA28D] w-[315px]"
                />
                <DashboardCard
                  data={{
                    title: "-",
                    subtitle: "USD",
                    titleClassName: "text-[27.52px]",
                  }}
                  header="Earned"
                  subHeader="This Month"
                  className="bg-[#FFA28D] w-[315px]"
                />

                <div className="w-[315px] flex-1 flex justify-center items-center bg-[#F4F4F4]  rounded-[5px] shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)]">
                  <div>
                    {" "}
                    <p className="text-[27.52px] text-center text-[#667085] font-semibold">
                      Tutor Rank
                    </p>
                    <p className="text-[#667085] text-center text-[18.33px]">
                      Coming Soon
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-[41.27px]">
                <p className="text-primary-dark font-semibold text-[20px] mb-[12.23px]">
                  Today’s Schedule
                </p>
                <div className="w-[1061px] px-[43px] py-[26px] bg-white  rounded-[5.333px] scrollbar-content scrollbar-vertical h-[530px] overflow-y-auto shadow-[0px_0px_2.6px_0px_rgba(0,0,0,0.25)]">
                  {sessions && sessions?.length > 0 ? (
                    sessions?.map((item, idx) => {
                      return (
                        <TutorSchedule
                          key={idx}
                          {...item}
                          setIsOpen={setIsOpen}
                          handleLinkClick={handleLinkClick}
                        />
                      );
                    })
                  ) : (
                    <div id="sschedule" className=" w-full z-[5000] h-full rounded-md bg-white flex justify-center items-center flex-col text-center">
                      <div className="w-[90%] mx-auto flex flex-col items-start">
                        <button className="bg-[#FF7979] text-white rounded-md cursor-text p-2 py-1 mb-3">
                          No Sessions Scheduled
                        </button>
                        <p className=" !whitespace-normal !text-left text-[#517CA8]">
                          There are no sessions on your calendar for today. To
                          add new sessions, please go to “Schedule” and click on
                          the empty space on “Calendar” where you would like to
                          schedule it. Fill out the session details and click on
                          “Save”.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>


            {/* last Assignments */}
            <div className="w-[525px] flex flex-col items-start justify-start ">
              <p className="text-xl text-[#26435F] mb-[12.5px] font-semibold">
                Last 10 Assignments
              </p>
              <div className="bg-[#FFFFFF]  rounded-[5px] shadow-[0px_0px_2.6px_0px_rgba(0,0,0,0.25)] w-full px-[33.33px] pt-[20px]">
                  <div className="w-full overflow-auto bg-white rounded-20 removeDefaultScrollStyling">
                    {allAssignedTests?.length > 0? (
                      allAssignedTests?.slice(-10).map((item) => {

                        return (
                          <div className="" key={item._id}>
                            <div className=" flex justify-between items-center">
                              <div className="w-[200px]">
                                <p
                                  className="text-[#24A3D9] text-[22.5px] font-bold cursor-pointer overflow-hidden text-ellipsis"
                                  onClick={() =>
                                    navigate(
                                      `/assigned-tests/${item.testId}/${item.assignedTestId}/report/${item.studentId}`
                                    )
                                  }
                                >
                                  { item.testName.length > 9 ? item.testName.slice(0,9) + "..."  :item.testName } 
                                </p>
                                <div className=" text-[#517CA8] flex text-[17.55px] mt-[6.25px]">
                                  <p className="text-[17.5px] overflow-hidden text-ellipsis">
                                    {" "}
                                    {item.studentName}
                                  </p>
                                </div>
                              </div>
                              <div>{item.pdf!==undefined?
                                <img
                                  className="cursor-pointer"
                                  onClick={() =>
                                    window.open(
                                      `${awsLink + item.pdf}`,
                                      "_blank"
                                    )
                                  }
                                  width="35px"
                                  src={download}
                                  alt=""
                                />
                                :null}
                              </div>
                              <div className=" font-medium text-[18px] text-white">
                                {item?.status === "notStarted" ? (
                                  <button
                                    
                                    className="bg-[#D4D9DF] rounded-5 px-[14.5px] h-[31px]"
                                  >
                                    View Report
                                  </button>
                                ) : (
                                  <>
                                    {item?.status === "completed" ? (
                                      <button
                                        onClick={() =>
                                          navigate(
                                            `/assigned-tests/${item.testId}/${item.assignedTestId}/report/${item.studentId}`
                                          )
                                        }
                                        className="bg-[#38C980] rounded-5 px-[14.5px] h-[31px]"
                                      >
                                        View Report
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          navigate(
                                            `/assigned-tests/${item.testId}/${item.assignedTestId}/report/${item.studentId}`
                                          )
                                        }
                                        className="bg-[#FFCE84] rounded-5 px-[14.5px] h-[31px]"
                                      >
                                        View Report
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                             
                            <div className={`mt-[16.75px] mb-[20px] h-[1px] w-[100%] bg-[#D9D9D9]`}></div>
                          </div>
                        );
                      })
                    ) : (
                      <div id="stest3" className=" w-full   h-full rounded-md bg-white flex justify-start flex-col text-center items-start">
                        <div className="w-[70%] mx-auto mt-32   flex flex-col items-center">
                          <button className="bg-[#38C980] text-white rounded-md p-2 py-1 mb-3" onClick={()=>navigate('/assigned-tests')}>
                            Create New Assignment
                          </button>
                          <p className=" !whitespace-normal !text-center text-[#517CA8]">
                            You have not yet added any Assignments for your
                            students. To create a new assignment, click on the
                            button above.{" "}
                          </p>
                        </div>
                      </div>
                    )}
        
                </div>
              </div>
            </div>
          </div>
        </div>
        <Message
          text="Session link has been copied to your clipboard"
          isOpen={isOpen}
        />
     
    </div>
    </div>
  );
}
