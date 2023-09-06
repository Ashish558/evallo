import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import OwlCarousel from "react-owl-carousel";

import ProfileCard from "../../../components/ProfileCard/ProfileCard";
import EditableText from "../../../components/EditableText/EditableText";
import SubjectSlider from "../../../components/SubjectSlider/SubjectSlider";
import ProfilePhoto from "./SPframes/ProfilePhoto";
import ParentEditables from "./SPframes/ParentEditables";
import clickArrowIcon from "../../../assets/YIcons/clickArrow.svg";
import ProfileImg from "../../../assets/images/profile.png";
import EditIcon from "../../../assets/icons/edit.svg";
import MailIcon from "../../../assets/icons/mail.svg";
import emailIcon from "../../../assets/icons/emailIcons.svg";
import phoneIcon from "../../../assets/icons/phoneIcon.svg";
import WhatsappIcon from "../../../assets/icons/whatsapp.svg";
import RightIcon from "../../../assets/icons/chevron-right.svg";
import LeftIcon from "../../../assets/profile/left.svg";
import ValueOneIcon from "../../../assets/images/val-1.svg";
import ValueTwoIcon from "../../../assets/images/val-2.svg";
import ValueThreeIcon from "../../../assets/images/val-3.svg";
import InterestOneIcon from "../../../assets/images/int-1.svg";
import InterestTwoIcon from "../../../assets/images/int-2.svg";
import InterestThreeIcon from "../../../assets/images/int-3.svg";

import { useLazyGetUserDetailQuery } from "../../../app/services/users";
import { useLazyGetSettingsQuery } from "../../../app/services/session";
import { BASE_URL, getAuthHeader } from "../../../app/constants/constants";
import { updateTimeZone } from "../../../app/slices/user";

import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import SPFrame1 from "./SPframes/SPFrame1";

import SPFrame0 from "./SPframes/SPFrame0";


const students = [
  {
    id: 1,
    name: "Joseph Brown",
    image: "/images/student-1.png",
  },
  {
    id: 1,
    name: "Rebecca Brown",
    image: "/images/student-2.png",
  },
];

const values = [
  {
    icon: ValueOneIcon,
    text: "Honesty",
    bg: "#A5A3F6",
  },
  {
    icon: ValueTwoIcon,
    text: "Confidence",
    bg: "#85C396",
  },
  {
    icon: ValueThreeIcon,
    text: "Brave",
    bg: "#FFA7C1",
  },
];
const interests = [
  {
    icon: InterestOneIcon,
    text: "Video Game",
    bg: "#F6D0A3",
  },
  {
    icon: InterestTwoIcon,
    text: "Cooking",
    bg: "#7BEA9A",
  },
  {
    icon: InterestThreeIcon,
    text: "Yoga",
    bg: "#AADFEB",
  },
];

const subjects = [
  "Biology",
  "Biology",
  "Chemistry",
  "Chemistry",
  "Physics",
  "Physics",
];
const subjects1 = [
  {
    marks: "-",
    name: "Verbal Score",
    bg: "#FEDCC3",
  },
  {
    marks: "-",
    name: "Maths Score",
    bg: "#DACDFF",
  },
];

const subjects2 = [
  {
    marks: "-",
    name: "Verbal",
    bg: "#FFCBCB",
  },
  {
    marks: "-",
    name: "Maths",
    bg: "#A7EAF9",
  },
  {
    marks: "-",
    name: "Verbal",
    bg: "#FFF38B",
  },
  {
    marks: "-",
    name: "Maths",
    bg: "#A4FFA7",
  },
];
export default function StudentProfile({ isOwn }) {
  const navigate = useNavigate();
  const [editable, setEditable] = useState(false);
  const dispatch = useDispatch();
  const { role: persona } = useSelector((state) => state.user);

  const [user, setUser] = useState({});
  const [userDetail, setUserDetail] = useState({});
  const [settings, setSettings] = useState({});
  const [associatedParent, setAssociatedParent] = useState({});
  const params = useParams();
  const [getUserDetail, userDetailResp] = useLazyGetUserDetailQuery();
  const [fetchSettings, settingsResp] = useLazyGetSettingsQuery();
  const [editableByTutor, setEditableByTutor] = useState(false);
  const { awsLink } = useSelector((state) => state.user);

  const { id } = useSelector((state) => state.user);
  const [selectedScoreIndex, setSelectedScoreIndex] = useState(0);
  const { organization } = useSelector((state) => state.organization);
  const [toEdit, setToEdit] = useState({
    frame0: {
     
      grade: [],
      active: false,
      firstName: "",
      lastName: "",

      schoolName: [],

      email: "",
      phone: "",
      phoneCode: "",
    },
    frame1: {
      active: false,
      timeZone: "",
      birthyear: "",
      accomodations: "",
      subscriptionCode: "",
      subscribeType: "",
      dropBoxLink:"",
      driveLink:""
    },
 
    whiteBoardLinks:{
      active: false,
      whiteBoardLinks:[]
    },
   
    aboutScore: {
      active: false,
      aboutScore: "",
    },
   
    address: {
      active: false,
      residentialAddress: "",
    },
    
    service: {
      active: false,
      service: [],
    },
    leadStatus: {
      active: false,
      leadStatus: "",
    },
    associatedParent: {
      active: false,
      associatedParent: "",
    },
    subjects: {
      active: false,
      subjects: [],
    },
    personality: {
      active: false,
      personality: [],
    },
    interest: {
      active: false,
      interest: [],
    },
   
    satScores: {
      active: false,
      satScores: [
        { created:"",
          verbal: 0,
          maths: 0,
        },
        { created:"",
          verbal: 0,
          maths: 0,
        },
        { created:"",
          verbal: 0,
          maths: 0,
        },
      ],
    },
    actScores: {
      active: false,
      actScores: [
        { created:"",
          english: 0,
          maths: 0,
          reading: 0,
          science: 0,
        },
        { created:"",
          english: 0,
          maths: 0,
          reading: 0,
          science: 0,
        },
        { created:"",
          english: 0,
          maths: 0,
          reading: 0,
          science: 0,
        },
      ],
    },
  });

  const handleClose = () => {
    setToEdit((prev) => {
      let tempToEdit = {};
      Object.keys(prev).map((key) => {
        tempToEdit[key] = { ...prev[key], active: false };
      });
      return tempToEdit;
    });
  };


  /*
const [toEdit, setToEdit] = useState({
    frame0: {
      active: false,
      firstName: "",
      lastName: "",

      schoolName: [],

      grade: [],

      email: "",
      phone: "",
      phoneCode: "",
    },
    frame1: {
      active: false,
      timeZone: "",
      birthyear: "",
    },
    // fullName: {
    //   active: false,
    //   firstName: "",
    //   lastName: "",
    // },
    timeZone: {
      active: false,
      timeZone: "",
    },
    subscribeType: {
      active: false,
      subscribeType: "",
    },
    subscriptionCode: {
      active: false,
      subscriptionCode: "",
    },
    birthYear: {
      active: false,
      birthyear: "",
    },
    aboutScore: {
      active: false,
      aboutScore: "",
    },
    // contact: {
    //   active: false,
    //   email: "",
    //   phone: "",
    //   phoneCode: "",
    // },
    address: {
      active: false,
      residentialAddress: "",
    },
    accomodations: {
      active: false,
      accomodations: "",
    },
    service: {
      active: false,
      service: [],
    },
    leadStatus: {
      active: false,
      leadStatus: "",
    },
    associatedParent: {
      active: false,
      associatedParent: "",
    },
    subjects: {
      active: false,
      subjects: [],
    },
    personality: {
      active: false,
      personality: [],
    },
    interest: {
      active: false,
      interest: [],
    },
    // schoolName: {
    //   active: false,
    //   schoolName: [],
    // },
    // grade: {
    //   active: false,
    //   grade: [],
    // },
    satScores: {
      active: false,
      satScores: [
        {
          verbal: 0,
          maths: 0,
        },
        {
          verbal: 0,
          maths: 0,
        },
        {
          verbal: 0,
          maths: 0,
        },
      ],
    },
    actScores: {
      active: false,
      actScores: [
        {
          english: 0,
          maths: 0,
          reading: 0,
          science: 0,
        },
        {
          english: 0,
          maths: 0,
          reading: 0,
          science: 0,
        },
        {
          english: 0,
          maths: 0,
          reading: 0,
          science: 0,
        },
      ],
    },
  });

  const handleClose = () => {
    setToEdit((prev) => {
      let tempToEdit = {};
      Object.keys(prev).map((key) => {
        tempToEdit[key] = { ...prev[key], active: false };
      });
      return tempToEdit;
    });
  };

  */
  useEffect(() => {
    if (persona === "admin" || persona === "parent" || isOwn) {
      setEditable(true);
    }
  }, []);

  const fetchDetails = (closeModal) => {
    let userId = "";
    if (isOwn) {
      userId = id;
    } else {
      userId = params.id;
    }
    getUserDetail({ id: userId }).then((res) => {
      console.log("details -- ", res.data.data);
      // console.log('tut id', id);
      if (res.data.data.user.assiginedTutors) {
        if (res.data.data.user.assiginedTutors?.includes(id)) {
          setEditable(true);
          setEditableByTutor(true);
        }
      }
      const { firstName, lastName, phone, phoneCode, email, associatedParent } =
        res.data.data.user;
      let {
        service,
        accomodations,
        timeZone,
        birthyear,
        personality,
        whiteBoardLinks,
        interest,
        schoolName,
        grade,
        satScores,
        actScores,
        subscriptionCode,
      } = res.data.data.userdetails;
      associatedParent &&
        getUserDetail({ id: associatedParent }).then((res) => {
          const { firstName, lastName, _id } = res.data.data.user;
          setAssociatedParent({
            firstName,
            lastName,
            _id,
            photo: res.data.data.user.photo
              ? res.data.data.user.photo
              : "/images/default.jpeg",
          });
        });
      setUser(res.data.data.user);
      if (!satScores) satScores = [];
      if (!actScores) actScores = [];
      // if (!satScores) satScores = [{
      //    verbal: 0,
      //    maths: 0
      // }]
      // if (!actScores) actScores = {
      //    english: 0,
      //    maths: 0,
      //    reading: 0,
      //    science: 0
      // }
      const promiseState = async (state) =>
        new Promise((resolve) => {
          resolve(
            setToEdit((prev) => {
              return {
                ...prev,
                frame0:{
                  ...prev.frame0,
                  firstName,
                  lastName,
                  email: email,
                  phone: phone === null ? "" : phone,
                  phoneCode: phoneCode === null ? "" : phoneCode,
                  ...prev.frame0.grade,
                  grade,
                  ...prev.frame0.schoolName,
                  schoolName,
                },
                frame1:{
                  ...prev.frame1,
                  ...prev.frame1.timeZone,
                  timeZone: timeZone ? timeZone : "",
                  ...prev.frame1.subscriptionCode,
                  subscriptionCode: subscriptionCode ? subscriptionCode : "",
                  ...prev.frame1.birthYear,
                  birthyear,
                  ...prev.frame1.accomodations,
                  accomodations: accomodations,

                },
                // fullName: {
                //   ...prev.fullName,
                //   firstName,
                //   lastName,
                // },
               
                // timeZone: {
                //   ...prev.timeZone,
                //   timeZone: timeZone ? timeZone : "",
                // },
                // subscriptionCode: {
                //   ...prev.subscriptionCode,
                //   subscriptionCode: subscriptionCode ? subscriptionCode : "",
                // },
                // contact: {
                //   ...prev.contact,
                //   email: email,
                //   phone: phone === null ? "" : phone,
                //   phoneCode: phoneCode === null ? "" : phoneCode,
                // },
                // birthYear: {
                //   ...prev.birthYear,
                //   birthyear,
                // },
                notes: {
                  ...prev.notes,
                },
                service: {
                  ...prev.service,
                  service: service ? [...service] : [],
                },
                // accomodations: {
                //   ...prev.accomodations,
                //   accomodations: accomodations,
                // },
                personality: {
                  ...prev.personality,
                  personality: personality,
                },
                whiteBoardLinks: {
                  ...prev.whiteBoardLinks,
                  whiteBoardLinks: whiteBoardLinks,
                },
                interest: {
                  ...prev.interest,
                  interest,
                },
                // schoolName: {
                //   ...prev.schoolName,
                //   schoolName,
                // },
                // grade: {
                //   ...prev.grade,
                //   grade,
                // },
                satScores: {
                  ...prev.satScores,
                  satScores: satScores,
                },
                actScores: {
                  ...prev.actScores,
                  actScores: actScores,
                },
              };
            })
          );
        });
      promiseState().then(() => {
        closeModal && handleClose();
      });
      setUserDetail(res.data.data.userdetails);
    });
  };

  useEffect(() => {
    fetchDetails();
  }, [params.id]);

  useEffect(() => {
    fetchSettings().then((res) => {
      if (res.error) {
        console.log("settings fetch err", res.error);
        return;
      }
      setSettings(res.data.data.setting);
    });
  }, []);
 // console.log({ userDetail, settings });
  const handleProfilePhotoChange = (file) => {
    // console.log(file)
    let url = "";
    const formData = new FormData();
    formData.append("photo", file);
    if (persona === "admin" || persona === "parent") {
      url = `${BASE_URL}api/user/admin/addphoto/${params.id} `;
    } else {
      url = `${BASE_URL}api/user/addphoto`;
    }
    axios.patch(url, formData, { headers: getAuthHeader() }).then((res) => {
      console.log("photo res", res);
      fetchDetails();
    });
  };

  const getSatMarks = (idx) => {
    // let scores = [
    //    userDetail.satScores.verbal,
    //    userDetail.satScores.maths
    // ]
    // scores =  scores.filter(score => !isNaN(score))
    // console.log(scores);
    let res = 0;
    if (
      typeof userDetail.satScores[idx]?.verbal === "number" &&
      typeof userDetail.satScores[idx]?.maths
    ) {
      res =
        userDetail.satScores[idx]?.verbal + userDetail.satScores[idx]?.maths;
    }
    if (isNaN(res)) return 0;
    return res;
  };

  const getActMarks = (idx) => {
    // let scores = [
    //    userDetail.satScores.verbal,
    //    userDetail.satScores.maths
    // ]
    // scores =  scores.filter(score => !isNaN(score))
    // console.log(scores);
    let res = 0;
    if (
      typeof userDetail.actScores[idx]?.maths &&
      typeof userDetail.actScores[idx]?.english &&
      typeof userDetail.actScores[idx]?.reading &&
      typeof userDetail.actScores[idx]?.science
    ) {
      res =
        (userDetail.actScores[idx]?.english +
          userDetail.actScores[idx]?.maths +
          userDetail.actScores[idx]?.reading +
          userDetail.actScores[idx]?.science) /
        4;
    }
    if (isNaN(res)) return 0;
    return res;
  };

  useEffect(() => {
    // console.log(userDetail.timeZone);
    if (userDetail.timeZone === undefined) return;
    dispatch(updateTimeZone({ timeZone: userDetail.timeZone }));
  }, [userDetail.timeZone]);

  // console.log(user)
  // console.log(userDetail)
  // console.log('associatedParent', associatedParent)
  // console.log('isEditable', editable)
  // console.log(settings)

  if (Object.keys(user).length < 1) return;
  if (Object.keys(userDetail).length < 1) return;
  if (Object.keys(settings).length < 1) return;

  return (
    <>
      <div className={`mx-[80px] min-h-screen design:mx-[160px] pb-[70px]`}>
        <p className="text-[#24A3D9] !my-[calc(50*0.0522vw)]">
          {organization?.company +
            " > " +
            user?.firstName +
            " " +
            user?.lastName +
            " > "}
          <span className="font-semibold">Dashboard</span>
        </p>

        <div className={` rounded-b-md w-full flex flex-col relative `}>
          <div className="flex gap-7"> 
            <div className={` rounded-b-md w-full flex flex-col relative `}>

         
          <div className=" bg-[#26435F]   px-5 h-[100px]  w-full  flex  items-center">
            {!isOwn ? (
              <button
                className="absolute bg-[#D9BBFF] px-[14px] py-[8px] rounded-[8px] text-[#636363] text-[18px] font-medium top-[16px] left-[22px] flex gap-[12px] cursor-pointer flex justify-center items-center"
                onClick={() => window.history.back()}
              >
                <img src={LeftIcon} alt="icon" /> Back
              </button>
            ) : (
              <></>
            )}
            <div className="flex flex-1 w-full">
              <ProfilePhoto
                src={
                  user.photo
                    ? `${awsLink}${user.photo}`
                    : "/images/default.jpeg"
                }
                imgSizeClass="!w-[110px] !h-[110px] !translate-y-8 border-[4px] border-white "
                imageClassName="!w-[100px] !h-[100px] border-[4px] border-white "
                className=""
                handleChange={handleProfilePhotoChange}
                editable={false}
              />
              <div className="flex-1 flex justify-between items-center">
                <div className="ml-4 my-auto">
                  <div className="flex  items-center text-[#F3F5F7]">
                    {user.firstName} {user.lastName}
                    <EditableText
                      editable={editable}
                      onClick={() =>
                        setToEdit({
                          ...toEdit,
                         
                          frame0:{
                            ...toEdit.frame0,active:true
                          }
                        })
                      }
                      text="edit"
                      textClassName=" ml-2 text-sm text-[#517CA8] text-underline  "
                      className="text-sm my-0 flex justify-end   float-right"
                    />
                  </div>
                  <div className="flex mt-1 text-xs items-center text-[#F3F5F7]">
                  <p>
                          <span>
                            <img
                              className="inline-block !w-4 !h-4 mr-2"
                              src={emailIcon}
                            />
                          </span>
                          {user?.email}
                        </p>
</div>
                </div>

                <div className="flex flex-col text-[12px]  font-medium text-white my-auto ">
                  <ProfileCard
                    className="lg:mt-0 flex-1 !bg-transparent h-min !shadow-none relative"
                    titleClassName="!bg-transparent"
                    title={
                      <EditableText
                        editable={editable}
                        onClick={() =>
                          setToEdit({
                            ...toEdit,
                            contact: { ...toEdit.contact, active: true },
                          })
                        }
                        imgClass="!bg-transparent"
                        className=" !bg-transparent absolute right-0 top-[50%]"
                      />
                    }
                    body={
                      <div className="flex h-min !bg-transparent justify-center flex-col  ">
                        <p>
                          <span>
                            <img
                              className="inline-block !w-4 !h-4 mr-2"
                              src={emailIcon}
                            />
                          </span>
                          {user?.email}
                        </p>
                        <p>
                          <span>
                            <img
                              className="inline-block !w-4 !h-4 mr-2"
                              src={phoneIcon}
                            />
                          </span>
                          {user?.phone}
                        </p>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
           
          </div>
          <div className="bg-white !rounded-b-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] flex  h-[100px] justify-between ">
            <div className="ml-[126px] flex my-auto py-auto w-4/5 text-[12px] px-5  flex-1 h-full  pt-5  ">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod empor incididunt ut labore et dolore gna aliqua. Ut enim
              ad minim veniam, nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo cnsquat duis aute irure dolor inerit in
              voluptate orem ipsum dolor sit amet, consectetur adipiscing elit.
              Ut enim ad minim veniam,
            </div>
           
          </div>
          </div>
          <div className="w-[200px] bg-white rounded-md overflow-hidden">
            <div className="bg-[#26435F] h-[100px]">
            <div className="flex justify-center items-center">
                <ProfilePhoto
                  src={
                    associatedParent.photo
                      ? `${awsLink}${associatedParent.photo}`
                      : "/images/default.jpeg"
                  }
                  imgSizeClass="!w-[70px] !h-[70px] !translate-y-[15px]"
                  imageClassName="!w-[50px] !h-[50px] border-[2px] border-[#26435F]"
                  className=" "
                  handleChange={handleProfilePhotoChange}
                />
              </div>
            </div>
          </div>
          </div>
          <EditableText
            editable={editable}
            onClick={() =>
              setToEdit({
                ...toEdit,
                frame1: {
                  ...toEdit.frame1,
                  active: true,
                },
              })
            }
            text="edit"
            textClassName="text-sm text-[#517CA8] text-underline  "
            className="text-sm my-0 flex justify-end translate-y-7  float-right"
          />
          <SPFrame0 userDetail={userDetail}  settings={settings} toEdit={toEdit} setToEdit={setToEdit}/>

          <SPFrame1
            userDetail={userDetail}
            settings={settings}
            userId={isOwn ? id : params.id}
            editable={editable}
            fetchDetails={fetchDetails}
            setToEdit={setToEdit}
            toEdit={toEdit}
          />
        
         
        </div>

       
      </div>
      <ParentEditables
        settings={settings}
        fetchDetails={fetchDetails}
        userId={isOwn ? id : params.id}
        toEdit={toEdit}
        user={user}
        editable={editable}
        setToEdit={setToEdit}
        persona={user.role}
        awsLink={awsLink}
        selectedScoreIndex={selectedScoreIndex}
      />
    
    </>
  );
}
