import React, { useEffect, useRef, useState } from "react";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import BackIcon from "../../assets/assignedTests/back.svg";
import AddIcon from "../../assets/icons/add.svg";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
// import styles from './style.module.css'
// import { tableData } from './tempData'
import { useLocation } from 'react-router-dom';
import Table from "../../components/Table/Table";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL, getAuthHeader } from "../../app/constants/constants";
import { useEditQuestionMutation, useLazyGetSectionsQuery } from "../../app/services/test";
import AllTestDetail from "../../components/AllTestDetail/AllTestDetail";
import { useLazyGetAllSectionsQuery } from "../../app/services/admin";
import Scoring from "./Scoring/Scoring";
import Modal from "../../components/Modal/Modal";
import InputField from "../../components/InputField/inputField";
import InputSelect from "../../components/InputSelect/InputSelect";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './form.css';
import Delete from '../../assets/images/delete.png'
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
   "Choices",
   "Edit"
];

const initialState = {
   questionType: '',
   correctAnswer: '',
   concept: '',
   strategy: '',
   AnswerChoices: '',
   Passage:'',
   Answers:[],
}
export default function TestDetail() {
   const [testData, setTestData] = useState([]);
   const [sectionsData, setSectionsData] = useState({})
   const [pdfFile, setPDFFile] = useState({});
   const [modalActive, setModalActive] = useState(false)
   const PdfRef = useRef()
   const [modalData, setModalData] = useState(initialState)
   const navigate = useNavigate();
   const [btnDisabled, setBtnDisabled] = useState(false)
   const [questionToEdit, setQuestionToEdit] = useState({})
   const [pdfBtnDisabled, setPdfBtnDisabled] = useState(false)
   const [pdfModalActive, setPdfModalActive] = useState(false)
   const [editLoading, setEditLoading] = useState(false)
   const location = useLocation();
   const testType=location?.state?.testype

   useEffect(() => {
      if (modalData.email === '' || modalData.firstName === '' || modalData.lastName === '' || modalData.userType === '') {
         setBtnDisabled(true)
      } else {
         setBtnDisabled(false)
      }
   }, [modalData])

   const { id } = useParams()
   // console.log(window.location.pathname.split("/")[2]);
   const [fetchSections, fetchSectionsResp] = useLazyGetAllSectionsQuery()
   const [getSections, getSectionsResp] = useLazyGetSectionsQuery()
   const [editQuestion, editQuestionResp] = useEditQuestionMutation()

   const [allQuestions, setAllQuestions] = useState([])
   const [questionsTable, setQuestionsTable] = useState([])
   const [subjects, setSubjects] = useState([])
   const [awsLink, setAwsLink] = useState('')
   const [pdfBase64, setPdfBase64] = useState("");

   const handlePDFFile = (file) => {
      const formData = new FormData();
      formData.append("pdf", file);
      setPDFFile(file);
      setPdfBtnDisabled(true);
      const id = window.location.pathname.split("/")[2];
      axios.post(`${BASE_URL}api/test/addpdf/${id}`, formData, {headers: getAuthHeader()})
         .then((res) => {
            setPdfBtnDisabled(false);
            alert('PDF file uploaded successfully!');
            console.log('pdf post resp', res);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
               // The base64 content of the PDF file will be available in reader.result
               const base64Data = reader.result.split(',')[1]; // Remove the data URL prefix
               console.log("Base64 PDF Content:", `data:application/pdf;base64,${base64Data}`);

               setPdfBase64(base64Data);
               setPdfModalActive(false);
               fetchData();
            }
         }).catch(err => {
            setPdfBtnDisabled(false);
            console.log('pdf err', err.response);
            alert('Could not upload pdf');
            setPdfModalActive(false);
            fetchData();
         });
   };


   const fetchData = () => {
      axios.get(`${BASE_URL}api/test/${id}`,{headers: getAuthHeader()})
         .then((res) => {
            console.log('test data', res);
            setAwsLink(res.data.data.baseLink)
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
   }
    
   useEffect(() => {
      fetchData()
   }, [])

   useEffect(() => {
      console.log('allQuestions', allQuestions);
      // console.log(subjects);
      if (subjects.length === 0) return
      if (allQuestions.length === 0) return
      let idx = subjects.findIndex(item => item.selected === true)
      let tempdata = allQuestions[idx].map(item => {
         // console.log(item);
         const { QuestionNumber, CorrectAnswer, Concepts, Strategies, QuestionType, AnswerChoices,Passage,Answers } = item
         if (!item.Strategies) {
            return {
               QuestionNumber,
               CorrectAnswer,
               Concepts: Concepts === undefined ? 'Unavailable' : Concepts,
               Strategies: 'Unavailable',
               QuestionType,
               AnswerChoices,
               }
         } else {
            return {
               QuestionNumber,
               CorrectAnswer,
               Concepts: Concepts === undefined ? 'Unavailable' : Concepts,
               Strategies,
               QuestionType,
               AnswerChoices,
            }
         }
      })
      setQuestionsTable(tempdata)
      console.log(questionsTable);
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


   
   const handleSubmit = (e) => {    
      e.preventDefault()
      // console.log('modalData', modalData);
      // console.log('questionToEdit', questionToEdit);
      // const imageBase64Data = {
      //    questionImageBase64:questionImageBase64,
      //    optionAImageBase64: optionAImageBase64,
      //    optionBImageBase64: optionBImageBase64,
      //    optionCImageBase64: optionCImageBase64,
      //    optionDImageBase64: optionDImageBase64,
      // richTextContentBase64: btoa(richTextContent),
      // };
       const body = {
         subject: "new subject",
         Qno: modalData.QuestionNumber,
         update:{
               CorrectAnswer: modalData.correctAnswer,
               Concepts: modalData.concept,
               Strategies: modalData.strategy,
               AnswerChoices: modalData.AnswerChoices,
               QuestionText: modalData.question,
               QuestionImage:questionImageBase64,
               QuestionType: modalData.questionType,
               Answers:[
                  {
                     label: 'A',
                     content: optionAImageBase64
                  },
                  {
                     label: 'B',
                     content: optionBImageBase64
                  },
                  {
                     label: 'C',
                     content: optionCImageBase64
                  },
                  {
                     label: 'D',
                     content: optionDImageBase64
                  },
               ],
               Passage: modalData.richTextContent,
            },
         };
        
const jsonString = JSON.stringify(body);

         // Log the JSON data in the console
         console.log("JSON Form Data:", jsonString);
      
      setEditLoading(true)
      editQuestion({ id, reqbody: body })
         .then(res => {
            setEditLoading(false)
            setModalData(initialState)
            setModalActive(false)
            if (res.error) return console.log('edit err', res.error);
            console.log('edit resp', res.data);
            fetchData()
         })

   }
   const handleEditTestClick = (item) => {
         setModalData(prev=>{
            return{
               ...prev,
               richTextContent:allQuestions[0][item.QuestionNumber-1].Passage,
               question:allQuestions[0][item.QuestionNumber-1].QuestionText
            }
         })
         setQuestionImageBase64(allQuestions[0][item.QuestionNumber-1].QuestionImage)
      if(allQuestions[0][item.QuestionNumber-1].Answers.size!=0){
         allQuestions[0][item.QuestionNumber-1].Answers.map((it)=>{
            if(it.label=='A'){
               setOptionAImageBase64(it.content)
            }
            else if(it.label==='B'){
               setOptionBImageBase64(it.content)
            }
            else if(it.label==='C'){
               setOptionCImageBase64(it.content)
            }
            else if(it.label==='D'){
               setOptionDImageBase64(it.content)
            }
         })
      }
      setModalData(prev => {
         return {
            ...prev,
            QuestionNumber: item.QuestionNumber,
            correctAnswer: item.CorrectAnswer ? item.CorrectAnswer : '',
            concept: item.Concepts ? item.Concepts : '',
            strategy: item.Strategies !== '-' ? item.Strategies : '',
            questionType: item.QuestionType,
            AnswerChoices: item.AnswerChoices,
         }
         

      })
      setModalActive(true)
      setQuestionToEdit(item)
   }

   const [questionContent, setQuestionContent] = useState('');
   const [optionAContent, setOptionAContent] = useState('');
   const [optionBContent, setOptionBContent] = useState('');
   const [optionCContent, setOptionCContent] = useState('');
   const [optionDContent, setOptionDContent] = useState('');

  
const [questionImageBase64, setQuestionImageBase64] = useState(""); // Define questionImageBase64 state variable
const [optionAImageBase64, setOptionAImageBase64] = useState(""); // Define optionAImageBase64 state variable
const [optionBImageBase64, setOptionBImageBase64] = useState(""); // Define optionBImageBase64 state variable
const [optionCImageBase64, setOptionCImageBase64] = useState(""); // Define optionCImageBase64 state variable
const [optionDImageBase64, setOptionDImageBase64] = useState(""); // Define optionDImageBase64 state variable
const [imageType, setImageType] = useState(""); // Define imageType state variable



// Add a function to handle image uploads
const handleImageUpload = (file, imageType) => {
   if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
       
         const base64Data = reader.result;
         console.log(`Base64 ${imageType} Content:`, base64Data);

         
         switch (imageType) {
            case "questionImage":
               setQuestionImageBase64(base64Data);
               break;
            case "optionAImage":
               setOptionAImageBase64(base64Data);
               break;
            case "optionBImage":
               setOptionBImageBase64(base64Data);
               break;
            case "optionCImage":
               setOptionCImageBase64(base64Data);
               break;
            case "optionDImage":
               setOptionDImageBase64(base64Data);
               break;
            default:
               break;
         }
      };
   }
};
 
 
 
const handleimage_emppty = (imageType) => {
   
         switch (imageType) {
            case "questionImage":
               setQuestionImageBase64('');
               break;
            case "optionAImage":
               setOptionAImageBase64('');
               break;
            case "optionBImage":
               setOptionBImageBase64('');
               break;
            case "optionCImage":
               setOptionCImageBase64('');
               break;
            case "optionDImage":
               setOptionDImageBase64('');
               break;
            default:
               break;
         }
};
  


const [richTextContent, setRichTextContent] = useState(""); 

   return (
      <>
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
                     <div className="flex flex-col justify-center mb-7">

                        <p className="mt-6 text-textPrimaryDark text-4xl font-bold">
                           {testData.testName}
                        </p>
                        {testType!='DSAT'?
                           Object.keys(sectionsData).length > 1 &&

                           <a className="text-[#0671E0] text-xs italic inline-block cursor-pointer"
                              href={sectionsData.test.pdf !== null && `${awsLink}${sectionsData.test.pdf}`} target="_blank"
                           // onClick={() => sectionsData.test.pdf !== null && window.open(sectionsData.test.pdf)} 
                           >
                              {sectionsData.test.pdf !== null ? `${sectionsData.test.testName}.pdf` : ''}
                           </a>
                        :null}
                       {testType!='DSAT'? <PrimaryButton
                           children='Reupload pdf'

                           disabled={pdfBtnDisabled}
                           className={`py-3.5 text-sm mt-5 w-[120px] pl-2 pr-2 mr-4 font-medium text-textGra`}
                           onClick={() => setPdfModalActive(true)}
                        />:null}
                        {/* <input ref={PdfRef}
                           id="pdf"
                           type="file"
                           className="hidden"
                           accept="application/pdf"
                           onChange={e => handlePDFFile(e.target.files[0])}
                        /> */}
                     </div>

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


                     {/* <PrimaryButton
                     children={<div className="flex items-center justify-center">
                        Add new question
                        <img src={AddIcon} className='w-6 ml-2' /> </div>}
                     className={`py-3.5 pl-6 pr-6 mr-4 font-medium text-textGray" }`}
                  /> */}
                  </div>
                  <div className="mt-4">

                     {questionsTable.length > 0 && <Table dataFor='testsDetailQuestions'
                        data={questionsTable}
                        tableHeaders={tableHeaders}
                        excludes={['_id', 'QuestionType']}
                        // maxPageSize={10}
                        onClick={{ handleEditTestClick }}
                        hidePagination />}

                  </div>
               </div>
            </div>
         </div>
         {
            modalActive &&
            <Modal
               classname={'max-w-[780px] mx-auto'}
               title='Edit Question'
               cancelBtn={true}
               cancelBtnClassName='w-140'
               primaryBtn={{
                  text: "Add",
                  className: 'w-140',
                  form: 'add-user-form',
                  // onClick: handleSubmit,
                  type: 'submit',
                  disabled: btnDisabled,
                  loading: editLoading
               }}
               handleClose={() => { setModalActive(false); setModalData(initialState) }}
               body={
                  <form id='add-user-form' onSubmit={handleSubmit} className='px-[3px] mb-0.5 form-scroll-container'>
                     <div className='grid grid-cols-2 md:grid-cols-2  gap-x-2 md:gap-x-3 gap-y-3 gap-y-4 mb-5'>
                        <div>
                           <InputField label='Question No.'
                              labelClassname='ml-4 mb-0.5'
                              isRequired={false}
                              placeholder='Question No.'
                              inputContainerClassName='text-sm pt-3.5 pb-3.5 px-5 bg-primary-50 border-0'
                              inputClassName='bg-transparent'
                              parentClassName='w-full' type='text'
                              value={modalData.QuestionNumber}
                              disabled={true}
                              onChange={e => e.target.value}
                           />
                        </div>
                        <div>
                           <InputSelect label='Question Type'
                              labelClassname='ml-4 mb-0.5'
                              placeholder='Select Question Type'
                              inputContainerClassName='text-sm pt-3.5 pb-3.5 px-5 bg-primary-50 border-0'
                              inputClassName='bg-transparent'
                              parentClassName='w-full' type='text'
                              value={modalData.questionType}
                              optionData={['MCQ', 'Grid-in']}
                              isRequired={true}
                              onChange={val => setModalData({ ...modalData, questionType: val })} />
                        </div>
                        <div>
                           <InputField label='Correct Answer'
                              labelClassname='ml-4 mb-0.5'
                              isRequired={true}
                              placeholder='Type Correct Answer'
                              inputContainerClassName='text-sm pt-3.5 pb-3.5 px-5 bg-primary-50 border-0'
                              inputClassName='bg-transparent'
                              parentClassName='w-full' type='text'
                              value={modalData.correctAnswer}
                              onChange={e => setModalData({ ...modalData, correctAnswer: e.target.value })} />
                        </div>
                        <div>
                           <InputField label='Concept'
                              labelClassname='ml-4 mb-0.5'
                              isRequired={true}
                              placeholder='Concept'
                              inputContainerClassName='text-sm pt-3.5 pb-3.5 px-5 bg-primary-50 border-0'
                              inputClassName='bg-transparent'
                              parentClassName='w-full' type='text'
                              value={modalData.concept}
                              onChange={e => setModalData({ ...modalData, concept: e.target.value })} />
                        </div>
                        <div>
                           <InputField label='Strategy'
                              labelClassname='ml-4 mb-0.5'
                              // isRequired={true}
                              placeholder='Strategy'
                              inputContainerClassName='text-sm pt-3.5 pb-3.5 px-5 bg-primary-50 border-0'
                              inputClassName='bg-transparent'
                              parentClassName='w-full' type='text'
                              value={modalData.strategy}
                              onChange={e => setModalData({ ...modalData, strategy: e.target.value })} />
                        </div>
                        <div>
                           <InputField label='Answer Choices'
                              labelClassname='ml-4 mb-0.5'
                              // isRequired={true}
                              placeholder='Answer Choices'
                              inputContainerClassName='text-sm pt-3.5 pb-3.5 px-5 bg-primary-50 border-0'
                              inputClassName='bg-transparent'
                              parentClassName='w-full' type='text'
                              value={modalData.AnswerChoices}
                              onChange={e => setModalData({ ...modalData, AnswerChoices: e.target.value })} />
                        </div>

                                  </div> 
                                
                                
                {/* My Code */}
                {/* Left Column for Text Inputs */}
                <div className="flex mb-2">
   {/* Left Column for Text Inputs */}
   {/* <div className="w-1/2 pr-4">
      <div className="mb-4">
         <p className="text-lg font-semibold">Question:</p>
         <input
            type="text"
            value={modalData.question}
            onChange={(e) => setModalData({ ...modalData, question: e.target.value })}
            className="border rounded p-2 w-full"
         />
      </div>
      <div className='flex items-center mb-2'>
      <label htmlFor='mcqOptionA' className='ml-2 text-lg'>
        A)
        </label>
      <input
         type='text'
         id='mcqOptionA'
         value={modalData.optionA}
         onChange={e => setModalData({ ...modalData, optionA: e.target.value })}
         className='border rounded p-2 ml-2 w-full'
      />
   </div>
   <div className='flex items-center mb-2'>
      <label htmlFor='mcqOptionA' className='ml-2 text-lg'>
        B)
        </label>
      <input
         type='text'
         id='mcqOptionB'
         value={modalData.optionB}
         onChange={e => setModalData({ ...modalData, optionB: e.target.value })}
         className='border rounded p-2 ml-2 w-full'
      />
   </div>
   <div className='flex items-center mb-2'>
      <label htmlFor='mcqOptionA' className='ml-2 text-lg'>
        C)
        </label>
      <input
         type='text'
         id='mcqOptionC'
         value={modalData.optionC}
         onChange={e => setModalData({ ...modalData, optionC: e.target.value })}
         className='border rounded p-2 ml-2 w-full'
      />
   </div>
   <div className='flex items-center mb-2'>
      <label htmlFor='mcqOptionA' className='ml-2 text-lg'>
        D)
        </label>
      <input
         type='text'
         id='mcqOptionD'
         value={modalData.optionD}
         onChange={e => setModalData({ ...modalData, optionD: e.target.value })}
         className='border rounded p-2 ml-2 w-full'
      />
   </div>

   </div> */}

   {/* Right Column for Image Upload */}
   <div className="w-full">
   <div className="mb-4 pl-[33px]">
         <p className="text-lg font-semibold">Question:</p>
         <input
            type="text"
            value={modalData.question}
            onChange={(e) => setModalData({ ...modalData, question: e.target.value })}
            className="border rounded p-2 w-full"
         />
      </div>
      <div className="mb-4 pl-[33px]">
         <p className="text-lg font-semibold">Question Image:</p>
         {questionImageBase64!=''?
         <div className="flex flex-row gap-6 w-full justify-start items-center overflow-hidden">
            <div className="flex ">
               <img src={questionImageBase64} className='rounded max-w-40 max-h-40' alt="base64"/>
            </div>
      <div onClick={()=>{handleimage_emppty('questionImage')}}>
           <img src={Delete} alt='delete' className="w-4 h-4 mx-2 cursor-pointer" />
         </div>
      </div>
      : <input
      type="file"
      id="questionImage"
      accept="image/*"
      onChange={(e) => handleImageUpload(e.target.files[0], 'questionImage')}
      className="border rounded p-2 w-full"
   />}
      </div>
      <div className='flex items-center mb-2'>
      <label htmlFor='optionAImage' className='ml-2 text-lg'>
         A)
      </label>
      {optionAImageBase64!=''?
      <div className="flex flex-row gap-6 w-full justify-start pl-4 items-center overflow-hidden">
      <div className="flex ">
         <img src={optionAImageBase64} className='rounded max-w-40 max-h-40' alt="base64"/>
      </div>
<div onClick={()=>{handleimage_emppty('optionAImage')}}>
     <img src={Delete} alt='delete' className="w-4 h-4 mx-2 cursor-pointer" />
   </div>
</div>
      : <input
      type='file'
      id='optionAImage'
      accept='image/*'
      onChange={e => handleImageUpload(e.target.files[0], 'optionAImage')}
      className='border rounded p-2 ml-2 w-full'
   />}
   </div>


   <div className='flex items-center mb-2'>
      <label htmlFor='optionBImage' className='ml-2 text-lg'>
         B)
      </label>
      {optionBImageBase64!=''?
      <div className="flex flex-row gap-6 w-full justify-start pl-4 items-center overflow-hidden">
      <div className="flex ">
         <img src={optionBImageBase64} className='rounded max-w-40 max-h-40' alt="base64"/>
      </div>
<div onClick={()=>{handleimage_emppty('optionBImage')}}>
     <img src={Delete} alt='delete' className="w-4 h-4 mx-2 cursor-pointer" />
   </div>
</div>
      : <input
      type='file'
      id='optionBImage'
      accept='image/*'
      onChange={e => handleImageUpload(e.target.files[0], 'optionBImage')}
      className='border rounded p-2 ml-2 w-full'
   />}
   </div>
   <div className='flex items-center mb-2'>
      <label htmlFor='optionCImage' className='ml-2 text-lg'>
         C)
      </label>{optionCImageBase64!=''?
      <div className="flex flex-row gap-6 w-full justify-start pl-4 items-center overflow-hidden">
      <div className="flex ">
         <img src={optionCImageBase64} className='rounded max-w-40 max-h-40' alt="base64"/>
      </div>
<div onClick={()=>{handleimage_emppty('optionCImage')}}>
     <img src={Delete} alt='delete' className="w-4 h-4 mx-2 cursor-pointer" />
   </div>
</div>
      : <input
      type='file'
      id='optionCImage'
      accept='image/*'
      onChange={e => handleImageUpload(e.target.files[0], 'optionCImage')}
      className='border rounded p-2 ml-2 w-full'
   />}
   </div>
   <div className='flex items-center mb-2'>
      <label htmlFor='optionDImage' className='ml-2 text-lg'>
        D)
      </label>
      {optionDImageBase64!=''?
      <div className="flex flex-row gap-6 w-full justify-start pl-4 items-center overflow-hidden">
      <div className="flex ">
         <img src={optionDImageBase64} className='rounded max-w-40 max-h-40' alt="base64"/>
      </div>
<div onClick={()=>{handleimage_emppty('optionDImage')}}>
     <img src={Delete} alt='delete' className="w-4 h-4 mx-2 cursor-pointer" />
   </div>
</div>
      : <input
      type='file'
      id='optionDImage'
      accept='image/*'
      onChange={e => handleImageUpload(e.target.files[0], 'optionDImage')}
      className='border rounded p-2 ml-2 w-full'
   />}
   </div>
      {/* Add similar code for option A, B, C, and D images */}
   </div>
</div>

{/* Rich Text Editor */}
<div className="mb-2">
   <p className="text-lg font-semibold mb-2">Passage</p>
   <ReactQuill
      value={modalData.richTextContent}
      onChange={(val) =>{ setModalData({ ...modalData, richTextContent: val })}}
      modules={{
         toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
         ],
      }}
   />
</div>




                  </form>
               }
            />
         }
         {
            pdfModalActive &&
            <Modal
               classname={'max-w-[580px] mx-auto'}
               title='Uploading PDF will replace the current PDF'
               titleClassName='pr-4'
               cancelBtn={true}
               cancelBtnClassName='w-140'
               primaryBtn={{
                  text: "Upload",
                  className: 'w-140 pl-4 pr-4',
                  form: 'add-user-form',
                  onClick: () => PdfRef.current.click(),
                  type: 'submit',
                  disabled: pdfBtnDisabled
               }}
               handleClose={() => setPdfModalActive(false)}
               body={
                  <div className="py-4">
                     <input ref={PdfRef}
                        id="pdf"
                        type="file"
                        className="hidden"
                        accept="application/pdf"
                        onChange={e => handlePDFFile(e.target.files[0])}
                     />
                  </div>
               }
            />
         }
      </>
   );
}

