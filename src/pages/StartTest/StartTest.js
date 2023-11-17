import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SecondaryButton from "../../components/Buttons/SecondaryButton";

import BackIcon from "../../assets/assignedTests/back.svg";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { TestDetail } from "../../components/TestDetail/TestDetail";
import { testData } from "./tempData";
import TestOption from "../../components/TestOption/TestOption";
import {
  useAddBackupResponseMutation,
  useAttendTestMutation,
  useLazyContinueTestQuery,
  useLazyGetAssignedTestQuery,
  useLazyGetSectionsQuery,
  useLazyGetSingleAssignedTestQuery,
  useLazyGetTestResponseQuery,
  useLazyGetTimeQuery,
  useStartTestMutation,
  useSubmitTestMutation,
  useUpdateTimeMutation,
} from "../../app/services/test";
import BackBtn from "../../components/Buttons/Back";
import Timer from "../../components/Timer/Timer";
import CurrentSection from "./CurrentSection/CurrentSection";
import { useSelector } from "react-redux";
import {
  getCheckedString,
  getDuration,
  getFormattedDate,
} from "../../utils/utils";
import Modal from "../../components/Modal/Modal";
import Warning from "../../assets/images/warning.png";
const tempsubjects = [
  { text: "Trigonometry", selected: true },
  { text: "Mathematics", selected: false },
  { text: "Reading", selected: false },
  { text: "Science", selected: false },
];

export default function StartTest() {
  const { organization } = useSelector((state) => state.organization);

  const navigate = useNavigate();
  const [tempSubjects, setTempSubjects] = useState(tempsubjects);
  const [testStarted, setTestStarted] = useState(false);

  const [initialSeconds, setInitialSeconds] = useState(0);
  const [countDown, setCountDown] = useState(0);
  const { firstName, lastName } = useSelector((state) => state.user);
  const { dateFormat } = useSelector((state) => state.user);

  const [testHeaderDetails, setTestHeaderDetails] = useState({
    name: `${firstName} ${lastName}`,
    duration: 0,
    dateAssigned: "",
    startedOn: "",
    completedOn: "",
    testName: "",
    dueDate: "",
    instruction: "",
  });
  const handleNextClick = () => {
    // Replace 'id' and 'assignedTestId' with the actual values you want to pass in the URL
    navigate(`/all-tests/start-section/${id}/${assignedTestId}`);
  };
  // console.log(testHeaderDetails);
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [sectionDetails, setSectionDetails] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [activeSection, setActiveSection] = useState({});
  const [timer, setTimer] = useState(10);
  const [answers, setAnswers] = useState([]);
  const [submitId, setSubmitId] = useState("");
  const [completedSubjects, setCompletedSubjects] = useState([]);
  const [startBtnLoading, setStartBtnLoading] = useState(false);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);

  const { id, assignedTestId } = useParams();

  const [getSections, getSectionsResp] = useLazyGetSectionsQuery();
  const [getAssignedTest, getAssignedTestResp] =
    useLazyGetSingleAssignedTestQuery();

  const [addBackupResponse, addBackupResponseResp] =
    useAddBackupResponseMutation();
  const [startTest, startTestResp] = useStartTestMutation();
  const [submitSection, submitSectionResp] = useSubmitTestMutation();
  const [continueTest, continueTestResp] = useLazyContinueTestQuery();
  const [completedSectionIds, setCompletedSectionIds] = useState([]);
  const [popUp, setPopUp] = useState(false);

  useEffect(() => {
    let params = {};
    let url = `/api/test/myassigntest/${assignedTestId}`;

    getAssignedTest({ url, params }).then((res) => {
      if (res.error) return console.log("testerror", res.error);
      console.log("getassigntest", res.data.data);
      const { testId, createdAt, timeLimit, multiple, dueDate, instruction } =
        res.data.data.test;
      if (multiple === 0) {
        setIsUnlimited(true);
      } else {
        setIsUnlimited(false);
      }
      console.log("asd", res.data.data);
      setTestHeaderDetails((prev) => ({
        ...prev,
        testName: res.data.data.test.testId?.testName,
        instruction: res.data.data.test.instruction,
        dateAssigned: getFormattedDate(
          res.data.data.test.createdAt,
          dateFormat
        ),
        dueDate: getFormattedDate(res.data.data.test.dueDate, dateFormat),
        duration: multiple
          ? getDuration(res.data.data.test.multiple)
          : "Unlimited",
      }));
    });
  }, []);

  const handleStartTest = () => {
    if (!activeSection) return;
    setStartBtnLoading(true);
    startTest({
      id: assignedTestId,
      reqbody: { sectionName: activeSection.name },
    }).then((res) => {
      setStartBtnLoading(false);
      if (res.error) {
        console.log(res.error);
        if (res?.error?.data?.message === "user blocked") {
          alert("Account temporarily deactivated");
        } else {
          alert("Error starting test");
        }
        return;
      }
      console.log("start test", res.data);
      const { startTime, endTime, sectionName, answer, submitId } =
        res.data.data;
      setPopUp(false);

      if (endTime === null) {
        let date = new Date();

        var nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        // console.log(nextDay); //

        let timer = (new Date(nextDay) - new Date()) / 1000;
        setTimer(Math.trunc(timer));
        setInitialSeconds(Math.trunc(timer));
      } else {
        let timer = (new Date(endTime) - new Date()) / 1000;
        setTimer(Math.trunc(timer));
        setInitialSeconds(Math.trunc(timer));
      }

      // setInitialSeconds(Math.trunc(timer))
      setTestStarted(true);
      setActiveSection({ name: sectionName });
      setSubmitId(submitId);

      setSubjects((prev) => {
        return prev.map((item) => {
          if (item.name === sectionName) {
            return { ...item, selected: true };
          } else {
            return { ...item, selected: false };
          }
        });
      });
      setAnswers(
        answer.map((item) => ({
          ...item,
          isMarked: false,
          ResponseAnswer: "",
          responseTime: 0,
        }))
      );
    });
  };
  // console.log(id)

  const fetchSections = () => {
    getSections({ id: id }).then((res) => {
      if (res.error) {
        return console.log(res.error);
      }
      console.log(
        "sectionshvhjvjhhjbb  hhb hbkkjjkbj  kjbj  response",
        res.data.data
      );
      let duration = 0;

      res.data.data.subjects.subjects.map((item) => {
        duration += item.timer;
      });
      // console.log('date', new Date(res.data.data.subjects.createdAt));
      setTestHeaderDetails((prev) => ({
        ...prev,
        // duration,
        startedOn: getFormattedDate(
          new Date(res.data.data.subjects.createdAt),
          dateFormat
        ),
      }));
      setSectionDetails(res.data.data);
      let tempsubs = res.data.data.subjects.subjects.map((item) => {
        return {
          ...item,
          selected: false,
        };
      });
      const promiseState = async (state) =>
        new Promise((resolve) => {
          resolve(setSubjects(tempsubs));
        });
      promiseState().then(() => {
        fetchContinueTest(true, tempsubs);
      });
    });
  };
  useEffect(() => {
    if (!id) return;
    fetchSections();
  }, [id]);

  useEffect(() => {
    // getTestResponse({ id })
    //    .then(res => {
    //       if (res.error) {
    //          console.log(res.error)
    //          return
    //       }
    //       console.log('TEST RESPONSE', res.data.data)
    //    })
  }, []);

  useEffect(() => {
    console.log(answers);
  }, [answers]);
  const fetchContinueTest = (setResponsesFromStorage, subjectsRec) => {
    continueTest({ id: assignedTestId }).then((res) => {
      if (res.error) {
        console.log(res.error);
        return;
      }
      console.log("CONTINUE", res.data.data);
      // console.log('isUnlimited', isUnlimited);
      // let completedIds = res.data.data.completed.map(item => item._id)

      // let inComplete = subjects.filter(sub => !completedIds.includes(sub._id))
      // console.log('subjects', subjects)
      // console.log('subjectsRec', subjectsRec)
      // console.log('inComplete', inComplete)

      const {
        startTime,
        endTime,
        sectionName,
        completed,
        answer,
        submitId,
        backupResponse,
      } = res.data.data;
      if (completed !== undefined) {
        setCompletedSubjects(completed);
      }
      if ((endTime !== null && endTime) || sectionName?.length > 1) {
        let timer = (new Date(endTime) - new Date()) / 1000;
        setTimer(Math.trunc(timer));
        setInitialSeconds(Math.trunc(timer));

        // setTestStarted(true)
        setTestStarted(true);
        setActiveSection({ name: sectionName });
        setSubmitId(submitId);

        setAnswers(
          answer.map((item, idx) => {
            if (backupResponse !== undefined && backupResponse.length > 0) {
              return {
                ...item,
                isMarked: false,
                responseTime: 0,
                ResponseAnswer: backupResponse[idx].ResponseAnswer,
              };
            } else {
              return {
                ...item,
                isMarked: false,
                ResponseAnswer: "",
                responseTime: 0,
              };
            }
          })
        );

        if (setResponsesFromStorage === true) {
          // let savedAnswers = JSON.parse(localStorage.getItem('answers'))
          // let savedAssignedTestId = localStorage.getItem('assignedTestId')
          // if (!savedAnswers) return
          // if (savedAnswers === null || savedAnswers === undefined) return
          // if (savedAnswers.length === 0) return
          // if (savedAssignedTestId !== assignedTestId) return
          // console.log('savedAnswers', savedAnswers);
          // setAnswers(savedAnswers)
          // console.log('savedAnswers2', localStorage.getItem('answers'));
        }
      } else {
        setTestStarted(false);
      }
      if (completed) {
        const compIds = completed.map((test) => test._id);
        setCompletedSectionIds(compIds);
      }

      setSubjects((prev) => {
        return prev.map((item) => {
          if (item.name === sectionName) {
            return { ...item, selected: true };
          } else {
            return { ...item, selected: false };
          }
        });
      });
    });
  };
  // useEffect(() => {
  //    fetchContinueTest()
  // }, [])

  const handleSubjectChange = (item) => {
    // console.log(item);
    let tempdata = subjects.map((sub) => {
      if (sub._id === item._id) {
        return { ...sub, selected: true };
      } else {
        return { ...sub, selected: false };
      }
    });
    setSubjects(tempdata);
  };
  // setTestStarted(false)
  useEffect(() => {
    if (subjects.length === 0) return;
    const active = subjects.find((item) => item.selected === true);
    if (active) {
      setActiveSection(active);
    }
  }, [subjects]);

  useEffect(() => {
    if (subjects.length === 0) return;
    const active = subjects.filter((item) => item.selected === true);
    let completedSubIds = completedSubjects.map((item) => item._id);
    // console.log('completedSubIds', completedSubIds);
    // console.log('subjects', subjects);
    if (active.length === 0) {
      let issetActive = false;
      let temp = subjects.map((sub) => {
        if (issetActive === false) {
          if (completedSubIds.includes(sub._id)) {
            return { ...sub, selected: false };
          } else {
            issetActive = true;
            return { ...sub, selected: true };
          }
        } else {
          return { ...sub, selected: false };
        }
      });
      setSubjects(temp);
      // console.log('tempsubjects', temp);
    }
    // console.log('active subject', active);
    // console.log('all subjects', subjects);
  }, [subjects, completedSubjects]);

  useEffect(() => {
    if (completedSectionIds.length === subjects.length) {
      if (completedSectionIds.length === 0) return;
      if (subjects.length === 0) return;
      alert("All section test completed");
      navigate("/all-tests");
    }
  }, [completedSectionIds, subjects]);

  const handleResponseChange = (id, option) => {
    // console.log('initialSeconds', initialSeconds);
    // console.log('countDown', countDown);

    const timeTaken = initialSeconds - countDown;
    setInitialSeconds(countDown);
    setAnswers((prev) => {
      return prev.map((item) => {
        let time = 0;
        if (item._id === id) {
          if (item.responseTime) {
            time = item.responseTime + timeTaken;
          } else {
            time = timeTaken;
          }
        }
        if (item._id === id)
          return { ...item, ResponseAnswer: option, responseTime: time };
        else return { ...item };
      });
    });
  };

  const handleSubmitSection = () => {
    // console.log(activeSection);
    // console.log(answers);
    const response = answers.map((item) => {
      const {
        QuestionType,
        QuestionNumber,
        ResponseAnswer,
        responseTime,
        isMarked,
      } = item;
      return {
        QuestionType,
        QuestionNumber,
        ResponseAnswer: ResponseAnswer ? ResponseAnswer : "",
        responseTime: responseTime ? responseTime : 0,
        marked: isMarked,
      };
    });
    console.log(response);
    let body = {
      submitId,
      reqbody: {
        sectionName: activeSection.name,
        response: response,
      },
    };
    console.log(body);
    // return
    setSubmitBtnLoading(true);
    submitSection(body).then((res) => {
      setSubmitBtnLoading(false);
      if (res.error) {
        return console.log(res.error);
      }
      console.log(res.data);
      setTestStarted(false);
      // localStorage.setItem('answers', null)
      fetchContinueTest();
      setActiveSection({});
    });
  };

  const handleMark = (id, bool) => {
    setAnswers((prev) => {
      return prev.map((item) => {
        if (item._id === id) return { ...item, isMarked: bool };
        else return { ...item };
      });
    });
  };

  useEffect(() => {
    if (!answers) return;
    if (answers === null || answers === undefined) return;
    if (answers.length === 0) return;
    // console.log('setans', answers);
    addBackupResponse({
      id: assignedTestId,
      reqbody: { backupResponse: answers },
    }).then((res) => {
      if (res.error) {
        console.log(res.error);
      } else {
        // console.log(res.data);
      }
    });
    // localStorage.setItem('assignedTestId', assignedTestId)
    // localStorage.setItem('answers', JSON.stringify(answers))
  }, [answers]);
  // const { subjects, testQnId, testType } = sectionDetails.subjects
  // console.log('sectionDetails', sectionDetails)
  // console.log('answers', answers)
  // console.log('subjects', subjects)
  // console.log('activeSection', activeSection)
  // console.log('testHeaderDetails', testHeaderDetails)
  // console.log('completedsections', completedSectionIds);
  // console.log('timer', timer);
  // console.log('isUnlimited ', isUnlimited);
  // console.log('initialSeconds', initialSeconds);
  // console.log('countDown', countDown);

  const handleTimeTaken = (id, sec) => {};

  // console.log(testHeaderDetails.duration);

  if (subjects.length === 0) return;
  return (
    <div className="w-screen bg-lightWhite flex justify-center items-center">
      <div className="w-[83.77vw] min-h-full">
        <div className="py-8 px-5">
          <div className="flex">
            <div className="flex-1">
              <p className="text-[#24A3D9] ml-8 !mt-[calc(50*0.052vw)] !mb-[calc(25*0.052vw)] text-base-20">
                <span onClick={() => navigate("/")} className="cursor-pointer">
                  {organization?.company +
                    "  >  " +
                    testHeaderDetails?.name +
                    "  >  "}
                </span>
                <span
                  onClick={() => navigate("/all-tests")}
                  className=" cursor-pointer"
                >
                  {"Assignments > "}{" "}
                </span>
                <span className="font-semibold">
                  {testHeaderDetails.testName}
                </span>
              </p>
              {!testStarted && (
                <div className="grid grid-cols-3 ml-4 w-full text-sm px-4 gap-y-4 mt-2">
                  <div className=" grid grid-flow-col  grid-rows-3 mr-3 justify-start items-start">
                    <div className="w-full flex mb-3 justify-between">
                      <p className="inline-block w-1/2 mr-4 font-medium  text-[20px] text-[#517CA8] opacity-60">
                        {" "}
                        Student’s Name
                      </p>

                      <p className="inline-block w-1/2 font-light  text-[20px] text-[#517CA8] ">
                        {testHeaderDetails?.name?.length > 18
                          ? testHeaderDetails?.name.substring(0, 15) + " ..."
                          : testHeaderDetails?.name}
                      </p>
                    </div>
                    <div className="w-full flex mb-3 justify-between">
                      <p className="inline-block w-1/2 mr-4 font-medium  text-[20px] text-[#517CA8] opacity-60">
                        {" "}
                        Date Assigned{" "}
                      </p>
                      {console.log(testHeaderDetails)}
                      <p className="inline-block w-1/2 font-light  text-[20px] text-[#517CA8]">
                        {testHeaderDetails.dateAssigned}
                      </p>
                    </div>
                    <div className="w-full flex mb-3 justify-between">
                      <p className="inline-block w-1/2 mr-4 font-medium  text-[20px] text-[#517CA8] opacity-60">
                        {" "}
                        Duration{" "}
                      </p>

                      <p className="inline-block w-1/2 font-light  text-[20px] text-[#517CA8]">
                        {testHeaderDetails.duration}
                      </p>
                    </div>
                  </div>
                  <div className=" grid grid-flow-col  grid-rows-3 justify-start items-start">
                    <div className="w-full flex mb-3 justify-between">
                      <p className="inline-block w-1/2 mr-4 font-medium  text-[20px] text-[#517CA8] opacity-60">
                        {" "}
                        Due on{" "}
                      </p>

                      <p className="inline-block w-1/2 font-light  text-[20px] text-[#517CA8] ">
                        {testHeaderDetails.dueDate
                          ? testHeaderDetails.dueDate
                          : "-"}
                      </p>
                    </div>
                    <div className="w-full flex mb-3 justify-between">
                      <p className="inline-block w-1/2 mr-4 font-medium  text-[20px] text-[#517CA8] opacity-60">
                        {" "}
                        Started on{" "}
                      </p>

                      <p className="inline-block w-1/2 font-light  text-[20px] text-[#517CA8]">
                        {testHeaderDetails.startedOn
                          ? testHeaderDetails.startedOn
                          : "-"}
                      </p>
                    </div>
                    <div className="w-full flex mb-3 justify-between">
                      <p className="inline-block w-1/2 mr-4 font-medium  text-[20px] text-[#517CA8] opacity-60">
                        {" "}
                        Completed on{" "}
                      </p>

                      <p className="inline-block w-[160px] font-light  text-[20px] text-[#517CA8]">
                        -{" "}
                      </p>
                    </div>
                  </div>
                  <div className="w-full flex mb-3 justify-between">
                    <div className="flex flex-col">
                      <p className="inline-block mr-4 font-medium  text-[20px] text-[#517CA8] opacity-60">
                        {" "}
                        Instruction from tutor{" "}
                      </p>

                      <p className="inline-block mt-2 font-light  text-[20px] text-[#517CA8]">
                        {testHeaderDetails.instruction.length > 0
                          ? testHeaderDetails.instruction
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <div className="flex relative w-fit flex-row gap-2 mx-4 mt-12 overflow-x-auto">
                  {subjects.map((item, idx) => {
                    return (
                      <PrimaryButton
                        roundedClass="rounded-0"
                        children={item.name}
                        onClick={() => handleSubjectChange(item)}
                        className={`pt-2 pb-2 px-0 mr-0 rounded-0 text-[17.5px] font-normal w-fit bg-transparent
                            ${
                              item.selected
                                ? " text-[#FFA28D] border-b-2 border-b-[#FFA28D]"
                                : ""
                            } disabled:opacity-60`}
                        disabled={
                          testStarted && item.selected === false
                            ? true
                            : completedSectionIds.includes(item._id)
                            ? true
                            : false
                        }
                      />
                    );
                  })}
                  <div className="bg-gray-300 absolute bottom-[0px] z-10 h-[1px] w-full"></div>
                </div>
                {!testStarted && (
                  <div className="border shadow-lg border-1 bg-white pt-[60px] pr-8 pl-12 pb-[50px] m-4 relative">
                    <div className="bg-[#24A3D9] absolute top-4 right-4 rounded px-4 flex items-center flex-col py-2">
                      <p className="text-[15px] text-[#FFFFFF] font-medium">
                        Time
                      </p>
                      <p className="text-[25px] text-[#FFFFFF] font-normal">
                        {activeSection.timer + ":00"}
                      </p>
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      <p className="text-[#26435F] text-[17.5] font-bold mb-4">
                        Section Instructions:
                      </p>
                      <p className="text-[#26435F] texxt-[17.5] font-normal">
                        Timer: {activeSection.timer} minutes
                      </p>
                      <p className="text-[#26435F] texxt-[17.5] font-normal">
                        {activeSection.description}
                      </p>
                    </div>

                    <div className="flex items-start flex-col mt-16 relative">
                      <div className="flex flex-row justify-start items-center bg-[#FF696133] py-2 px-5 rounded-20 mb-[15px]">
                        <img src={Warning} />
                        <p className="text-red-500 text-[15px] font-medium">
                          Warning
                        </p>
                        <p className="text-[#FF6961] text-[15px] font-light">
                          : Once you started,you won't be able to pause the
                          timer.
                        </p>
                      </div>
                      <PrimaryButton
                        children="Start Section"
                        className="w-[300px] h-[60px] text-[21px] !text-white"
                        onClick={() => setPopUp(true)}
                      />
                      {/* <PrimaryButton children='Start Section' className='w-[300px] h-[60px] text-[21px]' onClick={handleStartTest} /> */}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-center">
            {testStarted && (
              <div
                className="mt-[15px] w-[60%] overflow-auto custom-scroller"
                style={{ maxHeight: "calc(100vh - 240px)" }}
              >
                {answers.map((item, idx) => {
                  return (
                    <div
                      key={idx}
                      className="flex justify-between items-center py-5 px-10 bg-white rounded-xl mb-[15px]"
                    >
                      <p className="font-semibold text-[20px] text-[#517CA8] leading-none">
                        {item.QuestionNumber < 10
                          ? "0" + item.QuestionNumber
                          : item.QuestionNumber}
                      </p>
                      {console.log(item)}
                      <TestOption
                        {...item}
                        handleResponseChange={handleResponseChange}
                        handleTimeTaken={handleTimeTaken}
                      />
                      {item.isMarked ? (
                        <button
                          className="w-[180px] font-semibold pt-2.5 pb-2.5 rounded-lg bg-[#FFCE84] text-white ml-4"
                          onClick={() => handleMark(item._id, false)}
                        >
                          Unmark
                        </button>
                      ) : (
                        <button
                          className="w-[180px] text-[#FFCE84]  font-semibold py-3 rounded-lg pt-[8px] pb-[8px] border-2 border-[#FFCE84] ml-4"
                          onClick={() => handleMark(item._id, true)}
                        >
                          Mark for Review
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* RIGHT */}
            <div className="flex-2 w-[40%] ml-8 items-center flex flex-col">
              {testStarted && (
                <Timer
                  handleSubmitSection={handleSubmitSection}
                  timer={timer}
                  active={testStarted ? true : false}
                  setCountDown={setCountDown}
                  isUnlimited={isUnlimited}
                  duration={testHeaderDetails.duration}
                />
              )}
              {testStarted && (
                <CurrentSection
                  answers={answers}
                  activeSection={activeSection}
                  submitSection={handleSubmitSection}
                  setSubmitBtnLoading={setSubmitBtnLoading}
                  submitBtnLoading={submitBtnLoading}
                />
              )}
            </div>
          </div>
        </div>

        {popUp && (
          <Modal
            classname="max-w-[700px] mx-auto"
            title="Note that the time will begin as soon as you start this section. make sure that you have everything set up."
            titleClassName="mr-4  mb-4"
            primaryBtn={{
              text: "Okay",
              className: "bg-[#FF7979] w-[146.67px] h-[46.67px] ml-0",
              onClick: handleStartTest,
              loading: startBtnLoading,
            }}
            handleClose={() => setPopUp(false)}
          />
        )}
      </div>
    </div>
  );
}
