import React, { useEffect, useRef, useState } from "react";
import { useLazyGetParentsByNameQuery } from "../../../../app/services/admin";
import { useLazyGetStudentsByNameQuery } from "../../../../app/services/session";
import ProfilePhoto from "./ProfilePhoto";
import down from "../../../../assets/YIcons/Group33.svg";
import caution from "../../../../assets/icons/octicon_stop-16.svg";
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
import { Country } from "country-state-city";
import { useUpdateUserOrganizationMutation } from "../../../../app/services/organization";
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

  const [student, setStudent] = useState("");
  const [fetchStudents, studentResponse] = useLazyGetStudentsByNameQuery();
  const [students, setStudents] = useState([]);
  const { role: persona } = useSelector((state) => state.user);
  const [parent, setParent] = useState("");
  const [fetchParents, fetchParentsResp] = useLazyGetParentsByNameQuery();
  const [parents, setParents] = useState([]);
  const [addNotes, notesStatus] = useAddNotesMutation();
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
  const [textOpen, setTextOpen] = useState(false);
  const data = [
    {
      name: "profileData",
      title: "profileData",
      api: "user",
    },
    {
      name: "frame0",
      title: "Account Details",
      api: "user",
    },
    {
      name: "frame1",
      title: "Additional Details",
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
      name: "industry",
      title: "Industry",
      api: "userDetail",
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
      title: "Service",
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
      title: "SAT Scores",
      api: "userDetail",
    },
    {
      name: "actScores",
      title: "ACT Scores",
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
  const [country, setCountry] = useState([]);
  const [states, setStates] = useState([]);
  const handleState = (c) => {
    if (!c) return;
    //console.log("country", c);
    if (typeof c === "object") c = c.name;
    const state = country.filter((x) => x.name === c);
    const currentState = state.map((s) => s.states);

    setStates([...currentState[0]]);
  };
  const countryData = Country.getAllCountries().map((city) => ({
    value: city.name,
    displayValue: city.name,
  }));
  useEffect(() => {
    if (!currentToEdit.hasOwnProperty("country")) return;
    console.log("countries usseffect ", currentToEdit);

    fetch("/countryData.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("countries ", data);
        setCountry(data);
      });

    const c = currentToEdit.country;
    if (c) {
      const state = country.filter((x) => x.name === c);
      const currentState = state.map((s) => s.states);
      if (currentState.length > 0) setStates([...currentState[0]]);
    }
  }, [currentToEdit]);
  const [addLink, addLinkStatus] = useAddLinkStudentMutation();
  const [uploadedImage, setUploadedImage] = useState(null)

  const handleProfilePhotoChange = (file) => {
    // //console.log(file)
    setUploadedImage(file)
    let url = "";

  };

  const updateProfileImage = () => {
    if (uploadedImage) {
      let url = "";
      const formData = new FormData();
      formData.append("photo", uploadedImage);
      if (persona === "admin") {
        url = `${BASE_URL}api/user/admin/addphoto/${userId} `;
      } else {
        url = `${BASE_URL}api/user/addphoto`;
      }
      axios.patch(url, formData, { headers: getAuthHeader() }).then((res) => {
        //  //console.log(res);
        fetchDetails();
        setUploadedImage(null)
      });
    }
  }

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

  const handleClose = () => {
    let tempToEdit = {};
    Object.keys(toEdit).map((key) => {
      return (tempToEdit[key] = { ...toEdit[key], active: false });
    });
    setTextOpen(false);
    setToEdit(tempToEdit);
    setUploadedImage(null)
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
  const [updateUserOrg, updateUserOrgStatus] =
    useUpdateUserOrganizationMutation();
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
  const updateUserAccount = async (values) => {
    try {
      updateUserOrg(values)
        .then((res) => {
          //console.log("org updated", values,res);
        })
        .catch((err) => {
          //console.log(err);
        });
    } catch (e) {
      console.error(e);
    }
  };
  function isPhoneNumber(val) {
    let regEmail =
      /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
    if (!regEmail.test(val)) {
      return false;
    } else {
      return true;
    }
  }
  const emailValidation = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    let reqBody = { ...currentToEdit };
    delete reqBody["active"];
    console.log({ reqBody, userId });
    updateProfileImage()
    if (reqBody.hasOwnProperty("firstName")) {
      console.log("fiestName", reqBody.firstName?.length, { reqBody, userId });
      if (
        reqBody.firstName?.length === 0 ||
        reqBody.firstName?.trim()?.length === 0
      ) {
        alert("First name can't be empty.");
        return;
      }
    }
    if (reqBody.hasOwnProperty("lastName")) {
      if (
        reqBody.lastName?.length === 0 ||
        reqBody.lastName?.trim()?.length === 0
      ) {
        alert("Last name can't be empty.");
        return;
      }
    }
    if (reqBody.hasOwnProperty("country")) {
      updateUserAccount(reqBody);
    }
    if (reqBody.hasOwnProperty("phone")) {
      if (!isPhoneNumber(reqBody.phone)) {
        alert("Please enter a valid phone number.");
        return;
      }
    }
    if (currentToEdit.hasOwnProperty("email") && !emailValidation.test(currentToEdit.email)) {
      alert("Enter valid email.");
      return;
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

      //  addNotes(reqBody).then((res)=>{
      //   //console.log("internal",{res})
      //  })
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

    if (currentToEdit.hasOwnProperty("alternateEmail") && currentToEdit?.alternateEmail?.length > 0) {
      console.log({ currentField, currentToEdit })
      if (!emailValidation.test(currentToEdit.alternateEmail)) {
        //  alert("Enter valid alternate email.");
        //  return;
      }
      // else 
      userDetailSave({ Email: currentToEdit?.alternateEmail });
    }
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
    if (
      currentToEdit.hasOwnProperty("driveLink") &&
      currentToEdit.driveLink.length > 2
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
    if (currentToEdit.hasOwnProperty("about")) {
      let reqBody = {
        about: currentToEdit.about,
        accomodations: "None",
      };

      userDetailSave(reqBody);
    }
    if (
      currentToEdit.hasOwnProperty("dropBoxLink") &&
      currentToEdit.dropBoxLink.length > 2
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
    "frame0",
  ];
  //console.log({country,states,currentToEdit})
  return Object.keys(toEdit).map((key) => {
    return (
      toEdit[key].active === true && (
        <Modal
          fetchDetails={fetchDetails}
          key={key}
          topClass="!absolute !h-[120vh]"
          modalSize={currentField.name === "frame1" ? "!w-[1106px] !max-w-[1106px]" : ""}
          classname={`${forCss.includes(currentField.name)
              ? "max-w-[850px] md:pb-5 mx-auto overflow-visible pb-5 !px-[35px]" :
              currentField.name === "frame1"
                ? "max-w-[980px] md:pb-5 mx-auto overflow-visible pb-5 !px-10"
                : "max-w-fit md:pb-5 mx-auto overflow-visible pb-5 !px-[20px]"
            } `} /*{ ` max-w-[900px] md:pb-5 mx-auto overflow-visible pb-5`}*/
          title=""
          // primaryBtn={{
          //    text: "Save",
          //    className: 'w-[100px] bg-primaryOrange text-base pt-2 ml-0 pb-2 text-lg pl-3 pr-3 ',
          //    form: 'editable-form',
          //    // onClick: handleSubmit,
          //    type: 'submit',
          //    loading,
          // }}
          crossBtn={true}
          cancelBtnStyle={{ top: "18px" }}
          titleClassName="!hidden"
          underline={true}
          handleClose={handleClose}
          body={
            <>
              <div className="flex  items-center mt-[23px]">
                <div className="mr-5 text-[#26435F] font-semibold text-[21px]">
                  {currentField.title
                    ? currentField.title
                    : toEdit.tutorServices
                      ? "Service"
                      : ""}
                </div>
                <button
                  className="w-[133px] bg-[#FFA28D] py-1  text-white  text-base px-3 ml-auto h-[40px] rounded-lg"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              </div>
              <div className="mt-3 border-1  border-t-2 pb-3 border-[1.25px_solid_#00000033] justify-center "></div>
              <form
                className="mt-1 mb-4"
                id="editable-form"
                onSubmit={handleSubmit}
              >
                {/* {currentField.fields && currentField.fields} */}
                {currentField.name === "frame0" && (
                  <div className="flex flex-col px-2 max-h-[60vh] w-full ">
                    <div className="flex gap-3 items-center w-full">
                      <div className="flex flex-col gap-5 w-full">
                        <div className="flex !text-sm gap-4 ">
                          <div className="!w-[100px] mr-5">
                            <ProfilePhoto
                              src={
                                uploadedImage ?
                                URL.createObjectURL(uploadedImage) :
                                user.photo
                                  ? `${awsLink}${user.photo}`
                                  : "/images/Rectangle 2347.svg"
                              }
                              cameraClass=" translate-y-3"
                              imageClassName=" border-[4px] border-white"
                              className=""
                              imgSizeClass="!w-[93.456px] !h-[93.456px] "
                              handleChange={handleProfilePhotoChange}
                              editable={editable}
                            />
                          </div>
                          <InputField
                            label="First name"
                            labelClassname="text-[#26435F] !font-semibold text-[18.6px] mb-[5px]"
                            placeholder="First Name"
                            inputContainerClassName="text-xs !shadow-[0px_0px_2px_0px_#00000040] bg-[#F6F6F6] border-0 !py-3 !px-2 !rounded-[5px]"
                            inputClassName="bg-transparent text-[16px] text-[#667085]  "
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

                          <InputField
                            label="Last name"
                            labelClassname="text-[#26435F] !font-semibold text-[18.6px] mb-[5px]"
                            placeholder="Last Name"
                            inputContainerClassName="text-xs !shadow-[0px_0px_2px_0px_#00000040] bg-[#F6F6F6] border-0 !py-3 !px-2 !rounded-[5px]"
                            inputClassName="bg-transparent text-[16px]  text-[#667085]"
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
                        <div className="flex !text-sm gap-4 items-center ">
                          <InputFieldDropdown
                            placeholder="Phone"
                            labelClassname="text-[#26435F] !font-semibold text-[18.6px] mb-[5px]"
                            inputContainerClassName="flex gap-1 pt-0 pb-0 px-0 !py-0 !px-0  border-white"
                            inputClassName=" text-[#667085] text-[16px] pt-3 pb-3 px-5 !py-[13px] bg-primary-50  text-400 rounded-[5px] "
                            codeClassName="!px-4 w-[70px] !gap-4 text-[#667085] text-sm !py-[22.5px]  bg-primary-50  text-400 rounded-[5px] "
                            parentClassName="flex-1 "
                            type="number"
                            label="Phone"
                            value={currentToEdit.phone}
                            codeValue={currentToEdit.phoneCode}
                            handleCodeChange={(e) =>
                              setCurrentToEdit({
                                ...currentToEdit,
                                phoneCode: e.target.value,
                              })
                            }
                            onChange={(e) =>
                              setCurrentToEdit({
                                ...currentToEdit,
                                phone: e.target.value,
                              })
                            }
                          />
                          <InputField
                            IconLeft={caution}
                            label="Email"
                            labelClassname="text-[#26435F] font-semibold text-[18.6px] mb-[5px]"
                            placeholder="Email"
                            inputContainerClassName="text-xs !shadow-[0px_0px_2px_0px_#00000040] bg-[#F6F6F6] border-0 !py-3 !px-2 !rounded-[5px]"
                            inputClassName="bg-transparent !w-[200px] text-[16px]  text-[#667085] "
                            parentClassName="flex-1 "
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
                                <span className="absolute top-10 w-[200px] scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
                                  <h3 className="text-[#24A3D9] font-semibold mb-1 ">
                                    Email Confirmation Sent
                                  </h3>
                                  You need to verify your email if
                                  <ul className="list-disc pl-3 mb-2">
                                    <li>you created a new account.</li>
                                    <li>you recently changed your email.</li>
                                  </ul>
                                  We have sent you an email verification link to
                                  your current email address to make sure that
                                  it really is you who requested a change.
                                </span>
                              )
                            }
                          />
                          <InputField
                            label="Alternative Email"
                            labelClassname="text-[#26435F] font-semibold text-[18.6px] mb-[5px]"
                            placeholder="Alternative Email"
                            inputContainerClassName="text-xs !shadow-[0px_0px_2px_0px_#00000040] bg-[#F6F6F6] border-0 !py-3 !px-2 !rounded-[5px]"
                            inputClassName="bg-transparent !w-[200px] text-[16px]  text-[#667085] "
                            parentClassName="flex-1"
                            type="text"
                            value={currentToEdit.alternateEmail}
                            onChange={(e) =>
                              setCurrentToEdit({
                                ...currentToEdit,
                                alternateEmail: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex-1 mt-5">
                        <p className=" text-[18.6px] mb-[5px] text-[#26435F] font-semibold">
                          About
                        </p>
                        <textarea
                          rows="3"
                          className="mt-1 block w-full h-[100px] bg-[#F6F6F6] resize-none focus:!ring-blue-500 p-2 focus:!border-blue-500 placeholder-[#CBD6E2] text-[16px]   border border-[0.917px_solid_#D0D5DD] rounded-[6px] text-[#667085]
                "
                          placeholder="The parent can add their bio in this space. Here are a few ideas to get started:
Likes, dislikes, personality, professional details, hobbies, favorite sports, activities, family details, habits, favorite movies and TV shows, music taste, strengths and weaknesses."
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
                    {persona === "admin" ? (
                      <div className=" ">
                        <div
                          id="borderDashed2"
                          className="h-[2px] w-[100%] mt-6 mx-auto my-4"
                        ></div>
                        {/* <p className='font-medium mr-4'> Associated Students </p> */}
                        {/* <div className="max-w-[250px] mx-auto">
                        <Slider
                          images={currentToEdit.studentsData}
                          awsLink={awsLink}
                        />
                      </div> */}

                        <InputSearch
                          right={
                            <img
                              className="w-5 h-4 cursor-pointer"
                              alt="drop"
                              src={down}
                            />
                          }
                          labelClassname="text-[#26435F] mb-1 text-sm"
                          label="Associated Students"
                          placeholder="Select Associated Students"
                          parentClassName="w-[300px] mb-10"
                          inputContainerClassName="bg-[#F6F6F6] border-0 pt-3.5 pb-3.5 text-sm hover:cursor-pointer"
                          inputClassName="bg-[#F6F6F6] text-sm "
                          type="text"
                          optionPrefix="s"
                          value={student}
                          optionClassName="h-[60px] 2xl:h-[100px]  design:h-[200px]"
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
                    ) : (
                      ""
                    )}
                    <div></div>
                  </div>
                )}

                {currentField.name === "frame1" && (
                  <>
                    <div className="flex flex-col gap-5 !w-[100%]">
                      <div className="flex  justify-between items-center">
                        <InputField
                          label="D.O.B"
                          biggerText={true}
                          labelClassname="text-[#26435F]  !font-medium"
                          placeholder=""
                          inputContainerClassName="text-base  bg-[#F6F6F6] border-0 !py-1 !px-3 !rounded-[5px]  h-[54px]"
                          inputClassName="bg-transparent text-base  "
                          parentClassName="!w-[20%]"
                          type="date"
                          max={new Date().toISOString().split('T')[0]} 
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
                          labelClassname="text-[#26435F] text-lg !font-medium"
                          label="Time zone"
                          placeholder="Select"
                          inputContainerClassName="text-base  bg-[#F6F6F6] border-0 !py-1 !px-3 !rounded-[5px]  h-[54px]"
                          inputClassName="bg-transparent  "
                          parentClassName="!w-[35%]"
                          type="text"
                          value={currentToEdit.timeZone}
                          onChange={(val) =>
                            setCurrentToEdit({
                              ...currentToEdit,
                              timeZone: val,
                            })
                          }
                          optionData={timeZones}
                          radio={true}
                        />
                        {console.log(currentToEdit)}

                        <InputSelectNew
                          biggerText={true}
                          labelClassname="text-[#26435F]  !font-medium"
                          label="Industry"
                          placeholder="Select"
                          inputContainerClassName="text-base placeholder:text-[#667085]  bg-[#F6F6F6] border-0 !py-1 !px-3 !rounded-[5px]  h-[54px]"
                          inputClassName="bg-transparent placeholder:text-[#667085]"
                          parentClassName="!w-[35%]"
                          optionData={[
                            "IT",
                            "Finance",
                            "Sales",
                            "Marketing",
                            "Business",
                            "Agriculture",
                          ]}
                          type="text"
                          value={currentToEdit.industry}
                          onChange={(e) =>
                            setCurrentToEdit({
                              ...currentToEdit,
                              industry: e,
                            })
                          }
                        />
                      </div>

                      <div className="flex  justify-between items-center">
                        <InputSelectNew
                          labelClassname="text-[#26435F] text-lg !font-medium"
                          label="Country"
                          placeholder="Select"
                          inputContainerClassName="text-base  bg-[#F6F6F6] border-0 !py-1 !px-3 !rounded-[5px]  h-[54px]"
                          inputClassName="bg-transparent  "
                          parentClassName="!w-[35%]"
                          type="text"
                          optionData={country}
                          optionType={"object"}
                          value={currentToEdit?.country}
                          onChange={(e) => {
                            handleState(e);

                            setCurrentToEdit({
                              ...currentToEdit,
                              country: e.name,
                            });
                          }}
                        />

                        <InputField
                          biggerText={true}
                          label="Street Address"
                          labelClassname="text-[#26435F]  !font-medium"
                          placeholder="Text"
                          inputContainerClassName="text-base placeholder:text-[#667085] bg-[#F6F6F6] border-0 !py-1 !px-3 !rounded-[5px] h-[54px]"
                          inputClassName="bg-transparent placeholder:text-[#667085] "
                          parentClassName="!w-[60%]"
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
                      <div className="flex justify-between items-center ">
                        <InputSelectNew
                          labelClassname="text-[#26435F] text-lg !font-medium"
                          label="State"
                          placeholder="Select"
                          inputContainerClassName="text-base  bg-[#F6F6F6] border-0 !py-1 !px-3 !rounded-[5px]  h-[54px]"
                          inputClassName="bg-transparent  "
                          parentClassName="!w-[35%]"
                          type="text"
                          optionData={states}
                          optionType={"object"}
                          onChange={(e) => {
                            setCurrentToEdit({
                              ...currentToEdit,
                              state: e.name,
                            });
                          }}
                          value={currentToEdit.state}
                        />
                        <InputSelectNew
                          biggerText={true}
                          labelClassname="text-[#26435F]  !font-medium"
                          label="City"
                          placeholder="Select"
                          inputContainerClassName="text-base placeholder:text-[#667085]  bg-[#F6F6F6] border-0 !py-1 !px-3 !rounded-[5px]  h-[54px]"
                          inputClassName="bg-transparent placeholder:text-[#667085]"
                          parentClassName="!w-[35%]"
                          type="text"
                          optionData={timeZones}
                          value={currentToEdit.city}
                          onChange={(e) =>
                            setCurrentToEdit({
                              ...currentToEdit,
                              city: e,
                            })
                          }
                        />

                        <InputField
                          label="Zip"
                          biggerText={true}
                          labelClassname="text-[#26435F]  !font-medium"
                          placeholder="Text"
                          inputContainerClassName="text-base placeholder:text-[#667085] bg-[#F6F6F6] border-0 !py-1 !px-3 !rounded-[5px]  h-[54px]"
                          inputClassName="bg-transparent placeholder:text-[#667085]"
                          parentClassName="!w-[20%]"
                          type="number"
                          value={currentToEdit.pincode}
                          onChange={(e) => {
                            const enteredValue = e.target.value;
                            if(enteredValue === ''){
                              setCurrentToEdit({
                                ...currentToEdit,
                                pincode: '',
                              });
                            }
                            if (/^[0-9\s]+$/.test(enteredValue)) {
                              setCurrentToEdit({
                                ...currentToEdit,
                                pincode: enteredValue,
                              });
                            }
                          }}
                        />
                      </div>
                      {persona === "admin" && (
                        <div
                          id="borderDashed"
                          className="w-[70%] mx-auto !border-[#CBD6E3]"
                        ></div>
                      )}
                      {persona === "admin" && (
                        <div className="flex justify-between items-center ">
                          {console.log({ organization })}
                          <InputSelectNew
                            labelClassname="text-[#26435F] text-lg !font-medium"
                            label="Referral Code"
                            placeholder="Select Referral Code"
                            inputContainerClassName="text-base  bg-[#F6F6F6] border-0 !py-1 !px-3 !rounded-[5px] !w-[18.2291vw] h-[54px]"
                            inputClassName="bg-transparent  "
                            parentClassName=""
                            type="text"
                            optionData={organization?.settings?.subscriptionCode?.map(
                              (it) => {
                                return {
                                  ...it,
                                  name: it.code,
                                  value: it.code,
                                };
                              }
                            )}
                            optionType={"object"}
                            onChange={(e) => {
                              setCurrentToEdit({
                                ...currentToEdit,
                                subscriptionCode: e.code,
                              });
                            }}
                            value={currentToEdit.subscriptionCode}
                          />
                        </div>
                      )}
                    </div>
                  </>
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

                {currentField.name === "birthYear" && (
                  <div className="bg-[#F3F5F7] ">
                    {/* <div className='flex items-center mb-5 bg-white rounded-10' style={{ boxShadow: "-3px -4px 24px rgba(0, 0, 0, 0.25)" }}> */}
                    <p className="font-medium mr-4 min-w-[60px]"> </p>
                    <InputField
                      labelClassname="hidden"
                      placeholder="Enter your birth year"
                      inputContainerClassName="text-sm pt-3 pb-3 rounded-sm bg-[#F6F6F6] border-0"
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
                        inputContainerClassName="text-sm pt-3 pb-3 rounded-sm bg-[#F6F6F6] border-0"
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
                        inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-[#F6F6F6] border-0"
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
                    <div className="flex items-center mb-5 pt-6 w-[500px]">
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
                            className={`mt-1 block w-full resize-none focus:!ring-blue-500 p-2 focus:!border-blue-500 placeholder-[#CBD6E2] text-sm   placeholder:text-sm h-[250px] `}
                            placeholder=""
                          ></textarea>
                        )}
                        {!textOpen && currentToEdit?.notes?.length == 0 && (
                          <div
                            onClick={() => setTextOpen(true)}
                            className=" text-[#CBD6E2] text-xs flex-1 text-base-17-5 !p-5 !pt-5 !pl-7 h-[250px]"
                          >
                            Here, you can add notes about the parent. Here are
                            some ideas to get you started:
                            <ul className="list-disc px-4 design:px-5 !pl-7 ">
                              <li className="my-1">
                                How did the initial call go?
                              </li>
                              <li className="my-1">
                                What did the parent say about the student?
                              </li>
                              <li className="my-1">
                                What is the parent’s budget?
                              </li>
                              <li className="my-1">
                                What timeline do they have in mind for tutoring?
                              </li>
                              <li className="my-1">
                                Has the student been tutored before?
                              </li>
                              <li className="my-1">
                                Do they prefer online or offline tutoring?
                              </li>
                              <li className="my-1">
                                What other services might they be interested in?
                              </li>
                              <li className="my-1">
                                Does the student have siblings?
                              </li>
                              <li className="my-1">
                                What is the family demographic?
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {currentField.name === "service" && (
                  <div className="w-[400px] max-h-[50vh] overflow-y-auto custom-scroller">
                    <div className="flex flex-col gap-2">
                      {organization?.settings?.servicesAndSpecialization.map(
                        (item, id) => {
                          return (
                            <div key={id} className="flex gap-5 items-center">
                              <SCheckbox
                                stopM={true}
                                checked={currentToEdit?.service?.includes(
                                  item?.service
                                )}
                                onChange={() =>
                                  handleServiceChange(item?.service)
                                }
                              />
                              <span className="text-[#26435F]">
                                {item?.service}
                              </span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                  // // <div>
                  // //   <div className="flex items-center mb-5 pt-1 pb-5">
                  // //     <InputSelect
                  // //       value={
                  // //         currentToEdit.service.length === 0
                  // //           ? ""
                  // //           : currentToEdit.service[0]
                  // //       }
                  // //       checkbox={{
                  // //         visible: true,
                  // //         name: "services",
                  // //         match: currentToEdit.service,
                  // //       }}
                  // //       optionData={organization?.settings?.servicesAndSpecialization.map(
                  // //         (item) => item.service
                  // //       )}
                  // //       inputContainerClassName="pt-3 pb-3 border rounded-md bg-[#F6F6F6]"
                  // //       placeholder="Service"
                  // //       parentClassName="w-full mr-4"
                  // //       type="select"
                  // //       onChange={
                  // //         (val) => handleServiceChange(val)
                  // //         // setCurrentToEdit({ ...currentToEdit, service: val })
                  // //       }
                  // //       onOptionClick={(item) => {
                  // //         // setStudent(item.value);
                  // //         //console.log(item);
                  // //         // handleStudentsChange(item)
                  // //         // setCurrentToEdit({ ...currentToEdit, students: [... item._id] });
                  // //       }}
                  // //     />
                  // //   </div>
                  // // </div>
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
                        optionData={organization?.settings.leadStatus}
                        radio={true}
                        inputContainerClassName="pt-3 pb-3 border rounded-md bg-[#F6F6F6]"
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
                        inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-[#F6F6F6] border-0"
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
                    parentClassName="w-[300px]  mb-10"
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
                        inputContainerClassName="text-sm pt-3.5 pb-3 px-5 bg-[#F6F6F6] border-0"
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
                                    inputContainerClassName='text-sm pt-3.5 pb-3 px-5 bg-[#F6F6F6] border-0'
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
                          inputContainerClassName="text-sm pt-3.5 pb-3 px-5 bg-[#F6F6F6] border-"
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
                          inputContainerClassName="text-sm pt-3.5 pb-3 px-5 bg-[#F6F6F6] border-"
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
                          inputContainerClassName="text-sm pt-3.5 pb-3 px-5 bg-[#F6F6F6] border-"
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
                          inputContainerClassName="text-sm pt-3.5 pb-3 px-5 bg-[#F6F6F6] border-"
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
                          inputContainerClassName="text-sm pt-3.5 pb-3 px-5 bg-[#F6F6F6] border-"
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
                        inputContainerClassName="text-sm pt-3.5 pb-3 px-5 bg-[#F6F6F6] border-0"
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
                        inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-[#F6F6F6] border-0"
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
                        inputContainerClassName="text-sm pt-3.5 pb-3 px-5 w-[181px] bg-[#F6F6F6] border-0 text-[#667085]"
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
                                    inputContainerClassName='text-sm pt-3 pb-3 px-5 bg-[#F6F6F6] border-0'
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
                                    inputContainerClassName='text-sm pt-3 pb-3 px-5 bg-[#F6F6F6] border-0'
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
                                    inputContainerClassName='text-sm pt-3 pb-3 px-5 bg-[#F6F6F6] border-0'
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
                        inputContainerClassName="text-sm pt-3.5 pb-3 px-5 bg-[#F6F6F6] border-0"
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
                      inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-[#F6F6F6] border-0 text-[#667085]"
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
                    <div className="">
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
                                inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-[#F6F6F6] border-white"
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
                                inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-[#F6F6F6] border-white"
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
                                inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-[#F6F6F6] border-white"
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
                                inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-[#F6F6F6] border-white"
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
                                    inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-[#F6F6F6] border-white"
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
                                    inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-[#F6F6F6] border-white"
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

                {/* <InputField label='First Name'
                           labelClassname='ml-4 mb-0.5'
                           placeholder='First Name'
                           inputContainerClassName='text-sm pt-3.5 pb-3.5 px-5 bg-[#F6F6F6] border-0'
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
