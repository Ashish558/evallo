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
import copy1 from "../../../assets/YIcons/VectorCopy.svg";
import copy2 from "../../../assets/YIcons/fluent_copy-16-filledBlackCopy.svg";
import left from "../../../assets/YIcons/VectorleftParent.svg";
import right from "../../../assets/YIcons/VectorrightParent.svg";
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

export default function StudentProfile({ isOwn }) {
  const navigate = useNavigate();
  const [editable, setEditable] = useState(false);
  const dispatch = useDispatch();
  const { role: persona } = useSelector((state) => state.user);

  const [user, setUser] = useState({});
  const [userDetail, setUserDetail] = useState({});
  const [settings, setSettings] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [associatedStudents, setAssociatedStudents] = useState([]);
  const params = useParams();
  const [getUserDetail, userDetailResp] = useLazyGetUserDetailQuery();
  const [fetchSettings, settingsResp] = useLazyGetSettingsQuery();
  const [editableByTutor, setEditableByTutor] = useState(false);
  const { awsLink } = useSelector((state) => state.user);

  const { id } = useSelector((state) => state.user);
  console.log("user parent", user, userDetail)

  const [selectedScoreIndex, setSelectedScoreIndex] = useState(0);
  const { organization } = useSelector((state) => state.organization);

  const [toEdit, setToEdit] = useState({
    frame0: {
      active: false,
      firstName: "",
      lastName: "",
      about: "",
      email: "",
      phone: "",
      alternateEmail: "",
      assiginedStudents: [],
      studentsData: [],
      phoneCode: "",
    },
    frame1: {
      active: false,
      timeZone: "",
      industry: "",
      accomodations: "",
      birthyear: "",
      country: "",
      address: "",
      state: "",
      city: "",
      pincode: "",
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

    associatedStudents: {
      active: false,
      assiginedStudents: [],
    },
    notes: {
      active: false,
      notes: "",
    },
  });
  async function handleCopyClick(textToCopy) {
    console.log("copying", textToCopy);
    try {
      await navigator.clipboard.writeText(textToCopy);
      //  alert('Text copied to clipboard');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }
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
  const [fetchOrg, setFetchOrg] = useState(false)
  const fetchDetails = (closeModal) => {
    let userId = "";
    if (isOwn) {
      userId = id;
    } else {
      userId = params.id;
    }
    getUserDetail({ id: userId }).then((res) => {
      console.log("parent details -- ", userId, res);
      if (!res?.data?.data) return
      // //console.log('tut id', id);
      if (res.data.data.user.assiginedTutors) {
        if (res.data.data.user.assiginedTutors?.includes(id)) {
          setEditable(true);
          setEditableByTutor(true);
        }
      }
      const {
        firstName,
        lastName,
        phone,
        email,
        assiginedStudents,
        phoneCode,
      } = res.data.data.user;

      setUser(res.data.data.user);
      if (!res?.data?.data?.userdetails) return
      const { leadStatus, notes, residentialAddress, subscribeType } =
        res.data.data.userdetails;

      let studentsData = [];
      if (assiginedStudents === undefined || assiginedStudents?.length === 0)
        setAssociatedStudents([]);

      assiginedStudents !== undefined &&
        assiginedStudents.map((student, idx) => {
          getUserDetail({ id: student }).then((res2) => {
            if (res2?.error) return
            console.log("student ", { [id]: res2 })
            studentsData.push({
              _id: res2.data.data.user._id,
              value: `${res2.data.data.user.firstName} ${res2.data.data.user.lastName}`,
              name: `${res2.data.data.user.firstName} ${res2.data.data.user.lastName}`,
              photo: res2.data.data.user.photo ? res2.data.data.user.photo : null,
              email: res2.data.data.user.email ? res2.data.data.user.email : null,
              service: res2.data.data.userdetails?.service ? res2.data.data.userdetails?.service : [],
            });

            setAssociatedStudents([...studentsData]);
          });

        });

      let {
        service,
        accomodations,
        timeZone,
        birthyear,
        industry,
        schoolName,
        grade,
        about,
        pincode,
        address,
        country,
        city,
        state: state1,
        subscriptionCode,
      } = res.data.data.userdetails;

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
                  ...prev.frame0.schoolName,
                  schoolName,
                  about,
                  //  assiginedStudents:studentsData?.map(student => student?._id)
                },
                frame1: {
                  ...prev.frame1,
                  ...prev.frame1.timeZone,
                  timeZone: timeZone ? timeZone : "",
                  ...prev.frame1.birthyear,
                  country: country,
                  state: state1,
                  city: city,
                  pincode: pincode,
                  address: address,

                  birthyear,
                  ...prev.frame1.industry,
                  industry
                },

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
              };
            })
          );
        });
      promiseState().then(() => {
        closeModal && handleClose();
        setFetchOrg(true)
      });
      setUserDetail(res.data.data.userdetails);
    });
  };


  useEffect(() => {
    fetchDetails();
  }, [params.id]);
  useEffect(() => {
    if (associatedStudents?.length > 0)
      setToEdit((prev) => {
        return {
          ...prev,
          frame0: {
            ...prev.frame0,
            assiginedStudents: associatedStudents?.map(it => it?._id)
          }
        }
      })
  }, [associatedStudents])
  useEffect(() => {
    fetchSettings().then((res) => {
      if (res.error) {
        //console.log("settings fetch err", res.error);
        return;
      }
      setSettings(res.data.data.setting);
    });
  }, []);

  const handleProfilePhotoChange = (file) => {
    // //console.log(file)
    let url = "";
    const formData = new FormData();
    formData.append("photo", file);
    if (persona === "admin") {
      url = `${BASE_URL}api/user/admin/addphoto/${params.id} `;
    } else {
      url = `${BASE_URL}api/user/addphoto`;
    }
    axios
      .patch(url, formData, { headers: getAuthHeader() })
      .then((res) => {
        // //console.log(res)
        fetchDetails();
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  useEffect(() => {
    // //console.log(userDetail?.timeZone);
    if (userDetail?.timeZone === undefined) return;
    dispatch(updateTimeZone({ timeZone: userDetail?.timeZone }));
  }, [userDetail?.timeZone]);

  // //console.log(user)
  // //console.log(userDetail)
  // //console.log('associatedParent', associatedParent)
  // //console.log('isEditable', editable)
  // //console.log(settings)
  const handleCopy = text => {
    navigator.clipboard.writeText(text);
  }
  // useEffect(() => {
  //   //Don't need this effect 
  //   return false;
  //   if (user.assiginedStudents === undefined) return;
  //   let studentsData = [];
  //   user?.assiginedStudents.map((student, id) => {
  //     getUserDetail({ id: student }).then((res) => {
  //       console.log("associated  ,,",res)
  //       if (res.error) return;
  //       studentsData.push({
  //         _id: res.data.data.user._id,
  //         name: `${res.data.data.user.firstName} ${res.data.data.user.lastName}`,
  //         photo: res.data.data.user.photo ? res.data.data.user.photo : null,
  //         email: res.data.data.user.email ? res.data.data.user.email : null,
  //         service: res.data.data.userdetails?.service ? res.data.data.userdetails?.service : [],
  //       });

  //     });
  //     if(id===user?.assiginedStudents?.length-1)

  //     setAssociatedStudents(studentsData);
  //   });

  //   // setAssociatedStudents(studentsData)
  //   setActiveIndex(0);
  // }, [user,user?.assiginedStudents]);

  useEffect(() => {
    fetchDetails();
  }, [params.id]);
  //console.log({user,userDetail})
  return (
    <>
      <div className={`w-[83.3vw] mx-auto pb-[70px]`}>
        <p className="text-[#24A3D9] !my-[calc(50*0.0522vw)] text-base-20">
          <span className="cursor-pointer z-5000 relative" onClick={() => navigate('/')}>
            {organization?.company +
              " > " +
              user?.firstName +
              " " +
              user?.lastName +
              " > "}
          </span>
          <span className="font-semibold">Dashboard</span>
        </p>
        {!isOwn ? (
          <button
            className=" bg-[#D9BBFF] px-[14px] mb-10 py-[8px] relative z-[5000] cursor-pointer rounded-[8px] text-[#636363] text-[18px] font-medium top-[1px] left-[0px] gap-[12px] cursor-pointer flex justify-center items-center"
            onClick={() => window.history.back()}
          >
            <img src={LeftIcon} alt="icon" /> Back
          </button>
        ) : (
          <></>
        )}

        <div className={` rounded-b-md w-full flex flex-col relative `}>
          <div className="flex gap-7">
            <div className={` rounded-b-md w-[67.71vw] flex flex-col relative `}>
              <div className=" bg-[#26435F]   px-[30px] h-[142px] border rounded-tr-5 rounded-tl-5  w-full  flex  items-center ">
                <div className="flex flex-1 w-full relative">
                  <div className="h-fit">
                    <ProfilePhoto
                      src={
                        user.photo
                          ? `${awsLink}${user.photo}`
                          : "/images/Rectangle 2347.svg"
                      }
                      imgSizeClass="w-[187px] h-[187px] mt-[100px] !translate-y-8 border-[2.5px] border-white "
                      imageClassName="w-[187px] h-[187px] border-[4px] border-white "
                      className=""
                      handleChange={handleProfilePhotoChange}
                      editable={false}
                    />
                    {(persona === "admin" || isOwn) && <EditableText
                      editable={editable}
                      onClick={() =>
                        setToEdit({
                          ...toEdit,

                          frame0: {
                            ...toEdit.frame0,
                            active: true,
                          },
                        })
                      }
                      text="Edit Profile"
                      textClassName=" ml-2 text-[0.78vw]  mx-auto text-center text-[#26435F] text-underline font-semibold"
                      className="text-sm my-0 flex items-center justify-center text-center !translate-y-9  "
                    />}
                  </div>
                  <div className="flex-1 flex justify-between items-center">
                    <div className="ml-4 my-auto">
                      <div className="flex  font-semibold items-center text-[#F3F5F7] text-[1.56vw]">
                        {user.firstName} {user.lastName}
                      </div>
                      {(persona !== "tutor" || ((persona === 'tutor') && organization?.settings?.permissions && organization?.settings?.permissions[1]?.choosedValue)) && <div className="flex mt-1 text-base-17-5 items-center text-[#F3F5F7]">
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
                      </div>}
                    </div>

                    {(persona !== "tutor" || ((persona === 'tutor') && organization?.settings?.permissions && organization?.settings?.permissions[1]?.choosedValue)) && <div className="flex flex-col   font-medium text-white my-auto ">
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
                          <div className="flex h-min !bg-transparent justify-center flex-col  text-base-17-5">
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
              <div className="bg-white !rounded-b-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] flex design:h-[170px]  h-[170px] justify-between ">
                <div className="ml-[220px] py-auto w-[80.33%] text-[12px] px-5    overflow-y-auto pt-3  ">
                  <p className=" font-semibold text-[#26435F] text-[0.78vw]">
                    About
                  </p>
                  <p className=" text-[#517CA8] text-base-17-5 overflow-y-auto">
                    {userDetail?.about}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-[13.80vw]  bg-white rounded-md overflow-hidden !rounded-b-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] relative">
              <div
                className={`${styles.studentsContainer} min-h-[290px] w-full`}
              >

                {associatedStudents?.map((student, idx) => {
                  return (
                    <div
                      key={idx}
                      className={`${styles.student} ${activeIndex === idx
                        ? styles.activeStudent
                        : idx < activeIndex
                          ? styles.previousStudent
                          : styles.nextStudent
                        } flex flex-col items-center  lg:mb-10`}
                    >
                      <div className="bg-[#354a5e] w-full h-[142px]">
                        <div className="flex justify-center items-center">
                          <ProfilePhoto
                            src={
                              student.photo
                                ? `${awsLink}${student.photo}`
                                : "/images/Rectangle 2346.svg"
                            }
                            imgSizeClass="!w-[100px] !h-[100px] !translate-y-[20px]"
                            imageClassName="!w-[100px] !h-[100px] border-[2px] border-[#26435F]"
                            className=" "
                            handleChange={handleProfilePhotoChange}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col pt-4   gap-1 justify-center items-center ">
                        <p
                          onClick={() =>
                            navigate(`/profile/student/${student._id}`)
                          }
                          className="text-base-17-5 font-semibold cursor-pointer text-[#26435F]"
                        >
                          {" "}
                          {student.name}
                        </p>
                        {(persona !== "tutor" || (persona === "tutor" && organization?.settings?.permissions && organization?.settings?.permissions[1]?.choosedValue)) && <p className="  text-[#667085] text-base-15 ml-4">
                          {student.email}
                          <span>
                            <img
                              onClick={() => handleCopyClick(student?.email)}
                              className="inline-block !w-4 !h-4 mr-2 cursor-pointer"
                              src={copy2}
                              alt="copy2"
                            />
                          </span>
                        </p>}
                        <p className="  text-[#517CA8] w-[100px] flex gap-3 text-base-15">
                          {student?.service?.map((it, idx) => {
                            return (
                              <span key={idx}>{it}</span>
                            )
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="absolute left-[50%] bottom-0 text-center transform -translate-x-1/2 -translate-y-1/2">
                <p className=" text-base-17-5 mx-auto text-center flex justify-center  z-[3333]">
                  <span>
                    <img
                      className="inline-block !w-4 !h-4 mr-2"
                      src={left}
                      alt="left"
                      onClick={() =>
                        activeIndex !== 0 && setActiveIndex(activeIndex - 1)
                      }
                    />
                  </span>
                  <span>
                    <img
                      className="inline-block !w-4 !h-4 mr-2"
                      src={right}
                      onClick={() =>
                        activeIndex < associatedStudents.length - 1 &&
                        setActiveIndex(activeIndex + 1)
                      }
                      alt="right"
                    />
                  </span>
                </p>
              </div>
            </div>
          </div>
          {(persona === "admin" || isOwn) && <EditableText
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
            textClassName="text-[0.78vw] text-[#26435F]  text-underline"
            className="text-sm my-0 flex justify-end translate-y-7  float-right"
          />}
          <SPFrame0
            userDetail={userDetail}
            settings={settings}
            toEdit={toEdit}
            setToEdit={setToEdit}
          />

          {
            persona === "admin" && <SPFrame1
              user={user}
              userDetail={userDetail}
              settings={settings}
              userId={isOwn ? id : params.id}
              editable={editable}
              fetchDetails={fetchDetails}
              setToEdit={setToEdit}
              toEdit={toEdit}
            />
          }

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
