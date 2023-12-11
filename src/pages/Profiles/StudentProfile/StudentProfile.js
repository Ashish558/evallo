import { useEffect, useState } from "react";
import styles from "./style.module.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import OwlCarousel from "react-owl-carousel";
import copy1 from "../../../assets/YIcons/VectorCopy.svg";
import copy2 from "../../../assets/YIcons/fluent_copy-16-filledBlackCopy.svg";

import ProfileCard from "../../../components/ProfileCard/ProfileCard";
import EditableText from "../../../components/EditableText/EditableText";
import SubjectSlider from "../../../components/SubjectSlider/SubjectSlider";
import ProfilePhoto from "./SPframes/ProfilePhoto";
import ParentEditables from "./SPframes/ParentEditables";
import clickArrowIcon from "../../../assets/YIcons/clickArrow.svg";
import emailIcon from "../../../assets/icons/emailIcons.svg";
import phoneIcon from "../../../assets/icons/phoneIcon.svg";
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
import SPFrame2 from "./SPframes/SPFrame2";
import SPFrame0 from "./SPframes/SPFrame0";

import SPFrame3 from "./SPframes/SPFrame3";
import SPFrame4 from "./SPframes/SPFrame4";
import AllTests from "../../AllTests/AllTests";

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
  ////console.log({isOwn})
  const navigate = useNavigate();
  const [editable, setEditable] = useState(false);
  const dispatch = useDispatch();
  const { role: persona } = useSelector((state) => state.user);
  const [totalTest, setTotaltest] = useState(0)
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
  const { firstName, lastName } = useSelector((state) => state.user);
  async function handleCopyClick(textToCopy) {
    console.log("copying", textToCopy);
    try {
      await navigator.clipboard.writeText(textToCopy);
      //  alert('Text copied to clipboard');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }
  const [toEdit, setToEdit] = useState({
    frame0: {

      grade: [],
      active: false,
      firstName: "",
      lastName: "",
      associatedParent: "",
      schoolName: [],
      about: '',
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
      dropBoxLink: "",
      driveLink: ""
    },

    whiteBoardLinks: {
      active: false,
      whiteBoardLinks: []
    },

    aboutScore: {
      active: false,
      aboutScore: "",
    },
    baseLineScore: {
      active: false,
      baseLineScore: {
        satBaseLineScore:
        {
          created: "",
          cumilativeScore: 0,
          verbal: 0,
          maths: 0,

        },
        actBaseLineScore:
        {
          created: "",
          cumilativeScore: 0,
          english: 0,
          maths: 0,
          reading: 0,
          science: 0,
        },
      },
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
    notes: {
      active: false,
      notes: "",
    },
    interest: {
      active: false,
      interest: [],
    },

    satScores: {
      active: false,
      satScores: [
        {
          createdAt: "",
          verbal: 0,
          maths: 0,
        },
        {
          createdAt: "",
          verbal: 0,
          maths: 0,
        },
        {
          createdAt: "",
          verbal: 0,
          maths: 0,
        },
      ],
    },
    actScores: {
      active: false,
      actScores: [
        {
          createdAt: "",
          english: 0,
          maths: 0,
          reading: 0,
          science: 0,
        },
        {
          createdAt: "",
          english: 0,
          maths: 0,
          reading: 0,
          science: 0,
        },
        {
          createdAt: "",
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
      Object.keys(prev)?.map((key) => {
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
      Object.keys(prev)?.map((key) => {
        tempToEdit[key] = { ...prev[key], active: false };
      });
      return tempToEdit;
    });
  };

  */
 const [session_no, setsession_no] = useState(0)
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
      console.log("student details -- ", userId, res);
      if (!res?.data?.data) return
      // //console.log('tut id', id);
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
        about,
        baseLineScore,
        subjects,
        subscriptionCode,
      } = res.data.data.userdetails;
      associatedParent &&
        getUserDetail({ id: associatedParent }).then((res2) => {
          console.log("student ", { [id]: res2 })
          if (res2?.error) return
          const { firstName, lastName, _id, email } = res2.data.data.user;
          setAssociatedParent({
            firstName,
            lastName,
            _id,
            email,
            photo: res2?.data?.data?.user?.photo?.length > 0
              ? res2.data.data.user.photo
              : null,
          });
        });
      //   setAssociatedParent(res?.data?.data?.parent)
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
                frame0: {
                  ...prev.frame0,
                  firstName,
                  lastName,
                  email: email,
                  phone: phone === null ? "" : phone,
                  phoneCode: phoneCode === null ? "" : phoneCode,
                  ...prev.frame0.grade,
                  grade,
                  associatedParent,
                  ...prev.frame0.schoolName,
                  schoolName,
                  about,
                },
                frame1: {
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
                baseLineScore: {
                  ...prev.baseLineScore,
                  baseLineScore: baseLineScore,
                },
                whiteBoardLinks: {
                  ...prev.whiteBoardLinks,
                  whiteBoardLinks: whiteBoardLinks,
                },
                interest: {
                  ...prev.interest,
                  interest,
                },
                subjects: {
                  ...prev.subjects,
                  subjects,
                },
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
        //console.log("settings fetch err", res.error);
        return;
      }
      setSettings(res.data.data.setting);
    });
  }, []);
  // //console.log({ userDetail, settings });
  const handleProfilePhotoChange = (file) => {
    // //console.log(file)
    let url = "";
    const formData = new FormData();
    formData.append("photo", file);
    if (persona === "admin" || persona === "parent") {
      url = `${BASE_URL}api/user/admin/addphoto/${params.id} `;
    } else {
      url = `${BASE_URL}api/user/addphoto`;
    }
    axios.patch(url, formData, { headers: getAuthHeader() }).then((res) => {
      //console.log("photo res", res);
      fetchDetails();
    });
  };

  const getSatMarks = (idx) => {
    // let scores = [
    //    userDetail?.satScores.verbal,
    //    userDetail?.satScores.maths
    // ]
    // scores =  scores.filter(score => !isNaN(score))
    // //console.log(scores);
    let res = 0;
    if (
      typeof userDetail?.satScores[idx]?.verbal === "number" &&
      typeof userDetail?.satScores[idx]?.maths
    ) {
      res =
        userDetail?.satScores[idx]?.verbal + userDetail?.satScores[idx]?.maths;
    }
    if (isNaN(res)) return 0;
    return res;
  };

  const getActMarks = (idx) => {
    // let scores = [
    //    userDetail?.satScores.verbal,
    //    userDetail?.satScores.maths
    // ]
    // scores =  scores.filter(score => !isNaN(score))
    // //console.log(scores);
    let res = 0;
    if (
      typeof userDetail?.actScores[idx]?.maths &&
      typeof userDetail?.actScores[idx]?.english &&
      typeof userDetail?.actScores[idx]?.reading &&
      typeof userDetail?.actScores[idx]?.science
    ) {
      res =
        (userDetail?.actScores[idx]?.english +
          userDetail?.actScores[idx]?.maths +
          userDetail?.actScores[idx]?.reading +
          userDetail?.actScores[idx]?.science) /
        4;
    }
    if (isNaN(res)) return 0;
    return res;
  };

  useEffect(() => {
    // //console.log(userDetail?.timeZone);
    if (userDetail?.timeZone === undefined) return;
    dispatch(updateTimeZone({ timeZone: userDetail?.timeZone }));
  }, [userDetail?.timeZone]);

  const handleCopy = text => {
    navigator.clipboard.writeText(text);
  }
  const handleParentNavigate = () => {
    if (associatedParent) {
      navigate(`/profile/parent/${associatedParent?._id}`)
    }
  }
  // //console.log(user)
  console.log("user student", { userDetail, user })
  //console.log('associatedParent', associatedParent)
  // //console.log('isEditable', editable)
  // //console.log(settings)

  if (Object.keys(user).length < 1) return;
  // if (Object.keys(userDetail).length < 1) return;
  if (Object.keys(settings).length < 1) return;

  return (
    <>
      <div className={`w-[1600px] mx-auto pb-[70px]`}>
        <p className="text-[#24A3D9] mt-[50px] mb-[30px] text-base-22-5">
          {persona === "admin" ?
            <span >
              <span className="cursor-pointer" onClick={() => navigate('/')}>
                {organization?.company +
                  "  >  " +
                  firstName +
                  "  " +
                  lastName
                }  </span>
              <span className="cursor-pointer" onClick={() => navigate('/users')}>{"  >  CRM > "}</span>

              <span className="font-semibold">{
                user?.firstName +
                " " +
                user?.lastName}</span>
            </span> :
            <span>
              <span onClick={() => navigate('/')} className="cursor-pointer">
                {organization?.company +
                  " > " +
                  user?.firstName +
                  " " +
                  user?.lastName +
                  " > "}
              </span>
              <span className="font-semibold">Profile</span>
            </span>
          }
        </p>
        {/* {!isOwn ? (
          <button
            className="my-5 bg-primary text-white cursor-pointer relative z-[50] px-[14px] py-[8px] rounded-[8px]  text-[18px] font-medium top-[-8px] left-[0px] flex gap-[12px] cursor-pointer flex justify-center items-center"
            onClick={() => window.history.back()}
          >
            <img className="w-4 h-4" src={LeftIcon} alt="icon" /> Back
          </button>
        ) : (
          <></>
        )} */}
        <div className={` rounded-b-md w-full flex flex-col relative `}>
          <div className=" bg-[#26435F] rounded-t-[5px]  px-[52px] h-[142px] design:!h-[142px] w-full  flex  items-center">

            <div className="flex flex-1 w-full design:!h-[70px]">
              <div className="h-fit design:!ml-5 relative">
                <ProfilePhoto
                  src={
                    user.photo
                      ? `${awsLink}${user.photo}`
                      : "/images/Rectangle 2346.svg"
                  }
                  imgSizeClass="!w-[174px] !h-[174px] design:!w-[174px] design:!h-[174px]  !translate-y-[73px]  design:!translate-y-5   "
                  imageClassName="!w-[174px] !h-[174px] border-[4px] border-white "
                  className="relative"
                  handleChange={handleProfilePhotoChange}
                  editable={false}
                />
                {(persona !== "tutor" || (persona === "tutor" && organization?.settings?.permissions && organization?.settings?.permissions[1]?.choosedValue)) && <EditableText
                  editable={editable}
                  onClick={() =>
                    setToEdit({
                      ...toEdit,

                      frame0: {
                        ...toEdit.frame0, active: true
                      }
                    })
                  }
                  text="Edit Profile"
                  textClassName=" ml-2   mx-auto text-center text-[#26435F] text-underline text-base-15 font-semibold"
                  className=" my-0 flex items-center justify-center text-center   absolute -bottom-[60%] design:-bottom-[35%] left-[34px]"
                />}
              </div>
              <div className="flex-1 flex justify-between  items-center">
                <div className="ml-4 my-auto design:-translate-y-4">
                  <div className="flex  items-center font-semibold text-[#F3F5F7] text-[30px]">
                    {user.firstName} {user.lastName}

                  </div>
                  <div className="flex text-[17.5px]  items-center text-[#F3F5F7]">
                    {userDetail?.schoolName
                      ? userDetail?.schoolName
                      : "Sample School Name"}
                  </div>
                  <div className="flex  text-[17.5px] mt-1 items-center text-[#F3F5F7]">
                    {userDetail?.grade ? userDetail?.grade + `${' '} Grade` : "12th Grade"}

                    {/* <p className='font-semibold text-[22px] mr-4'>
                           {userDetail?.grade}
                        </p> */}

                    {/* <p className='font-semibold text-[22px]'>
                           {userDetail?.schoolName}
                        </p> */}
                  </div>
                </div>

                {(persona !== 'tutor') && <div className="flex flex-col text-[12px]  font-medium text-white my-auto ">
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
                      <div className="flex h-min !bg-transparent justify-center flex-col text-base-17-5 ">
                        <p>
                          <span>
                            <img
                              className="inline-block  w-[24px] h-[18px] mr-2 cursor-pointer "
                              src={emailIcon}
                              alt="email"
                            />
                          </span>
                          {user?.email}
                          <span>
                            <img
                              onClick={() => handleCopyClick(user?.email)}
                              className="inline-block ml-2 w-[10.94px] h-[13.13px] mr-2 cursor-pointer"
                              src={copy1}
                              alt="copy"

                            />
                          </span>
                        </p>
                        <p className="ml-[2px] mt-1">
                          <span className=" ">
                            <img
                              className="inline-block  w-[24px] h-[18px] mr-2 cursor-pointer"
                              src={phoneIcon}
                              alt="phone"
                            />
                          </span>
                          {user?.phone}
                        </p>
                      </div>
                    }
                  />
                </div>}
                {(persona === 'tutor') && organization?.settings?.permissions && organization?.settings?.permissions[1]?.choosedValue && <div className="flex flex-col text-[12px]  font-medium text-white my-auto ">
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
                              alt="email"
                            />
                          </span>
                          {user?.email}
                          <span>
                            <img
                              onClick={() => handleCopyClick(user?.email)}
                              className="inline-block ml-2 !w-4 !h-4 mr-2 cursor-pointer"
                              src={copy1}
                              alt="copy"
                            />
                          </span>
                        </p>
                        <p>
                          <span>
                            <img
                              className="inline-block !w-4 !h-4 mr-2"
                              src={phoneIcon}
                              alt="phone"
                            />
                          </span>
                          {user?.phone}
                        </p>
                      </div>
                    }
                  />
                </div>}
              </div>
            </div>
          </div>
          <div className="bg-white   !rounded-b-5 shadow-[0px_0px_2.500001907348633px_0px_#00000040] flex  h-[170px] design:!h-[170px] justify-between ">

            <div className="ml-[223px] design:!ml-[248px] flex my-auto py-auto w-4/5 text-[12px] px-5  flex-1 h-full   overflow-y-auto custom-scroller pt-5  text-[#517CA8] text-base-17-5 ">
              {userDetail?.about}
            </div>
            <div className="min-w-[250px] ml-6 design:!ml-0  my-0 relative">
              <div className="flex items-center absolute top-[20%] -left-[25%]">
                <ProfilePhoto
                  src={
                    associatedParent?.photo
                      ? `${awsLink}${associatedParent?.photo}`
                      : "/images/Rectangle 2347.svg"
                  }
                  imgSizeClass="!w-[60px] !h-[60px]   border-[2px] border-[#26435F]"
                  imageClassName="!w-[50px] !h-[50px] "
                  className=" "
                  handleChange={handleProfilePhotoChange}
                />
                <div className="flex flex-col ml-5 text-[#24A3D9] ">
                  <a
                  href={`/profile/parent/${associatedParent?._id}`}
                    // onClick={() =>
                    //   associatedParent?._id > 0 &&
                    //   navigate(`/profile/parent/${associatedParent?._id}`)
                    // }
                    className=" cursor-pointer text-base-20 "
                  >

                    {associatedParent && Object.keys(associatedParent)?.length > 1
                      ? `${associatedParent?.firstName} ${associatedParent?.lastName}`
                      : `None`}
                    <img
                      src={clickArrowIcon}
                      className="!ml-2 cursor-pointer !w-3 !h-3 inline-block"
                      alt="arrow"
                    />
                  </a>

                  {(persona !== "tutor" || (persona === 'tutor' && organization?.settings?.permissions && organization?.settings?.permissions[1]?.choosedValue)) && <p className="font-medium ">
                    <span
                      className="text-base-15 cursor-pointer   inline-block mr-1 text-[#7C98B6]"

                    // 
                    >
                      {associatedParent && Object.keys(associatedParent)?.length > 1
                        ? `${associatedParent?.email}`
                        : `None `}
                      {/* View Profile */}
                      <span>
                        <img
                          onClick={() => handleCopyClick(associatedParent && Object.keys(associatedParent).length > 1
                            ? `${associatedParent?.email}`
                            : `None`)}
                          className="inline-block ml-2 !w-4 !h-4 mr-2 cursor-pointer"
                          src={copy2}
                          alt="copy"
                        />
                      </span>
                    </span>
                  </p>}
                </div>
              </div>


            </div>
            <div className="flex flex-col items-center mb-3">
              {/* <p className='text-lg text-center text-primary font-semibold mb-5 text-[21px]'>Associated Parent</p> */}
              <EditableText
                editable={persona === "admin" ? true : false}
                onClick={() =>
                  setToEdit({
                    ...toEdit,
                    associatedParent: {
                      ...toEdit.associatedParent,
                      active: true,
                    },
                  })
                }
                className="text-[12px] mb-2 flex justify-start text-left self-stretch"
              />
            </div>
          </div>
          {persona == "admin" && <EditableText
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
          />}
          <SPFrame0 isOwn={isOwn} userDetail={userDetail} settings={settings} toEdit={toEdit} setToEdit={setToEdit} />
          <SPFrame1
            fetchDetailss={fetchDetails}
            session_no={session_no}
            isOwn={isOwn}
            userDetail={userDetail}
            settings={settings}
            userId={isOwn ? id : params.id}
            editable={editable}
            fetchDetails={fetchDetails}
            setToEdit={setToEdit}
            toEdit={toEdit}
          />
          <div className="h-[2px] mt-[173px] mb-14   bg-[#CBD6E2] w-[95%] mx-auto"></div>
          <SPFrame2
            session_no={session_no}
            isOwn={isOwn}
            userDetail={userDetail}
            fetchDetails={fetchDetails}
            setSelectedScoreIndex={setSelectedScoreIndex}
            settings={settings}
            userId={isOwn ? id : params.id}
            editable={editable}
            totalTest={totalTest}
            setToEdit={setToEdit}
            toEdit={toEdit}
          />
          <div className="flex-1 mt-16 min-h-[400px]">
            <p className="mb-[-33px] text-sm text-[#26435F] font-semibold text-[20px] pb-[2px] pl-[2px]">
              Latest Assignments
            </p>

            <AllTests isOwn={isOwn} setTotaltest={setTotaltest} studentId={userDetail?.userId} fromProfile={true} />
            <div


              className="border !border-[#CBD6E2] w-[1500px] mx-auto mb-[50px]"
            ></div>
            <SPFrame3 isOwn={isOwn} userDetail={userDetail} user={user} />
            <div
              id="borderDashed"
              className="border !border-[#CBD6E3] w-[1500px] mx-auto my-[50px]"
            ></div>
            {
              persona === "admin" &&
              <SPFrame4 isOwn={isOwn} userDetail={userDetail}
                setsession_no={setsession_no}
                fetchDetails={fetchDetails}
                user={user}
                setSelectedScoreIndex={setSelectedScoreIndex}
                settings={settings}
                userId={isOwn ? id : params.id}
                editable={editable}

                setToEdit={setToEdit}
                toEdit={toEdit} />
            }
          </div>
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

        awsLink={awsLink}
        selectedScoreIndex={selectedScoreIndex}
      />
      <div className="lg:grid !hidden px-2 mt-[300px] relative grid-cols-12 grid-ros-6 lg:mt-10 gap-5 lg:pl-3 ">
        <ProfileCard
          className="col-span-3 py-6 px-4 mt-3  lg:mt-0"
          body={
            <div className="flex justify-center flex-col">
              <div className="flex flex-1 flex-col mr-8">
                {/* <p className='text-primary text-center font-bold flex lg:text-lg whitespace-nowrap mb-1.5'>
                              Birth year
                           </p> */}
                <EditableText
                  editable={editable}
                  onClick={() =>
                    setToEdit({
                      ...toEdit,
                      birthYear: { ...toEdit.birthYear, active: true },
                    })
                  }
                  text="Birth year"
                  className="text-lg mb-2"
                  textClassName="text-[21px]"
                />
                <p className=" font-medium text-[16px] lg:opacity-60 mb-5">
                  {userDetail?.birthyear ? userDetail?.birthyear : "-"}
                </p>
              </div>
              <div className="flex flex-1 flex-col">
                <EditableText
                  editable={editable}
                  onClick={() =>
                    setToEdit({
                      ...toEdit,
                      subjects: { ...toEdit.subjects, active: true },
                    })
                  }
                  text="Subjects"
                  className="text-lg mb-2"
                  textClassName="text-[21px]"
                />
                <div className="grid grid-cols-2">
                  {userDetail?.subjects
                    ? userDetail?.subjects?.map((sub, idx) => {
                      return (
                        <p
                          key={idx}
                          className="mt-1 gap-1 font-medium text-[16px] lg:mt-2 lg:opacity-60"
                        >
                          {sub}{" "}
                        </p>
                      );
                    })
                    : "-"}
                </div>
              </div>
            </div>
          }
        />
        <div className="col-span-2 flex  justify-center items-center  scrollbar-content overflow-x-auto lg:py-5 bg-primary-light px-4 py-5 rounded-15"></div>
        <div className="col-span-4 flex flex-col justify-between">
          <ProfileCard
            className="mt-5 mt-auto flex-1"
            title={
              <EditableText
                editable={editable}
                onClick={() =>
                  setToEdit({
                    ...toEdit,
                    aboutScore: { ...toEdit.aboutScore, active: true },
                  })
                }
                text="PSAT / P-ACT Scores"
                className="text-[21px] mb-2 flex justify-start"
              />
            }
            titleClassName="text-left"
            body={
              <div className="flex mt-5 lg:mt-5">
                <p className=" font-semibold text-[18px]">
                  {userDetail?.aboutScore ? userDetail?.aboutScore : "-"}
                </p>
              </div>
            }
          />
        </div>
        <ProfileCard
          className="col-span-3 mt-6 lg:mt-0"
          body={
            <div className="overflow-x-auto scrollbar-content">
              <div className="mb-6">
                <EditableText
                  editable={editable}
                  onClick={() =>
                    setToEdit({
                      ...toEdit,
                      timeZone: { ...toEdit.timeZone, active: true },
                    })
                  }
                  text="Time Zone"
                  textClassName="text-[21px]"
                  className="text-lg mb-2"
                />
                <p className="mt-1.5 font-medium text-[18px] text-[#00000099] whitespace-nowrap">
                  {userDetail?.timeZone ? userDetail?.timeZone : "-"}
                </p>
              </div>
              <div className="mb-6">
                <EditableText
                  editable={editable}
                  onClick={() =>
                    setToEdit({
                      ...toEdit,
                      subscriptionCode: {
                        ...toEdit.subscriptionCode,
                        active: true,
                      },
                    })
                  }
                  text="Subscription"
                  textClassName="text-[21px]"
                  className="text-lg mb-2"
                />
                <p className="mt-1.5 font-medium text-[18px] text-[#00000099] whitespace-nowrap">
                  {userDetail?.subscriptionCode
                    ? userDetail?.subscriptionCode
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-primary font-bold text-lg">
                  <EditableText
                    editable={editable}
                    onClick={() =>
                      setToEdit({
                        ...toEdit,
                        accomodations: {
                          ...toEdit.accomodations,
                          active: true,
                        },
                      })
                    }
                    text="Accomodations"
                    textClassName="text-[21px]"
                    className="text-lg mb-2"
                  />
                </p>
                <p className="mt-1.5 font-medium text-[18px] text-[#00000099] whitespace-nowrap">
                  {userDetail?.accomodations ? userDetail?.accomodations : "-"}
                </p>
              </div>
            </div>
          }
        />
        -
        <ProfileCard
          className="mt-53 col-span-3 lg:mt-0"
          body={
            <>
              <EditableText
                editable={editable}
                onClick={() =>
                  setToEdit({
                    ...toEdit,
                    personality: { ...toEdit.personality, active: true },
                  })
                }
                text="Personality"
                className="text-lg mb-2"
                textClassName="flex-1 text-center text-[21px]"
              />
              <div className="flex scrollbar-content max-h-[500px]  scrollbar-vertical flex-col row-span-2 overflow-x-auto scrollbar-content h-[450px]">
                {settings &&
                  settings.personality &&
                  settings.personality.length > 0 &&
                  userDetail?.personality &&
                  userDetail?.personality?.map((id, idx) => {
                    return settings.personality.find(
                      (item) => item._id === id
                    ) ? (
                      <div
                        key={idx}
                        className="flex flex-col items-center mb-10"
                      >
                        <div className="flex h-90 w-90 rounded-full  items-center justify-center mb-3">
                          <img
                            className="max-w-[90px] max-h-[90px]"
                            src={
                              settings.personality.find(
                                (item) => item._id === id
                              )
                                ? `${awsLink}${settings.personality.find(
                                  (item) => item._id === id
                                )?.image
                                }`
                                : ""
                            }
                          />
                        </div>
                        <p className="opacity-70 font-semibold text-lg">
                          {settings.personality.find(
                            (item) => item._id === id
                          ) ? (
                            settings.personality.find(
                              (item) => item._id === id
                            ).text
                          ) : (
                            <></>
                          )}
                        </p>
                      </div>
                    ) : (
                      <></>
                    );
                  })}
              </div>
            </>
          }
        />
        <div className="col-span-6">
          <ProfileCard
            titleClassName="text-left text-[21px]"
            className="mt-53 lg:mt-0"
            body={
              <>
                <OwlCarousel
                  className={`owl-carousel owl-theme ${styles.scoreCarousel}`}
                  margin={30}
                  items={1}
                >
                  <SubjectSlider
                    score={
                      userDetail?.satScores
                        ? {
                          verbal: userDetail?.satScores[0]?.verbal,
                          maths: userDetail?.satScores[0]?.maths,
                        }
                        : {}
                    }
                    totalMarks={userDetail?.satScores ? getSatMarks(0) : "-"}
                    outOf={"1600"}
                    isSat={true}
                    header={
                      <EditableText
                        editable={editable}
                        onClick={() => {
                          setSelectedScoreIndex(0);
                          setToEdit({
                            ...toEdit,
                            satScores: {
                              ...toEdit.satScores,
                              active: true,
                            },
                          });
                        }}
                        text="Official SAT Scores"
                        className="text-lg mb-2"
                        imgClass={styles.editIcon}
                        textClassName="flex-1 text-center text-[21px]"
                      />
                    }
                    subjects={subjects1}
                    title="Composite Score"
                  />
                  <SubjectSlider
                    score={
                      userDetail?.satScores
                        ? {
                          verbal: userDetail?.satScores[1]?.verbal,
                          maths: userDetail?.satScores[1]?.maths,
                        }
                        : {}
                    }
                    totalMarks={userDetail?.satScores ? getSatMarks(1) : "-"}
                    outOf={"1600"}
                    isSat={true}
                    header={
                      <EditableText
                        editable={editable}
                        onClick={() => {
                          setSelectedScoreIndex(1);
                          setToEdit({
                            ...toEdit,
                            satScores: {
                              ...toEdit.satScores,
                              active: true,
                            },
                          });
                        }}
                        text="Official SAT Scores"
                        className="text-lg mb-2"
                        imgClass={styles.editIcon}
                        textClassName="flex-1 text-center text-[21px]"
                      />
                    }
                    subjects={subjects1}
                    title="Composite Score"
                  />
                  {userDetail?.satScores?.length >= 2 && (
                    <SubjectSlider
                      score={
                        userDetail?.satScores
                          ? {
                            verbal: userDetail?.satScores[2]?.verbal,
                            maths: userDetail?.satScores[2]?.maths,
                          }
                          : {}
                      }
                      totalMarks={userDetail?.satScores ? getSatMarks(2) : "-"}
                      outOf={"1600"}
                      isSat={true}
                      header={
                        <EditableText
                          editable={editable}
                          onClick={() => {
                            setSelectedScoreIndex(2);
                            setToEdit({
                              ...toEdit,
                              satScores: {
                                ...toEdit.satScores,
                                active: true,
                              },
                            });
                          }}
                          text="Official SAT Scores"
                          className="text-lg mb-2"
                          imgClass={styles.editIcon}
                          textClassName="flex-1 text-center text-[21px]"
                        />
                      }
                      subjects={subjects1}
                      title="Composite Score"
                    />
                  )}
                </OwlCarousel>
              </>
            }
          />
          <ProfileCard
            titleClassName="text-left"
            className="mt-8"
            body={
              <>
                <OwlCarousel
                  className={`owl-carousel owl-theme ${styles.scoreCarousel}`}
                  margin={30}
                  items={1}
                >
                  <SubjectSlider
                    totalMarks={userDetail?.actScores ? getActMarks(0) : "-"}
                    outOf={"36"}
                    isAct={true}
                    score={
                      userDetail?.actScores
                        ? {
                          reading: userDetail?.actScores[0]?.reading,
                          maths: userDetail?.actScores[0]?.maths,
                          science: userDetail?.actScores[0]?.science,
                          english: userDetail?.actScores[0]?.english,
                        }
                        : {}
                    }
                    header={
                      <EditableText
                        editable={editable}
                        onClick={() => {
                          setSelectedScoreIndex(0);
                          setToEdit({
                            ...toEdit,
                            actScores: {
                              ...toEdit.actScores,
                              active: true,
                            },
                          });
                        }}
                        text="Official ACT Scores"
                        imgClass={styles.editIcon}
                        className="text-lg mb-2"
                        textClassName="flex-1 text-center text-[21px]"
                      />
                    }
                    subjects={subjects2}
                    title="Composite Score"
                  />

                  <SubjectSlider
                    totalMarks={userDetail?.actScores ? getActMarks(1) : "-"}
                    outOf={"36"}
                    isAct={true}
                    score={
                      userDetail?.actScores
                        ? {
                          reading: userDetail?.actScores[1]?.reading,
                          maths: userDetail?.actScores[1]?.maths,
                          science: userDetail?.actScores[1]?.science,
                          english: userDetail?.actScores[1]?.english,
                        }
                        : {}
                    }
                    header={
                      <EditableText
                        editable={editable}
                        onClick={() => {
                          setSelectedScoreIndex(1);
                          setToEdit({
                            ...toEdit,
                            actScores: {
                              ...toEdit.actScores,
                              active: true,
                            },
                          });
                        }}
                        text="Official ACT Scores"
                        imgClass={styles.editIcon}
                        className="text-lg mb-2"
                        textClassName="flex-1 text-center text-[21px]"
                      />
                    }
                    subjects={subjects2}
                    title="Composite Score"
                  />
                  {userDetail?.actScores?.length >= 2 && (
                    <SubjectSlider
                      totalMarks={userDetail?.actScores ? getActMarks(2) : "-"}
                      outOf={"36"}
                      isAct={true}
                      score={
                        userDetail?.actScores
                          ? {
                            reading: userDetail?.actScores[2]?.reading,
                            maths: userDetail?.actScores[2]?.maths,
                            science: userDetail?.actScores[2]?.science,
                            english: userDetail?.actScores[2]?.english,
                          }
                          : {}
                      }
                      header={
                        <EditableText
                          editable={editable}
                          onClick={() => {
                            setSelectedScoreIndex(2);
                            setToEdit({
                              ...toEdit,
                              actScores: {
                                ...toEdit.actScores,
                                active: true,
                              },
                            });
                          }}
                          text="Official ACT Scores"
                          imgClass={styles.editIcon}
                          className="text-lg mb-2"
                          textClassName="flex-1 text-center text-[21px]"
                        />
                      }
                      subjects={subjects2}
                      title="Composite Score"
                    />
                  )}
                </OwlCarousel>
              </>
            }
          />
        </div>
        <ProfileCard
          className="mt-53 pb-0 col-span-3 lg:mt-0 overflow-auto "
          body={
            <>
              <EditableText
                editable={editable}
                onClick={() =>
                  setToEdit({
                    ...toEdit,
                    interest: { ...toEdit.interest, active: true },
                  })
                }
                text="Interests"
                className="text-lg mb-2"
                textClassName="flex-1 text-center text-[21px]"
              />
              <div className="flex scrollbar-content max-h-[500px]  scrollbar-vertical flex-col overflow-x-auto">
                {settings &&
                  settings.interest.length > 0 &&
                  userDetail?.interest?.map((id, idx) => {
                    return settings.interest.find(
                      (item) => item._id === id
                    ) ? (
                      <div
                        key={idx}
                        className="flex flex-col items-center mb-10"
                      >
                        <div className="flex h-90 w-90 rounded-full  items-center justify-center mb-3">
                          <img
                            className="max-w-[90px] max-h-[90px]"
                            src={
                              settings.interest.find(
                                (item) => item._id === id
                              )
                                ? `${awsLink}${settings.interest.find(
                                  (item) => item._id === id
                                ).image
                                }`
                                : ""
                            }
                          />
                        </div>
                        <p className="opacity-70 font-semibold text-lg">
                          {settings.interest.find(
                            (item) => item._id === id
                          ) ? (
                            settings.interest.find((item) => item._id === id)
                              .text
                          ) : (
                            <></>
                          )}
                        </p>
                      </div>
                    ) : (
                      <></>
                    );
                  })}
              </div>
            </>
          }
        />
        {persona === "admin" || editableByTutor ? (
          <>
            <ProfileCard
              className="mt-4 lg:order-6 lg:mt-0 lg:col-span-3"
              body={
                <div className="flex">
                  <div className="flex-1 lg:mr-12">
                    <EditableText
                      editable={editable}
                      onClick={() =>
                        setToEdit({
                          ...toEdit,
                          service: { ...toEdit.service, active: true },
                        })
                      }
                      text="Service and Specialization"
                      className="lg:text-21 text-left"
                    />
                    <div className="font-medium text-sm mt-2 lg:mt-6 flex flex-wrap lg:opacity-60">
                      {/* {userDetail?.subscribeType ? userDetail?.subscribeType : '-'} */}
                      {userDetail?.service
                        ? userDetail?.service?.map((service, idx) => {
                          return (
                            <p key={idx} className="opacity-80 mb-1 mr-1">
                              {service}
                              {idx < userDetail?.service.length - 1
                                ? ","
                                : ""}
                            </p>
                          );
                        })
                        : "-"}
                    </div>
                  </div>
                </div>
              }
            />
            <ProfileCard
              className="mt-4 lg:order-7 lg:mt-0 lg:col-span-9"
              body={
                <div className="flex">
                  <div className="flex-1 lg:mr-12">
                    <EditableText
                      editable={editable}
                      onClick={() =>
                        setToEdit({
                          ...toEdit,
                          notes: { ...toEdit.notes, active: true },
                        })
                      }
                      text="Additional Note"
                      className="lg:text-21 whitespace-nowrap"
                    />
                    <p className="font-medium text-sm mt-2 lg:mt-6 lg:opacity-60">
                      {userDetail?.notes ? userDetail?.notes : "-"}
                    </p>
                  </div>
                </div>
              }
            />
          </>
        ) : (
          ""
        )}
        {persona === "admin" && (
          <>
            <ProfileCard
              className="mt-4 lg:order-8 lg:mt-5 lg:col-span-3"
              body={
                <div className="flex">
                  <div className="flex-1 lg:mr-12">
                    <EditableText
                      editable={editable}
                      onClick={() =>
                        setToEdit({
                          ...toEdit,
                          leadStatus: {
                            ...toEdit.leadStatus,
                            active: true,
                          },
                        })
                      }
                      text="Lead Status"
                      className="lg:text-21 whitespace-nowrap"
                    />
                    <p className="font-medium text-sm mt-2 lg:mt-6 lg:opacity-60">
                      {userDetail?.leadStatus ? userDetail?.leadStatus : "-"}
                    </p>
                  </div>
                </div>
              }
            />
            <ProfileCard
              className="mt-4 lg:order-9 lg:mt-5 lg:col-span-9"
              body={
                <div className="flex">
                  <div className="flex-1 lg:mr-12">
                    <EditableText
                      editable={false}
                      onClick={() =>
                        setToEdit({
                          ...toEdit,
                          timeZone: { ...toEdit.timeZone, active: true },
                        })
                      }
                      text="Sign Up Form Details"
                      className="lg:text-21 whitespace-nowrap"
                    />
                    <div className="grid grid-cols-2 py-4 pt-5">
                      <div className="mb-7">
                        <p className="font-semibold mb-2">First Name</p>
                        <p className="opacity-80"> {user.firstName} </p>
                      </div>
                      <div className="mb-7">
                        <p className="font-semibold mb-2">Last Name</p>
                        <p className="opacity-80"> {user.lastName} </p>
                      </div>
                      <div className="mb-7">
                        <p className="font-semibold mb-2">
                          Are you a parent or student?
                        </p>
                        <p className="opacity-80"> Student </p>
                      </div>
                      <div className="mb-7">
                        <p className="font-semibold mb-2">Phone Number</p>
                        <p className="opacity-80">
                          {" "}
                          {user.phone ? user.phone : "-"}{" "}
                        </p>
                      </div>
                      <div className="mb-7 col-span-2">
                        <p className="font-semibold mb-2">
                          What service are you seeking?
                        </p>
                        <div>
                          {userDetail?.serviceSeeking?.map((service, idx) => {
                            return (
                              <p
                                key={idx}
                                className="opacity-80 inline-block mr-1"
                              >
                                {service}
                                {idx < userDetail?.serviceSeeking.length - 1
                                  ? ","
                                  : ""}{" "}
                              </p>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mb-7">
                        <p className="font-semibold mb-2">
                          Parent First Name
                        </p>
                        <p className="opacity-80"> {userDetail?.FirstName} </p>
                      </div>
                      <div className="mb-7">
                        <p className="font-semibold mb-2">
                          Parent Last Name{" "}
                        </p>
                        <p className="opacity-80"> {userDetail?.LastName} </p>
                      </div>
                      <div className="mb-7">
                        <p className="font-semibold mb-2">Parent Email</p>
                        <p className="opacity-80"> {userDetail?.Email} </p>
                      </div>
                      <div className="mb-7">
                        <p className="font-semibold mb-2">Parent Phone </p>
                        <p className="opacity-80"> {userDetail?.Phone} </p>
                      </div>
                      <div className="mb-7">
                        <p className="font-semibold mb-2">School Name</p>
                        <p className="opacity-80">
                          {" "}
                          {userDetail?.schoolName}{" "}
                        </p>
                      </div>
                      <div className="mb-7">
                        <p className="font-semibold mb-2"> Grade</p>
                        <p className="opacity-80">{userDetail?.grade} </p>
                      </div>

                      <div className="mb-7 col-span-2">
                        <p className="font-semibold mb-2">
                          Do you have any PSAT / P-ACT scores to share? How
                          are your student's grades in school?
                        </p>
                        <p className="opacity-80"> - </p>
                      </div>
                      <div className="mb-7 col-span-2">
                        <p className="font-semibold mb-2">
                          {" "}
                          Is your child taking any AP courses in school?
                          Please select all that apply.
                        </p>
                        <div>
                          {userDetail?.apCourses?.map((service, idx) => {
                            return (
                              <p
                                key={idx}
                                className="opacity-80 inline-block mr-1"
                              >
                                {service}
                                {idx < userDetail?.apCourses.length - 1
                                  ? ","
                                  : ""}{" "}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                      <div className="mb-7 col-span-2">
                        <p className="font-semibold mb-2">
                          Select if any of these apply to you{" "}
                        </p>
                        <div>
                          {" "}
                          {userDetail?.motive?.map((service, idx) => {
                            return (
                              <p key={idx} className="opacity-80 mb-1">
                                {service}
                                {idx < userDetail?.motive.length - 1
                                  ? ","
                                  : ""}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                      <div className="mb-7 col-span-2">
                        <p className="font-semibold mb-2">
                          Please enter the subscription code required to
                          access Seven Square Learning and starting prep.{" "}
                        </p>
                        <p className="opacity-80">
                          {" "}
                          {userDetail?.subscriptionCode}{" "}
                        </p>
                      </div>
                      <div className="mb-7 col-span-2">
                        <p className="font-semibold mb-2">
                          How did you hear about us?{" "}
                        </p>
                        <div>
                          {" "}
                          {userDetail?.hearAboutUs?.map((service, idx) => {
                            return (
                              <p
                                key={idx}
                                className="opacity-80 inline-block mr-1"
                              >
                                {service}
                                {idx < userDetail?.hearAboutUs.length - 1
                                  ? ","
                                  : ""}{" "}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
            />
          </>
        )}
      </div>
    </>
  );
}
