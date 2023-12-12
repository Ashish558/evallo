import React, { useEffect, useRef, useState } from "react";
import { useLazyGetParentsByNameQuery } from "../../../../app/services/admin";
import { useLazyGetStudentsByNameQuery } from "../../../../app/services/session";
import ProfilePhoto from "./ProfilePhoto";
import caution from "../../../../assets/icons/octicon_stop-16.svg";
import down from "../../../../assets/YIcons/Group33.svg";
import sat from "../../../../assets/YIcons/Official SAT® scores.svg";
import {
  useUpdateTutorDetailsMutation,
  useUpdateUserDetailsMutation,
  useUpdateUserFieldsMutation,
  usePostTutorDetailsMutation,
  useAddLinkStudentMutation,
  useAddNotesMutation,
} from "../../../../app/services/users";
import InputField from "../../../../components/InputField/inputField";
import InputSearch from "../../../../components/InputSearch/InputSearch";
import InputSelect from "../../../../components/InputSelect/InputSelect";
import Modal from "../../../../components/Modal/Modal";
import SimpleCalendar from "../../../../components/SimpleCalendar/SimpleCalendar";
import demoUser from "../../../../assets/icons/demo-user.png";
import Slider from "../../../../components/Slider/Slider";
import { grades, subjects } from "../../../../constants/constants";
import styles from "./style.module.css";
import CountryCode from "../../../../components/CountryCode/CountryCode";
import { useSelector } from "react-redux";
import { BASE_URL, getAuthHeader } from "../../../../app/constants/constants";
import ProfileCard from "../../../../components/ProfileCard/ProfileCard";
import axios from "axios";
import InputFieldDropdown from "../../../../components/InputField/inputFieldDropdown";
import InputSelectNew from "../../../../components/InputSelectNew/InputSelectNew";
import useOutsideAlerter from "../../../../hooks/useOutsideAlerter";
import { Interest, commonSubjects, qualities } from "./staticData";
import SCheckbox from "../../../../components/CCheckbox/SCheckbox";
import moment from "moment-timezone";

// 637b9df1e9beff25e9c2aa83
export default function ParentEditables({
  userId,
  user,
  editable,
  setToEdit,
  toEdit,
  fetchDetails,
  settings,
  awsLink,
  selectedScoreIndex,
}) {
  const [title, setTitle] = useState("");
  const [currentField, setCurrentField] = useState({});
  const [currentToEdit, setCurrentToEdit] = useState({});
  const [addNotes, notesStatus] = useAddNotesMutation();
  const [student, setStudent] = useState("");
  const [fetchStudents, studentResponse] = useLazyGetStudentsByNameQuery();
  const [students, setStudents] = useState([]);
  const [textOpen, setTextOpen] = useState(false);
  const [parent, setParent] = useState("");
  const [fetchParents, fetchParentsResp] = useLazyGetParentsByNameQuery();
  const [parents, setParents] = useState([]);
  const { role: persona } = useSelector((state) => state.user);
  const [updateFields, updateFieldsResp] = useUpdateUserFieldsMutation();
  const [updateDetails, updateDetailsResp] = useUpdateUserDetailsMutation();
  const [updateTutorDetails, updateTutorDetailsResp] =
    useUpdateTutorDetailsMutation();
  const [postTutorDetails, postTutorDetailsResp] =
    usePostTutorDetailsMutation();
  const [updatedService, setUpdatedService] = useState({});
  const [loading, setLoading] = useState(false);
  const timeZones = moment.tz.names(); // String[]

  const { organization } = useSelector((state) => state.organization);

  const data = [
    {
      name: "profileData",
      title: "profileData",
      api: "user",
    },
    {
      name: "frame0",
      title: "Basic Info",
      api: "user",
    },
    {
      name: "frame1",
      title: "Other Details",
      api: "userDetail",
    },
    {
      name: "whiteBoardLinks",
      title: "Whiteboard Link",
      api: "userDetail",
    },
    {
      name: "fullName",
      title: "Full Name",
      api: "user",
    },
    {
      name: "timeZone",
      title: "Time Zone",
      api: "userDetail",
    },
    {
      name: "subscribeType",
      title: "Subscription",
      api: "userDetail",
    },
    {
      name: "subscriptionCode",
      title: "Subscription",
      api: "userDetail",
    },
    {
      name: "birthYear",
      title: "Birth Year",
      api: "userDetail",
    },
    {
      name: "accomodations",
      title: "Accomodations",
      api: "userDetail",
    },
    {
      name: "schoolName",
      title: "School Name",
      api: "userDetail",
    },
    {
      name: "grade",
      title: "Grade",
      api: "userDetail",
    },

    {
      name: "industry",
      title: "Industry",
      api: "userDetail",
    },
    {
      name: "contact",
      title: "Contact",
      api: "user",
    },
    {
      name: "address",
      title: "Residential Address",
      api: "userDetail",
    },
    {
      name: "associatedStudents",
      title: "Associated Students",
      api: "user",
    },
    {
      name: "notes",
      title: "Admin Notes",
      api: "user",
    },
    {
      name: "service",
      title: "Services",
      api: "userDetail",
    },
    {
      name: "leadStatus",
      title: "Lead Status",
      api: "userDetail",
    },
    {
      name: "subjects",
      title: "What Subjects Are You Currently Studying?",
      api: "userDetail",
    },

    {
      name: "personality",
      title: "How Would You Describe Yourself Using A Few Adjectives?",
      api: persona === "tutor" ? "tutorDetail" : "userDetail",
    },
    {
      name: "interest",
      title: "What Are Your Interests?",
      api: persona === "tutor" ? "tutorDetail" : "userDetail",
    },
    {
      name: "serviceSpecializations",
      title: "Service Specialisation",
      api: persona === "tutor" ? "tutorDetail" : "userDetail",
    },
    {
      name: "associatedParent",
      title: "Associated Parent",
      api: "user",
    },
    {
      name: "tutorLevel",
      title: "Tutor Level",
      api: "tutorDetail",
    },
    {
      name: "education",
      title: "Education",
      api: "tutorDetail",
    },
    {
      name: "rates",
      title: "Rates",
      api: "tutorDetail",
    },
    {
      name: "tutorAddress",
      title: "Address",
      api: "tutorDetail",
    },
    {
      name: "pincode",
      title: "pincode",
      api: "tutorDetail",
    },
    {
      name: "paymentInfo",
      title: "Payment Info",
      api: "tutorDetail",
    },
    {
      name: "baseLineScore",
      title: "Baseline Scores",
      api: "userDetail",
    },
    {
      name: "tutorRank",
      title: "Tutor Rank",
      api: "tutorDetail",
    },
    {
      name: "income",
      title: "Income",
      api: "tutorDetail",
    },
    {
      name: "paymentStatus",
      title: "Payment Status",
      api: "tutorDetail",
    },
    {
      name: "tagLine",
      title: "Tag Line",
      api: "tutorDetail",
    },
    {
      name: "about",
      title: "Bio",
      api: "tutorDetail",
    },
    {
      name: "addressData",
      title: "Address",
      api: "tutorDetail",
    },
    {
      name: "tutorContact",
      title: "Contact",
      api: "user",
    },
    {
      name: "satScores",
      title: "Official SAT® Scores",
      api: "userDetail",
    },
    {
      name: "actScores",
      title: "Official ACT® Scores",
      api: "userDetail",
    },
    {
      name: "aboutScore",
      title: "PSAT / P-ACT Scores",
      api: "userDetail",
    },
    {
      name: "tutorServices",
      title: "Service",
      api: "tutorDetail",
    },
    {
      name: "videoLink",
      title: "Youtube Link",
      api: "tutorDetail",
    },
  ];

  const [addLink, addLinkStatus] = useAddLinkStudentMutation();
  //console.log("parentEditables",currentToEdit)
  const handleProfilePhotoChange = (file) => {
    // //console.log(file)
    let url = "";
    const formData = new FormData();
    formData.append("photo", file);
    if (persona === "admin") {
      url = `${BASE_URL}api/user/admin/addphoto/${userId} `;
    } else {
      url = `${BASE_URL}api/user/addphoto`;
    }
    axios.patch(url, formData, { headers: getAuthHeader() }).then((res) => {
      //  //console.log(res);
      fetchDetails();
    });
  };

  const getCurrentField = (keyName) => {
    Object.keys(data).map((key) => {
      if (data[key].name === keyName) {
        // //console.log(data[key]);
        setCurrentField(data[key]);
      }
    });
  };

  useEffect(() => {
    Object.keys(toEdit).map((key) => {
      if (toEdit[key].active === true) {
        getCurrentField(key);
        // //console.log(toEdit);
        // setEditFieldValue(toEdit[key])
        setCurrentToEdit(toEdit[key]);
      }
    });
    // //console.log("currentUser");
  }, [toEdit]);
  const [hideTooltip, setTooltip] = useState(false);
  useEffect(() => {
    if (user?.isVerified) {
      setTooltip(user?.isVerfied);
      console.log({ vv: user?.isVerfied, hideTooltip });
    }
  }, [user]);

  const handleClose = () => {
    let tempToEdit = {};
    Object.keys(toEdit).map((key) => {
      return (tempToEdit[key] = { ...toEdit[key], active: false });
    });
    setToEdit(tempToEdit);
    setTextOpen(false);
    // setToEdit()
  };

  useEffect(() => {
    if (student.length > 0) {
      fetchStudents(student).then((res) => {
        // //console.log('students', res.data.data.students);
        let tempData = res.data.data.students.map((tutor) => {
          return {
            _id: tutor._id,
            value: `${tutor.firstName} ${tutor.lastName}`,
            photo: tutor.photo ? tutor.photo : null,
          };
        });
        setStudents(tempData);
      });
    }
  }, [student]);
  //console.log({persona})
  useEffect(() => {
    if (parent.length > 0) {
      fetchParents(parent).then((res) => {
        let tempData = res.data.data.parents.map((parent) => {
          // //console.log(parent);
          return {
            _id: parent._id,
            value: `${parent.firstName} ${parent.lastName}`,
            fname: parent.firstName,
            lname: parent.lastName,
            email: parent.email,
          };
        });
        setParents(tempData);
      });
    }
  }, [parent]);

  const handleStudentsChange = (item) => {
    let tempStudents = [...currentToEdit.assiginedStudents];
    let tempStudentsData = [...currentToEdit.studentsData];
    if (tempStudents.includes(item._id)) {
      tempStudents = tempStudents.filter((student) => student !== item._id);
      tempStudentsData = tempStudentsData.filter(
        (student) => student._id !== item._id
      );
    } else {
      tempStudents.push(item._id);
      tempStudentsData.push(item);
    }
    // //console.log(tempStudentsData);
    setCurrentToEdit({
      ...currentToEdit,
      assiginedStudents: tempStudents,
      studentsData: tempStudentsData,
    });
  };

  const handleServiceChange = (item) => {
    let tempService = [...currentToEdit.service];
    if (tempService.includes(item)) {
      // //console.log(tempService);
      tempService = tempService.filter((service) => service !== item);
    } else {
      tempService.push(item);
    }
    setCurrentToEdit({ ...currentToEdit, service: tempService });
  };

  const handleSubjectChange = (item) => {
    let tempSubjects = [...currentToEdit.subjects];
    if (tempSubjects.includes(item)) {
      // //console.log(tempSubjects);
      tempSubjects = tempSubjects.filter((subject) => subject !== item);
    } else {
      tempSubjects.push(item);
    }
    setCurrentToEdit({ ...currentToEdit, subjects: tempSubjects });
  };

  // useEffect(() => {
  //    updateFields({ id: '637b1522e00aeb4098e8952a', fields: { amountToPay: 5 } })
  //       .then(res => {
  //          //console.log(res);
  //       })
  // }, [])
  const emailValidation = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    let reqBody = { ...currentToEdit };
    delete reqBody["active"];
    //console.log({reqBody,userId});
    const isEmpty = (val) => {
      if (!val || val?.trim()?.length === 0) return true;
      return false;
    };
    if (currentField.name === "frame0") {
      if (isEmpty(currentToEdit.firstName)) {
        alert("first name cannot be empty.");
        return;
      }
      if (isEmpty(currentToEdit.lastName)) {
        alert("last name cannot be empty.");
        return;
      }
      if (!emailValidation.test(currentToEdit.email)) {
        alert("Enter valid email.");
        return;
      }
    }
    if (currentToEdit.hasOwnProperty("notes")) {
      reqBody = {
        internalNotes: [
          ...currentToEdit.internalNotes,
          {
            note: currentToEdit?.notes,

            date: new Date(),
          },
        ],
      };
      // let reqBody = {
      //   note: currentToEdit?.notes,
      //   type: "internalNotes", // or it can be 'internalNotes'
      //   date: new Date(),
      // };

      //  addNotes(reqBody).then((res)=>{
      //   console.log("internal",{res})
      //  })
    }
    if (currentToEdit.hasOwnProperty("whiteBoardLinks")) {
      let ch = false;
      const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      currentToEdit?.whiteBoardLinks?.map((link) => {
        if (!urlRegex.test(link)) ch = true;
      });
      if (ch) {
        alert("Enter valid link!");
        return;
      }
    }
    const userDetailSave = (reqBody) => {
      // if (reqBody.satScores) {
      //   if (isNaN(reqBody?.satScores?.maths)) reqBody.satScores.maths = 0;
      //   if (isNaN(reqBody?.satScores?.verbal)) reqBody.satScores.verbal = 0;
      // }
      // if (reqBody.actScores) {
      //   if (isNaN(reqBody.actScores.maths)) reqBody.actScores.maths = 0;
      //   if (isNaN(reqBody.actScores.english)) reqBody.actScores.english = 0;
      //   if (isNaN(reqBody.actScores.reading)) reqBody.actScores.reading = 0;
      //   if (isNaN(reqBody.actScores.science)) reqBody.actScores.science = 0;
      // }

      //console.log({reqBody,currentToEdit});
      // return

      updateDetails({ id: userId, fields: reqBody }).then((res) => {
        //console.log(res);
        setLoading(false);
        fetchDetails(true, true);
        // handleClose()
      });
    };
    if (currentField.api === "user") {
      updateFields({ id: userId, fields: reqBody }).then((res) => {
        //console.log(res);
        setLoading(false);
        if (reqBody.linkedIn) {
          if (currentToEdit.isPresent === false) {
            delete reqBody["isPresent"];
            postTutorDetails({
              id: userId,
              fields: { linkedIn: reqBody.linkedIn },
            }).then((res) => {
              setLoading(false);
              fetchDetails(true, true);
              // handleClose()
            });
          } else {
            delete reqBody["isPresent"];
            updateTutorDetails({
              id: userId,
              fields: { linkedIn: reqBody.linkedIn },
            }).then((res) => {
              setLoading(false);
              fetchDetails(true, true);
              // handleClose()
            });
          }
        }
        fetchDetails(true, true);
        // handleClose()
      });
    } else if (currentField.api === "userDetail") {
      userDetailSave(reqBody);
    } else if (currentField.api === "tutorDetail") {
      if (reqBody.tutorLevel) {
        const level = getLevel(reqBody.tutorLevel);
        reqBody.tutorLevel = level;
      }
      if (reqBody.tutorServices) {
        if (currentToEdit.servicePresent === false) {
          reqBody.tutorServices = [
            ...reqBody.tutorServices,
            { ...updatedService },
          ];
        } else {
          reqBody.tutorServices = reqBody.tutorServices.map((serv) => {
            if (serv.service === updatedService.service) {
              return { ...updatedService };
            } else {
              return { ...serv };
            }
          });
        }
      }
      // //console.log('reqBody', reqBody)
      // return
      if (currentToEdit.isPresent === false) {
        delete reqBody["isPresent"];
        postTutorDetails({ id: userId, fields: reqBody }).then((res) => {
          //console.log("posted", res);
          setLoading(false);
          fetchDetails(true, true);
          // handleClose()
        });
      } else {
        delete reqBody["isPresent"];
        updateTutorDetails({ id: userId, fields: reqBody }).then((res) => {
          //console.log("patched", res);
          setLoading(false);
          fetchDetails(true, true);
          // handleClose()
        });
      }
    }
    let { schoolName, grade } = currentToEdit;
    let { dropBoxLink, dropLink } = currentToEdit;
    if (currentToEdit.hasOwnProperty("schoolName")) {
      let reqBody = {
        schoolName: currentToEdit.schoolName,
        grade: currentToEdit?.grade,
      };

      userDetailSave(reqBody);
    }
    if (currentToEdit.hasOwnProperty("about")) {
      let reqBody = {
        about: currentToEdit.about,
      };

      userDetailSave(reqBody);
    }
    if (
      currentToEdit?.hasOwnProperty("driveLink") &&
      currentToEdit?.driveLink?.length > 2
    ) {
      let reqBody = {
        type: "driveLink",
        link: currentToEdit.driveLink,
        studentId: userId,
      };
      addLink(reqBody).then((res) => {
        //console.log("drive",res);
        if (res?.data) {
          //console.log("drive link added")
        }
      });
    }
    if (
      currentToEdit?.hasOwnProperty("dropBoxLink") &&
      currentToEdit?.dropBoxLink?.length > 2
    ) {
      let reqBody = {
        type: "dropBoxLink",
        link: currentToEdit.dropBoxLink,
        studentId: userId,
      };
      addLink(reqBody).then((res) => {
        //console.log("drop",res);
        if (res?.data) {
          //console.log("drop link added")
        }
      });
    }
  };

  const getLevel = (str) => {
    const levels = ["ORANGE", "PURPLE", "BROWN", "BLACK"];
    if (str === "ORANGE") {
      return levels[0];
    }
    if (str === "PURPLE") {
      return levels[1];
    }
    if (str === "BROWN") {
      return levels[2];
    }
    if (str === "BLACK") {
      return levels[3];
    } else {
      return "";
    }
  };

  // //console.log('awsLink', awsLink)
  // //console.log('toedit--', currentToEdit)
  // //console.log('setting', settings.servicesAndSpecialization[currentToEdit.selectedIdx])
  // //console.log('field', currentField)
  // //console.log('sett', settings)
  // //console.log('students', students)
  // //console.log('parents', parents)

  const checkNumber = (prevNum, num, limit) => {
    if (limit) {
      if (num > limit) {
        return prevNum;
      } else {
        return num;
      }
    }
    return num;
  };

  const handlePriceChange = (value) => {
    let updated = [];
    currentToEdit?.tutorServices?.map((serv) => {
      //if exists
      if (
        serv.service ===
        organization.settings?.servicesAndSpecialization[
          currentToEdit.selectedIdx
        ].service
      ) {
        updated.push({ ...serv, price: value });
        setUpdatedService({ ...serv, price: value });
      } else {
        let newserv =
          organization.settings?.servicesAndSpecialization[
          currentToEdit.selectedIdx
          ];
        updated.push({ ...newserv, price: value });
        setUpdatedService({ ...newserv, price: value });
      }
    });

    //console.log(updated);
    // setCurrentToEdit(prev => {
    //    return {
    //       ...prev,

    //    }
    // })
  };
  // //console.log(settings);

  const [startDate, setStartDate] = useState(new Date());
  ////console.log({ currentField, currentToEdit });
  const forCss = [
    "profileData",
    "interest",
    "serviceSpecializations",
    "personality",
    "subjects",
  ];

  return Object.keys(toEdit).map((key) => {
    return (
      toEdit[key].active === true && (
        <Modal
          fetchDetails={fetchDetails}
          key={key}
          classname={
            forCss.includes(currentField.name)
              ? "max-w-[1038px] md:pb-5 mx-auto overflow-auto pb-5 "
              : currentField.name === 'frame1' ?
                'max-w-[488px] md:pb-5 mx-auto overflow-auto pb-5 '
                : currentField.name === 'notes' ? 'max-w-[660px] md:pb-5 mx-auto overflow-auto pb-5 ' :
                  "max-w-fit md:pb-5 mx-auto overflow-auto pb-5 "
          } /*{ ` max-w-[900px] md:pb-5 mx-auto overflow-visible pb-5`}*/
          title=""
          crossBtn={true}
          cancelBtnStyle={{ top: "18px" }}
          crossBtn2={true}
          titleClassName="!hidden"
          underline={true}
          handleClose={handleClose}
          body={
            <>
              <div className="flex  items-center">
                <div className="mr-5 text-[#26435F] font-semibold text-[17px]">
                  {currentField.title
                    ? currentField.title
                    : toEdit.tutorServices
                      ? "Service"
                      : ""}
                </div>
                <button
                  className="w-[125px] bg-[#FFA28D] p-1 rounded-[7.5px] text-white  text-base pl-3 pr-3 ml-auto h-[37.5px]"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              </div>
              <div className="mt-3 border-1  border-t-2 pb-3 border-[1.25px_solid_#00000033] justify-center "></div>
              <form
                className="mt-5 mb-4"
                id="editable-form"
                onSubmit={handleSubmit}
              >
                {/* {currentField.fields && currentField.fields} */}
                {currentField.name === "frame0" && (
                  <div className="flex flex-col px-2 max-h-[60vh] !w-[1030px]">
                    <div className="flex gap-3 items-center justify-between">
                      <div className="!w-[140px]">
                        <ProfilePhoto
                          src={
                            user.photo
                              ? `${awsLink}${user.photo}`
                              : "/images/Rectangle 2346.svg"
                          }
                          imageClassName=" border-[4px] border-white"
                          className=""
                          imgSizeClass="!w-[120px] !h-[120px] "
                          handleChange={handleProfilePhotoChange}
                          editable={editable}
                        />
                      </div>
                      <div className="flex flex-col gap-5 mr-[65px]  w-[80%]">
                        <div className="flex !text-sm gap-4 justify-around mr-10 ">
                          <InputField
                            label="First name"
                            labelClassname="text-[#26435F] font-medium my-2"
                            placeholder="Student First name"
                            inputContainerClassName="text-xs !shadow-[0px_0px_2px_0px_#00000040]  bg-primary-50 border-0 !py-3 !px-2 !rounded-[5px] h-[50px] !w-[193px]"
                            inputClassName="bg-transparent text-xs   "
                            parentClassName=""
                            type="text"
                            value={currentToEdit.firstName}
                            onChange={(e) => {
                              const regex = /^[a-zA-Z ]*$/;
                              const isValid = regex.test(e.target.value);
                              if (isValid)
                                setCurrentToEdit({
                                  ...currentToEdit,
                                  firstName: e.target.value,
                                });
                            }}
                          />

                          <InputField
                            label="Last name"
                            labelClassname="text-[#26435F] font-medium my-2"
                            placeholder="Student Last name"
                            inputContainerClassName="text-xs  !shadow-[0px_0px_2px_0px_#00000040] bg-primary-50 border-0 !py-3 !px-2 !rounded-[5px] h-[50px] !w-[193px]"
                            inputClassName="bg-transparent text-xs   "
                            parentClassName=""
                            type="text"
                            value={currentToEdit.lastName}
                            onChange={(e) => {
                              const regex = /^[a-zA-Z ]*$/;
                              const isValid = regex.test(e.target.value);
                              if (isValid)
                                setCurrentToEdit({
                                  ...currentToEdit,
                                  lastName: e.target.value,
                                });
                            }}
                          />
                          <InputField
                            label="School / College"
                            labelClassname="text-[#26435F] font-medium my-2"
                            placeholder="School / College"
                            inputContainerClassName="text-xs !shadow-[0px_0px_2px_0px_#00000040] bg-primary-50 border-0 !py-3 !px-2 !rounded-[5px] h-[50px] w-[270px]"
                            inputClassName="bg-transparent text-xs   "
                            parentClassName=" "
                            type="text"
                            value={currentToEdit.schoolName}
                            onChange={(e) =>
                              setCurrentToEdit({
                                ...currentToEdit,
                                schoolName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="flex !text-sm ml-1  justify-around  mt-[-10px]">
                          <InputField
                            // IconLeft={caution}
                            IconRight={caution}
                            iconRIghtClassName={'mr-1 ml-1' }
                            hideTooltip={hideTooltip}
                            label="Email"
                            labelClassname="text-[#26435F] font-medium my-2"
                            placeholder="Student Email Id"
                            inputContainerClassName="text-xs !shadow-[0px_0px_2px_0px_#00000040]  bg-primary-50 border-0 !py-3 !px-1 !rounded-[5px] h-[50px] w-[290px]"
                            inputClassName="bg-transparent !w-[200px] text-xs   "
                            parentClassName=""
                            type="text"
                            value={currentToEdit.email}
                            onChange={(e) =>
                              setCurrentToEdit({
                                ...currentToEdit,
                                email: e.target.value,
                              })
                            }
                            Tooltip={
                              !user?.isVerfied && (
                                <span className="absolute top-10 w-[333px] h-[167px] scale-0 rounded bg-gray-800 px-[13px] py-[20px] text-xs text-white group-hover:scale-100 font-light">
                                  <h3 className="text-[#24A3D9] font-semibold mb-1">
                                    Email Confirmation Sent
                                  </h3>
                                  You need to verify your email if
                                  <div className="list-disc mb-2 px-1">
                                    <li>you created a new account.</li>
                                    <li>you recently changed your email.</li>
                                  </div>
                                  We have sent you an email verification link to
                                  your current email address to make sure that
                                  it really is you who requested a change.
                                </span>
                              )
                            }
                          />
                          <div id="number2 ">
                            <InputFieldDropdown
                              codeClassName="!bg-white !rounded-sm"
                              placeholder="Student's Phone"
                              labelClassname="text-[#26435F] font-medium my-2"
                              inputContainerClassName="!text-xs flex-1 !border-none  bg-primary-50  !shadow-[0px_0px_2px_0px_#00000040] h-[50px] w-[250px]"
                              inputClassName="bg-transparent flex-1 !w-[90px]  !text-xs rounded-[4px] "
                              parentClassName=""
                              label="Student Phone"
                              value={currentToEdit.phone}
                              codeValue={currentToEdit.phoneCode}
                              handleCodeChange={(e) => {
                                setCurrentToEdit({
                                  ...currentToEdit,
                                  phoneCode: e.target.value,
                                });
                              }}
                              onChange={(e) => {
                                const regex = /^[0-9 ]*$/;
                                const isValid = regex.test(e.target.value);
                                if (isValid && e.target.value?.length < 11)
                                  setCurrentToEdit({
                                    ...currentToEdit,
                                    phone: e.target.value,
                                  });
                              }}
                            />
                          </div>
                          <InputSelectNew
                            optionData={grades}
                            labelClassname={`text-[#26435F] font-medium  my-2`}
                            label="Grade"
                            placeholder="Select"
                            inputContainerClassName="text-xs  bg-primary-50 !py-3 border-0 !rounded-[5px] !shadow-[0px_0px_2px_0px_#00000040] h-[50px] w-[190px]"
                            inputClassName="bg-transparent text-xs  "
                            parentClassName=""
                            type="text"
                            value={currentToEdit.grade}
                            onChange={(val) =>
                              setCurrentToEdit({ ...currentToEdit, grade: val })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex-1 mt-5">
                        <p className=" text-[17.5px] text-[#26435F] font-medium">
                          About
                        </p>
                        <textarea
                          rows="3"
                          className="mt-1 block w-full h-[111px] resize-none focus:!ring-blue-500 p-2 focus:!border-blue-500 placeholder-[#CBD6E2] text-sm  placeholder:text-xs border border-[0.917px_solid_#D0D5DD] rounded-[6px]
                "
                          value={currentToEdit.about}
                          onChange={(e) => {
                            setCurrentToEdit({
                              ...currentToEdit,
                              about: e.target.value,
                            });
                          }}
                          placeholder="The student can add their bio in this space. Here are a few ideas to get started:
                          Likes, dislikes, personality, sports, school activities, preferred majors, target colleges, habits, academic scores, family, favorite movies and TV shows, music taste, learning styles, strengths and weaknesses."
                        ></textarea>
                      </div>
                      {persona === "admin" && (
                        <div>
                          <div
                            id="borderDashed2"
                            className=" w-[80%] mt-6 mx-auto my-4"
                          ></div>

                          <InputSearch
                            right={
                              <img
                                className="w-5 h-4 cursor-pointer"
                                alt="drop"
                                src={down}
                              />
                            }
                            labelClassname="text-[#26435F] mb-1 text-sm"
                            label="Associated Parent"
                            placeholder="Select Associated Parent"
                            parentClassName="w-[300px]  mb-10 !whitespace-normal"
                            inputContainerClassName="bg-[#F3F5F7] border-0 pt-3.5 pb-3.5"
                            inputClassName="bg-[#F3F5F7]"
                            type="text"
                            optionClassName="h-[60px] 2xl:h-[100px]  design:h-[200px]"
                            optionPrefix="s"
                            value={parent}
                            onChange={(e) => setParent(e.target.value)}
                            optionData={parents}
                            onOptionClick={(val) => {
                              console.log({ currentToEdit, val });
                              // setStudent(item.value);
                              setParent(val?.fname + " " + val?.lname);
                              setCurrentToEdit({
                                ...currentToEdit,
                                associatedParent: val._id,
                              });
                              // setCurrentToEdit({ ...currentToEdit, students: [... item._id] });
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {currentField.name === "fullName" && (
                  <div>
                    <div className="flex items-center mb-5">
                      <p className="font-medium mr-4 text-[20px]">
                        {" "}
                        First Name{" "}
                      </p>
                      <InputField
                        labelClassname="hidden"
                        placeholder="First Name"
                        inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-primary-50 border-0"
                        inputClassName="bg-transparent"
                        parentClassName="flex-1 "
                        type="text"
                        value={currentToEdit.firstName}
                        onChange={(e) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center">
                      <p className="font-medium mr-4 text-[20px]">
                        {" "}
                        Last Name{" "}
                      </p>
                      <InputField
                        labelClassname="hidden"
                        placeholder="Last Name"
                        inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-primary-50 border-0"
                        inputClassName="bg-transparent"
                        parentClassName="flex-1 "
                        type="text"
                        value={currentToEdit.lastName}
                        onChange={(e) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
                {currentField.name === "frame1" && (
                  <div className="flex flex-col gap-y-6">
                    <div className="flex justify-between !text-sm gap-x-[37.5px]">
                      <InputField
                        label="D.O.B"
                        labelClassname="text-[#26435F] mb-[6.71px]"
                        placeholder=""
                        inputContainerClassName="text-xs  bg-primary-50 border-0 !py-3 !px-2 !rounded-[5px]  !h-[50px] text-[#667085]"
                        inputClassName="bg-transparent text-xs   "
                        parentClassName="flex-1"
                        type="date"
                        value={currentToEdit.dob}
                        onChange={(e) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            dob: e.target.value,
                            birthyear: e.target.value?.split("-")[0],
                          })
                        }
                      />

                      <InputSelectNew
                        labelClassname="text-[#26435F] !font-bold text-base-17-5 mb-[6.71px]"
                        label="Time zone"
                        placeholder="Time Zone"
                        inputContainerClassName="text-xs  bg-primary-50 !py-3 border-0 !rounded-[5px] !h-[50px]"
                        inputClassName="bg-transparent text-xs  "
                        parentClassName="flex-1"
                        type="text"
                        value={currentToEdit.timeZone}
                        onChange={(val) =>
                          setCurrentToEdit({ ...currentToEdit, timeZone: val })
                        }
                        optionData={timeZones}
                        radio={true}
                      />
                    </div>
                    <div className="flex !text-sm gap-4 ">
                      <InputField
                        label="Dropbox"
                        labelClassname="text-[#26435F] mb-[6.71px]"
                        placeholder="Paste your link here"
                        inputContainerClassName="text-xs  bg-primary-50 border-0 !py-3 !px-2 !rounded-[5px] !h-[50px]"
                        inputClassName="bg-transparent text-xs   "
                        parentClassName="flex-1"
                        type="text"
                        disabled={persona === "student" || persona === "parent"}
                        value={currentToEdit.dropBoxLink}
                        onChange={(e) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            dropBoxLink: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex !text-sm gap-4 ">
                      <InputField
                        label="Drive"
                        labelClassname="text-[#26435F] mb-[6.71px]"
                        placeholder="Paste your link here"
                        inputContainerClassName="text-xs  bg-primary-50 border-0 !py-3 !px-2 !rounded-[5px] !h-[50px]"
                        inputClassName="bg-transparent text-xs   "
                        parentClassName="flex-1 "
                        type="text"
                        disabled={persona === "student" || persona === "parent"}
                        value={currentToEdit.driveLink}
                        onChange={(e) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            driveLink: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex !text-sm gap-x-[35px] ">
                      <InputSelectNew
                        label="Referral Code"
                        labelClassname="text-[#26435F] text-base-17-5"
                        placeholder="Select"
                        inputContainerClassName="text-xs  bg-primary-50 border-0 !py-3 !px-2 !rounded-[5px]  !h-[50px]"
                        inputClassName="bg-transparent text-xs   "
                        parentClassName="flex-1"
                        optionData={organization?.settings?.subscriptionCode?.map(
                          (it) => {
                            return {
                              ...it,
                              value: it?.code,
                            };
                          }
                        )}
                        optionType={"object"}
                        disabled={persona !== "admin"}
                        value={currentToEdit.subscriptionCode}
                        onChange={(e) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            subscriptionCode: e?.value,
                          })
                        }
                      />

                      <InputField
                        label="Accomodations"
                        labelClassname="text-[#26435F]"
                        placeholder="Select"
                        inputContainerClassName="text-xs  bg-primary-50 border-0 !py-3 !px-2 !rounded-[5px] !h-[50px]"
                        inputClassName="bg-transparent text-xs   "
                        parentClassName="flex-1"
                        type="text"
                        value={currentToEdit.accomodations}
                        onChange={(e) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            accomodations: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
                {currentField.name === "whiteBoardLinks" && (
                  <div className="flex flex-col gap-5  !w-[350px]">
                    <div className="max-h-[50vh] flex flex-col gap-5 custom-scroller overflow-y-auto">
                      {currentToEdit?.whiteBoardLinks?.map((it, id) => {
                        return (
                          <div className="flex !text-sm gap-4 ">
                            <InputField
                              label=""
                              labelClassname="text-[#26435F] hidden"
                              placeholder="Add whiteboard link"
                              inputContainerClassName="text-xs  bg-primary-50 border-0 !py-3 !px-2 !rounded-[5px]"
                              inputClassName="bg-transparent text-xs   "
                              parentClassName="flex-1 "
                              type="text"
                              value={it}
                              onChange={(e) => {
                                let temp = [...currentToEdit.whiteBoardLinks];

                                temp[id] = e.target.value;
                                setCurrentToEdit({
                                  ...currentToEdit,
                                  whiteBoardLinks: temp,
                                });
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <p
                      onClick={() => {
                        let tempScores = [...currentToEdit.whiteBoardLinks];

                        tempScores.push("");
                        setCurrentToEdit({
                          ...currentToEdit,
                          whiteBoardLinks: tempScores,
                        });
                      }}
                      className="font-semibold !text-lg cursor-pointer    text-[#24A3D9] text-center"
                    >
                      Add{" "}
                      <svg
                        className="inline-block -mt-1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M14.4987 9.29037H9.29037V14.4987C9.29037 14.775 9.18062 15.0399 8.98527 15.2353C8.78992 15.4306 8.52497 15.5404 8.2487 15.5404C7.97243 15.5404 7.70748 15.4306 7.51213 15.2353C7.31678 15.0399 7.20703 14.775 7.20703 14.4987V9.29037H1.9987C1.72243 9.29037 1.45748 9.18062 1.26213 8.98527C1.06678 8.78992 0.957031 8.52497 0.957031 8.2487C0.957031 7.97243 1.06678 7.70748 1.26213 7.51213C1.45748 7.31678 1.72243 7.20703 1.9987 7.20703H7.20703V1.9987C7.20703 1.72243 7.31678 1.45748 7.51213 1.26213C7.70748 1.06678 7.97243 0.957031 8.2487 0.957031C8.52497 0.957031 8.78992 1.06678 8.98527 1.26213C9.18062 1.45748 9.29037 1.72243 9.29037 1.9987V7.20703H14.4987C14.775 7.20703 15.0399 7.31678 15.2353 7.51213C15.4306 7.70748 15.5404 7.97243 15.5404 8.2487C15.5404 8.52497 15.4306 8.78992 15.2353 8.98527C15.0399 9.18062 14.775 9.29037 14.4987 9.29037Z"
                          fill="#24A3D9"
                        />
                      </svg>
                    </p>
                  </div>
                )}
                {currentField.name === "associatedStudents" && (
                  <div>
                    <div className=" mb-5">
                      {/* <p className='font-medium mr-4'> Associated Students </p> */}
                      <div className="max-w-[250px] mx-auto">
                        <Slider
                          images={currentToEdit.studentsData}
                          awsLink={awsLink}
                        />
                      </div>

                      <InputSearch
                        labelClassname="hidden"
                        placeholder="Type Student Name"
                        parentClassName="w-full  mb-10"
                        inputContainerClassName="bg-[#F3F5F7] border-0 pt-3.5 pb-3.5"
                        inputClassName="bg-[#F3F5F7]"
                        type="text"
                        optionPrefix="s"
                        value={student}
                        checkbox={{
                          visible: true,
                          name: "name",
                          match: currentToEdit.assiginedStudents,
                        }}
                        onChange={(e) => setStudent(e.target.value)}
                        optionData={students}
                        onOptionClick={(item) => {
                          // setStudent(item.value);
                          handleStudentsChange(item);
                          // setCurrentToEdit({ ...currentToEdit, students: [... item._id] });
                        }}
                      />
                    </div>
                  </div>
                )}
                {currentField.name === "contact" && (
                  <div>
                    <div className="flex items-center mb-5">
                      <p className="font-medium mr-4 min-w-[80px] text-[20px]">
                        {" "}
                        Email Id{" "}
                      </p>
                      <InputField
                        labelClassname="hidden"
                        placeholder="Email Id"
                        inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-primary-50 border-0"
                        inputClassName="bg-transparent rounded-[4px]"
                        parentClassName="flex-1 "
                        type="text"
                        value={currentToEdit.email}
                        onChange={(e) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center">
                      <p className="font-medium mr-4 min-w-[80px] text-[20px]">
                        {" "}
                        Phone{" "}
                      </p>
                      <InputField
                        prefix=""
                        labelClassname="hidden"
                        placeholder="Phone"
                        inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-primary-50 border-0"
                        inputClassName="bg-transparent rounded-[4px]  ml-[70px]"
                        parentClassName="flex-1 "
                        type="text"
                        value={currentToEdit.phone}
                        inputLeftField={
                          <CountryCode
                            className={styles.phoneNumber}
                            numberPrefix={currentToEdit.phoneCode}
                            setNumberPrefix={(val) => {
                              setCurrentToEdit({
                                ...currentToEdit,
                                phoneCode: val,
                              });
                            }}
                          />
                        }
                        onChange={(e) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
                {currentField.name === "birthYear" && (
                  <div className="bg-[#F3F5F7] ">
                    {/* <div className='flex items-center mb-5 bg-white rounded-10' style={{ boxShadow: "-3px -4px 24px rgba(0, 0, 0, 0.25)" }}> */}
                    <p className="font-medium mr-4 min-w-[60px]"> </p>
                    <InputField
                      labelClassname="hidden"
                      placeholder="Enter your birth year"
                      inputContainerClassName="text-sm pt-3 pb-3 rounded-sm bg-primary-50 border-0"
                      inputClassName="bg-transparent"
                      parentClassName="flex-1 "
                      type="text"
                      value={currentToEdit.birthyear}
                      onChange={(e) =>
                        setCurrentToEdit({
                          ...currentToEdit,
                          birthyear: e.target.value,
                        })
                      }
                      minLength={4}
                      maxLength={4}
                    />
                    {/* <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} /> 
                                 <SimpleCalendar setCurrentDate={setCurrentToEdit} /> */}
                    {/* </div> */}
                  </div>
                )}
                {currentField.name === "industry" && (
                  <div>
                    <div className="flex items-center mb-5 pt-2">
                      <InputField
                        value={currentToEdit.industry}
                        onChange={(e) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            industry: e.target.value,
                          })
                        }
                        inputContainerClassName="text-sm pt-3 pb-3 rounded-sm bg-primary-50 border-0"
                        inputClassName="bg-transparent"
                        placeholder="Industry"
                        parentClassName="w-full mr-4"
                      />
                    </div>
                  </div>
                )}
                {currentField.name === "address" && (
                  <div>
                    <div className="flex items-center mb-5 pt-6">
                      {/* <p className='font-medium mr-4 min-w-[60px]'>  </p> */}
                      <InputField
                        labelClassname="hidden"
                        placeholder="Enter your Residential Address"
                        inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-primary-50 border-0"
                        inputClassName="bg-transparent"
                        parentClassName="flex-1 "
                        type="text"
                        value={currentToEdit.residentialAddress}
                        onChange={(e) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            residentialAddress: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
                {currentField.name === "grade" && (
                  <div>
                    <div className="flex items-center mb-5 pt-6">
                      {/* <p className='font-medium mr-4 min-w-[60px]'>  </p> */}
                      <InputSelect
                        optionData={grades}
                        labelClassname="hidden"
                        placeholder="Enter your Grade"
                        inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-primary-50 border-0"
                        inputClassName="bg-transparent"
                        parentClassName="flex-1 "
                        type="text"
                        value={currentToEdit.grade}
                        onChange={(val) =>
                          setCurrentToEdit({ ...currentToEdit, grade: val })
                        }
                      />
                    </div>
                  </div>
                )}
                {currentField.name === "schoolName" && (
                  <div>
                    <div className="flex items-center mb-5 pt-6">
                      {/* <p className='font-medium mr-4 min-w-[60px]'>  </p> */}
                      <InputField
                        labelClassname="hidden"
                        placeholder="Enter your Schol Name"
                        inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-primary-50 border-0"
                        inputClassName="bg-transparent"
                        parentClassName="flex-1 "
                        type="text"
                        value={currentToEdit.schoolName}
                        onChange={(e) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            schoolName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
                {currentField.name === "timeZone" && (
                  <div>
                    <div className="flex items-center mb-5 pt-3 pb-5">
                      <InputSelect
                        value={currentToEdit.timeZone}
                        onChange={(val) =>
                          setCurrentToEdit({ ...currentToEdit, timeZone: val })
                        }
                        optionData={timeZones}
                        radio={true}
                        inputContainerClassName="pt-3 pb-3 border bg-[#D9D9D999]"
                        placeholder="Select"
                        parentClassName="w-full mr-4"
                        type="select"
                      />
                    </div>
                  </div>
                )}
                {currentField.name === "notes" && (
                  <div>
                    <div className="flex items-center mb-5 pt-0">
                      {/* <p className='font-medium mr-4 min-w-[60px]'>  </p> */}
                      <div className="border w-full h-full rounded-md">
                        {textOpen && (
                          <textarea
                            rows="3"
                            value={currentToEdit.notes}
                            onChange={(e) =>
                              setCurrentToEdit({
                                ...currentToEdit,
                                notes: e.target.value,
                              })
                            }
                            onFocus={() => setTextOpen(true)}
                            onBlur={() =>
                              currentToEdit?.notes?.length == 0 &&
                              setTextOpen(false)
                            }
                            className={`mt-1 block w-full resize-none focus:!ring-blue-500 p-2 focus:!border-blue-500 placeholder-[#CBD6E2] text-sm  placeholder:text-xs h-[150px] `}
                            placeholder=""
                          ></textarea>
                        )}
                        {!textOpen && currentToEdit?.notes?.length === 0 && (
                          <div
                            onClick={() => setTextOpen(true)}
                            className=" text-[#CBD6E2] text-xs flex-1 text-base-17-5 p-3 h-[150px] bg-[#F6F6F6]                              "
                          >
                            Use this space to add notes about the student that
                            are only visible to you as the Org Admin.
                            <br></br>
                            <br></br>
                            Here are
                            some ideas to get you started: personality,
                            preferences, goals, sports, habits, academic scores,
                            activities, family, likes or dislikes, and schedule
                            preferences.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {currentField.name === "subscribeType" && (
                  <div>
                    <div className="flex items-center mb-5 pt-1 pb-5">
                      <InputSelect
                        value={currentToEdit.subscribeType}
                        onChange={(val) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            subscribeType: val,
                          })
                        }
                        optionData={[
                          "Unsubscribed",
                          "3 Months Trial",
                          "6 Months Trial",
                          "Subscribed",
                        ]}
                        radio={true}
                        inputContainerClassName="pt-3 pb-3 border bg-white"
                        placeholder="Subscription Type"
                        parentClassName="w-full mr-4"
                        type="select"
                      />
                    </div>
                  </div>
                )}
                {currentField.name === "subscriptionCode" && (
                  <div>
                    <div className="flex items-center mb-5 pt-1 pb-5">
                      <InputSelect
                        value={currentToEdit.subscriptionCode}
                        onChange={(val) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            subscriptionCode: val,
                          })
                        }
                        optionData={settings.subscriptionCode.map(
                          (item) => item.code
                        )}
                        radio={true}
                        inputContainerClassName="pt-3 pb-3 border bg-white"
                        placeholder="Subscription Type"
                        parentClassName="w-full mr-4"
                        type="select"
                      />
                    </div>
                  </div>
                )}
                {currentField.name === "service" && (
                  <div className="w-[660px] max-h-[50vh] overflow-y-auto custom-scroller">
                    <div className="flex flex-col gap-2">
                      {organization?.settings?.servicesAndSpecialization.map(
                        (item, id) => {
                          return (
                            <div
                              key={id}
                              className=" gap-5 flex justify-start items-center"
                            >
                              <SCheckbox
                                stopM={true}
                                checked={currentToEdit?.service?.includes(
                                  item?.service
                                )}
                                onChange={() =>
                                  handleServiceChange(item?.service)
                                }
                              />
                              <span className="text-[#26435F] pb-1">
                                {item?.service}
                              </span>
                            </div>
                          );
                        }
                      )}
                    </div>

                    {/* <div className="flex items-center mb-5 pt-1 pb-5">
                      <InputSelect
                        value={
                          currentToEdit.service.length === 0
                            ? ""F
                            : currentToEdit.service[0]
                        }
                        checkbox={{
                          visible: true,
                          name: "services",
                          match: currentToEdit.service,
                        }}
                        optionData={organization?.settings?.servicesAndSpecialization.map(
                          (item) => item.service
                        )}
                        inputContainerClassName="pt-3 pb-3 border bg-white"
                        placeholder="Service"
                        parentClassName="w-full mr-4"
                        type="select"
                        onChange={
                          (val) => handleServiceChange(val)
                          // setCurrentToEdit({ ...currentToEdit, service: val })
                        }
                        onOptionClick={(item) => {
                          // setStudent(item.value);
                          //console.log(item);
                          // handleStudentsChange(item)
                          // setCurrentToEdit({ ...currentToEdit, students: [... item._id] });
                        }}
                      />
                    </div> */}
                  </div>
                )}
                {currentField.name === "subjects" && (
                  <div>
                    <div className="flex flex-wrap max-h-[70vh] overflow-y-auto custom-scroller">
                      {commonSubjects.map((item) => {
                        return !currentToEdit?.subjects?.includes(item) ? (
                          <div
                            id="selected"
                            className={`px-3 mr-2 m-1 rounded-lg py-1.5 border-[1.33px] border-[#26435F80] text-[#26435F80]  cursor-pointer text-base-17-5`}
                            onClick={() => {
                              let intersetArray = [];

                              if (currentToEdit.subjects) {
                                intersetArray = currentToEdit.subjects;
                              }

                              setCurrentToEdit({
                                ...currentToEdit,
                                subjects: [...intersetArray, item],
                              });
                            }}
                          >
                            <p className="font-semibold ">{item}</p>
                          </div>
                        ) : (
                          <div
                            id="selected"
                            className={`px-3 mr-2 m-1 text-center rounded-lg text-white py-1.5 border border-primary bg-primary text-base-17-5 cursor-pointer`}
                            onClick={() =>
                              setCurrentToEdit({
                                ...currentToEdit,
                                subjects: currentToEdit.subjects.filter(
                                  (id) => id !== item
                                ),
                              })
                            }
                          >
                            <p className="font-medium">{item}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {currentField.name === "leadStatus" && (
                  <div>
                    <div className="flex items-center mb-5 pt-2">
                      <InputSelect
                        value={currentToEdit.leadStatus}
                        onChange={(val) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            leadStatus: val,
                          })
                        }
                        optionData={settings.leadStatus}
                        radio={true}
                        inputContainerClassName="pt-3 pb-3 border bg-white"
                        placeholder="Lead Status"
                        parentClassName="w-full mr-4"
                        type="select"
                      />
                    </div>
                  </div>
                )}
                {currentField.name === "accomodations" && (
                  <div>
                    <div className="flex items-center mb-5 pt-6">
                      {/* <p className='font-medium mr-4 min-w-[60px]'>  </p> */}
                      <InputField
                        labelClassname="hidden"
                        placeholder="Accomodations"
                        inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-primary-50 border-0"
                        inputClassName="bg-transparent"
                        parentClassName="flex-1 "
                        type="text"
                        value={currentToEdit.accomodations}
                        onChange={(e) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            accomodations: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
                {currentField.name === "associatedParent" && (
                  <InputSearch
                    labelClassname="hidden"
                    placeholder="Type Parent Name"
                    parentClassName="w-full  mb-10"
                    inputContainerClassName="bg-[#F3F5F7] border-0 pt-3.5 pb-3.5"
                    inputClassName="bg-[#F3F5F7]"
                    type="text"
                    optionPrefix="s"
                    value={parent}
                    onChange={(e) => setParent(e.target.value)}
                    optionData={parents}
                    onOptionClick={(val) => {
                      // setStudent(item.value);

                      setCurrentToEdit({
                        ...currentToEdit,
                        associatedParent: val._id,
                        FirstName: val.fname,
                        LastName: val.lname,
                        Email: val.email,
                      });
                      // setCurrentToEdit({ ...currentToEdit, students: [... item._id] });
                    }}
                  />
                )}
                {currentField.name === "tutorLevel" && (
                  <div>
                    <div className="flex items-center mb-5  pb-5">
                      <InputSelect
                        value={currentToEdit.tutorLevel}
                        onChange={(val) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            tutorLevel: val,
                          })
                        }
                        optionData={["ORANGE", "PURPLE", "BROWN", "BLACK"]}
                        radio={true}
                        inputContainerClassName="pt-3 pb-3 border bg-white"
                        placeholder="Tutor Level"
                        parentClassName="w-full mr-4"
                        type="select"
                      />
                    </div>
                  </div>
                )}
                {currentField.name === "education" && (
                  <div>
                    <div className="flex items-center mb-5">
                      <InputField
                        labelClassname="hidden"
                        placeholder="Education"
                        inputContainerClassName="text-sm pt-3.5 pb-3 px-5 bg-primary-50 border-0"
                        inputClassName="bg-transparent rounded-[4px]"
                        parentClassName="flex-1"
                        type="text"
                        value={currentToEdit.education}
                        onChange={(e) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            education: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
                {currentField.name === "tutorAddress" && (
                  <div>
                    {/* <div className='flex items-center mb-5'>
                                 <InputField
                                    labelClassname='hidden'
                                    placeholder='Address'
                                    inputContainerClassName='text-sm pt-3.5 pb-3 px-5 bg-primary-50 border-0'
                                    inputClassName='bg-transparent rounded-[4px]'
                                    parentClassName='flex-1' type='text'
                                    value={currentToEdit.address}
                                    onChange={e => setCurrentToEdit({ ...currentToEdit, address: e.target.value })} />
                              </div> */}
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-6">
                        <div>
                          <p style={{ color: "#26435F", fontWeight: "500" }}>
                            Street
                          </p>
                        </div>
                        <InputField
                          labelClassname="hidden"
                          placeholder="Text"
                          inputContainerClassName="text-sm pt-3.5 pb-3 px-5 bg-primary-50 border-"
                          inputClassName="bg-transparent rounded-[4px]"
                          parentClassName="flex-1"
                          type="text"
                          value={currentToEdit.address}
                          onChange={(e) =>
                            setCurrentToEdit({
                              ...currentToEdit,
                              address: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-span-6">
                        <div>
                          <p style={{ color: "#26435F", fontWeight: "500" }}>
                            City
                          </p>
                        </div>
                        <InputField
                          labelClassname="hidden"
                          placeholder="City"
                          inputContainerClassName="text-sm pt-3.5 pb-3 px-5 bg-primary-50 border-"
                          inputClassName="bg-transparent rounded-[4px]"
                          parentClassName="flex-1"
                          type="text"
                          value={currentToEdit.city}
                          onChange={(e) =>
                            setCurrentToEdit({
                              ...currentToEdit,
                              city: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4 mt-5">
                      <div className="col-span-6">
                        <div>
                          <p style={{ color: "#26435F", fontWeight: "500" }}>
                            State
                          </p>
                        </div>
                        <InputField
                          labelClassname="hidden"
                          placeholder="Text"
                          inputContainerClassName="text-sm pt-3.5 pb-3 px-5 bg-primary-50 border-"
                          inputClassName="bg-transparent rounded-[4px]"
                          parentClassName="flex-1"
                          type="text"
                          value={currentToEdit.state}
                          onChange={(e) =>
                            setCurrentToEdit({
                              ...currentToEdit,
                              state: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-span-6">
                        <div>
                          <p style={{ color: "#26435F", fontWeight: "500" }}>
                            Country
                          </p>
                        </div>
                        <InputField
                          labelClassname="hidden"
                          placeholder="City"
                          inputContainerClassName="text-sm pt-3.5 pb-3 px-5 bg-primary-50 border-"
                          inputClassName="bg-transparent rounded-[4px]"
                          parentClassName="flex-1"
                          type="text"
                          value={currentToEdit.country}
                          onChange={(e) =>
                            setCurrentToEdit({
                              ...currentToEdit,
                              country: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4 mt-5">
                      <div className="col-span-6">
                        <div>
                          <p style={{ color: "#26435F", fontWeight: "500" }}>
                            Zip
                          </p>
                        </div>
                        <InputField
                          labelClassname="hidden"
                          placeholder="Text"
                          inputContainerClassName="text-sm pt-3.5 pb-3 px-5 bg-primary-50 border-"
                          inputClassName="bg-transparent rounded-[4px]"
                          parentClassName="flex-1"
                          type="text"
                          value={currentToEdit.pincode}
                          onChange={(e) =>
                            setCurrentToEdit({
                              ...currentToEdit,
                              pincode: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
                {currentField.name === "tagLine" && (
                  <div>
                    <div className="flex items-center mb-5">
                      <InputField
                        labelClassname="hidden"
                        placeholder="Tagline"
                        inputContainerClassName="text-sm pt-3.5 pb-3 px-5 bg-primary-50 border-0"
                        inputClassName="bg-transparent rounded-[4px]"
                        parentClassName="flex-1"
                        type="text"
                        value={currentToEdit.tagLine}
                        onChange={(e) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            tagLine: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
                {currentField.name === "rates" && (
                  <div>
                    <div className="flex items-center mb-4">
                      <p className="font-medium mr-4 min-w-[150px]">
                        Test Prep Rate
                      </p>
                      <InputField
                        labelClassname="hidden"
                        placeholder=""
                        inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-primary-50 border-0"
                        inputLeftField={<div>$</div>}
                        inputClassName="bg-transparent pl-4 rounded-[4px]"
                        parentClassName="flex-1 "
                        type="text"
                        value={currentToEdit.testPrepRate}
                        onChange={(e) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            testPrepRate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center mb-4">
                      <p className="font-medium mr-4 min-w-[150px] ">
                        Subject Tutoring
                      </p>
                      <InputField
                        labelClassname="hidden"
                        placeholder=""
                        inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-primary-50 border-0"
                        inputLeftField={<div>$</div>}
                        inputClassName="bg-transparent pl-4 rounded-[4px]"
                        parentClassName="flex-1 "
                        type="text"
                        value={currentToEdit.subjectTutoringRate}
                        onChange={(e) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            subjectTutoringRate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center">
                      <p className="font-medium mr-4 min-w-[150px] ">
                        Other Rate
                      </p>
                      <InputField
                        labelClassname="hidden"
                        placeholder=""
                        inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-primary-50 border-0"
                        inputLeftField={<div>$</div>}
                        inputClassName="bg-transparent pl-4 rounded-[4px]"
                        parentClassName="flex-1 "
                        type="text"
                        value={currentToEdit.otherRate}
                        onChange={(e) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            otherRate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
                {currentField.name === "tutorServices" && (
                  <div>
                    <div className="flex items-center mb-4">
                      <p className="font-medium mr-4 min-w-[150px]">
                        {currentToEdit.selectedIdx !== undefined
                          ? organization.settings.servicesAndSpecialization[
                            currentToEdit.selectedIdx
                          ].service
                          : ""}
                      </p>
                      <InputField
                        labelClassname="hidden"
                        placeholder=""
                        inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-primary-50 border-0"
                        inputLeftField={<div>$</div>}
                        inputClassName="bg-transparent pl-4 rounded-[4px]"
                        parentClassName="flex-1 "
                        type="text"
                        value={currentToEdit.testPrepRate}
                        onChange={(e) => handlePriceChange(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                {currentField.name === "paymentInfo" && (
                  <div className="flex items-center justify-center">
                    <div className=" mb-5">
                      <InputField
                        labelClassname="hidden"
                        placeholder="Payment Info"
                        inputContainerClassName="text-sm pt-3.5 pb-3 px-5 w-[181px] bg-primary-50 border-0 text-[#667085]"
                        inputClassName="bg-transparent rounded-[4px]"
                        parentClassName="flex-1"
                        type="text"
                        value={currentToEdit.paymentInfo}
                        onChange={(e) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            paymentInfo: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* <div className='flex items-center mb-4'>
                                 <p className='font-medium mr-4 min-w-[100px]'>
                                    Bank Name
                                 </p>
                                 <InputField
                                    labelClassname='hidden'
                                    placeholder=''
                                    inputContainerClassName='text-sm pt-3 pb-3 px-5 bg-primary-50 border-0'
                                    inputClassName='bg-transparent rounded-[4px]'
                                    parentClassName='flex-1 ' type='text'
                                    value={currentToEdit.bankName}
                                    onChange={e => setCurrentToEdit({
                                       ...currentToEdit,
                                       paymentInfo: { ...currentToEdit.paymentInfo, bankName: e.target.value }
                                    })} />
                              </div> */}
                    {/* <div className='flex items-center mb-4'>
                                 <p className='font-medium mr-4 min-w-[100px] '>
                                    Acc No.
                                 </p>
                                 <InputField
                                    labelClassname='hidden'
                                    placeholder=''
                                    inputContainerClassName='text-sm pt-3 pb-3 px-5 bg-primary-50 border-0'
                                    inputClassName='bg-transparent rounded-[4px]'
                                    parentClassName='flex-1 ' type='text'
                                    value={currentToEdit.AccNo}
                                    onChange={e => setCurrentToEdit({
                                       ...currentToEdit,
                                       paymentInfo: { ...currentToEdit.paymentInfo, AccNo: e.target.value }
                                    })} />
                              </div> */}
                    {/* <div className='flex items-center'>
                                 <p className='font-medium mr-4 min-w-[100px] '>
                                    IFSC Code
                                 </p>
                                 <InputField
                                    labelClassname='hidden'
                                    placeholder=''
                                    inputContainerClassName='text-sm pt-3 pb-3 px-5 bg-primary-50 border-0'
                                    inputClassName='bg-transparent rounded-[4px]'
                                    parentClassName='flex-1 ' type='text'
                                    value={currentToEdit.ifcsCode}
                                    onChange={e => setCurrentToEdit({
                                       ...currentToEdit,
                                       paymentInfo: { ...currentToEdit.paymentInfo, ifcsCode: e.target.value }
                                    })} />
                              </div> */}
                  </div>
                )}
                {currentField.name === "tutorRank" && (
                  <div>
                    <div className="flex items-center mb-5  pb-5">
                      {/* <InputSelect
                                    optionData={['Rank 1', 'Rank 2', 'Rank 3', 'Rank 4', 'Rank 5', 'Rank 6']}
                                    radio={true}
                                    inputContainerClassName="pt-3 pb-3 border bg-white"
                                    placeholder="Tutor Rank"
                                    parentClassName="w-full mr-4"
                                    type="select"
                                 /> */}
                      <InputField
                        labelClassname="hidden"
                        placeholder="Tutor Rank"
                        inputContainerClassName="text-sm pt-3.5 pb-3 px-5 bg-primary-50 border-0"
                        inputClassName="bg-transparent rounded-[4px]"
                        parentClassName="flex-1"
                        type="text"
                        value={currentToEdit.tutorRank}
                        onChange={(e) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            tutorRank: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
                {currentField.name === "income" && (
                  <div className="flex justify-center items-center mb-4 pb-4">
                    <InputField
                      labelClassname="hidden"
                      placeholder=""
                      inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-primary-50 border-0 text-[#667085]"
                      inputLeftField={<div>$</div>}
                      inputClassName="bg-transparent pl-4 rounded-[4px]"
                      parentClassName="flex-1 max-w-[181px]"
                      type="text"
                      value={currentToEdit.income}
                      onChange={(e) =>
                        setCurrentToEdit({
                          ...currentToEdit,
                          income: e.target.value,
                        })
                      }
                    />
                  </div>
                )}
                {currentField.name === "paymentStatus" && (
                  <div>
                    <div className="flex items-center mb-5 pb-5">
                      <InputSelect
                        value={currentToEdit.paymentStatus}
                        onChange={(val) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            paymentStatus: val,
                          })
                        }
                        optionData={["Paid", "Unpaid"]}
                        radio={true}
                        inputContainerClassName="pt-3 pb-3 border bg-white"
                        placeholder="Select"
                        parentClassName="w-full mr-4"
                        type="select"
                      />
                    </div>
                  </div>
                )}
                {currentField.name === "profileData" && (
                  <div className="">
                    {/* <textarea
                                 placeholder=""
                                 value={currentToEdit.about}
                                 onChange={e =>
                                    setCurrentToEdit({ ...currentToEdit, about: e.target.value })
                                 }
                                 rows={5}
                                 className="bg-lightWhite w-full outline-0 px-5 py-4 rounded"
                              ></textarea> */}
                    <div>
                      <div className="grid grid-cols-12">
                        <div className="col-span-2">
                          <ProfilePhoto
                            isTutor={true}
                            src={
                              currentToEdit.photo
                                ? `${awsLink}${currentToEdit.photo}`
                                : "/images/default.jpeg"
                            }
                            handleChange={handleProfilePhotoChange}
                            editable={true}
                          />
                        </div>
                        <div className=" col-span-8 ">
                          <div className="grid grid-cols-12 gap-8">
                            <div className=" col-span-3">
                              <div>
                                <p
                                  style={{
                                    color: "#26435F",
                                    fontWeight: "500",
                                  }}
                                >
                                  First Name
                                </p>
                              </div>
                              <InputField
                                labelClassname="hidden"
                                placeholder="First Name"
                                inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-primary-50 border-white"
                                inputClassName="bg-transparent text-[#667085] text-400"
                                value={currentToEdit.firstName}
                                onChange={(e) =>
                                  setCurrentToEdit({
                                    ...currentToEdit,
                                    firstName: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className=" col-span-3">
                              <div>
                                <p
                                  style={{
                                    color: "#26435F",
                                    fontWeight: "500",
                                  }}
                                >
                                  Last Name
                                </p>
                              </div>

                              <InputField
                                labelClassname="hidden"
                                placeholder="Last Name"
                                inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-primary-50 border-white"
                                inputClassName="bg-transparent text-[#667085] text-400"
                                value={currentToEdit.lastName}
                                onChange={(e) =>
                                  setCurrentToEdit({
                                    ...currentToEdit,
                                    lastName: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className=" col-span-6">
                              <div>
                                <p
                                  style={{
                                    color: "#26435F",
                                    fontWeight: "500",
                                  }}
                                >
                                  Email
                                </p>
                              </div>

                              <InputField
                                labelClassname="hidden"
                                placeholder="Email"
                                inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-primary-50 border-white"
                                inputClassName="bg-transparent text-[#667085] text-400"
                                value={currentToEdit.email}
                                onChange={(e) =>
                                  setCurrentToEdit({
                                    ...currentToEdit,
                                    email: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className=" col-span-6">
                              <div>
                                <p
                                  style={{
                                    color: "#26435F",
                                    fontWeight: "500",
                                  }}
                                >
                                  LinkedIn
                                </p>
                              </div>

                              <InputField
                                labelClassname="hidden"
                                placeholder="Linkedin"
                                inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-primary-50 border-white"
                                inputClassName="bg-transparent text-[#667085] text-400"
                                value={currentToEdit.linkedIn}
                                onChange={(e) =>
                                  setCurrentToEdit({
                                    ...currentToEdit,
                                    linkedIn: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="col-span-6 ">
                              <div>
                                <p
                                  style={{
                                    color: "#26435F",
                                    fontWeight: "500",
                                  }}
                                >
                                  Phone
                                </p>
                              </div>
                              <div className="grid grid-cols-12 gap-3">
                                <div className="col-span-4">
                                  <InputField
                                    labelClassname="hidden"
                                    placeholder=""
                                    inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-primary-50 border-white"
                                    inputClassName="bg-transparent text-[#667085] text-400"
                                    value={currentToEdit.phoneCode}
                                    onChange={(e) =>
                                      setCurrentToEdit({
                                        ...currentToEdit,
                                        phoneCode: e.target.value,
                                      })
                                    }
                                  />
                                </div>

                                <div className="col-span-8">
                                  <div>
                                    <p
                                      style={{
                                        color: "#26435F",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {" "}
                                    </p>
                                  </div>

                                  <InputField
                                    labelClassname="hidden"
                                    placeholder="Mobile"
                                    inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-primary-50 border-white"
                                    inputClassName="bg-transparent text-[#667085] text-400"
                                    value={currentToEdit.phone}
                                    onChange={(e) => {
                                      setCurrentToEdit({
                                        ...currentToEdit,
                                        phone: e.target.value,
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 grid grid-cols-12">
                      <div>
                        <p style={{ color: "#26435F", fontWeight: "500" }}>
                          TagLine
                        </p>
                      </div>
                      <div className="col-span-12 ">
                        <textarea
                          cols={80}
                          value={currentToEdit.tagLine}
                          className=" rounded focus:border-[#D0D5DD]"
                          style={{
                            border: "1px solid #D0D5DD",
                            color: "#667085",
                          }}
                          onChange={(e) =>
                            setCurrentToEdit({
                              ...currentToEdit,
                              tagLine: e.target.value,
                            })
                          }
                        ></textarea>
                      </div>
                    </div>

                    <div className="mt-8 grid grid-cols-12">
                      <div>
                        <p style={{ color: "#26435F", fontWeight: "500" }}>
                          About
                        </p>
                      </div>
                      <div className="col-span-12 ">
                        <textarea
                          rows={3}
                          cols={80}
                          className=" rounded focus:border-[#D0D5DD]"
                          style={{
                            border: "1px solid #D0D5DD",
                            color: "#667085",
                          }}
                          value={currentToEdit.about}
                          onChange={(e) => {
                            setCurrentToEdit({
                              ...currentToEdit,
                              about: e.target.value,
                            });
                          }}
                        ></textarea>
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="grid grid-cols-12 ">
                        <div className="col-span-6">
                          <div>
                            <p style={{ color: "#26435F", fontWeight: "500" }}>
                              Education
                            </p>
                          </div>
                          <textarea
                            rows={3}
                            cols={35}
                            className=" rounded focus:border-[#D0D5DD]"
                            style={{
                              border: "1px solid #D0D5DD",
                              color: "#667085",
                            }}
                            value={currentToEdit.education}
                            onChange={(e) => {
                              setCurrentToEdit({
                                ...currentToEdit,
                                education: e.target.value,
                              });
                            }}
                          ></textarea>
                        </div>
                        <div className="col-span-6">
                          <div>
                            <p style={{ color: "#26435F", fontWeight: "500" }}>
                              Experience
                            </p>
                          </div>
                          <textarea
                            rows={3}
                            cols={35}
                            className=" rounded focus:border-[#D0D5DD]"
                            style={{
                              border: "1px solid #D0D5DD",
                              color: "#667085",
                            }}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {currentField.name === "personality" && (
                  <div className="flex flex-wrap">
                    {qualities.map((item) => {
                      return !currentToEdit?.personality?.includes(item) ? (
                        <div
                          id="selected"
                          className={`px-3 mr-2 m-1 rounded-lg py-1.5 border-[1.33px] border-[#26435F80] text-[#26435F80]  cursor-pointer text-base-17-5`}
                          onClick={() => {
                            let intersetArray = [];

                            if (currentToEdit.personality) {
                              intersetArray = currentToEdit.personality;
                            }
                            //console.log(intersetArray);
                            setCurrentToEdit({
                              ...currentToEdit,
                              personality: [...intersetArray, item],
                            });
                          }}
                        >
                          <p className="font-semibold ">{item}</p>
                        </div>
                      ) : (
                        <div
                          id="selected"
                          className={`px-3 mr-2 m-1 text-center rounded-lg text-white py-1.5 border border-primary bg-primary text-base-17-5 cursor-pointer`}
                          onClick={() =>
                            setCurrentToEdit({
                              ...currentToEdit,
                              personality: currentToEdit.personality.filter(
                                (id) => id !== item
                              ),
                            })
                          }
                        >
                          <p className="font-medium">{item}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
                {currentField.name === "interest" && (
                  <div className="flex flex-wrap">
                    {Interest.map((item) => {
                      return !currentToEdit?.interest?.includes(item) ? (
                        <div
                          id="selected"
                          className={`px-3 mr-2 m-1 rounded-lg py-1.5 border-[1.33px] border-[#26435F80] text-[#26435F80]  cursor-pointer text-base-17-5`}
                          onClick={() => {
                            let intersetArray = [];

                            if (currentToEdit.interest) {
                              intersetArray = currentToEdit.interest;
                            }
                            //console.log(intersetArray);
                            setCurrentToEdit({
                              ...currentToEdit,
                              interest: [...intersetArray, item],
                            });
                          }}
                        >
                          <p className="font-semibold ">{item}</p>
                        </div>
                      ) : (
                        <div
                          id="selected"
                          className={`px-3 mr-2 m-1 text-center rounded-lg text-white py-1.5 border border-primary bg-primary text-base-17-5 cursor-pointer`}
                          onClick={() =>
                            setCurrentToEdit({
                              ...currentToEdit,
                              interest: currentToEdit.interest.filter(
                                (id) => id !== item
                              ),
                            })
                          }
                        >
                          <p className="font-medium">{item}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
                {currentField.name === "serviceSpecializations" && (
                  <div className="flex flex-wrap">
                    {settings?.Expertise?.map((item) => {
                      return !currentToEdit?.serviceSpecializations?.includes(
                        item._id
                      ) ? (
                        <div
                          className={`px-3 mr-2 rounded rounded-lg   py-1.5 border-[1.33px] border-[#26435F80] text-[#26435F80]  cursor-pointer`}
                          onClick={() => {
                            let servicesArray = [];
                            if (currentToEdit.serviceSpecializations) {
                              servicesArray =
                                currentToEdit.serviceSpecializations;
                            }
                            //console.log(servicesArray);
                            setCurrentToEdit({
                              ...currentToEdit,
                              serviceSpecializations: [
                                ...servicesArray,
                                item._id,
                              ],
                            });
                          }}
                        >
                          <p className="font-medium">{item.text}</p>
                        </div>
                      ) : (
                        <div
                          className={`px-3 mr-2 rounded rounded-md text-white py-1.5 border border-primary bg-primary text-primary font-semibold cursor-pointer`}
                          onClick={() =>
                            setCurrentToEdit({
                              ...currentToEdit,
                              serviceSpecializations:
                                currentToEdit.serviceSpecializations.filter(
                                  (id) => id !== item._id
                                ),
                            })
                          }
                        >
                          <p className="font-medium">{item.text}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
                {currentField.name === "tutorContact" && (
                  <div>
                    <div className="flex items-center mb-5">
                      <p className="font-medium mr-4 min-w-[80px] text-[20px]">
                        {" "}
                        Linked In{" "}
                      </p>
                      <InputField
                        labelClassname="hidden"
                        placeholder="Linked in"
                        inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-primary-50 border-0"
                        inputClassName="bg-transparent rounded-[4px]"
                        parentClassName="flex-1 "
                        type="text"
                        value={currentToEdit.linkedIn}
                        onChange={(e) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            linkedIn: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center mb-5">
                      <p className="font-medium mr-4 min-w-[80px] text-[20px]">
                        {" "}
                        Email Id{" "}
                      </p>
                      <InputField
                        labelClassname="hidden"
                        placeholder="Email Id"
                        inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-primary-50 border-0"
                        inputClassName="bg-transparent rounded-[4px]"
                        parentClassName="flex-1 "
                        type="text"
                        value={currentToEdit.email}
                        onChange={(e) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center">
                      <p className="font-medium mr-4 min-w-[80px] text-[20px]">
                        {" "}
                        Phone{" "}
                      </p>
                      <InputField
                        labelClassname="hidden"
                        placeholder="Phone"
                        inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-primary-50 border-0"
                        inputClassName="bg-transparent rounded-[4px] ml-[70px]"
                        parentClassName="flex-1 "
                        type="text"
                        value={currentToEdit.phone}
                        inputLeftField={
                          <CountryCode
                            className={styles.phoneNumber}
                            numberPrefix={currentToEdit.phoneCode}
                            setNumberPrefix={(val) => {
                              setCurrentToEdit({
                                ...currentToEdit,
                                phoneCode: val,
                              });
                            }}
                          />
                        }
                        onChange={(e) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
                {currentField.name === "satScores" && (
                  <div className="flex flex-col gap-4">
                    <div className="max-h-[50vh] overflow-y-auto custom-scroller">
                      {currentToEdit?.satScores?.map(
                        (it, selectedScoreIndex) => {
                          return (
                            <div className="flex flex-col ">
                              <p className="font-semibold !text-[20px] cursor-pointer mb-2  text-[#24A3D9]">
                                SAT&reg; {selectedScoreIndex + 1}
                              </p>
                              <div className="flex gap-5">
                                <InputField
                                  labelClassname="hidden"
                                  placeholder="Verbal"
                                  placeholderClassName="text-sm"
                                  inputContainerClassName="text-sm  text-center py-1 bg-primary-50 border-0 h-[40px] !font-semibold"
                                  inputClassName="bg-transparent text-center rounded-[4px] text-[#517CA8]"
                                  parentClassName="flex-1 text-sm text-center w-[120px]"
                                  type="number"
                                  value={
                                    currentToEdit.satScores[selectedScoreIndex]
                                      ?.verbal
                                  }
                                  onChange={(e) => {
                                    if (
                                      parseInt(e.target.value) < 0 ||
                                      parseInt(e.target.value) > 1000
                                    ) {
                                      return;
                                    }
                                    let tempScores = [
                                      ...currentToEdit.satScores,
                                    ];
                                    if (
                                      tempScores.length <= selectedScoreIndex
                                    ) {
                                      tempScores.push({
                                        createdAt: new Date(),
                                        maths: 0,
                                        verbal: 0,
                                        cumulative: 0,
                                      });
                                    }
                                    tempScores = tempScores.map((item, idx) => {
                                      if (selectedScoreIndex === idx) {
                                        let num = checkNumber(
                                          currentToEdit.satScores[
                                            selectedScoreIndex
                                          ]?.verbal,
                                          parseInt(e.target.value),
                                          800
                                        );
                                        return { ...item, verbal: num };
                                      } else {
                                        return { ...item };
                                      }
                                    });
                                    setCurrentToEdit({
                                      ...currentToEdit,
                                      satScores: tempScores,
                                    });
                                  }}
                                />
                                <InputField
                                  labelClassname="hidden"
                                  placeholder="Math"
                                  inputContainerClassName="text-sm py-1 px-5 bg-primary-50 border-0 h-[40px] !font-semibold"
                                  inputClassName="bg-transparent pl-4 rounded-[4px] text-[#517CA8]"
                                  parentClassName="flex-1 w-[120px]"
                                  type="number"
                                  value={
                                    currentToEdit.satScores[selectedScoreIndex]
                                      ?.maths
                                  }
                                  onChange={(e) => {
                                    if (
                                      parseInt(e.target.value) < 0 ||
                                      parseInt(e.target.value) > 1000
                                    ) {
                                      return;
                                    }
                                    let tempScores = [
                                      ...currentToEdit.satScores,
                                    ];
                                    if (
                                      tempScores.length <= selectedScoreIndex
                                    ) {
                                      tempScores.push({
                                        createdAt: new Date(),
                                        maths: 0,
                                        verbal: 0,
                                      });
                                    }
                                    tempScores = tempScores.map((item, idx) => {
                                      if (selectedScoreIndex === idx) {
                                        return {
                                          ...item,
                                          maths: checkNumber(
                                            currentToEdit.satScores[
                                              selectedScoreIndex
                                            ]?.maths,
                                            parseInt(e.target.value),
                                            800
                                          ),
                                        };
                                      } else {
                                        return { ...item };
                                      }
                                    });
                                    // tempScores[selectedScoreIndex].maths = checkNumber(currentToEdit.satScores.maths, parseInt(e.target.value), 800)
                                    // //console.log('tempScores', tempScores);
                                    setCurrentToEdit({
                                      ...currentToEdit,
                                      satScores: tempScores,
                                    });
                                  }}
                                />

                                <div className="text-md  rounded-[4px] flex items-center  font-semibold  text-center py-auto px-5 bg-primary-50 border-0 !w-[120px] h-[40px] text-[#FFA28D]">
                                  {currentToEdit.satScores[selectedScoreIndex]
                                    ?.maths +
                                    currentToEdit.satScores[selectedScoreIndex]
                                      ?.verbal ? (
                                    currentToEdit.satScores[selectedScoreIndex]
                                      ?.maths +
                                    currentToEdit.satScores[selectedScoreIndex]
                                      ?.verbal
                                  ) : (
                                    <span className="text-sm my-auto font-semibold">
                                      cumulative
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="mt-[15px]">
                                <InputField
                                  label="Test Date"
                                  labelClassname="text-[#26435F] !text-[15px]"
                                  placeholder=""
                                  inputContainerClassName="text-xs  bg-primary-50 border-0 !py-3 !px-2 !rounded-[5px]  !h-[50px] w-[206px] text-[#507CA8]"
                                  inputClassName="bg-transparent text-xs   "
                                  parentClassName=""
                                  type="date"
                                  biggerText={true}
                                  value={currentToEdit.dob}
                                  onChange={(e) =>
                                    setCurrentToEdit({
                                      ...currentToEdit,
                                      dob: e.target.value,
                                      birthyear: e.target.value?.split("-")[0],
                                    })
                                  }
                                />
                              </div>
                              <div className="mt-5 border-1  border-t-2 mb-[30px] border-[1.25px_solid_#00000033] justify-center "></div>
                            </div>
                          );
                        }
                      )}
                    </div>

                    <p
                      onClick={() => {
                        let tempScores = [...currentToEdit.satScores];

                        tempScores.push({
                          maths: null,
                          verbal: null,
                          createdAt: new Date(),
                        });
                        setCurrentToEdit({
                          ...currentToEdit,
                          satScores: tempScores,
                        });
                      }}
                      className="font-bold !text-lg cursor-pointer    text-[#24A3D9]"
                    >
                      Add{" "}
                      <svg
                        className="inline-block -mt-1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M14.4987 9.29037H9.29037V14.4987C9.29037 14.775 9.18062 15.0399 8.98527 15.2353C8.78992 15.4306 8.52497 15.5404 8.2487 15.5404C7.97243 15.5404 7.70748 15.4306 7.51213 15.2353C7.31678 15.0399 7.20703 14.775 7.20703 14.4987V9.29037H1.9987C1.72243 9.29037 1.45748 9.18062 1.26213 8.98527C1.06678 8.78992 0.957031 8.52497 0.957031 8.2487C0.957031 7.97243 1.06678 7.70748 1.26213 7.51213C1.45748 7.31678 1.72243 7.20703 1.9987 7.20703H7.20703V1.9987C7.20703 1.72243 7.31678 1.45748 7.51213 1.26213C7.70748 1.06678 7.97243 0.957031 8.2487 0.957031C8.52497 0.957031 8.78992 1.06678 8.98527 1.26213C9.18062 1.45748 9.29037 1.72243 9.29037 1.9987V7.20703H14.4987C14.775 7.20703 15.0399 7.31678 15.2353 7.51213C15.4306 7.70748 15.5404 7.97243 15.5404 8.2487C15.5404 8.52497 15.4306 8.78992 15.2353 8.98527C15.0399 9.18062 14.775 9.29037 14.4987 9.29037Z"
                          fill="#24A3D9"
                        />
                      </svg>
                    </p>
                  </div>
                )}
                {currentField.name === "baseLineScore" && (
                  <div className="flex flex-col gap-4 mt-[-20px]">
                    <div className="max-h-[50vh] overflow-y-auto custom-scroller">
                      <div className="flex flex-col ">
                        <p className="font-semibold !text-md cursor-pointer mb-2  text-[#24A3D9]">
                          SAT Baseline Score
                        </p>
                        <div className="flex gap-5">
                          <InputField
                            labelClassname="hidden"
                            placeholder="Verbal"
                            placeholderClassName="text-sm"
                            inputContainerClassName="text-sm pt-3 text-center pb-3 bg-primary-50 border-0 h-[40px]"
                            inputClassName="bg-transparent text-center rounded-[4px] text-[#517CA8]"
                            parentClassName="flex-1 text-sm text-center w-[120px]"
                            type="number"
                            value={
                              currentToEdit.baseLineScore?.satBaseLineScore
                                ?.verbal
                            }
                            onChange={(e) => {
                              setCurrentToEdit({
                                ...currentToEdit,
                                baseLineScore: {
                                  ...currentToEdit?.baseLineScore,
                                  satBaseLineScore: {
                                    ...currentToEdit.baseLineScore
                                      ?.satBaseLineScore,
                                    verbal: e.target.value,
                                  },
                                },
                              });
                            }}
                          />
                          <InputField
                            labelClassname="hidden"
                            placeholder="Math"
                            inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-primary-50 border-0 h-[40px]"
                            inputClassName="bg-transparent pl-4 rounded-[4px] text-[#517CA8]"
                            parentClassName="flex-1 w-[120px]"
                            type="number"
                            value={
                              currentToEdit.baseLineScore?.satBaseLineScore
                                ?.maths
                            }
                            onChange={(e) => {
                              setCurrentToEdit({
                                ...currentToEdit,
                                baseLineScore: {
                                  ...currentToEdit?.baseLineScore,
                                  satBaseLineScore: {
                                    ...currentToEdit.baseLineScore
                                      ?.satBaseLineScore,
                                    maths: e.target.value,
                                  },
                                },
                              });
                            }}
                          // tempScores[selectedScoreIndex].maths = checkNumber(currentToEdit.satScores.maths, parseInt(e.target.value), 800)
                          // //console.log('tempScores', tempScores);
                          />

                          <div className="text-md  rounded-[4px] flex items-center  font-semibold  text-center py-auto px-5 bg-primary-50 border-0 !w-[120px] text-[#FFA28D]h-[40px]">
                            {parseInt(
                              currentToEdit.baseLineScore?.satBaseLineScore
                                ?.maths
                            ) +
                              parseInt(
                                currentToEdit.baseLineScore?.satBaseLineScore
                                  ?.verbal
                              ) ? (
                              parseInt(
                                currentToEdit.baseLineScore?.satBaseLineScore
                                  ?.maths
                              ) +
                              parseInt(
                                currentToEdit.baseLineScore?.satBaseLineScore
                                  ?.verbal
                              )
                            ) : (
                              <span className="text-sm my-auto font-semibold">
                                cumulative
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-5 border-1  border-t-2 pb-3 border-[1.25px_solid_#00000033] justify-center "></div>
                      </div>
                      <div className="flex flex-col ">
                        <p className="font-semibold !text-md cursor-pointer mb-2  text-[#24A3D9]">
                          ACT Baseline Score
                        </p>
                        <div className="flex gap-5 items-center !text-md">
                          <div className="grid grid-cols-2 gap-3 !text-[#517CA8]">
                            <div className="flex flex-col items-center mb-4">
                              <InputField
                                labelClassname="hidden"
                                placeholder="English"
                                inputContainerClassName="text-sm py-1 px-5 bg-primary-50 border-0 h-[40px]"
                                inputClassName="bg-transparent pl-4 rounded-[4px] placeholder:text-sm"
                                parentClassName="flex-1 !text-sm w-[120px]"
                                type="number"
                                value={
                                  currentToEdit.baseLineScore?.actBaseLineScore
                                    ?.english
                                }
                                onChange={(e) => {
                                  setCurrentToEdit({
                                    ...currentToEdit,
                                    baseLineScore: {
                                      ...currentToEdit?.baseLineScore,
                                      actBaseLineScore: {
                                        ...currentToEdit.baseLineScore
                                          ?.actBaseLineScore,
                                        english: e.target.value,
                                      },
                                    },
                                  });
                                }}
                              />
                            </div>
                            <div className="flex  flex-col  items-center mb-4">
                              <InputField
                                labelClassname="hidden"
                                placeholder="Math"
                                inputContainerClassName="text-sm py-1 px-5 bg-primary-50 border-0 h-[40px]"
                                inputClassName="bg-transparent pl-4 rounded-[4px]"
                                parentClassName="flex-1 w-[120px]"
                                type="number"
                                value={
                                  currentToEdit.baseLineScore?.actBaseLineScore
                                    ?.maths
                                }
                                onChange={(e) => {
                                  setCurrentToEdit({
                                    ...currentToEdit,
                                    baseLineScore: {
                                      ...currentToEdit?.baseLineScore,
                                      actBaseLineScore: {
                                        ...currentToEdit.baseLineScore
                                          ?.actBaseLineScore,
                                        maths: e.target.value,
                                      },
                                    },
                                  });
                                }}
                              />
                            </div>
                            <div className="flex  flex-col  items-center mb-4">
                              <InputField
                                labelClassname="hidden"
                                placeholder="Reading"
                                inputContainerClassName="text-sm py-1 px-5 bg-primary-50 border-0 h-[40px]"
                                inputClassName="bg-transparent pl-4 rounded-[4px]"
                                parentClassName="flex-1 w-[120px]"
                                type="number"
                                value={
                                  currentToEdit.baseLineScore?.actBaseLineScore
                                    ?.reading
                                }
                                onChange={(e) => {
                                  setCurrentToEdit({
                                    ...currentToEdit,
                                    baseLineScore: {
                                      ...currentToEdit?.baseLineScore,
                                      actBaseLineScore: {
                                        ...currentToEdit.baseLineScore
                                          ?.actBaseLineScore,
                                        reading: e.target.value,
                                      },
                                    },
                                  });
                                }}
                              />
                            </div>
                            <div className="flex  flex-col  items-center mb-4">
                              <InputField
                                labelClassname="hidden"
                                placeholder="Science"
                                inputContainerClassName="text-sm py-1 px-5 bg-primary-50 border-0 h-[40px]"
                                inputClassName="bg-transparent pl-4 rounded-[4px]"
                                parentClassName="flex-1 w-[120px]"
                                type="number"
                                value={
                                  currentToEdit.baseLineScore?.actBaseLineScore
                                    ?.science
                                }
                                onChange={(e) => {
                                  setCurrentToEdit({
                                    ...currentToEdit,
                                    baseLineScore: {
                                      ...currentToEdit?.baseLineScore,
                                      actBaseLineScore: {
                                        ...currentToEdit.baseLineScore
                                          ?.actBaseLineScore,
                                        science: e.target.value,
                                      },
                                    },
                                  });
                                }}
                              />
                            </div>
                          </div>

                          <div className="text-md py-2 rounded-[4px] flex items-center  font-semibold  text-center py-auto px-5 bg-primary-50 border-0 !w-[120px] text-[#FFA28D] h-[40px]">
                            {parseInt(
                              currentToEdit.baseLineScore?.actBaseLineScore
                                ?.maths
                            ) +
                              parseInt(
                                currentToEdit.baseLineScore?.actBaseLineScore
                                  ?.science
                              ) +
                              parseInt(
                                currentToEdit.baseLineScore?.actBaseLineScore
                                  ?.reading
                              ) +
                              parseInt(
                                currentToEdit.baseLineScore?.actBaseLineScore
                                  ?.english
                              ) ? (
                              parseInt(
                                currentToEdit.baseLineScore?.actBaseLineScore
                                  ?.maths
                              ) +
                              parseInt(
                                currentToEdit.baseLineScore?.actBaseLineScore
                                  ?.science
                              ) +
                              parseInt(
                                currentToEdit.baseLineScore?.actBaseLineScore
                                  ?.reading
                              ) +
                              parseInt(
                                currentToEdit.baseLineScore?.actBaseLineScore
                                  ?.english
                              )
                            ) : (
                              <span className="text-placeholder:text-sm my-auto text-sm font-semibold">
                                cumulative
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {currentField.name === "actScores" && (
                  <>
                    <div className="flex flex-col gap-4 ">
                      <div className="max-h-[50vh] overflow-y-auto custom-scroller">
                        {currentToEdit?.actScores?.map(
                          (it, selectedScoreIndex) => {
                            return (
                              <div className="flex flex-col ">
                                <p className="font-semibold text-[20px] cursor-pointer mb-2  text-[#24A3D9]">
                                  ACT&reg; {selectedScoreIndex + 1}
                                </p>
                                <div className="flex gap-5 items-center !text-md">
                                  <div className="grid grid-cols-2 gap-3 !text-[#517CA8]">
                                    <div className="flex flex-col items-center mb-4">
                                      <InputField
                                        labelClassname="hidden"
                                        placeholder="English"
                                        inputContainerClassName="text-sm py-1 px-5 bg-primary-50 border-0 !font-semibold h-[40px]"
                                        inputClassName="bg-transparent pl-4 rounded-[4px] placeholder:text-sm placeholder-[#CBD6E2]"
                                        parentClassName="flex-1 !text-sm w-[120px]"
                                        type="number"
                                        pattern={""}
                                        value={
                                          currentToEdit.actScores[
                                            selectedScoreIndex
                                          ]?.english
                                        }
                                        onChange={(e) => {
                                          if (
                                            parseInt(e.target.value) < 0 ||
                                            parseInt(e.target.value) > 1000
                                          ) {
                                            return;
                                          }
                                          let tempScores = [
                                            ...currentToEdit.actScores,
                                          ];
                                          if (
                                            tempScores.length <=
                                            selectedScoreIndex
                                          ) {
                                            tempScores.push({
                                              createdAt: new Date(),
                                              maths: 0,
                                              english: 0,
                                              reading: 0,
                                              science: 0,
                                            });
                                          }
                                          tempScores = tempScores.map(
                                            (item, idx) => {
                                              if (selectedScoreIndex === idx) {
                                                return {
                                                  ...item,
                                                  english: checkNumber(
                                                    currentToEdit.actScores[
                                                      selectedScoreIndex
                                                    ]?.english,
                                                    parseInt(e.target.value),
                                                    36
                                                  ),
                                                };
                                              } else {
                                                return { ...item };
                                              }
                                            }
                                          );
                                          setCurrentToEdit({
                                            ...currentToEdit,
                                            actScores: tempScores,
                                          });
                                        }}
                                      />
                                    </div>
                                    <div className="flex  flex-col  items-center mb-4">
                                      <InputField
                                        labelClassname="hidden"
                                        placeholder="Math"
                                        inputContainerClassName="text-sm py-1 px-5 bg-primary-50 border-0 !font-semibold h-[40px]"
                                        inputClassName="bg-transparent pl-4 rounded-[4px] placeholder-[#CBD6E2]"
                                        parentClassName="flex-1 w-[120px]"
                                        type="number"
                                        value={
                                          currentToEdit.actScores[
                                            selectedScoreIndex
                                          ]?.maths
                                        }
                                        onChange={(e) => {
                                          if (
                                            parseInt(e.target.value) < 0 ||
                                            parseInt(e.target.value) > 1000
                                          ) {
                                            return;
                                          }
                                          let tempScores = [
                                            ...currentToEdit.actScores,
                                          ];
                                          if (
                                            tempScores.length <=
                                            selectedScoreIndex
                                          ) {
                                            tempScores.push({
                                              createdAt: new Date(),
                                              maths: 0,
                                              english: 0,
                                              reading: 0,
                                              science: 0,
                                            });
                                          }
                                          tempScores = tempScores.map(
                                            (item, idx) => {
                                              if (selectedScoreIndex === idx) {
                                                return {
                                                  ...item,
                                                  maths: checkNumber(
                                                    currentToEdit.actScores[
                                                      selectedScoreIndex
                                                    ]?.maths,
                                                    parseInt(e.target.value),
                                                    36
                                                  ),
                                                };
                                              } else {
                                                return { ...item };
                                              }
                                            }
                                          );
                                          setCurrentToEdit({
                                            ...currentToEdit,
                                            actScores: tempScores,
                                          });
                                        }}
                                      />
                                    </div>
                                    <div className="flex  flex-col  items-center mb-4">
                                      <InputField
                                        labelClassname="hidden"
                                        placeholder="Reading"
                                        inputContainerClassName="text-sm py-1 px-5 bg-primary-50 border-0 !font-semibold h-[40px]"
                                        inputClassName="bg-transparent pl-4 rounded-[4px] placeholder-[#CBD6E2]"
                                        parentClassName="flex-1 w-[120px]"
                                        type="number"
                                        value={
                                          currentToEdit.actScores[
                                            selectedScoreIndex
                                          ]?.reading
                                        }
                                        onChange={(e) => {
                                          if (
                                            parseInt(e.target.value) < 0 ||
                                            parseInt(e.target.value) > 1000
                                          ) {
                                            return;
                                          }
                                          let tempScores = [
                                            ...currentToEdit.actScores,
                                          ];
                                          if (
                                            tempScores.length <=
                                            selectedScoreIndex
                                          ) {
                                            tempScores.push({
                                              createdAt: new Date(),
                                              maths: 0,
                                              english: 0,
                                              reading: 0,
                                              science: 0,
                                            });
                                          }
                                          tempScores = tempScores.map(
                                            (item, idx) => {
                                              if (selectedScoreIndex === idx) {
                                                return {
                                                  ...item,
                                                  reading: checkNumber(
                                                    currentToEdit.actScores[
                                                      selectedScoreIndex
                                                    ]?.reading,
                                                    parseInt(e.target.value),
                                                    36
                                                  ),
                                                };
                                              } else {
                                                return { ...item };
                                              }
                                            }
                                          );
                                          setCurrentToEdit({
                                            ...currentToEdit,
                                            actScores: tempScores,
                                          });
                                        }}
                                      />
                                    </div>
                                    <div className="flex  flex-col  items-center mb-4">
                                      <InputField
                                        labelClassname="hidden"
                                        placeholder="Science"
                                        inputContainerClassName="text-sm py-1 px-5 bg-primary-50 border-0 !font-semibold h-[40px]"
                                        inputClassName="bg-transparent pl-4 rounded-[4px] placeholder-[#CBD6E2]"
                                        parentClassName="flex-1 w-[120px]"
                                        type="number"
                                        value={
                                          currentToEdit.actScores[
                                            selectedScoreIndex
                                          ]?.science
                                        }
                                        onChange={(e) => {
                                          if (
                                            parseInt(e.target.value) < 0 ||
                                            parseInt(e.target.value) > 1000
                                          ) {
                                            return;
                                          }
                                          let tempScores = [
                                            ...currentToEdit.actScores,
                                          ];
                                          if (
                                            tempScores.length <=
                                            selectedScoreIndex
                                          ) {
                                            tempScores.push({
                                              createdAt: new Date(),
                                              maths: 0,
                                              english: 0,
                                              reading: 0,
                                              science: 0,
                                            });
                                          }
                                          tempScores = tempScores.map(
                                            (item, idx) => {
                                              if (selectedScoreIndex === idx) {
                                                return {
                                                  ...item,
                                                  science: checkNumber(
                                                    currentToEdit.actScores[
                                                      selectedScoreIndex
                                                    ]?.science,
                                                    parseInt(e.target.value),
                                                    36
                                                  ),
                                                };
                                              } else {
                                                return { ...item };
                                              }
                                            }
                                          );
                                          setCurrentToEdit({
                                            ...currentToEdit,
                                            actScores: tempScores,
                                          });
                                        }}
                                      />
                                    </div>
                                  </div>

                                  <div className="text-md py-2 rounded-[4px] flex items-center  font-semibold  text-center py-auto px-2 bg-primary-50 border-0 !w-[120px] text-[#FFA28D] !h-[40px] ">
                                    {it?.maths +
                                      it?.science +
                                      it?.reading +
                                      it?.english ? (
                                      it?.maths +
                                      it?.science +
                                      it?.reading +
                                      it?.english
                                    ) : (
                                      <span className="text-placeholder:text-sm my-auto font-semibold">
                                        cumulative
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <InputField
                                  label="Test Date"
                                  labelClassname="text-[#26435F]"
                                  placeholder=""
                                  inputContainerClassName="text-xs  bg-primary-50 border-0 !py-3 !px-2 !rounded-[5px]  !h-[50px] w-[206px] text-[#507CA8]"
                                  inputClassName="bg-transparent text-xs   "
                                  parentClassName=""
                                  type="date"
                                  value={currentToEdit.dob}
                                  onChange={(e) =>
                                    setCurrentToEdit({
                                      ...currentToEdit,
                                      dob: e.target.value,
                                      birthyear: e.target.value?.split("-")[0],
                                    })
                                  }
                                />
                                <div className="mt-5 border-1  border-t-2 mb-[30px] border-[1.25px_solid_#00000033] justify-center "></div>
                              </div>
                            );
                          }
                        )}
                      </div>
                      <p
                        onClick={() => {
                          let tempScores = [...currentToEdit.actScores];

                          tempScores.push({
                            maths: null,
                            english: null,
                            reading: null,
                            science: null,
                            createdAt: new Date(),
                          });
                          setCurrentToEdit({
                            ...currentToEdit,
                            actScores: tempScores,
                          });
                        }}
                        className="font-bold !text-lg cursor-pointer    text-[#24A3D9]"
                      >
                        Add{" "}
                        <svg
                          className="inline-block -mt-1"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M14.4987 9.29037H9.29037V14.4987C9.29037 14.775 9.18062 15.0399 8.98527 15.2353C8.78992 15.4306 8.52497 15.5404 8.2487 15.5404C7.97243 15.5404 7.70748 15.4306 7.51213 15.2353C7.31678 15.0399 7.20703 14.775 7.20703 14.4987V9.29037H1.9987C1.72243 9.29037 1.45748 9.18062 1.26213 8.98527C1.06678 8.78992 0.957031 8.52497 0.957031 8.2487C0.957031 7.97243 1.06678 7.70748 1.26213 7.51213C1.45748 7.31678 1.72243 7.20703 1.9987 7.20703H7.20703V1.9987C7.20703 1.72243 7.31678 1.45748 7.51213 1.26213C7.70748 1.06678 7.97243 0.957031 8.2487 0.957031C8.52497 0.957031 8.78992 1.06678 8.98527 1.26213C9.18062 1.45748 9.29037 1.72243 9.29037 1.9987V7.20703H14.4987C14.775 7.20703 15.0399 7.31678 15.2353 7.51213C15.4306 7.70748 15.5404 7.97243 15.5404 8.2487C15.5404 8.52497 15.4306 8.78992 15.2353 8.98527C15.0399 9.18062 14.775 9.29037 14.4987 9.29037Z"
                            fill="#24A3D9"
                          />
                        </svg>
                      </p>
                    </div>
                  </>
                )}
                {currentField.name === "aboutScore" && (
                  <div>
                    <div className="flex items-center mb-5">
                      <InputField
                        labelClassname="hidden"
                        placeholder="PSAT / P-ACT Scores"
                        inputContainerClassName="text-sm pt-3.5 pb-3 px-5 bg-primary-50 border-0"
                        inputClassName="bg-transparent rounded-[4px]"
                        parentClassName="flex-1"
                        type="text"
                        value={currentToEdit.aboutScore}
                        onChange={(e) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            aboutScore: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
                {currentField.name === "videoLink" && (
                  <div>
                    <input
                      placeholder=""
                      value={currentToEdit.videoLink}
                      onChange={(e) =>
                        setCurrentToEdit({
                          ...currentToEdit,
                          videoLink: e.target.value,
                        })
                      }
                      className="bg-lightWhite w-full outline-0 px-5 pt-3 pb-3 rounded"
                    />
                  </div>
                )}
                {/* <InputField label='First Name'
                           labelClassname='ml-4 mb-0.5'
                           placeholder='First Name'
                           inputContainerClassName='text-sm pt-3.5 pb-3.5 px-5 bg-primary-50 border-0'
                           inputClassName='bg-transparent'
                           parentClassName='w-full mr-4' type='text' /> */}
              </form>
            </>
          }
        />
      )
    );
  });
}
