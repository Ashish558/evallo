import React, { useEffect, useState } from "react";
import { useLazyGetParentsByNameQuery } from "../../../../app/services/admin";
import { useLazyGetStudentsByNameQuery } from "../../../../app/services/session";
import {
  useUpdateTutorDetailsMutation,
  useUpdateUserDetailsMutation,
  useUpdateUserFieldsMutation,
  usePostTutorDetailsMutation,
  useAddTutorReviewMutation,
} from "../../../../app/services/users";
import InputField from "../../../../components/InputField/inputField";
import InputSearch from "../../../../components/InputSearch/InputSearch";
import InputSelect from "../../../../components/InputSelect/InputSelect";
import Modal from "../../../../components/Modal/Modal";
import { Country } from "country-state-city";
// import SimpleCalendar from "../../../../components/SimpleCalendar/SimpleCalendar";
// import demoUser from "../../../../assets/icons/demo-user.png";
import Slider from "../../../../components/Slider/Slider";
import { grades, subjects } from "../../../../constants/constants";
import styles from "./style.module.css";
import CountryCode from "../../../../components/CountryCode/CountryCode";
import { useSelector } from "react-redux";
import { BASE_URL, getAuthHeader } from "../../../../app/constants/constants";
// import ProfileCard from "../../../../components/ProfileCard/ProfileCard";
import axios from "axios";
import ProfilePhoto from "../../../../components/ProfilePhoto/ProfilePhoto";
import { useNavigate } from "react-router-dom";
import InputFieldDropdown from "../../../../components/InputField/inputFieldDropdown";
import moment from "moment-timezone";
import InputSelectNew from "../../../../components/InputSelectNew/InputSelectNew";

// 637b9df1e9beff25e9c2aa83
export default function ParentEditables({
  userId,
  setToEdit,
  toEdit,
  fetchDetails,
  settings,
  persona,
  awsLink,
  selectedScoreIndex,
}) {
  const [title, setTitle] = useState("");
  const [currentField, setCurrentField] = useState({});
  const [currentToEdit, setCurrentToEdit] = useState({});

  const [student, setStudent] = useState("");
  const [fetchStudents, studentResponse] = useLazyGetStudentsByNameQuery();
  const [students, setStudents] = useState([]);

  const [parent, setParent] = useState("");
  const [fetchParents, fetchParentsResp] = useLazyGetParentsByNameQuery();
  const [parents, setParents] = useState([]);

  const [updateFields, updateFieldsResp] = useUpdateUserFieldsMutation();
  const [updateDetails, updateDetailsResp] = useUpdateUserDetailsMutation();
  const [updateTutorDetails, updateTutorDetailsResp] =
    useUpdateTutorDetailsMutation();
  const [postTutorDetails, postTutorDetailsResp] =
    usePostTutorDetailsMutation();
  const [addReview, addReviewStatus] = useAddTutorReviewMutation();
  const [updatedService, setUpdatedService] = useState({});
  const [loading, setLoading] = useState(false);

  const { organization } = useSelector((state) => state.organization);
  const Interest = [
    "Basketball",
    "Soccer",
    "American Football",
    "Running",
    "Yoga",
    "Bowling",
    "Tennis",
    "Cricket",
    "F1 Racing",
    "Rock Climbing",
    "Boxing",
    "Trekking",
    "Sketching",
    "Painting",
    "Digital Art",
    "Writing ",
    "Reading",
    "Video Games",
    "Travelling",
    "Board Games ",
    "Blogging",
    "Podcasts",
    "Youtube",
    "Volunteering",
    "Socializing",
    "Singing",
    "Dancing",
    "Listening Music",
    "Guitar",
    "Violin",
    "Drums",
    "Piano",
    "Upskilling",
    "Movies",
    "TV Shows",
    "Anime",
    "Comics",
    "Cooking",
  ];
  const Expertise = [
    { _id: 1, text: "SAT" },
    { _id: 2, text: "ACT" },
    { _id: 3, text: "GRE" },
    { _id: 4, text: "GMAT" },
    { _id: 5, text: "Academic Coaching" },
    { _id: 6, text: "Life Coaching" },
    { _id: 7, text: "Career Counselling" },
    { _id: 8, text: "College Counselling" },
    { _id: 9, text: "Subject Tutoring" },
  ];
  const data = [
    {
      name: "profileData",
      title: "Basic Info",
      api: "user",
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
      title: "Notes",
      api: "userDetail",
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
      title: "Subjects",
      api: "userDetail",
    },
    {
      name: "accomodations",
      title: "Accomodations",
      api: "userDetail",
    },
    {
      name: "personality",
      title: "Keywords that describe you",
      api: persona === "tutor" ? "tutorDetail" : "userDetail",
    },
    {
      name: "interest",
      title: "Interests",
      api: persona === "tutor" ? "tutorDetail" : "userDetail",
    },
    {
      name: "serviceSpecializations",
      title: "Expertise",
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
      title: "Hourly Rate",
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
      title: "Hourly Service Rates",
      api: "tutorDetail",
    },
    {
      name: "videoLink",
      title: "Tutor Highlight Video",
      api: "tutorDetail",
    },
    {
      name: "tutorReviews",
      title: "Tutor Reviews",
      api: "tutorDetail",
    },
  ];

  const handleProfilePhotoChange = (file) => {
    // console.log(file)
    let url = "";
    const formData = new FormData();
    formData.append("photo", file);
    if (persona === "admin") {
      url = `${BASE_URL}api/user/admin/addphoto/${userId} `;
    } else {
      url = `${BASE_URL}api/user/addphoto`;
    }
    axios.patch(url, formData, { headers: getAuthHeader() }).then((res) => {
      console.log(res);
      fetchDetails();
    });
  };

  const getCurrentField = (keyName) => {
    Object.keys(data).map((key) => {
      if (data[key].name === keyName) {
        // console.log(data[key]);
        setCurrentField(data[key]);
      }
    });
  };

  useEffect(() => {
    Object.keys(toEdit).map((key) => {
      if (toEdit[key].active === true) {
        getCurrentField(key);
        // console.log(toEdit);
        // setEditFieldValue(toEdit[key])
        setCurrentToEdit(toEdit[key]);
      }
    });
    console.log("currentUser");
  }, [toEdit]);
  const timeZones = moment.tz.names(); // String[]

  const handleClose = () => {
    let tempToEdit = {};
    Object.keys(toEdit).map((key) => {
      return (tempToEdit[key] = { ...toEdit[key], active: false });
    });
    setToEdit(tempToEdit);
    // setToEdit()
  };
  //console.log("parentEdit",currentField,currentToEdit,organization,userId)
  const handleAddReview = () => {
    let tutorRev = currentToEdit?.tutorReviews;
    let bool = 0;
    tutorRev?.map((tr, id) => {
      if (
        !tr?.userTag ||
        !tr?.content ||
        !tr?.date ||
        !tr?.service ||
        !tr?.userTag?.length === 0 ||
        !tr?.content?.length === 0 ||
        !tr?.date?.length === 0 ||
        !tr?.service?.length === 0
      ) {
        if (!bool) alert("Please fill all the fields to add review. ");

        bool = 1;
        return;
      }
    });
    if (bool) return;
    tutorRev?.map((tr, id) => {
      let reqBody = tr;
      reqBody.orgId = organization?._id;
      reqBody.tutorId = userId;
      //console.table(id, "review", reqBody);
      addReview(reqBody).then((res) => {
        console.log(id, "newtr tutor review", res);

        if (id === tutorRev?.length - 1) {
          console.log("last review");
          fetchDetails(true, true);
          setLoading(false);
          handleClose();
          setCurrentToEdit({
            active: false,
            tutorReviews: [],
            fetchData: [],
          });
        }
      });
    });
  };

  useEffect(() => {
    if (student.length > 0) {
      fetchStudents(student).then((res) => {
        // console.log('students', res.data.data.students);
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
          // console.log(parent);
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
    console.log(tempStudentsData);
    setCurrentToEdit({
      ...currentToEdit,
      assiginedStudents: tempStudents,
      studentsData: tempStudentsData,
    });
  };

  const handleServiceChange = (item) => {
    let tempService = [...currentToEdit.service];
    if (tempService.includes(item)) {
      // console.log(tempService);
      tempService = tempService.filter((service) => service !== item);
    } else {
      tempService.push(item);
    }
    setCurrentToEdit({ ...currentToEdit, service: tempService });
  };

  const handleSubjectChange = (item) => {
    let tempSubjects = [...currentToEdit.subjects];
    if (tempSubjects.includes(item)) {
      // console.log(tempSubjects);
      tempSubjects = tempSubjects.filter((subject) => subject !== item);
    } else {
      tempSubjects.push(item);
    }
    setCurrentToEdit({ ...currentToEdit, subjects: tempSubjects });
  };

  // useEffect(() => {
  //    updateFields({ id: '637b1522e00aeb4098e8952a', fields: { amountToPay: 5 } })
  //       .then(res => {
  //          console.log(res);
  //       })
  // }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    let reqBody = { ...currentToEdit };
    delete reqBody["active"];
    // console.log(reqBody);
    if (reqBody?.tutorReviews) {
      handleAddReview();
      return;
    }
    if(currentField.name === "videoLink"){
      const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
     let check=false
        if (!urlRegex.test(currentToEdit.videoLink)) check = true;
      

      if (check) {
        alert("Enter valid video url!");
        return;
      }
    }
    if (currentField.name === "profileData") {
      let body = { ...reqBody };
      delete body["firstName"];
      delete body["lastName"];
      delete body["phones"];
      delete body["phoneCode"];
      const emailValidation = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        let check = false;
        const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      
          if (!urlRegex.test(currentToEdit?.linkedIn)) check = true;
        
         if(!emailValidation.test(currentToEdit.email)){
          alert("Enter valid email!");
          return;
         }
         if(!currentToEdit.firstName || currentToEdit.firstName?.trim()?.length===0){
          alert("first name cannot be empty!");
          return;
         }
         if(!currentToEdit.lastName || currentToEdit.lastName?.trim()?.length===0){
          alert("last name cannot be empty!");
          return;
         }
        if (check) {
          alert("Enter valid linkedin url!");
          return;
        }
       
      
      updateTutorDetails({ id: userId, fields: reqBody }).then((res) => {
        console.log("patched", res);
        setLoading(false);
        fetchDetails(true, true);
        // handleClose()
      });
    }
    if (currentField.api === "user") {
      updateFields({ id: userId, fields: reqBody }).then((res) => {
        console.log(res);
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
      if (reqBody.satScores) {
        if (isNaN(reqBody.satScores.maths)) reqBody.satScores.maths = 0;
        if (isNaN(reqBody.satScores.verbal)) reqBody.satScores.verbal = 0;
      }
      if (reqBody.actScores) {
        if (isNaN(reqBody.actScores.maths)) reqBody.actScores.maths = 0;
        if (isNaN(reqBody.actScores.english)) reqBody.actScores.english = 0;
        if (isNaN(reqBody.actScores.reading)) reqBody.actScores.reading = 0;
        if (isNaN(reqBody.actScores.science)) reqBody.actScores.science = 0;
      }
      // console.log(reqBody);
      // return
      updateDetails({ id: userId, fields: reqBody }).then((res) => {
        console.log(res);
        setLoading(false);
        fetchDetails(true, true);
        // handleClose()
      });
    }
    if (
      currentField.name === "profileData" ||
      currentField.api === "tutorDetail"
    ) {
      if (reqBody.tutorLevel) {
        const level = getLevel(reqBody.tutorLevel);
        reqBody.tutorLevel = level;
      }
      // if (reqBody.tutorServices) {
      //   if (currentToEdit.servicePresent === false) {
      //     reqBody.tutorServices = [
      //       ...reqBody.tutorServices,
      //       { ...updatedService },
      //     ];
      //   } else {
      //     reqBody.tutorServices = reqBody.tutorServices.map((serv) => {
      //       if (serv.service === updatedService.service) {
      //         return { ...updatedService };
      //       } else {
      //         return { ...serv };
      //       }
      //     });
      //   }
      // }
      console.log("reqBody", reqBody);
      // return
      if (currentToEdit.isPresent === false) {
        delete reqBody["isPresent"];
        postTutorDetails({ id: userId, fields: reqBody }).then((res) => {
          console.log("posted", res);
          setLoading(false);
          fetchDetails(true, true);
          // handleClose()
        });
      } else {
        delete reqBody["isPresent"];
        updateTutorDetails({ id: userId, fields: reqBody }).then((res) => {
          console.log("patched", res);
          setLoading(false);
          fetchDetails(true, true);
          // handleClose()
        });
      }
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

  // console.log('awsLink', awsLink)
  console.log("toedit--", currentToEdit);
  // console.log('setting', settings.servicesAndSpecialization[currentToEdit.selectedIdx])
  // console.log('field', currentField)
  // console.log('sett', settings)
  // console.log('students', students)
  // console.log('parents', parents)

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
  const navigate = useNavigate();
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

    console.log(updated);
    // setCurrentToEdit(prev => {
    //    return {
    //       ...prev,

    //    }
    // })
  };
  // console.log(settings);
  const [startDate, setStartDate] = useState(new Date());
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
  const forCss = [
    "profileData",
    "interest",
    "serviceSpecializations",
    "tutorReviews",
    "tutorAddress",
    "videoLink",
  ];
  const forCss2 = [
    
    "interest",
    "serviceSpecializations",
   
    "videoLink",
  ];
  return Object.keys(toEdit).map((key) => {
    return (
      toEdit[key].active === true && (
        <Modal
          key={key}
          classname={
            forCss2.includes(currentField.name)
              ? "max-w-[1050px] md:pb-5 mx-auto overflow-visible pb-5"
              : forCss.includes(currentField.name)
              ? "max-w-[950px] md:pb-5 mx-auto overflow-visible pb-5"
              : currentField.name === "tutorServices"
              ? "max-w-[550px] md:pb-5 mx-auto overflow-visible pb-5"
              : "max-w-[650px] md:pb-5 mx-auto overflow-visible pb-5"
          } /*{ ` max-w-[900px] md:pb-5 mx-auto overflow-visible pb-5`}*/
          title=""
          // primaryBtn={{
          //    text: "Save",
          //    className: 'w-[100px] bg-primaryOrange text-base pt-2 ml-0 pb-2 text-lg pl-3 pr-3 ',
          //    form: 'editable-form',
          //    // onClick: handleSubmit,
          //    type: 'submit',
          //    loading,
          // }}
          cancelBtn={false}
          crossBtn={true}
          underline={true}
          cancelBtnStyle={{ top: "1px" }}
          handleClose={handleClose}
          body={
            <>
              <div className="flex items-center">
                <p className="text-[#26435F] py-auto my-auto  font-semibold text-[18.33px]">
                  {currentField.title
                    ? currentField.title
                    : toEdit.tutorServices
                    ? "Service"
                    : ""}
                </p>
                <button
                  className="w-[130px] bg-[#FFA28D] text-base pt-2 rounded text-white pb-2  px-6 ml-auto"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              </div>
              <div className="border-b border-b-[1.33px] mt-[15px]  border-[#00000033] justify-center "></div>
              <form
                className="mt-5 mb-4"
                id="editable-form"
                onSubmit={handleSubmit}
              >
                {/* {currentField.fields && currentField.fields} */}
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
                          {
                            const regex = /^[0-9 ]*$/;
                        const isValid = regex.test(e.target.value);
                        if(isValid  && e.target.value?.length<11)
                            setCurrentToEdit({
                            ...currentToEdit,
                            phone: e.target.value,
                          })}
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
                    <div className="flex items-center mb-5 pt-6">
                      {/* <p className='font-medium mr-4 min-w-[60px]'>  </p> */}
                      <InputField
                        labelClassname="hidden"
                        placeholder="Enter your notes"
                        inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-primary-50 border-0"
                        inputClassName="bg-transparent"
                        parentClassName="flex-1 "
                        type="text"
                        value={currentToEdit.notes}
                        onChange={(e) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            notes: e.target.value,
                          })
                        }
                      />
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
                  <div>
                    <div className="flex items-center mb-5 pt-1 pb-5">
                      <InputSelect
                        value={
                          currentToEdit.service.length === 0
                            ? ""
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
                          console.log(item);
                          // handleStudentsChange(item)
                          // setCurrentToEdit({ ...currentToEdit, students: [... item._id] });
                        }}
                      />
                    </div>
                  </div>
                )}
                {currentField.name === "subjects" && (
                  <div>
                    <div className="flex items-center mb-5 pt-1 pb-5">
                      <InputSelect
                        value={
                          currentToEdit.subjects.length === 0
                            ? ""
                            : currentToEdit.subjects[0]
                        }
                        checkbox={{
                          visible: true,
                          name: "subjects",
                          match: currentToEdit.subjects,
                        }}
                        optionData={settings.classes ? settings.classes : []}
                        inputContainerClassName="pt-3 pb-3 border bg-white"
                        placeholder="Subjects"
                        parentClassName="w-full mr-4"
                        type="select"
                        onChange={
                          (val) => handleSubjectChange(val)
                          // setCurrentToEdit({ ...currentToEdit, service: val })
                        }
                        onOptionClick={(item) => {
                          // setStudent(item.value);
                          console.log(item);
                          // handleStudentsChange(item)
                          // setCurrentToEdit({ ...currentToEdit, students: [... item._id] });
                        }}
                      />
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
                      console.log(val);
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
                          <p className={styles.address}>Country</p>
                        </div>
                        <InputSelectNew
                          labelClassname="text-[#26435F] text-lg !font-medium hidden"
                          label="Country"
                          placeholder="Select"
                          inputContainerClassName="text-base  bg-[#F6F6F6] border-0 !py-1 !px-3 !rounded-[5px] !w-full h-[54px]"
                          inputClassName="bg-transparent  "
                          parentClassName=""
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
                      </div>
                      <div className="col-span-6">
                        <div>
                          <p className={styles.address}>Street Address</p>
                        </div>
                        <InputField
                          labelClassname="hidden"
                          placeholder="Street Address"
                          inputContainerClassName="text-sm !py-[17px] px-5 bg-primary-50 "
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
                    </div>

                    <div className="grid grid-cols-12 gap-4 mt-5">
                      <div className="col-span-6">
                        <div>
                          <p className={styles.address}>State</p>
                        </div>
                        <InputSelectNew
                          labelClassname="text-[#26435F] text-lg !font-medium hidden"
                          label="State"
                          placeholder="Select"
                          inputContainerClassName="text-base  bg-[#F6F6F6] border-0 !py-1 !px-3 !rounded-[5px] !w-full h-[54px]"
                          inputClassName="bg-transparent  "
                          parentClassName=""
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
                      </div>
                      <div className="col-span-3">
                        <div>
                          <p className={styles.address}>City</p>
                        </div>
                        <InputSelectNew
                          labelClassname="text-[#26435F] text-lg !font-medium hidden"
                          label="State"
                          placeholder="Select"
                          inputContainerClassName="text-base  bg-[#F6F6F6] border-0 !py-1 !px-3 !rounded-[5px] !w-full h-[54px]"
                          inputClassName="bg-transparent  "
                          parentClassName=""
                          type="text"
                          optionData={[{name:"",value:""}]}
                          optionType={"object"}
                          onChange={(e) =>
                            setCurrentToEdit({
                              ...currentToEdit,
                              city: e.name,
                            })
                          }
                          value={currentToEdit.city}
                        />
                      
                      </div>
                      <div className="col-span-3">
                        <div>
                          <p className={styles.address}>Zip</p>
                        </div>
                        <InputField
                          labelClassname="hidden"
                          placeholder="zip"
                          inputContainerClassName="text-sm !py-[17px] px-5 bg-primary-50 border-"
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
                  <div className="">
                    <p className="text-base-15 text-[#667085]">
                      <span className="font-semibold ">
                        <div className="h-3 w-4 text-[10px] pb-1 mb-1 scale-90 translate-y-[-1px] inline-block">
                          ⚠️
                        </div>{" "}
                        Note:
                      </span>{" "}
                      The hourly rates you set for the tutor here will directly
                      affect automatic invoicing wherever applicable. Read
                      detailed documentation in Evallo’s{" "}
                      <span onClick={()=>navigate('/support')} className="text-[#24A3D9] cursor-pointer border-b-[0.6px] border-b-[#24A3D9] cursor-pointer">
                        {" "}
                        knowledge base.
                      </span>
                    </p>
                    <div className="flex gap-5 mt-3 font-semibold">
                      <h2 className="text-base-18 font-[500] text-[#26435F] min-w-[330px]">
                        Service{" "}
                        <span className="text-[#B3BDC7] font-medium text-base-15">
                          (pulled from settings)
                        </span>
                      </h2>
                      <h2 className="text-base-18 font-[500] text-[#26435F]">
                        Hourly Rate
                      </h2>
                    </div>
                    <div className="max-h-[30vh] overflow-y-auto">
                      {
                        // console.log({organization,currentField,currentToEdit}),
                        //handlePriceChange(e.target.value)

                        currentToEdit?.tutorServices?.map((it, id) => {
                          return (
                            <div className="flex justify-between font-semibold gap-3 items-center mb-4 p-[2px]">
                              <p className=" mr-4 min-w-[320px] font-[500] text-sm pt-3 pb-3 px-5 bg-primary-50 border-0 rounded-sm text-[#517CA8] text-base-18 shadow-[0px_0px_2.50039005279541px_0px_#00000040]">
                                {it?.service}
                              </p>

                              <InputField
                                labelClassname="hidden"
                                placeholder=""
                                inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-primary-50 border-0 shadow-[0px_0px_2.50039005279541px_0px_#00000040]"
                                inputLeftField={
                                  <div className="text-[#B3BDC7] font-[500] text-base-18 mr-3">
                                    $
                                  </div>
                                }
                                inputClassName="bg-transparent pl-1 rounded-[4px] font-[500] text-[#517CA8] text-base-20"
                                parentClassName="w-[180px] "
                                type="text"
                                value={it?.price ? it?.price : ""}
                                onChange={(e) => {
                                  let temp = currentToEdit.tutorServices;
                                  temp[id].price = e.target.value;
                                  setCurrentToEdit({
                                    ...currentToEdit,
                                    tutorServices: temp,
                                  });
                                }}
                              />
                            </div>
                          );
                        })
                      }
                    </div>
                    <div
                      onClick={() => navigate("/settings")}
                      className="text-[#24A3D9] cursor-pointer font-semibold text-base-17-5"
                    >
                      + Add New Service
                    </div>
                    {/* <div className="flex items-center mb-4">
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
                    </div> */}
                  </div>
                )}
                {currentField.name === "tutorReviews" && (
                  <div>
                    <div className="max-h-[40vh] overflow-y-auto custom-scroller">
                      {
                        // console.log({organization,currentField,currentToEdit}),
                        //handlePriceChange(e.target.value)

                        currentToEdit?.tutorReviews?.map((it, id) => {
                          return (
                            <div
                              key={id}
                              style={{ fontFamily: "Inter" }}
                              className="flex flex-col mb-4 bg-[#F6F6F6] p-3 rounded-md"
                            >
                              <div
                                style={{ fontFamily: "Inter" }}
                                className="flex gap-5 justify-between flex-1 items-end"
                              >
                                <InputSelect
                                  labelClassname="text-base-17-5 text-[#26435F] mb-1"
                                  label="Review Given By"
                                  placeholder="Select"
                                  inputContainerClassName="text-sm pt-[14px] pb-[14px] px-5 bg-white border-0 shadow-[0px_0px_2.50039005279541px_0px_#00000040]"
                                  inputLeftField={
                                    <div className="text-[#B3BDC7] font-semibold text-base-20 mr-3">
                                      $
                                    </div>
                                  }
                                  inputClassName="bg-transparent pl-4 rounded-[4px] font-semibold text-[#517CA8] text-base-20"
                                  parentClassName="w-[220px] "
                                  type="text"
                                  value={it?.userTag}
                                  optionData={["student", "parent"]}
                                  onChange={(e) => {
                                    let temp = currentToEdit.tutorReviews;
                                    console.log(temp);
                                    temp[id].userTag = e;
                                    setCurrentToEdit({
                                      ...currentToEdit,
                                      tutorReviews: [...temp],
                                    });
                                  }}
                                />
                                <InputSelect
                                  labelClassname="text-base-17-5 text-[#26435F] mb-1"
                                  label="For Service"
                                  placeholder="Select"
                                  inputContainerClassName="text-sm pt-[14px] pb-[14px] px-5 bg-white border-0 shadow-[0px_0px_2.50039005279541px_0px_#00000040]"
                                  inputLeftField={
                                    <div className="text-[#B3BDC7] font-semibold text-base-20 mr-3">
                                      $
                                    </div>
                                  }
                                  inputClassName="bg-transparent pl-4 rounded-[4px] font-semibold text-[#517CA8] text-base-20"
                                  parentClassName="w-[300px] "
                                  type="text"
                                  value={it?.service}
                                  optionData={organization?.settings?.servicesAndSpecialization?.map(
                                    (it) => {
                                      return it?.service;
                                    }
                                  )}
                                  onChange={(e) => {
                                    let temp = currentToEdit.tutorReviews;
                                    temp[id].service = e;
                                    setCurrentToEdit({
                                      ...currentToEdit,
                                      tutorReviews: temp,
                                    });
                                  }}
                                />
                                <InputField
                                  labelClassname="text-base-17-5 text-[#26435F] !font-medium mb-1"
                                  label="Review Date"
                                  placeholder="Review Date"
                                  inputContainerClassName="text-sm pt-[10px] pb-2 px-5 bg-white border-0 shadow-[0px_0px_2.50039005279541px_0px_#00000040]"
                                  inputClassName="bg-transparent pl-4 rounded-[4px] font-normal text-[#333] text-base-17-5 placeholder:text-[#667085]"
                                  parentClassName="w-[230px] -mt-1"
                                  type="date"
                                  value={it?.date}
                                  onChange={(e) => {
                                    let temp = currentToEdit?.tutorReviews;
                                    temp[id].date = e.target.value;
                                    setCurrentToEdit({
                                      ...currentToEdit,
                                      tutorReviews: temp,
                                    });
                                  }}
                                />
                              </div>

                              <div className=" my-5">
                                <h5
                                  style={{ fontFamily: "Inter" }}
                                  className="text-base-17-5 text-[#26435F] !font-medium mb-1"
                                >
                                  Review Content
                                </h5>
                                <textarea
                                  rows="3"
                                  maxLength={100}
                                  value={it?.content}
                                  placeholder="Add the review received by the tutor in this paragraph text space.
                        Suggested word limit: 100 words."
                                  onChange={(e) => {
                                    let temp = currentToEdit?.tutorReviews;
                                    temp[id].content = e.target.value;
                                    setCurrentToEdit({
                                      ...currentToEdit,
                                      tutorReviews: temp,
                                    });
                                  }}
                                  className="text-base-16 !shadow-[0px_0px_2.50039005279541px_0px_#00000040] rounded-md mt-1 block w-full h-[120px] flex-1 resize-none focus:!ring-blue-500 p-2 focus:!border-blue-500 placeholder-[#CBD6E2]   placeholder:text-base-16 pt-3.5 pb-3 px-5  bg-white border-0 text-[#667085]"
                                ></textarea>
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                    <div
                      onClick={() => {
                        let temp = currentToEdit.tutorReviews;
                        temp.push({
                          tutorId: "",
                          userTag: "", // "parent"
                          service: "",
                          date: "",
                          content: "",
                          orgId: "",
                        });
                        setCurrentToEdit({
                          ...currentToEdit,
                          tutorReviews: temp,
                        });
                      }}
                      className="text-[#24A3D9] cursor-pointer font-semibold text-base-17-5"
                    >
                      + Add New Review
                    </div>
                    {/* <div className="flex items-center mb-4">
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
                    </div> */}
                  </div>
                )}
                {currentField.name === "paymentInfo" && (
                  <div className="flex flex-1 w-full items-center justify-center">
                    <div className="flex-1 mb-5">
                      <textarea
                        rows="3"
                        value={currentToEdit.paymentInfo}
                        onChange={(e) =>
                          setCurrentToEdit({
                            ...currentToEdit,
                            paymentInfo: e.target.value,
                          })
                        }
                        placeholder="Use this space to add any payment info about the tutor, such as Account Number, Routing Number, Billing Address, Reimbursements, etc."
                        className="mt-1 rounded-md  block w-full h-[100px] flex-1 resize-none focus:!ring-blue-500 p-2 focus:!border-blue-500 placeholder-[#CBD6E2] text-sm   pt-3.5 pb-3 pt-7 px-3  bg-primary-50 border-0 text-[#667085] text-base-17-5"
                      ></textarea>
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
                  <div className="h-[60vh] overflow-y-auto px-5">
                    {/* <textarea
                                 placeholder=""
                                 value={currentToEdit.about}
                                 onChange={e =>
                                    setCurrentToEdit({ ...currentToEdit, about: e.target.value })
                                 }
                                 rows={5}
                                 className="bg-lightWhite w-full outline-0 px-5 py-4 rounded"
                              ></textarea> */}
                    <div className="px-1">
                      <div className="grid grid-cols-12 ">
                        <div className="col-span-2 flex items-center justify-start">
                          <ProfilePhoto
                            isTutor={true}
                            customWidth={true}
                            src={
                              currentToEdit?.photo
                                ? `${awsLink}${currentToEdit?.photo}`
                                : "/images/tutor.jpg"
                            }
                            handleChange={handleProfilePhotoChange}
                            editable={true}
                          />
                        </div>
                        <div className="ml-7 col-span-10 ">
                          <div className="grid grid-cols-13 gap-6">
                            <div className=" col-span-4">
                              <div>
                                <p className="text-[18.667px] text-[#26435F] font-medium cursor-default">
                                  First name
                                </p>
                              </div>
                              <InputField
                                labelClassname="hidden"
                                placeholder="{Tutor First Name}"
                                inputContainerClassName="text-sm pt-3 pb-3 !px-2 bg-primary-50 border-white !text-[18.667px]"
                                inputClassName="bg-transparent text-[#667085] text-400"
                                value={currentToEdit.firstName}
                                onChange={(e) =>{
                                  const regex = /^[a-zA-Z ]*$/;
                                  const isValid = regex.test(e.target.value);
                                  if(isValid)
                                  setCurrentToEdit({
                                    ...currentToEdit,
                                    firstName: e.target.value,
                                  })
                                }}
                              />
                            </div>
                            <div className=" col-span-4">
                              <div>
                                <p className="text-[18.667px] text-[#26435F] font-medium cursor-default">
                                  Last name
                                </p>
                              </div>

                              <InputField
                                labelClassname="hidden"
                                placeholder="{Tutor Last Name}"
                                inputContainerClassName="text-sm pt-3 pb-3 !px-2 bg-primary-50 border-white"
                                inputClassName="bg-transparent text-[#667085] text-400"
                                value={currentToEdit.lastName}
                                onChange={(e) =>{
                                  const regex = /^[a-zA-Z ]*$/;
                                  const isValid = regex.test(e.target.value);
                                  if(isValid)
                                  setCurrentToEdit({
                                    ...currentToEdit,
                                    lastName: e.target.value,
                                  })}
                                }
                              />
                            </div>

                            <div className=" col-span-5">
                              <div>
                                <p className="text-[18.667px] text-[#26435F] font-medium cursor-default">
                                  Email
                                </p>
                              </div>

                              <InputField
                                labelClassname="hidden"
                                placeholder="{Tutor Email}"
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
                                <p className="text-[18.667px] mb-[2px] text-[#26435F] font-medium cursor-default">
                                  Linkedin
                                </p>
                              </div>

                              <InputField
                                labelClassname="hidden mb-1"
                                placeholder="https://"
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
                            <div className="col-span-7 ">
                              <div>
                                <p className="text-[18.667px] text-[#26435F] font-medium cursor-default">
                                  Phone
                                </p>
                              </div>
                              <div className="grid grid-cols-12 gap-3">
                                {/* <div className="col-span-4">
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
                                </div> */}
                                <div className="col-span-12">
                                  <div>
                                    <p className={styles.address}> </p>
                                  </div>

                                  <InputFieldDropdown
                                    labelClassname="hidden"
                                    placeholder="Mobile"
                                    inputContainerClassName="flex gap-3 pt-0 pb-0 px-0 !py-0 !px-0  border-white"
                                    inputClassName=" text-[#667085] text-sm pt-3 pb-3 px-5 !py-[13px] bg-primary-50  text-400 rounded-[5px] "
                                    codeClassName="!px-2 w-[70px] !gap-4 text-[#667085] text-sm !py-[22.5px]  bg-primary-50  text-400 rounded-[5px] "
                                    value={currentToEdit.phone}
                                    codeValue={currentToEdit.phoneCode}
                                    handleCodeChange={(e) =>
                                      setCurrentToEdit({
                                        ...currentToEdit,
                                        phoneCode: e.target.value,
                                      })
                                    }
                                    onChange={(e) =>{
                                      const regex = /^[0-9 ]*$/;
                        const isValid = regex.test(e.target.value);
                        if(isValid  && e.target.value?.length<11)
                                      setCurrentToEdit({
                                        ...currentToEdit,
                                        phone: e.target.value,
                                      })}
                                    }
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
                        <p className="text-[18.667px] text-[#26435F] font-medium cursor-default">
                          Tagline
                        </p>
                      </div>
                      <div className="col-span-12 ">
                        <textarea
                          rows={2}
                          className="bg-[#F6F6F6] pt-6  w-full p-2 rounded text-md focus:border-[#D0D5DD] border border-[#D0D5DD] text-[#667085]"
                          value={currentToEdit.tagLine}
                          placeholder="Add single line text here to highlight your tutor."
                          onChange={(e) => {
                            setCurrentToEdit({
                              ...currentToEdit,
                              tagLine: e.target.value,
                            });
                          }}
                        ></textarea>
                      </div>
                    </div>

                    <div className="mt-8 grid grid-cols-12 ">
                      <div>
                        <p className="text-[18.667px] font-medium text-[#26435F] cursor-default">
                          About
                        </p>
                      </div>
                      <div className="col-span-12 ">
                        <textarea
                          rows={4}
                          className="bg-[#F6F6F6] w-full p-2 rounded focus:border-[#D0D5DD] border border-[#D0D5DD] text-[#667085] text-md"
                          value={currentToEdit.about}
                          placeholder="Use this space to write a short bio about the tutor.
                          Suggested word limit: 150 words."
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
                      <div className="grid grid-cols-12 gap-10">
                        <div className="col-span-6">
                          <div>
                            <p className="text-[18.667px] text-[#26435F] font-medium cursor-default">
                              Education
                            </p>
                          </div>
                          <textarea
                            rows={3}
                            className="bg-[#F6F6F6] w-full p-2 text-md rounded focus:border-[#D0D5DD] border border-[#D0D5DD] text-[#667085]"
                            value={currentToEdit.education}
                            placeholder="Add the tutor’s educational background in this single-line text space."
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
                            <p
                              className="text-[18.667px] cursor-default"
                              style={{ color: "#26435F", fontWeight: "500" }}
                            >
                              Experience
                            </p>
                          </div>
                          <textarea
                            rows={3}
                            className="w-full rounded focus:border-[#D0D5DD] text-md border border-[#D0D5DD] text-[#667085] bg-[#F6F6F6] p-2 "
                            value={currentToEdit.experience}
                            placeholder="Add a one-liner describing the tutor’s experience and/or any achievements."
                            onChange={(e) => {
                              setCurrentToEdit({
                                ...currentToEdit,
                                experience: e.target.value,
                              });
                            }}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {currentField.name === "personality" && (
                  <div className="flex flex-wrap">
                    {settings.personality.map((item) => {
                      return !currentToEdit.personality.includes(item._id) ? (
                        <div
                          className={`px-3 mr-2 rounded rounded-md py-1.5 border border-primary text-primary cursor-pointer`}
                          onClick={() =>
                            setCurrentToEdit({
                              ...currentToEdit,
                              personality: [
                                ...currentToEdit.personality,
                                item._id,
                              ],
                            })
                          }
                        >
                          <p className="font-medium">{item.text}</p>
                        </div>
                      ) : (
                        <div
                          className={`px-3 mr-2 rounded rounded-md text-white py-1.5 border border-primary bg-primary text-primary cursor-pointer`}
                          onClick={() =>
                            setCurrentToEdit({
                              ...currentToEdit,
                              personality: currentToEdit.personality.filter(
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
                {/* {currentField.name === "interest" && (
                  <div className="flex flex-wrap">
                    {settings.interest.map((item) => {
                      return !currentToEdit?.interest?.includes(item._id) ? (
                        <div
                          id="selected"
                          className={`px-3 mr-2  rounded-md py-1.5 border-[1.33px] border-[#26435F80] text-[#26435F80]  cursor-pointer`}
                          onClick={() => {
                            let intersetArray = [];

                            if (currentToEdit.interest) {
                              intersetArray = currentToEdit.interest;
                            }
                            console.log(intersetArray);
                            setCurrentToEdit({
                              ...currentToEdit,
                              interest: [...intersetArray, item._id],
                            });
                          }}
                        >
                          <p className="">{item.text}</p>
                        </div>
                      ) : (
                        <div
                          className={`px-3 mr-2  rounded-md text-white py-1.5 border border-primary bg-primary  cursor-pointer`}
                          onClick={() =>
                            setCurrentToEdit({
                              ...currentToEdit,
                              interest: currentToEdit.interest.filter(
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
                )} */}
                {currentField.name === "serviceSpecializations" && (
                  <div className="flex flex-wrap">
                    {Expertise?.map((item) => {
                      return !currentToEdit?.serviceSpecializations?.includes(
                        item?.text
                      ) ? (
                        <div
                          className={`px-3 mr-2  !rounded-lg m-1   py-1.5 border-[1.33px] border-[#26435F80] text-[#26435F80]  cursor-pointer`}
                          onClick={() => {
                            let servicesArray = [];
                            if (currentToEdit.serviceSpecializations) {
                              servicesArray =
                                currentToEdit.serviceSpecializations;
                            }
                            console.log(servicesArray);
                            setCurrentToEdit({
                              ...currentToEdit,
                              serviceSpecializations: [
                                ...servicesArray,
                                item?.text,
                              ],
                            });
                          }}
                        >
                          <p className="font-medium">{item.text}</p>
                        </div>
                      ) : (
                        <div
                          className={`px-3 mr-2 rounded-lg text-white py-1.5 border border-primary bg-primary m-1  font-semibold cursor-pointer`}
                          onClick={() =>
                            setCurrentToEdit({
                              ...currentToEdit,
                              serviceSpecializations:
                                currentToEdit.serviceSpecializations?.filter(
                                  (id) => id !== item?.text
                                ),
                            })
                          }
                        >
                          <p className="font-medium">{item?.text}</p>
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
                  <div className="grid grid-cols-2">
                    <div className="flex flex-col items-center mb-4">
                      <p className="font-medium mb-2">Verbal Score</p>
                      <InputField
                        labelClassname="hidden"
                        placeholder=""
                        inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-primary-50 border-0"
                        inputClassName="bg-transparent pl-4 rounded-[4px]"
                        parentClassName="flex-1 max-w-[140px]"
                        type="number"
                        value={
                          currentToEdit.satScores[selectedScoreIndex]?.verbal
                        }
                        onChange={(e) => {
                          let tempScores = [...currentToEdit.satScores];
                          if (tempScores.length <= selectedScoreIndex) {
                            tempScores.push({
                              maths: 0,
                              verbal: 0,
                            });
                          }
                          tempScores = tempScores.map((item, idx) => {
                            if (selectedScoreIndex === idx) {
                              let num = checkNumber(
                                currentToEdit.satScores[selectedScoreIndex]
                                  ?.verbal,
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
                    </div>
                    <div className="flex  flex-col  items-center mb-4">
                      <p className="font-medium mb-2 ">Maths Score</p>
                      <InputField
                        labelClassname="hidden"
                        placeholder=""
                        inputContainerClassName="text-sm pt-3 pb-3 px-5 bg-primary-50 border-0"
                        inputClassName="bg-transparent pl-4 rounded-[4px]"
                        parentClassName="flex-1 max-w-[140px]"
                        type="number"
                        value={
                          currentToEdit.satScores[selectedScoreIndex]?.maths
                        }
                        onChange={(e) => {
                          let tempScores = [...currentToEdit.satScores];
                          if (tempScores.length <= selectedScoreIndex) {
                            tempScores.push({
                              maths: 0,
                              verbal: 0,
                            });
                          }
                          tempScores = tempScores.map((item, idx) => {
                            if (selectedScoreIndex === idx) {
                              return {
                                ...item,
                                maths: checkNumber(
                                  currentToEdit.satScores[selectedScoreIndex]
                                    ?.maths,
                                  parseInt(e.target.value),
                                  800
                                ),
                              };
                            } else {
                              return { ...item };
                            }
                          });
                          // tempScores[selectedScoreIndex].maths = checkNumber(currentToEdit.satScores.maths, parseInt(e.target.value), 800)
                          // console.log('tempScores', tempScores);
                          setCurrentToEdit({
                            ...currentToEdit,
                            satScores: tempScores,
                          });
                        }}
                      />
                    </div>
                  </div>
                )}
                {currentField.name === "actScores" && (
                  <div className="grid grid-cols-2">
                    <div className="flex flex-col items-center mb-4">
                      <p className="font-medium mb-2">Maths Score</p>
                      <InputField
                        labelClassname="hidden"
                        placeholder=""
                        inputContainerClassName="text-sm pt-3.5 pb-3.5 px-5 bg-primary-50 border-0"
                        inputClassName="bg-transparent pl-4 rounded-[4px]"
                        parentClassName="flex-1 max-w-[140px]"
                        type="number"
                        value={
                          currentToEdit.actScores[selectedScoreIndex]?.maths
                        }
                        onChange={(e) => {
                          let tempScores = [...currentToEdit.actScores];
                          if (tempScores.length <= selectedScoreIndex) {
                            tempScores.push({
                              maths: 0,
                              english: 0,
                              reading: 0,
                              science: 0,
                            });
                          }
                          tempScores = tempScores.map((item, idx) => {
                            if (selectedScoreIndex === idx) {
                              return {
                                ...item,
                                maths: checkNumber(
                                  currentToEdit.actScores[selectedScoreIndex]
                                    ?.maths,
                                  parseInt(e.target.value),
                                  36
                                ),
                              };
                            } else {
                              return { ...item };
                            }
                          });
                          setCurrentToEdit({
                            ...currentToEdit,
                            actScores: tempScores,
                          });
                        }}
                      />
                    </div>
                    <div className="flex  flex-col  items-center mb-4">
                      <p className="font-medium mb-2 ">English Score</p>
                      <InputField
                        labelClassname="hidden"
                        placeholder=""
                        inputContainerClassName="text-sm pt-3.5 pb-3.5 px-5 bg-primary-50 border-0"
                        inputClassName="bg-transparent pl-4 rounded-[4px]"
                        parentClassName="flex-1 max-w-[140px]"
                        type="number"
                        value={
                          currentToEdit.actScores[selectedScoreIndex]?.english
                        }
                        onChange={(e) => {
                          let tempScores = [...currentToEdit.actScores];
                          if (tempScores.length <= selectedScoreIndex) {
                            tempScores.push({
                              maths: 0,
                              english: 0,
                              reading: 0,
                              science: 0,
                            });
                          }
                          tempScores = tempScores.map((item, idx) => {
                            if (selectedScoreIndex === idx) {
                              return {
                                ...item,
                                english: checkNumber(
                                  currentToEdit.actScores[selectedScoreIndex]
                                    ?.english,
                                  parseInt(e.target.value),
                                  36
                                ),
                              };
                            } else {
                              return { ...item };
                            }
                          });
                          setCurrentToEdit({
                            ...currentToEdit,
                            actScores: tempScores,
                          });
                        }}
                      />
                    </div>
                    <div className="flex  flex-col  items-center mb-4">
                      <p className="font-medium mb-2 ">Reading Score</p>
                      <InputField
                        labelClassname="hidden"
                        placeholder=""
                        inputContainerClassName="text-sm pt-3.5 pb-3.5 px-5 bg-primary-50 border-0"
                        inputClassName="bg-transparent pl-4 rounded-[4px]"
                        parentClassName="flex-1 max-w-[140px]"
                        type="number"
                        value={
                          currentToEdit.actScores[selectedScoreIndex]?.reading
                        }
                        onChange={(e) => {
                          let tempScores = [...currentToEdit.actScores];
                          if (tempScores.length <= selectedScoreIndex) {
                            tempScores.push({
                              maths: 0,
                              english: 0,
                              reading: 0,
                              science: 0,
                            });
                          }
                          tempScores = tempScores.map((item, idx) => {
                            if (selectedScoreIndex === idx) {
                              return {
                                ...item,
                                reading: checkNumber(
                                  currentToEdit.actScores[selectedScoreIndex]
                                    ?.reading,
                                  parseInt(e.target.value),
                                  36
                                ),
                              };
                            } else {
                              return { ...item };
                            }
                          });
                          setCurrentToEdit({
                            ...currentToEdit,
                            actScores: tempScores,
                          });
                        }}
                      />
                    </div>
                    <div className="flex  flex-col  items-center mb-4">
                      <p className="font-medium mb-2 ">Science Score</p>
                      <InputField
                        labelClassname="hidden"
                        placeholder=""
                        inputContainerClassName="text-sm pt-3.5 pb-3.5 px-5 bg-primary-50 border-0"
                        inputClassName="bg-transparent pl-4 rounded-[4px]"
                        parentClassName="flex-1 max-w-[140px]"
                        type="number"
                        value={
                          currentToEdit.actScores[selectedScoreIndex]?.science
                        }
                        onChange={(e) => {
                          let tempScores = [...currentToEdit.actScores];
                          if (tempScores.length <= selectedScoreIndex) {
                            tempScores.push({
                              maths: 0,
                              english: 0,
                              reading: 0,
                              science: 0,
                            });
                          }
                          tempScores = tempScores.map((item, idx) => {
                            if (selectedScoreIndex === idx) {
                              return {
                                ...item,
                                science: checkNumber(
                                  currentToEdit.actScores[selectedScoreIndex]
                                    ?.science,
                                  parseInt(e.target.value),
                                  36
                                ),
                              };
                            } else {
                              return { ...item };
                            }
                          });
                          setCurrentToEdit({
                            ...currentToEdit,
                            actScores: tempScores,
                          });
                        }}
                      />
                    </div>
                  </div>
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
                    <p className="text-[#26435F] font-semibold text-base-18">
                      Youtube Link
                    </p>
                    <input
                      placeholder="Paste the YouTube link of a video highlighting your tutor or your tutoring company."
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
