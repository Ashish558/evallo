import React, { useEffect, useState } from "react";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import BackIcon from "../../assets/assignedTests/back.svg";
import questionMark from "../../assets/assignedTests/question-mark.svg";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import styles from "./style.module.css";
import {
  tableData,
  answerTableData,
  timeTakenSeries,
  ttOptions,
  accuracySeries,
  accuracyOptions,
} from "./tempData";
import Table from "../../components/Table/Table";
import { useNavigate, useParams } from "react-router-dom";
import BarGraph from "../../components/BarGraph/BarGraph";
import {
  useLazyGetAnswersQuery,
  useLazyGetSingleAssignedTestQuery,
  useLazyGetTestDetailsQuery,
  useLazyGetTestResponseQuery,
} from "../../app/services/test";
import {
  getDate,
  getDuration,
  getFormattedDate,
  getScoreStr,
  millisToMinutesAndSeconds,
  getFormattedDateTime,
} from "../../utils/utils";
import { useLazyGetTutorDetailsQuery } from "../../app/services/users";
import { useSelector } from "react-redux";

import RedIcon from "../../assets/assignedTests/red.svg";
import GreenIcon from "../../assets/assignedTests/green.svg";
import moment from "moment";
import PrimaryTab from "../../components/Buttons/PrimaryTab";

const tempsubjects = [
  { text: "Trigonometry", selected: true },
  { text: "Mathematics", selected: false },
  { text: "Reading", selected: false },
  { text: "Science", selected: false },
];

const tableHeadersParent = [
  "Q No.",
  "Correct Answer",
  "Student Response",
  "Accuracy",
  "Concept",
  "Strategy",
  "Time Taken",
  "Marked For Review",
];
const adminTableHeaders = [
  "Q No.",
  "Correct Answer",
  "Student Response",
  "Accuracy",
  "Concept",
  "Strategy",
  "Time Taken",
  "Marked For Review",
];

export default function StudentReport() {
  const { organization } = useSelector((state) => state.organization);
  const { firstName, lastName } = useSelector((state) => state.user);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [testData, setTestData] = useState(tableData);
  const [answersData, setAnswersData] = useState(answerTableData);
  const [responseData, setResponseData] = useState({});
  const [displayScore, setDisplayScore] = useState({
    cumulative: "",
    right: "",
    isSat: false,
  });
  const { role: persona, id: currentUserId } = useSelector(
    (state) => state.user
  );
  const [sectionScore, setSectionScore] = useState({
    correct: 0,
    outOf: 0,
  });
  const [timeSeries, setTimeSeries] = useState({
    name: "Time Taken",
    data: [],
  });
  const [timeSeriesOptions, setTimeSeriesOptions] = useState(ttOptions);
  const [sortedConcepts, setSortedConcepts] = useState([]);

  const [accuracySeries, setAccuracySeries] = useState({
    name: "Correct Answers",
    data: [],
  });
  const [accuracyGraphOptions, setAccuracyGraphOptions] =
    useState(accuracyOptions);
  const [answerKey, setAnswerKey] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (persona === "parent" || persona === "student") {
      setTableHeaders(tableHeadersParent);
    } else {
      setTableHeaders(adminTableHeaders);
    }
  }, [persona]);

  const { id, studentId, assignedTestId } = useParams();

  const [testDetails, setTestDetails] = useState({
    testName: "-",
    assignedOn: "-",
    name: "-",
    dueOn: "-",
    startedOn: "-",
    completedOn: "-",
    duration: "-",
    instruction: "-",
  });
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState({});
  const [getTestResponse, getTestResponseResp] = useLazyGetTestResponseQuery();
  const [getUserDetail, userDetailResp] = useLazyGetTutorDetailsQuery();
  const [getTestDetails, getTestDetailsResp] = useLazyGetTestDetailsQuery();
  const [getAssignedTest, getAssignedTestResp] =
    useLazyGetSingleAssignedTestQuery();
  const [isSet, setIsSet] = useState(false);
  const [getAnswers, getAnswersResp] = useLazyGetAnswersQuery();
  const [answerKeySubjects, setAnswerKeySubjects] = useState([]);
  const [sectionDuration, setSectionDuration] = useState("");
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);

  const [scoreStr, setScoreStr] = useState("");
  const getSubjectScore = (response, selectedSubject) => {
    const tot = scaleData?.answer?.subjects[selectedSubject?.idx].totalQuestion;
    const maxS =
      tot > 0
        ? scaleData?.scale?.score[tot - 1][selectedSubject?.scoreScale]
        : 0;
    console.log({
      scaleData,
      selectedSubject,
      sc: scaleData?.scale?.score[tot],
    });

    return maxS;
  };

  // console.log('params studnt', studentId);
  //get answer key
  useEffect(() => {
    if (Object.keys(responseData).length === 0) return;
    if (isSet === true) return;
    console.log("response data 55", responseData);
    // let sortedSubjects = responseData.subjects.map(sub => sub.name)
    if (responseData.subjects.length === 0) {
      // alert('No sections are submitted')
      // navigate(-1)
      return;
    }

    getAnswers(id).then((res) => {
      console.log("555", res, id);
      if (res.error) return console.log(res.error);
      console.log("ANSWER KEY", res.data.data);
      if (res.data.data) setScaleData(res.data.data);
      let answerKeyData = { ...res.data.data };
      let score = getScoreStr(
        responseData.testType,
        responseData.score,
        responseData.subjects,
        answerKeyData.answer.subjects.length
      );
      console.log("score55", score);
      let newS = score;
      if (score?.length > 0) {
        newS = score?.split("|")?.join(" ");
      }
      setDisplayScore(newS);

      console.log("answer key subjects", answerKeyData.answer.subjects);
      let conceptsPresent = true;
      let updatedSubs = answerKeyData.answer.subjects.map((item) => {
        if (item.concepts === undefined) {
          conceptsPresent = false;
          return { ...item, concepts: { UNAVAILABLE: 0 } };
        } else {
          return item;
        }
      });
      answerKeyData = {
        ...answerKeyData,
        answer: {
          ...answerKeyData.answer,
          subjects: updatedSubs,
        },
      };
      // if (conceptsPresent === false) {
      //    // alert('Concepts not present')
      //    // navigate(-1)
      //    return
      // }
      let subResponse = answerKeyData.answer.subjects
        .map((sub) => {
          let currSub = responseData.subjects.find(
            (item) => item.name === sub.name
          );
          if (currSub === undefined) return;
          // console.log('currSub', currSub);
          let conceptsToInclude = {};
          if (currSub.concepts === undefined) {
            Object.keys(sub.concepts).map((key) => {
              // console.log('sub.concepts[key]', sub.concepts[key]);
              conceptsToInclude[key] = 0;
            });
            return {
              ...currSub,
              concepts: conceptsToInclude,
            };
          } else {
            Object.keys(sub.concepts).map((key) => {
              conceptsToInclude[key] = 0;
            });
            return {
              ...currSub,
              concepts: {
                ...conceptsToInclude,
                ...currSub.concepts,
              },
            };
          }
          // console.log('conceptsToInclude', conceptsToInclude);
        })
        .filter((item) => item !== undefined);
      // console.log('subResponse', subResponse);
      // console.log('subjects', subjects);
      let updated = subjects.map((subj) => {
        let updatedSubjWithConcepts = subResponse.find(
          (item) => item.name === subj.name
        );
        return {
          ...subj,
          concepts: {
            ...updatedSubjWithConcepts.concepts,
          },
        };
        // console.log('updatedSubjWithConcepts', updatedSubjWithConcepts);
      });
      let updated2 = subResponse.map((subj) => {
        let updatedSubj = subjects.find((item) => item.name === subj.name);
        return {
          ...subj,
          timeTaken: updatedSubj.timeTaken,
          selected: updatedSubj.selected,
        };
        // console.log('updatedSubjWithConcepts', updatedSubjWithConcepts);
      });
      // console.log('subjects', subjects);
      // console.log('updated', updated);
      // console.log('responseData', responseData);
      // console.log('subResponse', subResponse);
      let upSubArr = [];
      updated2.forEach((responseSub) => {
        updated.forEach((sub) => {
          if (responseSub.name === sub.name) {
            upSubArr.push(sub);
          }
        });
      });

      setResponseData((prev) => {
        return {
          ...prev,
          subjects: upSubArr,
        };
      });
      setSubjects(upSubArr);
      let selected = upSubArr.find((item) => item.selected === true);
      setSelectedSubject(selected);

      let subjects1 = answerKeyData.answer.subjects;
      setAnswerKey(res.data.data.answer.answer);
      // console.log('answerKeyData.answer.subjects', answerKeyData.answer.subjects);
      setAnswerKeySubjects(answerKeyData.answer.subjects);
      setIsSet(true);
    });
  }, [responseData]);

  const getSelectedString = (arr) => {
    let strArr = [];
    arr.map((item) => {
      if (item.selected) strArr.push(item.text);
    });
    return strArr;
  };
  const [scaleData, setScaleData] = useState({});
  useEffect(() => {
    let params = {};
    let url = `/api/test/myassigntest/${assignedTestId}`;
    if (studentId) {
      params = {
        userId: studentId,
      };
      url = `/api/test/myassigntest/${assignedTestId}`;
    }
    getAssignedTest({ url }).then((res) => {
      if (res.error) return console.log("TEST ERROR", res.error);
      console.log("TEST RESP", res.data.data.test);
      let {
        testId,
        createdAt,
        timeLimit,
        multiple,
        instruction,
        isCompleted,
        updatedAt,
      } = res.data.data.test;

      if (testId === null) {
        testId = {};
      }
      setTestDetails((prev) => {
        return {
          ...prev,
          assignedOn: getFormattedDateTime(createdAt),
          testName: testId.testName,
          instruction: instruction,
          duration: multiple ? getDuration(multiple) : "-",
          completedOn: isCompleted ? getFormattedDateTime(updatedAt) : null,
        };
      });
    });
  }, []);

  useEffect(() => {
    let params = {};
    let url = `/api/test/getresponse/${assignedTestId}`;
    if (studentId) {
      url = `/api/test/admin/getresponse/${assignedTestId}`;
    }
    getTestResponse({ url, params: params }).then((res) => {
      if (res.error) {
        console.log("RESPONSE ERR", res.error);
        return;
      }
      console.log("RESPONSE", res.data.data.response);
      const { subjects, studentId, response, createdAt, updatedAt } =
        res.data.data.response;
      if (res.data.data.response.testType === "SAT") {
        let set1Score = 0;
        let set2Score = 0;
        subjects.map((sub, idx) => {
          if (idx === 0 || idx === 1) {
            set1Score += sub.no_of_correct;
          } else {
            set2Score += sub.no_of_correct;
          }
        });

        setDisplayScore({
          cumulative: `C${set1Score + set2Score}`,
          right: `V${set1Score} M${set2Score}`,
          isSat: true,
        });
      } else if (res.data.data.response.testType === "SAT") {
        let scoreArr = [];
        let total = 0;
        subjects.map((sub, idx) => {
          total += sub.no_of_correct;
          scoreArr.push(sub.no_of_correct);
        });
        setDisplayScore({
          cumulative: `C${total / subjects.length}`,
          right: `E${scoreArr[0]} M${scoreArr[1]} R${scoreArr[2]} C${scoreArr[3]}`,
          isSat: false,
        });
      }
      setTestDetails((prev) => {
        return {
          ...prev,
          startedOn: getFormattedDateTime(createdAt),
        };
      });
      setSubjects(
        subjects.map((sub, idx) => ({
          ...sub,
          idx,
          selected: idx === 0 ? true : false,
        }))
      );

      setResponseData(res.data.data.response);
      getUserDetail({ id: studentId }).then((res) => {
        if (res.error) return console.log(res.error);
        const { firstName, lastName } = res.data.data.user;
        setTestDetails((prev) => {
          return {
            ...prev,
            // assignedOn: getFormattedDate(createdAt),
            name: `${firstName} ${lastName}`,
          };
        });
      });
    });
  }, []);

  const handleChange = (item) => {
    let tempdata = subjects.map((sub) => {
      if (sub._id === item._id) {
        return { ...sub, selected: true };
      } else {
        return { ...sub, selected: false };
      }
    });
    setSubjects(tempdata);
  };

  useEffect(() => {
    if (!subjects) return;
    if (subjects.length === 0) return;
    setSelectedSubject(subjects.filter((sub) => sub.selected === true)[0]);
  }, [subjects]);

  useEffect(() => {
    let strArr = getSelectedString(subjects);
    let tempData = tableData.filter((item) => strArr.includes(item.concept));
    setTestData(tempData);
  }, [subjects]);

  const [startDate, startTime, startFormat] =
    testDetails?.startedOn?.split(" ");
  // console.log(startDate,startTime,startFormat)
  const [assignDate, assignTime, assignFormat] =
    testDetails?.assignedOn?.split(" ");
  // console.log(assignDate,assignTime,assignFormat)
  const [completeDate, completeTime, completeFormat] = testDetails?.completedOn
    ? testDetails?.completedOn?.split(" ")
    : ["", "", "", ""];
  // console.log(completeDate,completeTime,completeFormat)

  //change table data
  useEffect(() => {
    if (Object.keys(selectedSubject).length === 0) return;
    if (answerKey.length === 0) return;

    let currentAnswerKeyIndex = 0;

    answerKeySubjects.map((subj, idx) => {
      if (subj.name === selectedSubject.name) {
        currentAnswerKeyIndex = idx;
      }
    });
    const CustomImage = () => {
      return (
        <div className="w-full flex justify-center">
          <img src={questionMark} alt="QuestionMark" />
        </div>
      );
    };

    if (persona === "student" || persona === "parent") {
      let temp = responseData.response[selectedSubject.idx].map(
        (item, index) => {
          console.log("qa", item);
          const {
            QuestionNumber,
            QuestionType,
            ResponseAnswer,
            isCorrect,
            responseTime,
            _id,
            marked,
          } = item;
          let concept = "-";
          let strategy = "-";
          if (answerKey[currentAnswerKeyIndex][index]) {
            concept = answerKey[currentAnswerKeyIndex][index].Concepts
              ? answerKey[currentAnswerKeyIndex][index].Concepts
              : "-";
          }
          if (answerKey[currentAnswerKeyIndex][index]) {
            strategy = answerKey[currentAnswerKeyIndex][index].Strategy
              ? answerKey[currentAnswerKeyIndex][index].Strategy
              : "-";
          }
          if (answerKey[currentAnswerKeyIndex][index])
            return {
              QuestionNumber,
              CorrectAnswer:
                organization &&
                organization?.settings &&
                organization?.settings?.permissions &&
                organization?.settings?.permissions[4]?.choosedValue
                  ? answerKey[currentAnswerKeyIndex][index]?.CorrectAnswer
                  : "-",
              ResponseAnswer,
              isCorrect,
              Concept: concept,
              Strategy: strategy,
              responseTime: responseTime >= 0 ? `${responseTime} sec` : "-",
              review: marked ? <CustomImage /> : "-",
            };
        }
      );
      setTableData(temp);
    } else {
      // console.log('answerKey', answerKey[selectedSubject.idx]);
      let temp = responseData.response[selectedSubject.idx].map(
        (item, index) => {
          const {
            QuestionNumber,
            QuestionType,
            ResponseAnswer,
            isCorrect,
            responseTime,
            _id,
            marked,
          } = item;
          // console.log(item)
          const CustomImage = () => {
            return (
              <div className="w-full flex justify-center">
                <img src={questionMark} alt="QuestionMark" />
              </div>
            );
          };
          return {
            QuestionNumber,
            CorrectAnswer:
              answerKey[currentAnswerKeyIndex][index]?.CorrectAnswer,
            ResponseAnswer,
            isCorrect,
            Concept: answerKey[currentAnswerKeyIndex][index]?.Concepts
              ? answerKey[currentAnswerKeyIndex][index]?.Concepts
              : "-",
            Strategy: answerKey[currentAnswerKeyIndex][index]?.Strategy
              ? answerKey[currentAnswerKeyIndex][index]?.Strategy
              : "-",
            responseTime: responseTime >= 0 ? `${responseTime} sec` : "-",
            review: marked ? <CustomImage /> : "-",
          };
        }
      );
      setTableData(temp);
    }
  }, [selectedSubject, answerKey, organization]);

  //change time taken series data
  useEffect(() => {
    const oddcolors = ["#8ADCFF", "#96D7F2"];
    const evencolors = ["#8E76ED", "#24A3D9"];

    if (Object.keys(selectedSubject).length === 0) return;
    const selected = responseData.response[selectedSubject.idx];
    console.log("timetaken", selectedSubject, selected);
    let data = [];
    let colors = [];
    let concepts = [];
    let maxColor = "#24A3D9";
    let opColors = [];
    let maxRange = 0;
    selected.map((subj, idx) => {
      maxRange = Math.max(maxRange, subj.responseTime);
    });
    let availableColors = [
      "#24A3D902",
      "#24A3D904",
      "#24A3D908",
      "#24A3D912",
      "#24A3D916",
      "#24A3D922",
      "#24A3D92E",
      "#24A3D93A",
      "#24A3D946",
      "#24A3D952",
      "#24A3D95E",
      "#24A3D96A",
      "#24A3D976",
      "#24A3D982",
      "#24A3D98E",
      "#24A3D99A",
      "#24A3D9A6",
      "#24A3D9B2",
      "#24A3D9BE",
    ];

    selected.map((subj, idx) => {
      //  concepts.push(subj.concept)
      let newColor = Math.ceil((subj.responseTime * 17) / maxRange);
      // console.log("timeee",newColor,subj,maxRange)
      opColors.push(availableColors[newColor]);
      if (subj.responseTime) {
        if (subj.isCorrect) {
          idx % 2 === 0
            ? colors.push(evencolors[0])
            : colors.push(oddcolors[0]);
        } else {
          idx % 2 === 0
            ? colors.push(evencolors[1])
            : colors.push(oddcolors[1]);
        }
        data.push(subj.responseTime);
      } else {
        if (subj.isCorrect) {
          idx % 2 === 0
            ? colors.push(evencolors[0])
            : colors.push(oddcolors[0]);
        } else {
          idx % 2 === 0
            ? colors.push(evencolors[1])
            : colors.push(oddcolors[1]);
        }
        data.push(0);
      }
    });
    // console.log('data', data);
    // console.log('colors', colors);
    // console.log('length', Math.ceil(data.length / 5));
    const len = Math.round(data.length / 1);
    let groups = [];
    {
      [...Array(len)].map((x, i) => {
        groups.push({ title: (i + 1) * 1, cols: 1 });
      });
    }
    // groups = groups.map(item => {
    //    return item.title % 5 === 0 ? item.title : '-'
    // })
    // console.log('groups', groups);
    // console.log('timeSeriesOptions', timeSeriesOptions);
    setTimeSeriesOptions((prev) => ({
      ...prev,
      colors: opColors,
      xaxis: {
        categories: [""],
        tickAmount: 3,

        // categories: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'],
        ...prev.xaxis,
        // tickAmount: 'dataPoints',
        range: 5,
        group: {
          ...prev.xaxis.group,
          groups,
        },
        labels: {
          // show: false,
          style: {
            fontFamily: "Inter",
            fontWeight: 500,
            fontSize: "16px",
            colors: "#517CA8",
          },
        },
      },

      chart: {
        // ... other chart options ...
        toolbar: {
          show: false,
        },
        // Add the custom style to the CSS class
        events: {
          updated: function (chartContext, config) {
            // Apply the custom style to the x-axis title
            var xaxisTitle = chartContext.el.querySelector(
              ".custom-xaxis-title"
            );
            if (xaxisTitle) {
              xaxisTitle.style.transform = "translate(0px, 105px)";
            }
          },
        },
      },

      tooltip: {
        ...prev.tooltip,
        enabled: true,
        shared: false,

        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          console.log({ series, timeSeriesOptions, timeSeries });
          return `<div className="!bg-[#FFA28DBF]  p-4 px-6 text-[16px] text-white rounded-[8px]">
            #${dataPointIndex + 1}.
            <br/>
           <span className="font-semibold text-[17px]">
           ${series[0][dataPointIndex]}
            secs </span> <br/>
           ${selectedSubject.name}
            </div>`;
        },
      },
    }));
    setTimeSeries((prev) => {
      return {
        ...prev,
        data,
      };
    });
  }, [selectedSubject]);

  //change accuracy series and x axis
  useEffect(() => {
    if (Object.keys(selectedSubject).length === 0) return;
    if (answerKey.length === 0) return;
    const selected = responseData.response[selectedSubject.idx];

    if (!selectedSubject.concepts) return;
    const concepts = Object.keys(selectedSubject.concepts).map((key) => {
      if (key?.length > 10) {
        return key?.slice(0, 10) + "...";
      }
      return key;
    });
    // console.log('concepts', concepts);
    let maxColor = "#24A3D9";
    let opColors = [];
    let maxRange = 0;
    let totalIncorrectList = [];
    Object.keys(selectedSubject.concepts).forEach((key) => {
      const incorrectScore = selectedSubject.concepts[key];
      totalIncorrectList.push(incorrectScore);
    });

    totalIncorrectList = totalIncorrectList.sort((a, b) => {
      return parseInt(b) - parseInt(a);
    });
    console.log("timeeconceptsAnswer", selectedSubject);
    setAccuracySeries((prev) => {
      return {
        ...prev,
        data: totalIncorrectList,
      };
    });
    Object.keys(selectedSubject.concepts).forEach((key) => {
      // console.log('CorrectList',key, maxRange,selectedSubject);
      const incorrectScore = selectedSubject.concepts[key];
      maxRange = Math.max(maxRange, incorrectScore);
    });

    let availableColors = [
      "#24A3D902",
      "#24A3D904",
      "#24A3D908",
      "#24A3D912",
      "#24A3D916",
      "#24A3D922",
      "#24A3D92E",
      "#24A3D93A",
      "#24A3D946",
      "#24A3D952",
      "#24A3D95E",
      "#24A3D96A",
      "#24A3D976",
      "#24A3D982",
      "#24A3D98E",
      "#24A3D99A",
      "#24A3D9A6",
      "#24A3D9B2",
      "#24A3D9BE",
    ];
    totalIncorrectList?.map((it) => {
      let newColor = Math.ceil((it * 17) / maxRange);

      opColors.push(availableColors[newColor]);
    });

    let sectionMetaData = scaleData.answer.subjects[selectedSubject.idx];

    let conceptsLablel = Object.keys(selectedSubject.concepts).map(
      (key) => key
    );
    setAccuracyGraphOptions((prev) => {
      return {
        ...prev,
        colors: opColors,
        xaxis: {
          ...prev.xaxis,
          categories: concepts,
          labels: {
            // show: false,
            style: {
              fontFamily: "Inter",
              fontWeight: 500,
              fontSize: "16px",
              colors: "#517CA8",
            },
          },
        },
        tooltip: {
          ...prev.tooltip,
          custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            let totalCQ =
              sectionMetaData.concepts[conceptsLablel[dataPointIndex]];
            console.log("timee", { scaleData, sectionMetaData });
            let pers = 100 - (series[0][dataPointIndex] * 100) / totalCQ;
            return `<div className="!bg-[#FFA28DBF] p-4 px-6 text-[16px]  text-white rounded-[8px]">
            <span className="font-semibold text-[17px]">
            ${conceptsLablel[dataPointIndex]}
            </span>
              <br/>
             <span className="">
            Incorrect ${series[0][dataPointIndex]}/${totalCQ}
               </span> <br/>
              ${pers.toFixed(2)}% Accuracy
              </div>`;
          },
        },
      };
    });

    // console.log(selectedSubject.concepts);
    // const conceptsAnswer = Object.keys(selectedSubject.concepts).map(key => {
    //    const incorrectScore = getConceptScore(selectedSubject.concepts[key], key, true)
    //    totalIncorrectList.push(incorrectScore)
    // })
  }, [selectedSubject, answerKey]);

  //set total score of a section
  useEffect(() => {
    if (Object.keys(selectedSubject).length === 0) return;
    const selected = responseData.response[selectedSubject.idx];
    setSectionScore({
      correct: selectedSubject.no_of_correct,
      outOf: selected.length,
    });
  }, [selectedSubject]);

  const getConceptScore = (correctTotal, key, returnIncorrectOnly) => {
    let currentAnswerKeyIndex = 0;

    answerKeySubjects.map((subj, idx) => {
      if (subj.name === selectedSubject.name) {
        currentAnswerKeyIndex = idx;
      }
    });
    // console.log('currentAnswerKeyIndex', currentAnswerKeyIndex);
    let selected = answerKey[currentAnswerKeyIndex];
    // console.log('selected', selected);
    selected = selected?.map((item) => {
      if (!item.Concepts) {
        return { ...item, Concepts: "UNAVAILABLE" };
      } else {
        return { ...item };
      }
    });
    // console.log('selected', selected);

    let total = 0;
    selected?.forEach((concept) => {
      if (concept.Concepts === key) {
        total += 1;
      }
    });
    if (returnIncorrectOnly) {
      return total - correctTotal;
    } else {
      return `${total - correctTotal} / ${total}`;
    }
  };

  useEffect(() => {
    if (!answerKeySubjects) return;
    if (!selectedSubject) return;

    if (answerKeySubjects.length === 0) return;
    if (Object.keys(selectedSubject).length === 0) return;
    // console.log('selectedSubject', selectedSubject)
    // console.log('answerKeySubjects', answerKeySubjects)
    const ansKeySubject = answerKeySubjects.find(
      (item) => item.name === selectedSubject.name
    );
    // console.log('ansKeySubject', ansKeySubject);
    if (!ansKeySubject) return;
    setSectionDuration(`${ansKeySubject.timer}:00`);
  }, [answerKeySubjects, selectedSubject]);

  useEffect(() => {
    if (!tableData) return;
    if (!selectedSubject) return;

    if (tableData.length === 0) return;
    // console.log('selectedSubject', selectedSubject)
    // console.log('tableData', tableData)

    let total = 0;
    tableData.forEach((item) => {
      if (item.responseTime !== undefined || item.responseTime !== "-") {
        let num = item.responseTime.split(" ")[0];
        if (num === "-") return;
        total += parseInt(num);
      }
    });
    setTotalTimeTaken(`${total} sec`);
    setTotalTimeTaken(millisToMinutesAndSeconds(total * 1000));
  }, [tableData, selectedSubject]);

  // console.log('tableData', tableData)
  // console.log('responseData', responseData)
  // console.log('subjects', subjects)
  // console.log('selectedSubject', selectedSubject)
  // console.log('timeSeries', timeSeries)
  // console.log('answerKey', answerKey)
  // console.log('answerKeySubjects', answerKeySubjects)
  // console.log('testDetails', testDetails)
  const getTotalAndIncorrect = (correctTotal, key, returnIncorrectOnly) => {
    let currentAnswerKeyIndex = 0;

    answerKeySubjects.map((subj, idx) => {
      if (subj.name === selectedSubject.name) {
        currentAnswerKeyIndex = idx;
      }
    });

    let selected = answerKey[currentAnswerKeyIndex];
    selected = selected.map((item) => {
      if (!item.Concepts) {
        return { ...item, Concepts: "UNAVAILABLE" };
      } else {
        return { ...item };
      }
    });
    // console.log('selected', selected);
    let total = 0;
    selected.forEach((concept) => {
      if (concept.Concepts === key) {
        total += 1;
      }
    });
    if (returnIncorrectOnly) {
      return total - correctTotal;
    } else {
      return `${total - correctTotal} / ${total}`;
    }
  };
  const getSortedConcepts = () => {
    let arr = [];
    // console.log('selectedSubject.concepts', selectedSubject.concepts);
    if (
      selectedSubject.concepts === null ||
      selectedSubject.concepts === undefined
    )
      return;
    Object.keys(selectedSubject.concepts).map((key, idx) => {
      let inc = getConceptScore(selectedSubject.concepts[key], key, true);
      // console.log('incorrect', inc, selectedSubject.concepts[key], key)
      arr.push({
        incorrect: inc,
        name: key,
        correct: selectedSubject.concepts[key],
      });
    });
    // console.log('arr', arr)
    arr = arr.sort((a, b) => {
      return parseFloat(b.incorrect) - parseFloat(a.incorrect);
    });
    // console.log('arr', arr)
    setSortedConcepts(arr.slice(0, 5));
    return arr.slice(0, 5);
  };

  useEffect(() => {
    if (selectedSubject.concepts === undefined) return;
    // return
    getSortedConcepts();
  }, [selectedSubject, answerKey, answerKeySubjects]);

  // console.log('concepts', selectedSubject.concepts)
  // console.log('sortedConcepts', sortedConcepts)
  // console.log('selectedSubject', selectedSubject)
  // console.log('selectedSubject', responseData.response)
  // console.log('responseData', responseData)
  // console.log('answerKey', answerKey)

  console.log({ displayScore, subjects });
  const [startSectionDate, startSectionTime, startSectionFormat] =
    selectedSubject?.startSectionTime
      ? getFormattedDateTime(selectedSubject?.startSectionTime)?.split(" ")
      : "- - -";
  return (
    <div className="px-[80px]  min-h-screen">
      <div className="py-14 px-5">
        <div className="px-0">
          <p className="text-[#24A3D9] my-3 text-base-20">
            <span onClick={() => navigate("/")} className="cursor-pointer">
              {organization?.company + "  >  " + firstName + "  " + lastName}
            </span>
            <span
              onClick={() => navigate("/assigned-tests")}
              className="cursor-pointer"
            >
              {"  >  Assignments > "}
            </span>
            <span className="font-bold">Report</span>
          </p>

          <div className="flex justify-between relative">
            <p className="mt-[31px] text-textPrimaryDark text-[25px] font-bold">
              {testDetails?.testName
                ? testDetails.testName
                : scaleData?.test?.testName}
            </p>
            {
              <button
                className={`py-[11px] px-[16px] bg-[#FFA28D] text-white rounded-lg flex items-center shadow-sm h-[75px] absolute top-6 right-0 gap-2`}
              >
                <span className="inline-block font-semibold text-[25px]">
                  {displayScore.cumulative}
                </span>
                <div className="mx-1 font-bold text-[25px] mt-[-3px]">|</div>
                <span className="inline-block  text-[25px]">
                  {displayScore.right}
                </span>
              </button>
            }
          </div>
          {/* {console.log(testDetails)} */}
          <div className="flex gap-x-20">
            <div className="grid grid-cols-2 grid-rows-3  gap-y-[17px] gap-x-[50px] mt-6 text-[#517CA8] text-base-20">
              <div>
                <p className="inline-block w-[160px]  font-bold text-[#26435F]">
                  {" "}
                  Student Name
                </p>
                <span className="inline-block mr-10">:</span>
                <p className="inline-block text-[#26435F]">
                  {" "}
                  {testDetails.name}{" "}
                </p>
              </div>
              <div>
                <p className="inline-block w-[160px] text-[#26435F] text-base-20 font-bold">
                  {" "}
                  Due on{" "}
                </p>
                <span className="inline-block mr-10">:</span>
                <p className="inline-block text-base-20 text-[#26435F]">
                  {" "}
                  {testDetails.startedOn.split(" ")[0]}{" "}
                </p>
              </div>

              <div>
                <p className="inline-block w-[160px] text-[#26435F] text-base-20 font-bold">
                  {" "}
                  Date Assigned{" "}
                </p>
                <span className="inline-block mr-10">:</span>
                <p className="inline-block text-base-20 text-[#26435F]">
                  {" "}
                  {assignDate}{" "}
                  <span className="text-[#24A3D9] font-light text-base-20">
                    {assignTime} {assignFormat}{" "}
                    {organization?.settings?.timeZone}
                  </span>
                </p>
              </div>
              <div>
                <p className="inline-block w-[160px] text-[#26435F] text-base-20 font-bold">
                  {" "}
                  Completed on{" "}
                </p>
                <span className="inline-block mr-10">:</span>
                <p className="inline-block text-base-20 text-[#26435F]">
                  {" "}
                  {completeDate ? completeDate : "-"}{" "}
                  {completeDate && (
                    <span className="text-[#24A3D9] font-light text-base-20">
                      {completeTime} {completeFormat}{" "}
                      {organization?.settings?.timeZone}
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="inline-block w-[160px] text-[#26435F] text-base-20 font-bold">
                  {" "}
                  Duration{" "}
                </p>
                <span className="inline-block mr-10">:</span>
                <p className="inline-block text-base-20 text-[#26435F]">
                  {" "}
                  {testDetails.duration}{" "}
                </p>
              </div>
              <div>
                <p className="inline-block w-[160px] text-[#26435F] text-base-20 font-bold">
                  {" "}
                  Started on{" "}
                </p>
                <span className="inline-block mr-10">:</span>
                <p className="inline-block text-base-20 text-[#26435F]">
                  {" "}
                  {startDate}{" "}
                  <span className="text-[#24A3D9] font-light text-base-20">
                    {startTime} {startFormat} {organization?.settings?.timeZone}
                  </span>
                </p>
              </div>
            </div>
            {persona === "student" && (
              <div className="  text-base-20 mt-16 text-[#517CA8]">
                <p className="inline-block  font-medium">
                  {" "}
                  Instruction from tutor{" "}
                </p>
                <span className="inline-block mr-10 my-auto">:</span>
                <p className="  !font-light">{testDetails.instruction} </p>
              </div>
            )}
          </div>
          <div className="mt-[53px] flex justify-between items-end">
            <div>
              {subjects.map((item, idx) => {
                return (
                  <>
                    <PrimaryTab
                      item={item}
                      children={item.name}
                      onClick={() => handleChange(item)}
                      className={` px-4 mr-7   ${
                        item.selected
                          ? "border-b-4 rounded border-[#FFA28D] text-[#FFA28D]"
                          : ""
                      }`}
                    />
                  </>
                );
              })}
            </div>
          </div>
          <hr className="border-t-[1.25px] border-[#D3D3D3] w-2/5" />
          <div className="mt-7 flex">
            {/* <p className='text-lg font-medium mb-2'>
                     Score: {`${sectionScore.correct} / ${sectionScore.outOf}`}
                  </p> */}
            <div className="flex  py-4 px-4 rounded-10 bg-[#FFFFFF] w-[90%]">
              <div className="flex  flex-col w-full">
                <p
                  className="font-semibold text-[#26435F] mb-2.2 text-base-20"
                  onClick={getSortedConcepts}
                >
                  Concepts
                </p>
                {
                  // selectedSubject.no_of_correct === 0 ?
                  //    <>
                  //       {getSubjectSections()}
                  //    </> :
                  selectedSubject.concepts ? (
                    // Object.keys(selectedSubject.concepts).map((key, idx) => {
                    //    return idx < 5 ? <p key={idx} className='font-semibold mb-2'>
                    //       {/* {selectedSubject.concepts[key]} */}
                    //       {key}
                    //    </p> : <></>
                    // })
                    sortedConcepts.map((item, idx) => {
                      return (
                        <p
                          key={idx}
                          className="text-base-17-5 text-[#517CA8] mb-2"
                        >
                          {item.name}
                        </p>
                      );
                    })
                  ) : (
                    <></>
                  )
                }
              </div>
              <div className="flex flex-col items-center">
                <p className="font-semibold text-[#26435F] mb-2.2 text-base-20">
                  {" "}
                  Incorrect
                </p>
                {
                  // selectedSubject.no_of_correct === 0 ?
                  //    <>
                  //       {getSubjectSectionsScore()}
                  //    </> :
                  selectedSubject.concepts ? (
                    sortedConcepts.map((item, idx) => {
                      return (
                        <p
                          key={idx}
                          className="text-base-17-5 text-[#517CA8] mb-4"
                        >
                          {item.incorrect >= 0 ? item.incorrect : 0}/
                          {item.correct + item.incorrect}
                        </p>
                      );
                    })
                  ) : (
                    <></>
                  )
                }
              </div>
            </div>

            <div className="w-full">
              <div className="flex bg-[#FFFFFF] p-4 rounded-10 ml-[50px]  h-[140px]">
                <div className="flex   mr-[50px]">
                  <div className="mr-[50px]">
                    {" "}
                    <p className="font-semibold text-[#26435F] mb-2.2 text-base-20">
                      {" "}
                      Section Started
                    </p>
                    <p className=" mb-2 text-[#517CA8] text-base-17-5">
                      {" "}
                      {startSectionDate}
                    </p>
                    <p className=" mb-2 text-[#24A3D9] text-base-17-5 font-normal">
                      {startSectionTime} {startSectionFormat}{" "}
                      {organization?.settings?.timeZone}
                    </p>
                    {/* <p className='font-semibold mb-2 opacity-0'>04:25 PM EST</p> */}
                  </div>
                  <div>
                    <p className="font-semibold text-[#26435F] mb-2.2 text-base-20">
                      {" "}
                      Section Accuracy
                    </p>
                    <p className=" mb-2 text-[#517CA8] text-base-17-5">
                      {Object.keys(responseData).length >= 1 &&
                        Object.keys(selectedSubject).length >= 1 && (
                          <>
                            {selectedSubject.no_of_correct} /{" "}
                            {responseData.response[selectedSubject.idx].length}
                          </>
                        )}
                    </p>
                  </div>
                </div>
                <div className="flex  ">
                  <div className="mr-[38px]">
                    <p className="font-semibold text-[#26435F] mb-2.2 text-base-20">
                      {" "}
                      Section Duration
                    </p>
                    <p className=" mb-2  text-[#517CA8] text-base-17-5">
                      {/* {selectedSubject.timeTaken/1000} */}
                      {selectedSubject.timeTaken ? (
                        // moment.duration(selectedSubject.timeTaken).format('HH:mm')
                        sectionDuration ? (
                          sectionDuration
                        ) : (
                          ""
                        )
                      ) : (
                        // millisToMinutesAndSeconds(selectedSubject.timeTaken)
                        <></>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#26435F] mb-2.2 text-base-20">
                      {" "}
                      Time Taken{" "}
                    </p>
                    <p className=" mb-2 text-[#517CA8] text-base-17-5">
                      {/* {selectedSubject.timeTaken/1000} */}
                      {selectedSubject.timeTaken ? (
                        // moment.duration(selectedSubject.timeTaken).format('HH:mm')
                        totalTimeTaken
                      ) : (
                        // millisToMinutesAndSeconds(selectedSubject.timeTaken)
                        <></>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="  text-[#24A3D9] px-4 py-3 ml-[45px] border-[2.5px] border-[#FFA28D] rounded-7 w-[338px] mt-[70px]">
                <p className="text-center font-semibold text-base-20">
                  Section Score: {console.log({ testDetails, testData })}
                  <span className="text-[#517CA8] text-[1.30vw] pl-1 font-medium">
                    {Object.keys(responseData).length >= 1 &&
                      Object.keys(selectedSubject).length >= 1 && (
                        <>
                          {responseData?.score[selectedSubject?.scoreScale]} /{" "}
                          {getSubjectScore(responseData, selectedSubject)}
                        </>
                      )}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <Table
              noArrow={true}
              dataFor={
                persona === "parent" || persona === "student"
                  ? "studentTestsReport"
                  : "studentTestsReport"
              } //studentTestsReportSmall
              hidePagination={true}
              data={tableData}
              tableHeaders={tableHeaders}
              maxPageSize={10}
            />
          </div>
          <div className="mt-10">
            {/* <Table dataFor='studentTestsAnswers'
                     hidePagination={true}
                     data={answersData}
                     tableHeaders={adminTableHeaders}
                     maxPageSize={10} /> */}
          </div>
          <p className="text-primary-dark font-bold text-base-20   mt-10">
            Time Taken
          </p>
          <div className="bg-white mt-1 rounded-5 py-5 px-10 relative">
            {/* <p className='text-primary-dark font-bold text-3xl text-center mb-6 mt-2'>Time Taken</p> */}
            <BarGraph
              series={[timeSeries]}
              options={timeSeriesOptions}
              height="600px"
            />
            <p className="text-[#24A3D9] text-xl font-medium absolute bottom-4 left-1/2 transform -translate-x-1/2">
              Question Number
            </p>
            <p className="text-[#24A3D9] text-xl font-medium absolute top-1/2  transform -translate-x-1/2 -translate-y-1/2 -rotate-90 left-9">
              Time Taken (Seconds)
            </p>
          </div>
          <p className="text-primary-dark font-bold text-base-20   mt-10">
            Conceptual Accuracy
          </p>
          <div className="bg-white mt-1 rounded-5 py-5 px-5 ">
            <BarGraph
              series={[accuracySeries]}
              options={accuracyGraphOptions}
              height="600px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
