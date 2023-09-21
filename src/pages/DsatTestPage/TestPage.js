import React from "react";
import Navbar from "./Navbar";
import Foot from "./Foot";
import { useEffect, useState } from "react";
import Que from "./Questions";
import axios from "axios";
import { BASE_URL, getAuthHeader } from "../../app/constants/constants";
import { useParams } from "react-router-dom/dist";
import {
  useLazyGetQuestionQuery,
  useSubmitTestMutation,
} from "../../app/services/test";
import LoaderPage from "../../components/TestItem/LoaderPage";
export default function TestPage() {
  const [getQue, GetQueRes] = useLazyGetQuestionQuery();
  const [info, setInfo] = useState([]);
  const [opt, setOpt] = useState([]);
  const [background, setbackground] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [sectionindex, setsectionindex] = useState(0);
  const [index, setIndex] = useState(0);
  const [data, setdata] = useState([]);
  const [submitSection, submitSectionResp] = useSubmitTestMutation();
  const [toggle2,setToggle2] =useState(false)
  const [seconds, setSeconds] = useState(0);
  const [cutanswer, setcutanswer] = useState([]);
  const [markreview, setmarkreview] = useState([]);
  const [sectionDetails, setSectionDetails] = useState();
  const [cutcheck,setcutcheck] = useState(false);
  const[cal,setCal] = useState(false)
  const[loader,setloader] = useState(false)  
  const { id } = useParams();
  const data2 = [
    {
      paragraph:
        "<p>Lake Baikal is the world's deepest lake, located in Siberia, Russia. It is also the world's oldest and most voluminous lake by volume. The lake is home to a unique ecosystem and is a UNESCO World Heritage Site.</p>",
      question: "What is the world's deepest lake?",
      options: [
        "Lake Baikal",
        "Lake Tanganyika",
        "Lake Superior",
        "Lake Michigan",
      ],
    },
    {
      paragraph:
        "<p>Mount Everest is the world's highest mountain, located in the Himalayas between Nepal and China. It is 29,031 feet (8,848 meters) tall. The mountain is a popular destination for mountaineers from all over the world.</p>",
      question: "What is the world's highest mountain?",
      options: ["Mount Everest", "K2", "Aconcagua", "Mauna Kea"],
    },
    {
      paragraph:
        "<p>The Nile River is the world's longest river, flowing through 11 countries in Africa. It is 4,132 miles (6,650 kilometers) long. The river is an important source of water for irrigation and transportation.</p>",
      question: "What is the world's longest river?",
      options: [
        "The Nile River",
        "The Amazon River",
        "The Yangtze River",
        "The Yellow River",
      ],
    },
    {
      paragraph:
        "<p>The Sahara Desert is the world's largest desert, covering most of North Africa. It is 3.5 million square miles (9.1 million square kilometers) in size. The desert is home to a variety of animals and plants that have adapted to the harsh conditions.</p>",
      question: "What is the world's largest desert?",
      options: [
        "The Sahara Desert",
        "The Arctic Desert",
        "The Antarctic Desert",
        "The Arabian Desert",
      ],
    },
    {
      paragraph:
        "<p>The Amazon rainforest is the world's largest rainforest, covering most of northwestern South America. It is 2.1 million square miles (5.4 million square kilometers) in size. The rainforest is home to a vast variety of plants and animals, including many that are found nowhere else in the world.</p>",
      question: "What is the world's largest rainforest?",
      options: [
        "The Amazon rainforest",
        "The Congo rainforest",
        "The Sumatran rainforest",
        "The Borneo rainforest",
      ],
    },
    {
      paragraph:
        "<p>The Pacific Ocean is the world's largest ocean, covering about one-third of the Earth's surface. It is 165,250,000 square miles (427,075,000 square kilometers) in size. The ocean is home to a vast variety of marine life, including many that are found nowhere else in the world.</p>",
      question: "What is the world's largest ocean?",
      options: [
        "The Pacific Ocean",
        "The Atlantic Ocean",
        "The Indian Ocean",
        "The Arctic Ocean",
      ],
    },
    {
      paragraph:
        "<p>Greenland is the world's largest island, located in the North Atlantic Ocean. It is 836,000 square miles (2,175,600 square kilometers) in size. The island is covered in ice and snow, and is home to a variety of wildlife, including polar bears, seals, and whales.</p>",
      question: "What is the world's largest island?",
      options: ["Greenland", "New Guinea", "Borneo", "Madagascar"],
    },
    {
      paragraph:
        "<p>China is the world's most populous country, with a population of over 1.4 billion people. It is located in East Asia. The country is home to a vast variety of cultures and languages.</p>",
      question: "What is the world's most populous country?",
      options: ["China", "India", "United States", "Indonesia"],
    },
  ];

  function MarkAnswer(QuestionNumber, correctAnswer) {
    const updatedanswer = answers.map((q) =>
      q.QuestionNumber === QuestionNumber
        ? {
            ...q,
            ResponseAnswer:
              correctAnswer === 0
                ? "A"
                : correctAnswer === 1
                ? "B"
                : correctAnswer === 2
                ? "C"
                : correctAnswer === 3
                ? "D"
                : null,
          }
        : q
    );
    setAnswers(updatedanswer);
  }

    function showcutcheck(){
      setcutcheck(!cutcheck)
      console.log(cutcheck);
    }

    function cutanswers(QuestionNumber, correctAnswer,optionno) {
         const updateddata = cutanswer.map((q) =>
      q.QuestionNumber === QuestionNumber
        ? {
            ...q,
           markcut: q.markcut.map((val, index) => 
           index === correctAnswer ? (val === 1 ? 0 : 1) : val
         )
       }
        : q
    );
    setcutanswer(updateddata);
        }

  function markshadow() {
    setbackground(!background);
  }

  let tog2 =()=>
   {
    setToggle2(!toggle2)
    markshadow();
   }

  const fetchApi = () => {
    setloader(true)
    getQue({ id }).then((res) => {
      if (res.error) return console.log("testerror", res.error);
      setdata(res.data.data.answer.subjects)
      setSeconds(res.data.data.answer.subjects[sectionindex].timer*60)
      setSectionDetails(res.data.data.answer.subjects[sectionindex])
      setInfo(res.data.data.answer.answer[sectionindex]);
      let dataofque, newData,cutdata;
      dataofque = res.data.data.answer.answer[sectionindex];
      newData = dataofque.map((item) => ({
        QuestionType: item.QuestionType,
        QuestionNumber: item.QuestionNumber,
        ResponseAnswer: "",
        responseTime: "10",
      }));
      cutdata = dataofque.map((item) => ({
        QuestionNumber:item.QuestionNumber,
        markcut:new Array(4).fill(0)
      }));
      let markr=dataofque.map((item) => ({
        QuestionNumber:item.QuestionNumber,
        review:false
      }));
      setmarkreview(markr)
      setAnswers(newData);
      setcutanswer(cutdata)
      setloader(false)
    });
  };


  const size = Object.keys(info).length;

  let handle = () => {
    setIndex(index + 1);
  };


  let prev = () => {
    setIndex(index - 1);
  };


  function next_section() {
    setsectionindex(sectionindex + 1);
  }

  
  useEffect(() => {
    if (seconds <= 0) {
      return handleSubmitSection();
    }

    const interval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  const handleSubmitSection = () => {
    //id of test
    var submitId = "64fb1f5c68528c79b20b45dd";
    const response = answers;
    let body = {
      submitId,
      reqbody: {
        sectionName: data[sectionindex]?.name,
        response: response,
      },
    };
    submitSection(body).then((res) => {
      if (res.error) {
        return console.log(res.error);
      }
      console.log(res.data);
    });
    console.log(data.length);
    if(sectionindex<data.length-1)
    setsectionindex(sectionindex + 1);
    setIndex(0)
    if(toggle2)
    tog2()
  };

  function  markre(QuestionNumber) {
    const updatedanswer = markreview.map((q) =>
      q.QuestionNumber === QuestionNumber
        ? {
           ...q,
           review:!q.review
          }
        : q
    );
    setmarkreview(updatedanswer);
  }


  useEffect(() => {
    fetchApi();
  }, [sectionindex]);

  useEffect(() => {
console.log(sectionDetails,'asdasdasd');  }, [sectionDetails]);
const arr = new Array(size)
arr.fill(false)
const [pages,setPage]=useState(arr)
  return (
    <div className=" relative ">
     {loader? <LoaderPage/>
     :
     <>
      <Navbar seconds={seconds} sectionDetails={data[sectionindex]} cal={cal} setCal={setCal} />
      <Que
        markreview={markreview}
        markre={markre}
        cutcheck={cutcheck}
        showcutcheck={showcutcheck}
        cutanswer={cutanswer}
        cutanswers={cutanswers}
        check={background}
        MarkAnswer={MarkAnswer}
        ques={info[index] ? info[index].QuestionText : ""}
        index={index + 1}
        op={info[index] ? info[index].Answers : null}
        para={info[index] ? info[index].Passage : ""}
        Setmark={setPage} 
        cal={cal}
        mark={pages}
      />
      <Foot
      markreview={markreview}
      index={index}
      cutcheck={cutcheck}
      tog2={tog2}
      toggle2={toggle2}
        next_section={next_section}
        markshadow={markshadow}
        handleSubmitSection={handleSubmitSection}
        next={handle}
        prev={prev}
        set={setIndex ? setIndex : ""}
        data={info ? info : null}
        s={size}
        i={index + 1}
        mark={pages}
      />
      </>
  }
    </div>
  );
}
