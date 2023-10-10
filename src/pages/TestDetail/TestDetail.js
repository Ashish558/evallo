import React, { useEffect, useMemo, useRef, useState } from "react";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import BackIcon from "../../assets/assignedTests/back.svg";
import AddIcon from "../../assets/icons/add.svg";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
// import styles from './style.module.css'
// import { tableData } from './tempData'
import pdf from '../.././assets/images/pdf.png'
import Switch from "react-switch";
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
import { useSelector } from "react-redux";
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
   const [checked, setChecked] = useState(false);
   const [options, setoptions] = useState(['', '', '', '']);
   const [subjective_answer,setsubjective_answe]=useState();
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
   const [extratableitem, setextratableitem] = useState([]);
   

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
      // let idx = subjects.findIndex(item => item.selected === true)
const updatedQuestions = tempdata.map(question => {
   if (testData.testType==='DSAT') {
     const { AnswerChoices, ...rest } = question;
     return rest;
   }
   return question;
 });
 console.log(allQuestions[idx]);
 let updatedData
 if (testData.testType==='DSAT') {
    updatedData = allQuestions[idx].map(obj => ({
          ...obj,
          testType:testData.testType,
          QImage : obj?.QuestionImage==='no'?'No':'Yes',
          Passage : obj?.Passage==='no'?'No':'Yes',
          AImage :obj.Answers.some(it => it?.image !== 'no' && it?.image !== undefined && it?.image !== null) ? 'Yes' : 'No'
      }))
   }
  
  
      setextratableitem(updatedData);
      setQuestionsTable(updatedQuestions)
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
      let indx
      subjects.map((it,i)=>{
         if(it.selected===true){
            indx=i; 
         }
      })
      console.log(indx);
       const body = {
         subject: subjects[indx].name,
         Qno: modalData.QuestionNumber,
         update:{
               CorrectAnswer: modalData.correctAnswer,
               Concepts: modalData.concept,
               Strategies: modalData.strategy,
               AnswerChoices: 'A,B,C,D',
               QuestionText: modalData.question,
               QuestionImage:questionImageBase64,
               QuestionType: modalData.questionType,
               //AnswerChoices:'a,b,c,d',
               Answers:[
                  {
                     label: 'A',
                     text: options[0],
                     ...(optionAImageBase64 !== undefined && optionAImageBase64 !== null ? { image: optionAImageBase64 } : {})                  },
                  {
                     label: 'B',
                     text: options[1],
                     ...(optionBImageBase64 !== undefined && optionBImageBase64 !== null ? { image: optionBImageBase64 } : {})                  },
                  {
                     label: 'C',
                     text: options[2],
                     ...(optionCImageBase64 !== undefined && optionCImageBase64 !== null ? { image: optionCImageBase64 } : {})                  },
                  {
                     label: 'D',
                     text: options[3],
                     ...(optionDImageBase64 !== undefined && optionDImageBase64 !== null ? { image: optionDImageBase64 } : {})                  },
               ],
               PassageData: modalData.richTextContent,
               Passage:checked===true?'yes':'no'
            },
         };
const jsonString = JSON.stringify(body);

         // Log the JSON data in the console
         console.log("JSON Form Data:", body);
      
      setEditLoading(true)
      editQuestion({ id, reqbody: body })
         .then(res => {
            setEditLoading(false)
            setModalData(initialState)
            setoptions(['','','',''])
            setOptionAImageBase64('')
            setOptionBImageBase64('')
            setOptionCImageBase64('')
            setOptionDImageBase64('')
            setModalActive(false)
            if (res.error) return console.log('edit err', res.error);
            console.log('edit resp', res.data);
            fetchData()
         })

   }
   const handleEditTestClick = (item) => {
      let indx
      subjects.map((it,i)=>{
         if(it.selected===true){
            indx=i; 
         }
      })
      console.log('asdasdasd',subjects);
      if(allQuestions[indx][item.QuestionNumber-1].Passage!=='no'){
         setChecked(true)
      }
         setModalData(prev=>{
            return{
               ...prev,
               richTextContent:allQuestions[indx][item.QuestionNumber-1]?.PassageData,
               question:allQuestions[indx][item.QuestionNumber-1].QuestionText
            }
         })
         setQuestionImageBase64(allQuestions[indx][item.QuestionNumber-1].QuestionImage)
      if(allQuestions[indx][item.QuestionNumber-1].Answers.size!=0){
         allQuestions[indx][item.QuestionNumber-1].Answers.map((it)=>{
            console.log('dafsdfsdfs',it.label);
            if(it.label=='A'){
               setOptionAImageBase64(it?.image)
            }
            else if(it.label=='B'){
               setOptionBImageBase64(it?.image)
            }
            else if(it.label=='C'){
               setOptionCImageBase64(it?.image)
            }
            else if(it.label==='D'){
               let newArray = [...options];
               newArray[3] = it.content;
               setoptions(newArray);
               setOptionDImageBase64(it?.image)
            }
         })
         let newArray=[...options]
         allQuestions[indx][item.QuestionNumber-1].Answers.map((it,i)=>{
               newArray[i]=it.text;      
         })
         console.log(newArray,'newatrratlbjasdja');
         setoptions(newArray)
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
  const {organization}= useSelector((state)=>state.organization)
  const { firstName, lastName } = useSelector((state) => state.user);
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
const tableHeaders = [
   "Q No.",
   "Answer",
   "Concept",
   "Strategy",
   "QType",
   ...(testData.testType!=='DSAT' ? [] : ["Q. Image"]),
   ...(testData.testType!=='DSAT' ? [] : ["A. Image"]),
   ...(testData.testType!=='DSAT' ? [] : ["Passage?"]),
   ...(testData.testType!=='DSAT' ? ["Choices"] : []),
      "Edit"
]; 


const [richTextContent, setRichTextContent] = useState(""); 

   return (
      <>
         <div className="!mx-[6vw] bg-lightWhite min-h-screen">
         <p className="text-[#24A3D9]  !mt-[calc(50*0.052vw)] !mb-[calc(25*0.052vw)] text-base-20">
      <span onClick={()=>navigate('/')} className="cursor-pointer"> 
         {
           
            firstName +
            "  " +
            lastName +
            "  >  "}
             
          </span>
          <span  onClick={()=>navigate('/all-tests')} className=" cursor-pointer">{"Content > "} </span>
          <span className="font-semibold">  {testData.testName?testData.testName:"Report"}</span>
        </p>
            <div className="pb-14 pt-4  flex flex-col items-center">
               <div className="px-0 flex flex-row justify-start items-start pr-2 w-full">
                           <div className="flex mx-2 w-1/4 flex-col justify-start">
                           <p className="mb-2 text-textPrimaryDark text-[35px] min-h-[50px] font-extrabold">
                           {testData.testName?testData.testName:""}
                        </p>
                           
                           <div className="border w-full py-4 flex rounded shadow-lg justify-center items-center">
                     <AllTestDetail testData={testData} />
                        </div>
                        </div>
                     <div className=" w-2/4 mx-2 p-2 flex flex-col justify-start items-start text-left">
                        <p className="text-[35px] text-textPrimaryDark ml-4 font-extrabold">
                           Sections
                        </p>

                        <div className="gap-y-1 w-full mx-4 border rounded p-4 shadow-lg mb-10">
                           <div className="mb-2 flex justify-between ">
                              <p className="inline-block w-[170px] font-semibold opacity-60 text-[#26435F] opacity-100">
                                 {" "}
                                 Section
                              </p>
                              <div className="flex">
                              <div className="inline-block w-[120px] font-semibold opacity-60 text-[#26435F] opacity-100">
                                 Time
                              </div>
                              <p className="inline-block w-[138px] font-semibold opacity-60 text-[#26435F] opacity-100 text-center">
                                 {" "}
                                 Total Questions
                              </p>
                              </div>
                           </div>
                           <div className=" h-[158px] overflow-y-auto ">
                           {Object.keys(sectionsData).length > 1 &&
                              sectionsData.answer.subjects?.map((section) => (
                                 <div className="mb-1 flex justify-between">
                                    <p className="inline-block text-[#24A3D9] w-[170px] font-medium">
                                       {" "}
                                       {section.name}
                                    </p>
                                    <div className="flex"> 
                                    <div className="inline-block text-[#24A3D9] w-[120px] font-medium">
                                       {section.timer} mins
                                    </div>
                                    <p className="inline-block text-[#24A3D9] w-[138px] font-medium text-center">
                                       {section.totalQuestion ? section.totalQuestion : '-'}
                                    </p>
                                    </div>
                                 </div>
                              ))
                           }
                           </div>
                        </div>

                     </div>
                  {testData.testType!=='DSAT'?
                  <div className="px-6 py-[2.5rem] ml-[50px] flex  mx-2 mt-[3.8rem] w-1/4 justify-center border-[#26435F] border-dashed border-[2px] items-center flex-col rounded shadow-lg">
                           
                        {
                           Object.keys(sectionsData).length > 1 &&
                           <>
                           <img src={pdf} className="mb-4" alt="pdf"/>
                           <a className="text-[#24A3D9] text-sm  inline-block underline cursor-pointer"
                              href={sectionsData.test.pdf !== null && `${awsLink}${sectionsData.test.pdf}`} target="_blank" 
                               rel="noreferrer" 
                           // onClick={() => sectionsData.test.pdf !== null && window.open(sectionsData.test.pdf)} 
                           >
                              {sectionsData.test.pdf !== null ? `${sectionsData.test.testName}.pdf` : ''}
                           </a>
                           </>
                        }
                      <PrimaryButton
                           children='Reupload pdf'

                           disabled={pdfBtnDisabled}
                           className={`!bg-[#517CA8] px-4 py-2 text-sm mt-5 w-[120px] whitespace-nowrap font-medium !text-white`}
                           onClick={() => setPdfModalActive(true)}
                        />
                  </div>:null}
               </div>

               <div className="flex pl-2 flex-col w-full">
                  <div className="mt-6 w-fit relative flex justify-between items-end">
                     <div className="flex flex-row justify-between z-20 items-center">
                        {subjects.map((item, idx) => {
                           return (
                              <PrimaryButton
                                 children={item.name}
                                 className={`py-2.5 px-0 text-[17.5px] mr-4 bg-transparent font-normal w-fit ${item.selected
                                    ? "text-[#FFA28D] border-b-[#FFA28D] border-b-[2px]"
                                    : " text-[#26435F]"
                                    }`}
                                    roundedClass='rounded-none'
                                 onClick={() => handleSubjectChange(item._id)}
                              />
                           );
                        })}
                     </div> 
                     <div className="bg-gray-300 absolute bottom-[-1px] z-10 h-[1px] w-full"></div>

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
                        extratableitem={extratableitem}
                        tableHeaders={tableHeaders}
                        excludes={['_id']}
                        testtype={testData.testType}
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
               cancelBtnClassName='bg-white text-[#FFA28D] border border-[#FFA28D] w-140'
               title='Edit Question'
               cancelBtn={true}
               primaryBtn={{
                  text: "Save",
                  className: 'w-140 bg-[#FFA28D]',
                  form: 'add-user-form',
                  // onClick: handleSubmit,
                  type: 'submit',
                  disabled: btnDisabled,
                  loading: editLoading
               }}
               handleClose={() => { setModalActive(false); setModalData(initialState) }}
               body={
                  <form id='add-user-form' onSubmit={handleSubmit} className='px-[3px] mb-0.5 form-scroll-container'>
                     <div className='flex flex-col w-full'>
                        <div className="flex flex-row justify-between items-center">
                        <div className="min-w-[170px] px-1">
                           <InputField label='Question No.'
                              labelClassname='ml-4 mb-0.5 input-heading font-medium text-[15px]'
                              isRequired={false}
                              placeholder='Question No.'
                              inputContainerClassName='bg-[#F6F6F6] text-sm pt-3.5 pb-3.5 px-5 bg-primary-50 border-0'
                              inputClassName='bg-transparent'
                              parentClassName='w-full' type='text'
                              value={modalData.QuestionNumber}
                              disabled={true}
                              onChange={e => e.target.value}
                           />
                        </div>
                        <div className="min-w-[170px] px-1">
                           <InputSelect label='Question Type'
                              labelClassname='ml-4 mb-0.5 input-heading font-semibold text-[15px]'
                              placeholder='Select Question Type'
                              inputContainerClassName='bg-[#F6F6F6] text-sm pt-3.5 pb-3.5 px-5 bg-primary-50 border-0'
                              inputClassName='bg-transparent'
                              parentClassName='w-full' type='text'
                              value={modalData.questionType}
                              optionData={['MCQ', 'Grid-in']}
                              isRequired={true}
                              onChange={val => setModalData({ ...modalData, questionType: val })} />
                        </div>
                        <div className="min-w-[170px] px-1">
                           <InputField label='Correct Answer'
                              labelClassname='ml-4  mb-0.5 input-heading font-medium text-[15px]'
                              isRequired={true}
                              placeholder='Type Correct Answer'
                              inputContainerClassName='bg-[#F6F6F6] text-[#38C980] text-sm pt-3.5 pb-3.5 px-5 bg-primary-50 border-0'
                              inputClassName='bg-transparent'
                              parentClassName='w-full' type='text'
                              value={modalData.correctAnswer}
                              onChange={e => setModalData({ ...modalData, correctAnswer: e.target.value })} />
                        </div>
                        {testData.testType!=='DSAT'?<div className="min-w-[170px] px-1">
                           {console.log("test",{modalData})}
                           <InputField label='Answer Choices'
                              labelClassname='ml-4 mb-0.5 input-heading font-medium text-[15px]'
                              // isRequired={true}
                              placeholder='Answer Choices'
                              inputContainerClassName='bg-[#F6F6F6] text-sm pt-3.5 pb-3.5 px-5 bg-primary-50 border-0'
                              inputClassName='bg-transparent'
                              parentClassName='w-full' type='text'
                              value={modalData.AnswerChoices}
                              onChange={e => setModalData({ ...modalData, AnswerChoices: e.target.value })} />
                        </div>:null}
                        </div>
                        <div className="flex mt-4 flex-row">
                        <div className="w-1/2 p-1">
                           <InputField label='Concept'
                              labelClassname='ml-4 mb-0.5 input-heading font-medium text-[15px]'
                              isRequired={true}
                              placeholder='Concept'
                              inputContainerClassName='bg-[#F6F6F6] text-sm pt-3.5 pb-3.5 px-5 bg-primary-50 border-0'
                              inputClassName='bg-transparent'
                              parentClassName='w-full' type='text'
                              value={modalData.concept}
                              onChange={e => setModalData({ ...modalData, concept: e.target.value })} />
                        </div>
                        <div className="w-1/2 p-1">
                           <InputField label='Strategy'
                              labelClassname='ml-4 mb-0.5 input-heading font-medium text-[15px]'
                              // isRequired={true}
                              placeholder='Strategy'
                              inputContainerClassName='bg-[#F6F6F6] text-sm pt-3.5 pb-3.5 px-5 bg-primary-50 border-0'
                              inputClassName='bg-transparent'
                              parentClassName='w-full' type='text'
                              value={modalData.strategy}
                              onChange={e => setModalData({ ...modalData, strategy: e.target.value })} />
                        </div>
                        </div>
                                  </div> 
                                  <div className="w-full h-1 my-4 bg-[#00000033]">
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
   {testData.testType=='DSAT'?
   <div className="w-full mt-4">
   <div className="mb-4">
         <p className="text-[15px] mb-1 font-semibold">Add Question Content:</p>
         <div className="flex flex-row  items-center bg-[#F6F6F6] ">
         <input
            type="text"
            value={modalData.question}
            onChange={(e) => setModalData({ ...modalData, question: e.target.value })}
            className="border w-3/4 mr-4 ml-3 outline-none border-none bg-[#F6F6F6] rounded p-2"
         />
          {questionImageBase64!==undefined&&questionImageBase64!=='' && questionImageBase64!='no'?
         <div className="flex flex-row w-1/4 justify-start items-center overflow-hidden">
               <img src={questionImageBase64} className='rounded max-w-14 max-h-14 my-2' alt="base64"/>
      <div onClick={()=>{handleimage_emppty('questionImage')}}>
           <img src={Delete} alt='delete' className="w-4 cursor-pointer h-4 mx-2 cursor-pointer" />
         </div>
      </div>
      :<>
         <label htmlFor="questionImage" className="w-1/4" >
        <p className="px-2 py-1 w-fit bg-[#FFA28D] rounded cursor-pointer font-normal text-[15px]">Attach Image</p>
        </label>
      <input 
        type="file" 
        id="questionImage"
        accept="image/*"
        onChange={(e) => handleImageUpload(e.target.files[0], 'questionImage')}  
      />
      </>}
         </div>
      </div>

      {/* Rich Text Editor */}
<div className="mb-2 mt-6">
<div className="flex flex-row">
<Switch
        onChange={setChecked}
        checked={checked}
        handleDiameter={5}
        offHandleColor="#FF7979"            
        onHandleColor="#38C980"             
        height={20}
        width={40}
        uncheckedIcon={false}
        checkedIcon={false}
        id={checked?'true':null}
      />
   <p className="text-[15px] ml-4 font-normal mb-6">Enable Split Screen / Add Passage</p>
   
   </div>
   {checked?
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
:null}
</div>
<div className="w-full h-1 my-4 bg-[#00000033]">
</div>
{  console.log('moasmdoasdnasnfa',modalData)}
{modalData.questionType=='Grid-in'?
   null
:<>
      <div className='flex items-center mb-2'>
      <p className={`ml-2 rounded-full border py-1 px-3  mr-2 text-lg ${modalData.correctAnswer==='A'?'bg-[#38C980] text-white':'bg-[#F6F6F6]'}`}>
         A
      </p>
      <div className="flex flex-row w-full items-center bg-[#F6F6F6] ">
         <input
            type="text"
            value={options[0]}
            onChange={(e) => {
               let newArray = [...options];
               newArray[0] = e.target.value;
               setoptions(newArray);
            }}className="border w-3/4 cursor-pointer mr-4 ml-3 outline-none border-none bg-[#F6F6F6] rounded p-2"
         />
          {optionAImageBase64!=undefined&&optionAImageBase64!=''?
         <div className="flex flex-row w-1/4 cursor-pointer justify-start items-center overflow-hidden">
               <img src={optionAImageBase64} className='rounded max-w-14 max-h-14 my-2' alt="base64"/>
      <div onClick={()=>{handleimage_emppty('optionAImage')}}>
           <img src={Delete} alt='delete' className="w-4 h-4 mx-2 cursor-pointer" />
         </div>
      </div>
      :<>
         <label htmlFor="optionAImage" className="w-1/4" >
        <p className="px-2 py-1 w-fit bg-[#FFA28D] rounded font-normal cursor-pointer text-[15px]">Attach Image</p>
        </label>
      <input 
        type="file" 
        id="optionAImage"
        accept="image/*"
        onChange={(e) => handleImageUpload(e.target.files[0], 'optionAImage')}  
      />
      </>}
         </div>
   </div>

   <div className='flex items-center mb-2'>
      <p className={`ml-2 rounded-full border py-1 px-3  mr-2 text-lg ${modalData.correctAnswer==='B'?'bg-[#38C980] text-white':'bg-[#F6F6F6]'}`}>
         B
      </p>
      <div className="flex flex-row w-full items-center bg-[#F6F6F6] ">
         <input
            type="text"
            value={options[1]}
            onChange={(e) => {
               let newArray = [...options];
               newArray[1] = e.target.value;
               setoptions(newArray);
            }}className="border w-3/4 cursor-pointer mr-4 ml-3 outline-none border-none bg-[#F6F6F6] rounded p-2"
         />
          {optionBImageBase64!=undefined&&optionBImageBase64!=''?
         <div className="flex flex-row w-1/4 cursor-pointer justify-start items-center overflow-hidden">
               <img src={optionBImageBase64} className='rounded max-w-14 max-h-14 my-2' alt="base64"/>
      <div onClick={()=>{handleimage_emppty('optionBImage')}}>
           <img src={Delete} alt='delete' className="w-4 h-4 mx-2 cursor-pointer" />
         </div>
      </div>
      :<>
         <label htmlFor="optionBImage" className="w-1/4" >
        <p className="px-2 py-1 w-fit bg-[#FFA28D] rounded font-normal cursor-pointer text-[15px]">Attach Image</p>
        </label>
      <input 
        type="file" 
        id="optionBImage"
        accept="image/*"
        onChange={(e) => handleImageUpload(e.target.files[0], 'optionBImage')}  
      />
      </>}
         </div>
   </div>

   <div className='flex items-center mb-2'>
      <p className={`ml-2 rounded-full border py-1 px-3  mr-2 text-lg ${modalData.correctAnswer==='C'?'bg-[#38C980] text-white':'bg-[#F6F6F6]'}`}>
         C
      </p>
      <div className="flex flex-row w-full items-center bg-[#F6F6F6] ">
         <input
            type="text"
            value={options[2]}
            onChange={(e) => {
               let newArray = [...options];
               newArray[2] = e.target.value;
               setoptions(newArray);
            }}
            className="border w-3/4 cursor-pointer mr-4 ml-3 outline-none border-none bg-[#F6F6F6] rounded p-2"
         />
          {optionCImageBase64!=undefined&&optionCImageBase64!=''?
         <div className="flex flex-row w-1/4 cursor-pointer justify-start items-center overflow-hidden">
               <img src={optionCImageBase64} className='rounded max-w-14 max-h-14 my-2' alt="base64"/>
      <div onClick={()=>{handleimage_emppty('optionCImage')}}>
           <img src={Delete} alt='delete' className="w-4 h-4 mx-2 cursor-pointer" />
         </div>
      </div>
      :<>
         <label htmlFor="optionCImage" className="w-1/4" >
        <p className="px-2 py-1 w-fit bg-[#FFA28D] rounded font-normal cursor-pointer text-[15px]">Attach Image</p>
        </label>
      <input 
        type="file" 
        id="optionCImage"
        accept="image/*"
        onChange={(e) => handleImageUpload(e.target.files[0], 'optionCImage')}  
      />
      </>}
         </div>
   </div>
   <div className='flex items-center mb-2'>
      <p className={`ml-2 rounded-full border py-1 px-3  mr-2 text-lg ${modalData.correctAnswer==='D'?'bg-[#38C980] text-white':'bg-[#F6F6F6]'}`}>
         D
      </p>
      <div className="flex flex-row w-full items-center bg-[#F6F6F6] ">
         <input
            type="text"
            value={options[3]}
            onChange={(e) => {
               let newArray = [...options];
               newArray[3] = e.target.value;
               setoptions(newArray);
            }}
            className="border w-3/4 cursor-pointer mr-4 ml-3 outline-none border-none bg-[#F6F6F6] rounded p-2"
         />
          {optionDImageBase64!=undefined&&optionDImageBase64!=''?
         <div className="flex flex-row w-1/4 cursor-pointer justify-start items-center overflow-hidden">
               <img src={optionDImageBase64} className='rounded max-w-14 max-h-14 my-2' alt="base64"/>
      <div onClick={()=>{handleimage_emppty('optionDImage')}}>
           <img src={Delete} alt='delete' className="w-4 h-4 mx-2 cursor-pointer" />
         </div>
      </div>
      :<>
         <label htmlFor="optionDImage" className="w-1/4" >
        <p className="px-2 py-1 w-fit bg-[#FFA28D] rounded font-normal cursor-pointer text-[15px]">Attach Image</p>
        </label>
      <input 
        type="file" 
        id="optionDImage"
        accept="image/*"
        onChange={(e) => handleImageUpload(e.target.files[0], 'optionDImage')}  
      />
      </>}
         </div>
   </div>
   </>}
   <div className="w-full h-1 my-4 bg-[#00000033]">
</div>
      {/* Add similar code for option A, B, C, and D images */}
   </div>:null}
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
               cancelBtnClassName='bg-[#FFFFFF] text-[#FFA28D] border border-[#FFA28D] w-140'
               primaryBtn={{
                  text: "Upload",
                  className: 'w-140  bg-[#FFA28D] pl-4 pr-4',
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

