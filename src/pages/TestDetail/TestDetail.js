import React, { useEffect, useRef, useState } from "react";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import BackIcon from "../../assets/assignedTests/back.svg";
import AddIcon from "../../assets/icons/add.svg";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
// import styles from './style.module.css'
// import { tableData } from './tempData'
import Table from "../../components/Table/Table";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../app/constants/constants";
import { useLazyGetSectionsQuery } from "../../app/services/test";
import AllTestDetail from "../../components/AllTestDetail/AllTestDetail";
import { useLazyGetAllSectionsQuery } from "../../app/services/admin";
import Scoring from "./Scoring/Scoring";

const subjects = [
   { text: "English", selected: true },
   { text: "Mathematics", selected: false },
   { text: "Reading", selected: false },
   { text: "Science", selected: false },
];

// const tableHeaders = [
//    "Q No.",
//    "Correct Answer",
//    "Student Response",
//    "Accuracy",
//    "Concept",
//    "Strategy",
//    "Time",
//    "Solution",
// ];
const tableHeaders = [
   "Q No.",
   "Answer",
   "Concept",
   "Strategy",
   ""
];

export default function TestDetail() {
   const [testData, setTestData] = useState([]);
   const [sectionsData, setSectionsData] = useState([])
   const [pdfFile, setPDFFile] = useState({});
   const PdfRef = useRef()

   const navigate = useNavigate();

   const { id } = useParams()
   // console.log(window.location.pathname.split("/")[2]);
   const [fetchSections, fetchSectionsResp] = useLazyGetAllSectionsQuery()
   const [getSections, getSectionsResp] = useLazyGetSectionsQuery()

   const [allQuestions, setAllQuestions] = useState([])
   const [questionsTable, setQuestionsTable] = useState([])
   const [subjects, setSubjects] = useState([])

   const handlePDFFile = (file) => {
      const formData = new FormData();
      formData.append("pdf", file);
      setPDFFile(file);
      axios.post(
         `${BASE_URL}api/test/addpdf/${id}`,
         formData
      )
         .then((res) => {
            console.log('pdf post resp', res); 
         });
   };


   useEffect(() => {
      axios.get(`${BASE_URL}api/test/${id}`)
         .then((res) => {
            // console.log(res.data.data);
            setTestData(res.data.data.test);
         });
      fetchSections({ id })
         .then(res => {
            if (res.error) {
               return console.log(res.error);
            }
            console.log('sections data', res.data.data);
            setSectionsData(res.data.data)
            let tempSubs = res.data.data.answer.subjects.map((item, idx) => ({ ...item, selected: idx === 0 ? true : false }))
            setSubjects(tempSubs)
            setAllQuestions(res.data.data.answer.answer)
         })
   }, [])

   useEffect(() => {
      // console.log(allQuestions);
      // console.log(subjects);
      if (subjects.length === 0) return
      if (allQuestions.length === 0) return
      let idx = subjects.findIndex(item => item.selected === true)
      // console.log(idx);
      let tempdata = allQuestions[idx].map(item => {
         const { QuestionNumber, CorrectAnswer, Concepts, Strategies } = item
         if (!item.Strategies) {
            return {
               QuestionNumber, CorrectAnswer, Concepts, Strategies: '-'
            }
         } else {
            return { QuestionNumber, CorrectAnswer, Concepts, Strategies }
         }
      })
      setQuestionsTable(tempdata)
   }, [subjects])

   const handleSubjectChange = (id) => {
      let tempSubs = subjects.map(subject => {
         if (subject._id === id) {
            return { ...subject, selected: true }
         } else {
            return { ...subject, selected: false }
         }
      })
      setSubjects(tempSubs)
   }

   // console.log('questionsTable', questionsTable);

   return (
      <div className="ml-pageLeft bg-lightWhite min-h-screen">
         <div className="py-14 px-5 flex">
            <div className="px-0 flex-1 pr-2">
               <div className="">
                  <SecondaryButton
                     className="flex items-center pl-2 pr-5 py-2.5"
                     onClick={() => navigate("/all-tests")}
                     children={
                        <>
                           <img src={BackIcon} className="mr-2" />
                           <span>Back</span>
                        </>
                     }
                  />
                  <p className="mt-6 text-textPrimaryDark text-4xl font-bold">
                     {testData.testName}
                  </p>

                  <AllTestDetail testData={testData} />

                  <div>
                     <p className="text-2xl text-textPrimaryDark my-7 mb-6 font-bold">
                        Sections
                     </p>

                     <div className="grid max-0 gap-y-1 mt-2 mb-10">
                        <div className="mb-2">
                           <p className="inline-block w-[170px] font-semibold opacity-60">
                              {" "}
                              Section
                           </p>
                           <div className="inline-block w-[120px] font-semibold opacity-60">
                              Time
                           </div>
                           <p className="inline-block w-[138px] font-semibold opacity-60 text-center">
                              {" "}
                              Total Questions
                           </p>
                        </div>
                        {Object.keys(sectionsData).length > 1 &&
                           sectionsData.answer.subjects?.map((section) => (
                              <div className="mb-1">
                                 <p className="inline-block w-[170px] font-medium">
                                    {" "}
                                    {section.name}
                                 </p>
                                 <div className="inline-block w-120 font-medium">
                                    {section.timer} mins
                                 </div>
                                 <p className="inline-block w-138 font-medium text-center">
                                    {section.totalQuestion ? section.totalQuestion : '-'}
                                 </p>
                              </div>
                           ))
                        }
                     </div>

                  </div>
               </div>

               <div className="px-3 py-4 bg-white rounded-[30px]">
                  {Object.keys(sectionsData).length > 1 && <Scoring sectionsData={sectionsData} />}
               </div>


            </div>

            <div className="flex-1 pl-2">
               <p className="text-2xl text-textPrimaryDark my-7 font-bold"> Questions by Section </p>
               <div className="mt-6 flex justify-between items-end">
                  <div>
                     {subjects.map((item, idx) => {
                        return (
                           <PrimaryButton
                              children={item.name}
                              className={`py-2.5 px-0 text-xs mr-4 font-semibold w-[120px] ${item.selected
                                 ? ""
                                 : "bg-secondaryLight text-textGray"
                                 }`}
                              onClick={() => handleSubjectChange(item._id)}
                           />
                        );
                     })}
                  </div>
               </div>

               <div className="flex justify-between mt-7">
                  <PrimaryButton
                     children={<div className="flex items-center justify-center">
                        Add Pdf
                        <img src={AddIcon} className='w-6 ml-2' /> </div>}
                     className={`py-3.5 pl-6 pr-6 mr-4 font-medium text-textGray" }`}
                     onClick={() => PdfRef.current.click()}
                  />
                  <input ref={PdfRef}
                     id="pdf"
                     type="file"
                     className="hidden"
                     accept="application/pdf"
                     onChange={e => handlePDFFile(e.target.files[0])}
                  />
                  <PrimaryButton
                     children={<div className="flex items-center justify-center">
                        Add new question
                        <img src={AddIcon} className='w-6 ml-2' /> </div>}
                     className={`py-3.5 pl-6 pr-6 mr-4 font-medium text-textGray" }`}
                  />
               </div>
               <div className="mt-4">

                  {questionsTable.length > 0 && <Table dataFor='testsDetailQuestions'
                     data={questionsTable}
                     tableHeaders={tableHeaders}
                     excludes={['_id', 'AnswerChoices', '']}
                     // maxPageSize={10}
                     hidePagination />}

               </div>
            </div>
         </div>
      </div>
   );
}
