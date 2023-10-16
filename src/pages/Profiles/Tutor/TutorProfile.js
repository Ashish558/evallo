import React, { useState } from "react";
import ProfileCard from "../../../components/ProfileCard/ProfileCard";
import styles from "./style.module.css";
// import EditableText from "../../../components/EditableText/EditableText";
// import dots from "../../../assets/icons/four-dot.svg";
// import ProfileImg from "../../../assets/images/profile.png";
// import TutorImg from "../../../assets/images/tutor.png";
// import TutorSmallImg from "../../../assets/images/tutor-small.png";
// import sat from "../../../assets/icons/sat.png";
import LeftIcon from "../../../assets/profile/left.svg";

import linkedin from "../../../assets/icons/linkedin.svg";
import call from "../../../assets/icons/ic_baseline-local-phone.svg";
import mail from "../../../assets/icons/mdi_email.svg";
import education from "../../../assets/icons/education.png";
import experience from "../../../assets/icons/cap.svg";
import bag from "../../../assets/icons/bag.svg";
import highlight from "../../../assets/YIcons/highlight.svg";
// import EditIcon from "../../../assets/icons/edit.svg";
// import MailIcon from "../../../assets/icons/mail.svg";
// import LinkedIn from "../../../assets/icons/linked-in.svg";
// import WhatsappIcon from "../../../assets/icons/whatsapp.svg";
// import RightIcon from "../../../assets/icons/chevron-right.svg";
// import SecondaryButton from "../../../components/Buttons/SecondaryButton";
// import ValueOneIcon from "../../../assets/images/val-1.svg";
// import ValueTwoIcon from "../../../assets/images/val-2.svg";
// import ValueThreeIcon from "../../../assets/images/val-3.svg";

import TutorLevelOne from "../../../assets/profile/tutor-level-1.svg";
import TutorLevelTwo from "../../../assets/profile/tutor-level-2.svg";
import TutorLevelThree from "../../../assets/profile/tutor-level-3.svg";
import TutorLevelFour from "../../../assets/profile/tutor-level-4.svg";
import Table from "../../../components/Table/Table";
// import EducationIcon from "../../../assets/profile/education.svg";

// import InterestOneIcon from "../../../assets/images/int-1.svg";
// import InterestTwoIcon from "../../../assets/images/int-2.svg";
// import InterestThreeIcon from "../../../assets/images/int-3.svg";
// import SubjectSlider from "../../../components/SubjectSlider/SubjectSlider";
// import BackBtn from "../../../components/Buttons/Back";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useLazyGetTutorDetailsQuery,
  useLazyGetFeedbackQuery,
} from "../../../app/services/users";
import {
  useLazyGetSettingsQuery,
  useLazyGetSingleSessionQuery,
} from "../../../app/services/session";
import { useSelector } from "react-redux";
import ParentEditables from "../../Frames/Editables/ParentEditables/ParentEditables";
import { useLazyGetFeedbacksQuery } from "../../../app/services/dashboard";
// import FeedbackTable from "./FeedbackTable/FeedbackTable";
import { BASE_URL, getAuthHeader } from "../../../app/constants/constants";
import axios from "axios";
import ProfilePhoto from "../../../components/ProfilePhoto/ProfilePhoto";
import YoutubeEmbed from "./YoutubeEmbed/YoutubeEmbed";
// import CircleButton from "../../../components/CircleButton/CircleButton";
import BarChart from "../../../components/BarChart/BarChart";
import Pagination from "../../SuperadminDashboard/Table/Pagination";
import { getFormattedDate } from "../../../utils/utils";

export default function TutorProfile({ isOwn }) {
  const { firstName, lastName } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [editable, setEditable] = useState(false);
  const { role: persona } = useSelector((state) => state.user);
  const [user, setUser] = useState({});
  const [userDetail, setUserDetail] = useState({});
  const [settings, setSettings] = useState({});
  console.log("userdetails",userDetail,user);
  const params = useParams();
  const [getUserDetail, userDetailResp] = useLazyGetTutorDetailsQuery();
  const [getStudentFeedback, userStudentFeedbackResp] =
    useLazyGetFeedbackQuery();
  const [fetchSettings, settingsResp] = useLazyGetSettingsQuery();
  const [getFeedbacks, getFeedbacksResp] = useLazyGetFeedbacksQuery();
  const [getSession, getSessionResp] = useLazyGetSingleSessionQuery();
  const [feedbacks, setFeedbacks] = useState([]);
  const [awsLink, setAwsLink] = useState("");
  const { organization } = useSelector((state) => state.organization);
  const [newServices, setNewServices] = useState([]);
  // console.log(feedbacks)
  const { dateFormat } = useSelector(state => state.user)
  const { id } = useSelector((state) => state.user);
  const [studentFeedbacks, setStudentFeedbacks] = useState([]);
  useEffect(() => {
    getStudentFeedback({ id: params.id }).then(({ error, data }) => {
      if (error) {
        return console.log(error);
      }
      console.log(studentFeedbacks);
      setStudentFeedbacks(data);
    });
  }, [params.id]);

  useEffect(() => {
    if (!userDetail || !organization?.settings?.servicesAndSpecialization)
      return;
    let temp = [];

    userDetail.tutorServices?.map((service) => {
      organization?.settings?.servicesAndSpecialization?.map((service2) => {
        if (
          service2._id === service?._id &&
          service?.price !== null &&
          service.price >= 0
        ) {
          //  console.log("newsa",service)
          temp.push({
            service: service.service,
            price: service.price,
          });
        }
      });
    });
    //console.log("news",userDetail.tutorServices, organization?.settings?.servicesAndSpecialization)

    setNewServices(temp);
  }, [userDetail, organization]);
  //console.log("newww", newServices);
  const tableHeaders1 = [
    {
      id: 1,
      text: "Student Name",
    },
    {
      id: 4,
      text: "Serivce",
    },
    {
      id: 2,
      text: "Rating",
    },

    {
      id: 5,
      text: "Session Date",
    },
  ];
  const tableHeaders2 = [
    {
      id: 1,
      text: "Service",
    },
    {
      id: 2,
      text: "Hourly Rate",
    },
  ];
  const data2 = [
    {
      id: 1,
      service: "Test Prep",
      currency: "USD",
      hourlyrate: "$130",
    },
  ];
  const data = [
    {
      id: 1,
      studentname: "Lorem Ipsum",
      feedback: "5",
      comment: "Loream",
      service: "Loream",
      sessiondata: "May 12,2002",
    },
    {
      id: 1,
      studentname: "Lorem Ipsum",
      feedback: "5",
      comment: "Loream",
      service: "Loream",
      sessiondata: "May 12,2002",
    },
  ];

  const [toEdit, setToEdit] = useState({
    profileData: {
      active: false,
      firstName: "",
      lastName: "",
      tagLine: "",
    },
    tutorAddress: {
      state: "",
      country: "",
      city: "",
      pincode: "",
      address: "",
    },
    fullName: {
      active: false,
      firstName: "",
      lastName: "",
    },
    tagLine: {
      active: false,
      tagLine: "",
      isPresent: false,
    },
    about: {
      active: false,
      about: "",
      isPresent: false,
    },
    tutorLevel: {
      active: false,
      tutorLevel: "",
      isPresent: false,
    },
    education: {
      active: false,
      education: "",
      isPresent: false,
    },
    rates: {
      active: false,
      testPrepRate: "",
      otherRate: "",
      subjectTutoringRate: "",
    },
    pincode: {
      active: false,
      pincode: "",
      isPresent: false,
    },
    paymentInfo: {
      active: false,
      paymentInfo: "",
    },
    tutorRank: {
      active: false,
      tutorRank: "",
      isPresent: false,
    },
    income: {
      active: false,
      income: "",
      isPresent: false,
    },
    paymentStatus: {
      active: false,
      paymentStatus: "",
      isPresent: false,
    },
    tutorContact: {
      active: false,
      email: "",
      phone: "",
      linkedIn: "",
      phoneCode: "",
      isPresent: false,
    },
    interest: {
      active: false,
      interest: [],
    },
    serviceSpecializations: {
      active: false,
      serviceSpecializations: [],
    },
    tutorServices: {
      active: false,
      tutorServices: [],
    },
    videoLink: {
      active: false,
      videoLink: "",
    },
    tutorReviews: {
      active: false,
      fetchedData: [],
      tutorReviews: [
        {
          tutorId: "",
          userTag: "", // "parent"
          service: "",
          date: "",
          content: "",
          orgId: "",
        },
      ],
    },
  });
  //console.log("userDetail", { userDetail, toEdit });
  const [tutorTotalReviews,setTutorReviews]=useState([])
  const [currentPage, setCurrentPage] = useState(1);
  console.log("trts",tutorTotalReviews)
  useEffect(() => {
    let userId = "";
    if (isOwn) {
      userId = id;
    } else {
      console.log("userid" + params.id);
      userId = params.id;
    }
    getFeedbacks({ id: userId }).then(({ error, data }) => {
      if (error) {
        console.log("feedback error", error);
        return;
      }
      console.log("newtr feedback", data);
      let tempp=[]
      data?.data?.feedback?.map((tr)=>{
         if(tr?.customCreatedAt && tr?.userTag){
            tempp.push(tr)
         }
      })
      setTutorReviews(tempp);

      data.data.feedback.map((feedback) => {
        getUserDetail({ id: feedback.studentId }).then((res) => {
          const student = res?.data?.data?.user;
          getSession(feedback?.sessionId).then((res) => {
            const session = res?.data?.data?.session;
            setFeedbacks((prev) => {
              let obj = {
                ...feedback,
                studentName: `${student?.firstName} ${student?.lastName}`,
                service: session?.service,
              };
              let allFeedbacks = [...prev, { ...obj }];
              return allFeedbacks.sort(function (a, b) {
                return new Date(b.updatedAt) - new Date(a.updatedAt);
              });
            });
          });
        });
      });
    });
  }, []);
 // console.log(settings?.Expertise, "settings");
  const handleClose = () => {
    setToEdit((prev) => {
      let tempToEdit = {};
      Object.keys(prev).map((key) => {
        tempToEdit[key] = { ...prev[key], active: false };
      });
      return tempToEdit;
    });
  };

  useEffect(() => {
    if (persona === "admin" || isOwn) {
      setEditable(true);
    }
  }, []);
  const [tutorAdminServices, setTutorServices] = useState();
  useEffect(() => {
    if (organization?.settings?.servicesAndSpecialization) {
      let temp = [];
      temp = organization?.settings?.servicesAndSpecialization?.map((item) => {
        return {
          service: item?.service,
          price: null,
          _id: item?._id,
        };
      });
      setTutorServices(temp);
    }
  }, [organization]);
  //console.log("servicessss", tutorAdminServices, userDetail);
  useEffect(() => {
    if (userDetail?.tutorServices && tutorAdminServices) {
      //console.log("userDetailttftft",tutorAdminServices,userDetail?.tutorServices);
      let temp = tutorAdminServices;
      temp?.map((serv, id) => {
        userDetail.tutorServices?.map((item) => {
          if (item?._id === serv?._id) {
            temp[id].price = item?.price;
          }
        });
      });
      setTutorServices(temp);
    }
  }, [userDetail?.tutorServices]);
  const fetchDetails = (closeModal) => {
    let userId = "";
    if (isOwn) {
      userId = id;
    } else {
      userId = params.id;
    }
    getUserDetail({ id: userId }).then((res) => {
      console.log("response",userId, res?.data);
      if(!res?.data)return 
      setAwsLink(res.data.data.baseLink);
      const { firstName, lastName, phone, email, phoneCode } =
        res.data.data.user;
      setUser(res.data.data.user);
      console.log(user.phone + "phone");
    
      let details = res?.data?.data?.details?res?.data?.data?.details:{};
      if(Object.keys(details)?.length===0){
        details=null
      }
      
      console.log("details", details);
      // const { } = res.data.data.user
      // const { service } = res.data.data.userdetails

      const promiseState = async (state) =>
        new Promise((resolve) => {
          resolve(
            setToEdit((prevToEdit) => {
              return {
                ...prevToEdit,
                fullName: {
                  ...prevToEdit.fullName,
                  firstName,
                  lastName,
                },
                profileData: {
                  ...prevToEdit.profileData,
                  firstName,
                  lastName,
                  tagLine,
                  phone,
                  phoneCode,
                  linkedIn: !details ? "" : details?.linkedIn,
                  about: !details ? "" : details?.about,
                  education: !details ? "" : details?.education,
                  experience: !details ? "" : details?.experience,
                  isPresent: details === null ? false : true,
                },
                tutorAddress: {
                  ...prevToEdit.addressData,
                  city: !details ? "" : details?.city,
                  country: !details ? "" : details?.country,
                  pincode: !details ? "" : details?.pincode,
                  state: !details ? "" : details?.state,
                  address: !details ? "" : details?.address,
                  isPresent: details === null ? false : true,
                },
                tutorContact: {
                  ...prevToEdit.tutorContact,
                  email: email,
                  phone: phone === null ? "" : phone,
                  phoneCode: phoneCode === null ? "" : phoneCode,
                  linkedIn: details === null ? "" : details?.linkedIn,
                  isPresent: details === null ? false : true,
                },
                tagLine: {
                  ...prevToEdit.tagLine,
                  tagLine: details === null ? "" : details?.tagLine,
                  isPresent: details === null ? false : true,
                },
                tutorLevel: {
                  ...prevToEdit.tutorLevel,
                  tutorLevel: details === null ? "" : details?.tutorLevel,
                  isPresent: details === null ? false : true,
                },
                about: {
                  ...prevToEdit.about,
                  about: details === null ? "" : details?.about,
                  isPresent: details === null ? false : true,
                },
                education: {
                  ...prevToEdit.education,
                  education: details === null ? "" : details?.education,
                  isPresent: details === null ? false : true,
                },
                rates: {
                  ...prevToEdit.rates,
                  isPresent: details === null ? false : true,
                },
                // tutorAddress: {
                //    ...prevToEdit.tutorAddress,
                //    address: details === null ? '' : details.address,
                //    isPresent: details === null ? false : true
                // },
                pincode: {
                  ...prevToEdit.pincode,
                  pincode: details === null ? "" : details?.pincode,
                  isPresent: details === null ? false : true,
                },
                paymentInfo: {
                  ...prevToEdit.paymentInfo,
                  paymentInfo: details === null ? "" : details?.paymentInfo,
                  isPresent: details === null ? false : true,
                },
                tutorRank: {
                  ...prevToEdit.tutorRank,
                  tutorRank: details === null ? "" : details?.tutorRank,
                  isPresent: details === null ? false : true,
                },
                income: {
                  ...prevToEdit.income,
                  income: details === null ? "" : details?.income,
                  isPresent: details === null ? false : true,
                },
                paymentStatus: {
                  ...prevToEdit.paymentStatus,
                  isPresent: details === null ? false : true,
                },
                interest: {
                  ...prevToEdit.interest,
                  interest: details !== null ? details?.interest : [],
                  isPresent: details === null ? false : true,
                },
                tutorServices: {
                  ...prevToEdit.tutorServices,
                  tutorServices: details !== null ? details?.tutorServices : [],
                  isPresent: details === null ? false : true,
                },
                //  tutorReviews: {
                //    ...prevToEdit.tutorReviews,
                //    tutorReviews: details?.tutorReviews !== null ? details.tutorReviews : prevToEdit.tutorReviews?.tutorReviews,
                //    isPresent: details === null ? false : true,
                //  },
                serviceSpecializations: {
                  ...prevToEdit.serviceSpecializations,
                  serviceSpecializations:
                    details !== null ? details?.serviceSpecializations : [],
                  isPresent: details === null|| details?.serviceSpecializations===null? false : true,
                },
                videoLink: {
                  ...prevToEdit.videoLink,
                  videoLink: details !== null ? details?.videoLink : [],
                  isPresent: details === null ? false : true,
                },
              };
            })
          );
        });

      promiseState().then(() => {
        closeModal && handleClose();
      });

      if (res.data.data.details == null) {
        setUserDetail({});
      } else {
        setUserDetail(res.data.data.details);
      }
    });
  };

  useEffect(() => {
    fetchDetails();
  }, [params.id]);

  useEffect(() => {
    // fetchSettings()
    //    .then(res => {

    //    })
    console.log("UserDetails", userDetail);
    console.log("organizations" + organization.settings);
    setSettings(organization.settings);
  }, [organization]);

  // console.log('user', user)
  // console.log('To-edit', toEdit)
  //console.log("userdetail", userDetail);
  // console.log('settings', settings.Expertise)
  const {
    about,
    education,
    tagLine,
    tutorLevel,
    testPrepRate,
    otherRate,
    subjectTutoringRate,
    address,
    pincode,
    paymentInfo,
    tutorRank,
    income,
    paymentStatus,
    linkedIn,
    videoLink,
    city,
    state,
    country,
  } = userDetail;
  // console.log('userdetail', tutorLevel)

  // console.log(user);
  // console.log('settings', settings.servicesAndSpecialization);
  if (Object.keys(user).length < 1) return;
  if (Object.keys(settings).length < 1) return;
 // if (Object.keys(userDetail).length < 1) return;
  let tutorLevelIcon = TutorLevelOne;
  let tutorLevelTextColor = "text-[#ff4300]";
  let tutorLevelBg = "#FBDB89";

  const levels = {
    one: {
      bg: "#FBDB89",
      text: "#FF4300",
    },
    two: {
      bg: "#7152EB",
      text: "#472D70",
    },
    three: {
      bg: "#DC8553",
      text: "#FFFFFF",
    },
    four: {
      bg: "#2D2C2C",
      text: "#FFFFFF",
    },
  };
  if (tutorLevel === "ORANGE") {
    tutorLevelIcon = TutorLevelOne;
    tutorLevelTextColor = "text-[#ff4300]";
    tutorLevelBg = "#fbdb89";
  } else if (tutorLevel === "PURPLE") {
    tutorLevelIcon = TutorLevelTwo;
    tutorLevelTextColor = "text-[#472d70]";
    tutorLevelBg = "#7152eb";
  } else if (tutorLevel === "BROWN") {
    tutorLevelIcon = TutorLevelThree;
    tutorLevelTextColor = "text-[#ffffff]";
    tutorLevelBg = "#dc8553";
  } else if (tutorLevel === "BLACK") {
    tutorLevelIcon = TutorLevelFour;
    tutorLevelTextColor = "text-[#ffffff]";
    tutorLevelBg = "#2d2c2c";
  }

  const handleProfilePhotoChange = (file) => {
    // console.log(file)
    let url = "";
    const formData = new FormData();
    formData.append("photo", file);
    if (persona === "admin") {
      url = `${BASE_URL}api/user/admin/addphoto/${params.id} `;
    } else {
      url = `${BASE_URL}api/user/addphoto`;
    }
    axios.patch(url, formData, { headers: getAuthHeader() }).then((res) => {
      console.log(res);
      fetchDetails();
    });
  };
  // console.log(isOwn);
  // console.log(tutorRank);
  const timestamp = userDetail?.createdAt;
  const date = new Date(timestamp);
 const getDateFormat=(date1)=>{
 let date= new Date(date1);
   const options = { year: "numeric", month: "long", day: "numeric" };
   const formattedDate = date.toLocaleDateString("en-US", options);
   return formattedDate
 }
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  // console.log(formattedDate);
  return (
    <>
      <div className="w-[83.3vw] mx-auto">
        {/* <div className="py-8">
               <p className='text-[#24A3D9] text-xl '>Org</p>
            </div> */}
        <p className="text-[#24A3D9] text-base-20 mb-8 my-[calc(50*0.0522vw)] ">
         <span onClick={()=>navigate('/')} className="cursor-pointer">
         {organization?.company +
            "  >  " +
            firstName +
            "  " +
            lastName +
            "  >  "}
         </span>
          <span className="font-bold">Profile</span>
        </p>
        {!isOwn ? (
          <button
            className="my-5 bg-[#D9BBFF] cursor-pointer relative z-[50] px-[14px] py-[8px] rounded-[8px] text-[#636363] text-[18px] font-medium top-[-8px] left-[0px] flex gap-[12px] cursor-pointer flex justify-center items-center"
            onClick={() => window.history.back()}
          >
            <img src={LeftIcon} alt="icon" /> Back
          </button>
        ) : (
          <></>
        )}
        <div className="flex  justify-between">
          <ProfileCard
            hideShadow
            titleClassName="text-left"
            bgClassName="bg-profilecard"
            className=" w-[68.5vw]"
            // title={
            //    <EditableText text=''
            //       editable={editable}
            //       onClick={() => setToEdit({ ...toEdit, about: { ...toEdit.about, active: true } })}
            //       className='text-primary text-lg capitalize '
            //       textClassName='flex-1'
            //       imgClass='ml-auto' />
            // }

            body={
              <>
                <div className="bg-white rounded-md shadow-[0px_0px_2px_0px_#00000040]">
                  <div className="h-[120px]  rounded-t-md shadow-t-[0px_0px_2px_0px_#00000040] flex relative bg-[#26435F]">
                    <div className="ml-8  pt-1  w-4/6">
                      <div className="flex h-full  items-end">
                        <div className="mb-[-80px] h-min">
                          <ProfilePhoto
                            isTutor={true}
                            imgSizeClass={"!w-[150px] !h-[150px]"}
                            className={"!w-[150px] !h-[150px]"}
                            src={
                              user.photo
                                ? `${awsLink}${user.photo}`
                                : "/images/default.jpeg"
                            }
                            handleChange={handleProfilePhotoChange}
                          />
                          {(isOwn === true || persona === "admin") && (
                            <p
                              className="text-[#667085] text-center mt-1  underline underline-offset-2  cursor-pointer text-[15.002px] font-semibold text-base-15"
                              onClick={() =>
                                setToEdit({
                                  ...toEdit,
                                  profileData: {
                                    ...toEdit.profileData,
                                    active: true,
                                  },
                                })
                              }
                            >
                              Edit Profile
                            </p>
                          )}
                        </div>
                        <div className="pl-4">
                          <div className="flex justify-start items-center ">
                            <p className="text-white text-[25px] text-base-25 font-semibold">
                              {user.firstName + " "}
                              {user.lastName}
                            </p>

                            {/* <EditableText text='edit'
                                    editable={editable}
                              onClick={() => setToEdit({ ...toEdit, about: { ...toEdit.about, active: true } })}
                              className='text-green'
                                /> */}
                          </div>
                          <div className="w-full break-words  ">
                            <p className="text-white text-light text-[17px] text-base-17-5 mb-4">
                              {userDetail.tagLine}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {(persona === "tutor" || persona === "admin") && (
                      <div className="ml-auto mt-auto pt-[10px] pb-[10px] mr-8">
                        <div className="flex gap-4 items-center mb-[10px]">
                          <img src={mail} alt="mailLogo"></img>
                          <p className="text-white text-[17.503px] text-base-17-5">
                            {user.email}
                          </p>
                        </div>
                        <div className="flex gap-4 items-center mb-[10px]">
                          <img src={call} alt="callLogo"></img>
                          <p className="text-white text-[17.503px] text-base-17-5">
                            {user.phoneCode}
                            {user.phone}
                          </p>
                        </div>
                        <div className="flex gap-4 items-center mb-[10px]">
                          <img src={linkedin} alt="linkedinLogo"></img>
                          <a
                            className="text-white text-[17.503px] text-base-17-5"
                            href={userDetail.linkedIn}
                          >
                            {userDetail.linkedIn}
                          </a>
                        </div>
                      </div>
                    )}
                    {(persona === "student" || persona === "parent") &&
                      organization?.settings?.permissions[2]?.choosedValue && (
                        <div className="ml-auto mt-auto pt-[25px] pb-[15px] mr-8">
                          <div className="flex gap-4 items-center mb-[10px]">
                            <img src={mail} alt="mailLogo"></img>
                            <p className="text-white text-[17.503px] text-base-17-5">
                              {user.email}
                            </p>
                          </div>
                          <div className="flex gap-4 items-center mb-[10px]">
                            <img src={call} alt="callLogo"></img>
                            <p className="text-white text-[17.503px] text-base-17-5">
                              {user.phoneCode}
                              {user.phone}
                            </p>
                          </div>
                          <div className="flex gap-4 items-center mb-[10px]">
                            <img src={linkedin} alt="linkedinLogo"></img>
                            <a
                              className="text-white text-[17.503px] text-base-17-5"
                              href={userDetail.linkedIn}
                            >
                              {userDetail.linkedIn}
                            </a>
                          </div>
                        </div>
                      )}
                    {/* <div>
                                 <ProfilePhoto isTutor={true}
                                    src={user.photo ? `${awsLink}${user.photo}` : '/images/default.jpeg'}
                                    handleChange={handleProfilePhotoChange} />
                              </div> */}
                  </div>
                  <div className="flex ml-4  h-[120px] overflow-y-auto">
                    <div className="min-w-[182px]"></div>
                    <div className="my-[33px] pl-1 pr-[41px]">
                      <p className="text-[17.503px] text-base-17-5 text-[#517CA8] whitespace-normal text-left">
                        {userDetail.about}
                      </p>
                    </div>
                  </div>
                </div>

                {/* <div>
                                 <img src={user.photo ? user.photo : '/images/default.jpeg'} className={} />
                              </div> */}
              </>
            }
          />
          <div className="w-[13vw]">
            <div className="flex ">
              <img className="" src={experience} alt="experience"></img>
              <div className="ml-6">
                <p className="text-[#24A3D9] font-semibold text-[20px] text-base-20">
                  Education
                </p>
                <p className="text-[17.503px] text-base-17-5 text-[#517CA8]">
                  {userDetail.education}
                </p>
              </div>
            </div>
            <div className="flex  pl-2 mt-[43.76px] ">
              <img className="" src={bag} alt="experience"></img>

              <div className="ml-6">
                <p className="text-[#24A3D9] font-semibold text-[20px] text-base-20">
                  Experience
                </p>
                <p className="text-[17.503px] text-base-17-5 text-[#517CA8]">
                  {userDetail.experience}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className=" lg:pt-0 lg:pr-0 relative mt-[67px]">
          <div className="grid grid-cols-12 gap-x-[46px]">
            <div className="col-span-3 mt-53 lg:mt-0 flex flex-col ">
              {/* {
                        !isOwn &&
                        <div className={` mb-5 px-4 py-4 lg:bg-textGray-30 rounded-2xl`}
                           style={{ backgroundColor: tutorLevelBg }}
                        >
                           <EditableText text={tutorLevel === undefined ? '' : `${tutorLevel} belt`}
                              editable={editable}
                              onClick={() => setToEdit({ ...toEdit, tutorLevel: { ...toEdit.tutorLevel, active: true } })}
                              className={` justify-center font-bold text-lg capitalize `}
                              textClassName={`flex-1 capitalize ${tutorLevelTextColor}`}
                              imgClass='ml-auto' />
                           <div className='flex mt-4 mb-6 justify-center'>
                              <img src={tutorLevelIcon} />
                           </div>
                        </div>

                     }  */}
              <div>
                <div className="flex font-semibold items-center">
                  <div className="text-xl text-[#26435F] text-base-20 text-[#26435F] font-semibold">
                    Expertise
                  </div>
                  {(isOwn == true || persona === "admin") && (
                    <p
                      className="text-[#667085] ml-auto underline cursor-pointer text-[15px] text-base-15"
                      onClick={() =>
                        setToEdit({
                          ...toEdit,
                          serviceSpecializations: {
                            ...toEdit.serviceSpecializations,
                            active: true,
                          },
                        })
                      }
                    >
                      edit
                    </p>
                  )}
                </div>
                <ProfileCard
                  className="flex-1 pr-0"
                  hideShadow={true}
                  bgClassName="bg-profilecard"
                  body={
                    <div className=" max-h-[500px] custom-scroller scroll-mx-3">
                      {/* {settings &&
                        settings.Expertise?.length > 0 &&
                        userDetail.serviceSpecializations &&
                        userDetail.serviceSpecializations.map((id, idx) => {
                          return settings?.Expertise?.find(
                            (item) => item._id === id || true
                          ) ? (
                            <div className="mt-[7px]  rounded-md shadow-[0px_0px_2px_0px_#00000040] overflow-x-auto  ">
                              <div className=" bg-white rounded min-h-[50px]  flex items-center pl-[40px]">
                                <div className="ml-3">
                                  <img
                                    className="max-w-[40px] max-h-[40px]"
                                    src={`${awsLink}${
                                      settings?.Expertise?.find(
                                        (item) => item._id === id
                                      ).image
                                    }`}
                                  ></img>
                                </div>
                                <div className="ml-[35px]">
                                  <p className="text-[#517CA8] text-[17.5px] text-base-17-5">
                                    {
                                      settings?.Expertise?.find(
                                        (item) => item._id === id 
                                      ).text
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <></>
                          );
                        })} */}
                            {userDetail?.serviceSpecializations?.length > 0 &&
                      userDetail?.serviceSpecializations?.map((it, idx) => {
                        return (
                          it[0] !== "6" && (
                            <div
                              key={idx}
                              className="bg-white p-2 h-min mb-1  text-[#517CA8] text-base-17-5 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040]  w-full"
                            >
                              {it}
                            </div>
                          )
                        );
                      })}
                      {/* <div className='overflow-x-auto scrollbar-content max-h-[500px] scrollbar-vertical '>
                                                         <div className=' bg-white rounded min-h-[60px] flex items-center '>
                                 <div className='ml-3'>
                                    <img src={sat}></img>
                                 </div>
                                 <div className=' ml-10'>
                                    <p className='text-[#517CA8] ' style={{fontWeight:'400'}}></p>
                                 </div>
                              </div>
                              </div> */}

                      {/* <EditableText editable={editable}
                                 onClick={() => setToEdit({ ...toEdit, serviceSpecializations: { ...toEdit.serviceSpecializations, active: true } })}
                                 text='Expertise'
                                 className='text-lg mb-2' textClassName="flex-1 text-center text-[21px]" /> */}
                      {/* May Be Useful */}
                      {/* <div className='flex flex-col row-span-2 overflow-x-auto scrollbar-content max-h-[500px] scrollbar-vertical'>
                                 {settings && settings.Expertise?.length > 0 && userDetail.serviceSpecializations && userDetail.serviceSpecializations.map((id, idx) => {
                                    return (
                                       settings.Expertise?.find(item => item._id === id) ?
                                          <div key={idx} className='flex flex-col items-center mb-10'>
                                             <div className='flex h-90 w-90 rounded-full  items-center justify-center mb-3' >
                                                <img className='max-w-[90px] max-h-[90px]' src={settings.Expertise.find(item => item._id === id).image}
                                                />
                                             </div>
                                             <p className='opacity-70 font-semibold text-lg'>
                                                {settings.Expertise.find(item => item._id === id).text}
                                             </p>
                                          </div>
                                          :
                                          <></>
                                    )
                                 })}
                              </div> */}
                    </div>
                  }
                />
              </div>
            </div>
            <div className="col-span-6">
              <div className="flex font-semibold items-center">
                <div className="text-xl text-[#26435F] text-base-20 text-[#26435F] font-semibold mb-1">
                  Tutor Highlight Video
                </div>
               
                {(isOwn == true || persona === "admin") && (  <p
                    className="text-[#667085] ml-auto underline cursor-pointer text-[15px] text-base-15"
                    onClick={() =>
                      setToEdit({
                        ...toEdit,
                        videoLink: { ...toEdit.videoLink, active: true },
                      })
                    }
                  >
                    edit
                  </p>)}
    
              </div>

              <div className="pt-10  h-[460px] design:min-h-[460px]  relative z-10 flex items-end ">
               {videoLink ?<YoutubeEmbed embedId={videoLink} />:
<div className="!w-full bg-white  mb-10 !h-full flex-1 flex justify-center  items-center">  
<div
  class="relative ml-5 !w-[90%] my-auto overflow-hidden translate-y-[-15%] !h-[350px]   rounded-lg !bg-fit bg-center bg-no-repeat  text-center"
  id="highPlace"
 >
  <div
    class="absolute z-50 bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-fixed"
   >
    <div class="flex h-full mx-auto mt-8  max-w-[80%]  items-center justify-center">
      <div class="text-[#517CA8]">
        <p class="mb-4 text-md font-semibold text-base-20">Use this space to add a YouTube video highlighting the tutor or your company.</p>
       
        <button
          type="button"
          class="rounded-md bg-[#FFA28D] p-2 px-4 text-white text-base-17-5"
          data-te-ripple-init
          onClick={() =>{
            if(isOwn === true || persona === "admin") 
            setToEdit({
              ...toEdit,
              videoLink: { ...toEdit.videoLink, active: true },
            })
          }}
          data-te-ripple-color="light">

         + Add Highlight Video
        </button>
      </div>
    </div>
  </div>
</div>

</div>             }
           
                {/* <div className={`${styles.backBtn} mt-10`} >
                     </div> */}
                {isOwn === true || persona === "admin" ? (
                  <div className={`${styles.editButton} mt-10`}>
                    {/* <BackBtn to={-1} /> */}
                    {/* <CircleButton
                                 className='flex items-center rounded-full'
                                 children={
                                    <EditableText editable={persona === "tutor" || persona === "admin"} />
                                 }
                                 onClick={() => setToEdit({ ...toEdit, videoLink: { ...toEdit.videoLink, active: true } })}
                              /> */}
                    {/* <EditableText editable={true} className="right-0" /> */}
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className="relative z-[100] flex justify-between text-xl text-[#26435F] font-semibold text-base-20">
                <span>Reviews</span>

                {(persona === "admin" || isOwn) && (
                  <p
                    className="text-[#667085] ml-auto underline cursor-pointer text-[15px] font-semibold text-base-15"
                    onClick={() =>
                      setToEdit({
                        ...toEdit,
                        tutorReviews: {
                          ...toEdit.tutorReviews,
                          tutorReviews: [
                            {
                              tutorId: "",
                              userTag: "", // "parent"
                              service: "",
                              date: "",
                              content: "",
                              orgId: "",
                            },
                          ],
                          active: true,
                        },
                      })
                    }
                  >
                    edit
                  </p>
                )}
              </div>
              <ProfileCard
                className="border border-[#00000010]"
                hideShadow
                bgClassName="bg-white pl-7 py-3 rounded-[10px]"
                body={

                  <>
                  {tutorTotalReviews[currentPage-1] ?
                  <div>
                    <p className="text-[#24A3D9] text-[15px] text-base-17-5">
                      {tutorTotalReviews[currentPage-1]?.customCreatedAt?getDateFormat(tutorTotalReviews[currentPage-1]?.customCreatedAt):"None"}
                    </p>
                    <div>
                      <p className="text-[#517CA8] mt-4 font-light text-[17.503px] text-base-17-5">
                        {" "}
                        {tutorTotalReviews[currentPage-1]?.comments}{" "}
                      </p>
                    </div>
                    <div className="flex mt-7 text-[15px]">
                      <div>
                        <button className=" h-[31px] rounded-full w-[120px] mr-5 text-base-15 bg-[#26435F33] text-[#26435F]">
                          {tutorTotalReviews[currentPage-1]?.userTag}
                        </button>
                      </div>
                      <div>
                        <button className="rounded-full h-[33px] w-[100px] bg-[#26435F33] text-base-15 text-[#26435F]">{tutorTotalReviews[currentPage-1]?.service[0]}</button>
                      </div>
                    </div>
                  </div>:<div className="h-24">
                    
                    No Review Given! </div>}
                   
                  </>
                }
              />
               <div className="flex justify-end items-center">
                    <Pagination
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      totalPages={
                         Math.ceil(tutorTotalReviews?.length )
                      }
                    />
                    
            
                  </div>
            </div>

            <div className="col-span-3">
              <div className="flex font-semibold items-center">
                <div className="text-xl text-[#26435F] text-base-20 text-[#26435F] font-semibold">
                  Interests
                </div>
                {(isOwn === true || persona === "admin") && (
                  <p
                    className="text-[#667085] ml-auto underline cursor-pointer text-[15px] text-base-15"
                    onClick={() =>
                      setToEdit({
                        ...toEdit,
                        interest: { ...toEdit.interest, active: true },
                      })
                    }
                  >
                    edit
                  </p>
                )}
              </div>

              <ProfileCard
                className="flex-1 pr-0"
                hideShadow
                bgClassName="bg-profilecard"
                body={
                  // //settings && settings.interest.length >= 0 &&
                  // <div  className=' max-h-[500px] custom-scroller scroll-mx-3 '> { userDetail.interest && userDetail.interest.map((id, idx) => {
                  //    return (
                  //       userDetail?.interest?.find(item => item._id === id) ?
                  //          <div className='mt-[7px]  rounded-md shadow-[0px_0px_2px_0px_#00000040] overflow-x-auto  '>
                  //             <div className=' bg-white rounded-5 min-h-[50px]  flex items-center pl-[40px] '>
                  //                <div className='ml-3'>
                  //                   <img className='max-w-[40px] max-h-[40px]' src={`${awsLink}${userDetail?.interest?.find(item => item._id === id).image}`}></img>
                  //                </div>
                  //                <div className=' ml-[35px]'>
                  //                   <p className='text-[#517CA8] text-[17.5px]'>{userDetail?.interest?.find(item => item._id === id).text}</p>
                  //                </div>
                  //             </div>
                  //          </div>
                  //          :
                  //          <></>
                  //    )
                  // })}

                  //    {/* <EditableText editable={editable}
                  //       onClick={() => setToEdit({ ...toEdit, interest: { ...toEdit.interest, active: true } })}
                  //       text='Interests'
                  //       className='text-lg mb-2 ' textClassName="flex-1 text-center text-[21px]" /> */}
                  //    {/* <div className='flex flex-col overflow-x-auto scrollbar-content max-h-[500px] scrollbar-vertical'>
                  //       {settings && settings.interest.length > 0 && userDetail.interest && userDetail.interest.map((id, idx) => {
                  //          return (
                  //             settings?.interest?.find(item => item._id === id) ?
                  //                <div key={idx} className='flex flex-col items-center mb-10'>
                  //                   <div className='flex h-90 w-90 rounded-full  items-center justify-center mb-3' >
                  //                      <img className='max-w-[90px] max-h-[90px]' src={settings?.interest?.find(item => item._id === id).image}
                  //                      />
                  //                   </div>
                  //                   <p className='opacity-70 font-semibold text-lg'>
                  //                      {settings?.interest?.find(item => item._id === id).text}
                  //                   </p>
                  //                </div>
                  //                :
                  //                <></>
                  //          )
                  //       })}
                  //    </div> */}

                  // </div>
                  <div className="w-full relative h-[450px] p-1 flex flex-col gap-1  rounded-md items-center overflow-y-auto custom-scroller">
                    {/* {settings ? (
                             settings.interest.length > 0 &&
                             userDetail.interest.map((id, idx) => {
                               return settings.interest.find((item) => item._id === id) ? (
                                 <div
                                   key={idx}
               
                                   className="bg-white  p-2 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] flex-1 w-full"
               
                                 >
                                   <div className="flex h-90 w-90 rounded-full  items-center justify-center mb-3">
                                     <img
                                       className="max-w-[90px] max-h-[90px]"
                                       src={
                                         settings.interest.find((item) => item._id === id)
                                           ? `${awsLink}${
                                               settings.interest.find(
                                                 (item) => item._id === id
                                               ).image
                                             }`
                                           : ""
                                       }
                                     />
                                   </div>
                                   <p className="opacity-70 font-semibold text-lg">
                                     {settings.interest.find((item) => item._id === id) ? (
                                       settings.interest.find((item) => item._id === id).text
                                     ) : (
                                       <></>
                                     )}
                                   </p>
                                 </div>
                               ) : (
                                 <> </>
                               );
                             })
                           ) : (
                             <></>
                           )} */}

                    {userDetail?.interest?.length > 0 &&
                      userDetail?.interest.map((it, idx) => {
                        return (
                          it[0] !== "6" && (
                            <div
                              key={idx}
                              className="bg-white p-2 h-min  text-[#517CA8] text-base-17-5 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040]  w-full"
                            >
                              {it}
                            </div>
                          )
                        );
                      })}
                  </div>
                }
              />
            </div>
          </div>
        {
          persona =="admin" &&   <div className="mt-[50px] border-4 mx-[40px]  border-t border-[#CBD6E2]-300 justify-center border-dotted"></div>
        }
          {/* address row */}
          {
            (isOwn===true || persona ==="admin") && <div className="flex justify-between mt-[55px] gap-x-[37px]">
            <div className="w-[60.32vw]">
              <div className="flex items-center mb-1">
                {(isOwn === true || persona === "admin") && (
                  <>
                    <div className=" text-[#26435F] text-xl font-semibold text-base-20">
                      Address
                    </div>
                    <p
                      className="text-[#667085] ml-auto underline cursor-pointer font-semibold text-[15px] text-base-15"
                      onClick={() =>
                        setToEdit({
                          ...toEdit,
                          tutorAddress: {
                            ...toEdit.tutorAddress,
                            active: true,
                          },
                        })
                      }
                    >
                      edit
                    </p>
                  </>
                )}
              </div>

              <div>
                {isOwn === true || persona === "admin" ? (
                  <ProfileCard
                    bgClassName="bg-white "
                    className="h-[90px] design:h-[100px] mt-[-4px] "
                    body={
                      <div className="flex justify-between px-7 pt-[25px] pb-[24px]">
                        <div className="">
                          <div className="text-[#24A3D9] font-semibold text-[15.002px] text-base-20">
                            Street Adress
                          </div>
                          <div className="text-[#517CA8] font-normal text-[17.503px] text-base-17-5">
                            {userDetail.address}
                          </div>
                        </div>

                        <div className="">
                          <div className="text-[#24A3D9] font-semibold text-[15.002px] text-base-20">
                            City
                          </div>
                          <div className="text-[#517CA8] font-normal text-[17.503px] text-base-17-5">
                            {userDetail.city}
                          </div>
                        </div>

                        <div className="">
                          <div className="text-[#24A3D9] font-semibold text-[15.002px] text-base-20">
                            {" "}
                            State
                          </div>
                          <div className="text-[#517CA8] font-normal text-[17.503px] text-base-17-5">
                            {userDetail.state}
                          </div>
                        </div>

                        <div className="">
                          <div className="text-[#24A3D9] font-semibold text-[15.002px] text-base-20">
                            Country
                          </div>
                          <div className="text-[#517CA8] font-normal text-[17.503px] text-base-17-5">
                            {userDetail.country}
                          </div>
                        </div>

                        <div className="">
                          <div className="text-[#24A3D9] font-semibold text-[15.002px] text-base-20">
                            Zip
                          </div>
                          <div className="text-[#517CA8] font-normal text-[17.503px] text-base-17-5">
                            {userDetail.pincode}
                          </div>
                        </div>
                      </div>
                    }
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
            {persona === "admin" && false && (
              <div className="w-[10.49vw]">
                <div className="flex items-center">
                  <div className="text-xl text-[#26435F] font-semibold text-base-20">
                    Salary
                  </div>
                  <p
                    className="text-[#667085] ml-auto underline cursor-pointer font-semibold text-[15px] text-base-15"
                    onClick={() =>
                      setToEdit({
                        ...toEdit,
                        income: { ...toEdit.income, active: true },
                      })
                    }
                  >
                    edit
                  </p>
                </div>
                <ProfileCard
                  bgClassName="bg-white"
                  className="flex items-center justify-center min-h-[106px] "
                  body={
                    <>
                      <div>
                        <div className="font-normal text-[#517CA8] text-xl">
                          {"$" + userDetail.income} / hour
                        </div>
                      </div>
                    </>
                  }
                />
              </div>
            )}
            {isOwn === true || persona === "admin" ? (
              <div className="w-[25.10vw]">
                <div className="flex items-center">
                  <div className="text-[#26435F] text-xl font-semibold text-base-20">
                    Payment Info
                  </div>
                  {persona === "admin" && (
                    <p
                      className="text-[#667085] ml-auto underline cursor-pointer font-semibold text-[15px] text-base-15"
                      onClick={() =>
                        setToEdit({
                          ...toEdit,
                          paymentInfo: { ...toEdit.paymentInfo, active: true },
                        })
                      }
                    >
                      edit
                    </p>
                  )}
                </div>
                <ProfileCard
                  bgClassName="bg-white "
                  className="flex items-center justify-center h-[90px] design:h-[100px]"
                  body={
                    <>
                      <div className="pt-[25px] pb-[24px]">
                        {/* <EditableText editable={editable}
                                       onClick={() => setToEdit({ ...toEdit, paymentInfo: { ...toEdit.paymentInfo, active: true } })}
                                     
                                    /> */}
                        <div className="font-normal text-[#B3BDC7]  text-lg px-3 py-2 text-base-17-5">
                          {userDetail.paymentInfo}
                        </div>
                      </div>
                    </>
                  }
                />
              </div>
            ) : (
              <></>
            )}
          </div>
          }
{persona === "admin" || <div className="mt-[100px]"></div>}
{persona === "admin" && (
                <div className="flex justify-between mt-20 mb-[191px]">
            
                <div className="w-[36.5vw]">
                  <div className="text-xl text-[#26435F] font-semibold mb-[-10px] text-base-20">
                    Recent Feedback History
                  </div>
                  <div className="flex">
                    <Table
                      tableHeaders={tableHeaders1}
                      // onClick={{ handleDelete, handleNavigate }}
                      dataFor="tutorFeedback"
                      data={feedbacks}
                      // excludes={['assiginedTutor', 'student_id', 'parentFirstName', 'parentLast']}
                      // tableHeaders={tableHeaders}
                      headerObject={true}
                      maxPageSize={9}
                      noArrow={true}
                      // loading={tableLoading}
                    />
                  </div>
                </div>
            
              {persona === "admin" && (
                <div className="w-[19.8vw] ">
                  <BarChart studentFeedbacks={studentFeedbacks}></BarChart>
                </div>
              )}
              {persona === "admin" && (
                <div className=" w-[1.25px] h-[630px] bg-[#CBD6E2] "></div>
              )}
              {persona === "admin" && (
                <div className="w-[20.9vw] ">
                  <div className="flex items-center">
                    <div className="text-[#26435F] text-[20px] text-base-20 font-semibold">
                      Tutor Status
                    </div>
                    {(isOwn === true || persona === "admin") && (
                      <p
                        className="text-[#667085] ml-auto underline cursor-pointer text-[15px] font-semibold text-base-15"
                        onClick={() =>
                          setToEdit({
                            ...toEdit,
                            tutorLevel: { ...toEdit.tutorLevel, active: true },
                          })
                        }
                      >
                        edit
                      </p>
                    )}
                  </div>
                  <ProfileCard
                    hideShadow
                    className="border border-[#00000010]"
                    bgClassName="bg-white"
                    body={
                      <>
                        <div className="text-[#517CA8] text-lg p-3 min-h-[50px] shadow-[0px_0px_2px_0px_#00000040] rounded-md text-base-17-5">
                          {userDetail.tutorLevel}
                        </div>
                      </>
                    }
                  />
  
                  <div className="mt-[33.75px]">
                    <div className="flex justify-between mb-[-10px]">
                      <div className=" text-[#26435F] text-xl font-semibold text-base-20">
                        Service Rates
                      </div>
                      {persona === "admin" && (
                        <p
                          className="text-[#667085] ml-auto underline cursor-pointer text-[15px] font-semibold text-base-15"
                          onClick={() =>
                            setToEdit({
                              ...toEdit,
                              tutorServices: {
                                ...toEdit.tutorServices,
                                tutorServices: tutorAdminServices,
                                active: true,
                              },
                            })
                          }
                        >
                          edit
                        </p>
                      )}
                    </div>
                    <Table
                      tableHeaders={tableHeaders2}
                      dataFor="serviceRates"
                      data={newServices}
                      maxPageSize={7}
                      setPrice={(idx, isPresent) =>
                        setToEdit({
                          ...toEdit,
                          tutorServices: {
                            ...toEdit.tutorServices,
                            active: true,
                            selectedIdx: idx,
                            servicePresent: isPresent,
                          },
                        })
                      }
                      headerObject={true}
                      noArrow={true}
                    ></Table>
                  </div>
                </div>
              )}
            </div>
            )}
        

          {/* <div className='lg:grid mt-12 px-2 grid-cols-12 grid-ros-6 lg:mt-[60px] gap-5 lg:pl-3'>


                  <div className='col-span-6 row-span-10 flex flex-col'> */}

          {/* <ProfileCard className='lg:mt-4' hideShadow
                        title={
                           <EditableText text='Contact'
                              editable={editable}
                              onClick={() => setToEdit({ ...toEdit, tutorContact: { ...toEdit.tutorContact, active: true } })}
                              textClassName='flex-1 text-center'
                              className='text-primary text-lg capitalize  '
                              imgClass='ml-auto' />
                        }
                        body={
                           <div className='flex justify-center mt-5 lg:mt-3'>
                              <div className='flex flex-col items-center mr-8'>
                                 <img src={LinkedIn} />
                                 <p className='mt-1 font-medium opacity-60 text-xs cursor-pointer'
                                    onClick={() => window.open(userDetail.linkedIn)} >
                                    {userDetail.linkedIn ? userDetail.linkedIn : 'Your linkedIn'}
                                 </p>
                              </div>
                              <div className='flex flex-col items-center mr-8'>
                                 <img src={MailIcon} />
                                 <p className='mt-1 font-medium opacity-60 text-xs cursor-pointer'
                                    onClick={() => window.open(`mailto:${user.email}`)} >
                                    {user.email ? user.email : ''}
                                 </p>
                              </div>
                              <div className='flex flex-col items-center'>
                                 <img src={WhatsappIcon} />
                                 <p className='mt-1 font-medium.4 opacity-60 text-xs cursor-pointer'
                                    onClick={() => window.open(`https://wa.me/${user.phone}`)}>
                                    {user.phone ?
                                       <>
                                          {`${user.phoneCode ? user.phoneCode : ''} ${user.phone}`}
                                       </>
                                       : ''}
                                 </p>
                              </div>
                           </div>
                        } /> */}
        </div>

        {/* <div className='mt-53 pb-0 col-span-3 lg:mt-0 flex flex-col'>
                     {
                        !isOwn &&
                        <ProfileCard hideShadow
                           className='col-span-3 mb-5 mt-6 lg:mt-0 flex items-center'
                           body={
                              <div className='overflow-x-auto flex-1 scrollbar-content'>
                                 <div className='mb-2'>
                                    <EditableText text='Education'
                                       editable={editable}
                                       onClick={() => setToEdit({ ...toEdit, education: { ...toEdit.education, active: true } })}
                                       className='text-primary text-lg capitalize'
                                       textClassName='flex-1'
                                       imgClass='ml-auto' />
                                    <div className='flex mt-2 justify-center items-center bg-[#F6D0A3] w-[90px] h-[90px] mx-auto rounded-full'>
                                       <img src={EducationIcon} alt='education' />
                                    </div>
                                    <p className='mt-5 text-center font-medium text-sm'>
                                       {education ? education : 'Your Education'}
                                    </p>
                                 </div>

                              </div>
                           }
                        />
                     }
                     
                  </div> */}

        {/* //for address */}

        {/* {
                     (isOwn === true) || (persona === 'admin') ?
                        <ProfileCard hideShadow
                           className='col-span-3 mt-6 lg:mt-0 flex items-center'
                           body={
                              <div className='overflow-x-auto scrollbar-content'>
                                 <div className='mb-6'>
                                    <EditableText editable={editable}
                                       onClick={() => setToEdit({ ...toEdit, tutorAddress: { ...toEdit.tutorAddress, active: true } })}
                                       text='Address'
                                       className='text-xl justify-between'
                                    />
                                    <p className='mt-5  font-medium text-sm'>
                                       {address ? address : '-'}
                                    </p>
                                 </div>

                              </div>
                           }
                        /> : <></>
                  } */}

        {/* {
                     (isOwn === true) || (persona === 'admin') ?
                        <ProfileCard hideShadow
                           className='col-span-6 mt-6 lg:mt-0'
                           body={
                              <div className='overflow-x-auto scrollbar-content'>
                                 <div className='mb-6'>
                                    <EditableText editable={editable}
                                       onClick={() => setToEdit({ ...toEdit, paymentInfo: { ...toEdit.paymentInfo, active: true } })}
                                       text='Payment Info'
                                       className='text-xl justify-between'
                                    />
                                    <div className='mt-5  font-medium text-sm ma-w-[100px]'>
                                       <span className='inline-block pl-2'>
                                          {paymentInfo === undefined ? ' -' : paymentInfo ? paymentInfo : '-'}
                                       </span>
                                        <p className='flex items-center mb-3.5'>
                                          <span>
                                             Bank Name
                                          </span>
                                          <span className='inline-block pl-2'>
                                             {paymentInfo === undefined ? ' -' : paymentInfo.bankName ? paymentInfo.bankName : '-'}
                                          </span>
                                       </p>
                                        <p className='flex items-center mb-3.5'>
                                          <span>
                                             Acc No.
                                          </span>
                                          <span className='inline-block pl-2'>
                                             {paymentInfo === undefined ? ' -' : paymentInfo.AccNo ? paymentInfo.AccNo : '-'}
                                          </span>
                                       </p>
                                       <p className='flex items-center mb-3.5'>
                                          <span>
                                             IFCS Code
                                          </span>
                                          <span className='inline-block pl-2'>
                                             {paymentInfo === undefined ? ' -' : paymentInfo.ifcsCode ? paymentInfo.ifcsCode : '-'}
                                          </span>
                                       </p> 
                                    </div>
                                 </div>

                              </div>
                           }
                        /> : <></>
                  } */}

        {/* {
                     (isOwn === true) || (persona === 'admin') ?
                        <ProfileCard hideShadow
                           className='col-span-3 mt-6 lg:mt-0'
                           body={
                              <div className='overflow-x-auto scrollbar-content'>
                                 <div className='mb-6'>
                                    <EditableText editable={persona === 'admin' ? true : false}
                                       onClick={() => setToEdit({ ...toEdit, tutorRank: { ...toEdit.tutorRank, active: true } })}
                                       text='Tutor Rank'
                                       className='text-xl justify-between'
                                    />
                                    <p className='mt-1.5  font-medium text-sm whitespace-nowrap'>
                                       {tutorRank ? tutorRank : '-'}
                                    </p>
                                 </div>
                                  <div className='mb-6'>
                                 <EditableText editable={editable}
                                    onClick={() => setToEdit({ ...toEdit, income: { ...toEdit.income, active: true } })}
                                    text='Income'
                                    className='text-xl justify-between'
                                 />
                                 <p className='mt-1.5 font-medium text-sm whitespace-nowrap'>
                                    {income ? income : '-'}
                                 </p>
                              </div>
                              <div>
                                 <EditableText editable={editable}
                                    onClick={() => setToEdit({ ...toEdit, paymentStatus: { ...toEdit.paymentStatus, active: true } })}
                                    text='Payment Status'
                                    className='text-xl justify-between'
                                 />
                                 <p className='mt-1.5 font-medium text-sm whitespace-nowrap'>
                                    {paymentStatus ? paymentStatus : '-'}
                                 </p>
                              </div> 
                              </div>
                           }
                        /> : <></>
                  } */}

        {/* rates */}
        {/* {
               persona === 'admin' &&
               <ProfileCard hideShadow
                  className='col-span-3 mt-6 lg:mt-0  max-h-[300px] overflow-y-auto scrollbar-content'
                  body={
                     <div className=''>
                        {
                           organization.settings?.servicesAndSpecialization?.map((service, idx) => {
                              let price = '-'
                              let isPresent = false
                              if (userDetail !== undefined || userDetail !== null) {
                                 let obj = userDetail?.tutorServices?.find(serv => serv.service === service.service)
                                 // console.log('obj', obj);
                                 if (obj !== undefined) {
                                    price = obj.price
                                    isPresent = true
                                 }
                              }
                              return (
                                 <div className='mb-6'>
                                    <EditableText
                                       // text='Test Prep Rate'
                                       text={service.service}
                                       editable={editable}
                                       onClick={() => setToEdit({
                                          ...toEdit,
                                          tutorServices: {
                                             ...toEdit.tutorServices, active: true, selectedIdx: idx,
                                             servicePresent: isPresent
                                          }
                                       })}
                                       className='text-primary justify-between text-lg capitalize'
                                       imgClass='ml-auto' />
                                    <p className='mt-1.5  font-medium text-sm whitespace-nowrap'>
                                       {price}
                                    </p>
                                 </div>
                              )
                           })
                        }
                        <div className='mb-6'>
                           <EditableText
                              // text='Test Prep Rate'
                              text='Service 1'
                              editable={editable}
                              onClick={() => setToEdit({
                                 ...toEdit,
                                 tutorServices: { ...toEdit.tutorServices, active: true, selectedIdx: 0 }
                              })}
                              className='text-primary justify-between text-lg capitalize'
                              imgClass='ml-auto' />
                           <p className='mt-1.5  font-medium text-sm whitespace-nowrap'>
                              {testPrepRate ? `$${testPrepRate}` : '-'}
                           </p>
                        </div>
                        <div className='mb-6'>
                           <EditableText
                              //  text='Subject Tutoring Rate'
                              text='Service 2'
                              editable={editable}
                              onClick={() => setToEdit({ ...toEdit, rates: { ...toEdit.rates, active: true } })}
                              className='text-primary justify-between text-lg capitalize'
                              imgClass='ml-auto' />
                           <p className='mt-1.5 font-medium text-sm whitespace-nowrap'>
                              {subjectTutoringRate ? `$${subjectTutoringRate}` : '-'}
                           </p>
                        </div>
                        <div>
                           <EditableText
                              //  text='Other Rate'
                              text='Service 3'
                              editable={editable}
                              onClick={() => setToEdit({ ...toEdit, rates: { ...toEdit.rates, active: true } })}
                              className='text-primary justify-between text-lg capitalize'
                              imgClass='ml-auto' />
                           <p className='mt-1.5 font-medium text-sm whitespace-nowrap'>
                              {otherRate ? `$${otherRate}` : '-'}
                           </p>
                        </div>
                     </div>
                  }
               />

            }
            {
               persona === 'admin'&&false &&
               <FeedbackTable feedbacks={feedbacks} />
            } */}

        {/* </div>

            </div> */}
      </div>
      <ParentEditables
        settings={settings}
        fetchDetails={fetchDetails}
        userId={isOwn ? id : params.id}
        toEdit={toEdit}
        setToEdit={setToEdit}
        persona={user.role}
        awsLink={awsLink}
      />
    </>
  );
}
