import React, { useEffect, useState } from "react";
import { CSVLink, CSVDownload } from "react-csv";
import Table from "../../components/Table/Table";
import FilterItems from "../../components/FilterItemsNew/filterItems";
import Modal from "../../components/Modal/Modal";
import InputField from "../../components/InputField/inputField";
import InputSelect from "../../components/InputSelect/InputSelect";
import styles from "./styles.module.css";
import AddIcon from "../../assets/icons/add.svg";
import Dropdown from "../../assets/icons/Polygon 2.png";
import PlusIcon from "../../assets/icons/plus.svg";
import ExportIcon from "../../assets/icons/export.svg";
import UploadIcon from "../../assets/icons/upload.svg";
import XIcon from "../../assets/icons/x.png";
import SearchIcon from "../../assets/icons/search.svg";
import fileupload from "../../assets/icons/fileupload.png";
import { tableData, userTypesList } from "./tempData";
import { BASE_URL, getAuthHeader } from "../../app/constants/constants";
import { csvHeaders } from "./csvUtlis";
import {
  useAddUserMutation,
  useGetAllOrgUsersQuery,
  useLazyGetAllOrgUsersQuery,
  useLazyGetAllUsersQuery,
  useLazyGetTutorDetailsQuery,
  useLazyGetUserDetailQuery,
} from "../../app/services/users";
import { useSignupUserMutation } from "../../app/services/auth";
import { useNavigate } from "react-router-dom";
import { roles } from "../../constants/constants";
import {
  useBlockUserMutation,
  useDeleteUserMutation,
  useUnblockUserMutation,
} from "../../app/services/admin";
import { useLazyGetSettingsQuery } from "../../app/services/session";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import CountryCode from "../../components/CountryCode/CountryCode";
import { isPhoneNumber } from "../Signup/utils/util";
import { checkIfExistInNestedArray } from "../../utils/utils";
import InputSelectNew from "../../components/InputSelectNew/InputSelectNew";
import InputSearch from "../../components/InputSearch/InputSearch";
import { useSelector } from "react-redux";
import axios from "axios";
import Loader from "../../components/Loader";
import LoaderNew from "../../components/Loader/LoaderNew";

const optionData = ["option 1", "option 2", "option 3", "option 4", "option 5"];

const userTypeOptions = ["Tutor", "Parent", "Student"];

const initialState = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  userType: "",
};

export default function Users() {
  const [modalActive, setModalActive] = useState(false);
  const navigate = useNavigate();
  const { organization } = useSelector((state) => state.organization);
  const { firstName, lastName } = useSelector((state) => state.user);
  const [modalData, setModalData] = useState(initialState);
  const [validData, setValidData] = useState(true);
  const [deleteModalActive, setDeleteModalActive] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [specializations, setSpecializations] = useState([]);
  const [numberPrefix, setNumberPrefix] = useState("+1");
  const [usersData, setUsersData] = useState([]);
  const [filteredUsersData, setFilteredUsersData] = useState([]);
  const [bulkUpload, setBulkUpload] = useState(false);
  const [xlsFile, setXlsFile] = useState();
  const [inviteUsers, setInviteUsers] = useState(false);

  useEffect(() => {
    setValidData(
      isEmail(modalData.email) &&
      modalData.firstName &&
      modalData.lastName &&
      modalData.userType &&
      modalData.phone
    );
  }, [
    modalData,
    modalData.email.length,
    modalData.firstName.length,
    modalData.lastName.length,
    modalData.phone.length,
    modalData.userType.length,
  ]);

  const [settings, setSettings] = useState({
    leadStatus: [],
  });
  const sortByName = () => {
    setUsersData((prev) => {
      let arr = [...prev];
      arr = arr.sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      return arr;
    });

    setFilteredUsersData((prev) => {
      let arr = [...prev];
      console.log("arr", arr);
      arr = arr.sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      return arr;
    });
  };
  const tableHeaders = [
    {
      id: 1,
      text: "Full Name",
      className: "text-left pl-6",
      onCick: sortByName,
    },
    {
      id: 2,
      text: "User Type",
    },
    {
      id: 3,
      text: "Email",
    },
    {
      id: 4,
      text: "Phone",
    },
    {
      id: 5,
      text: "Assigned Tutor",
    },
    {
      id: 1,
      text: "Lead Status",
    },
    {
      id: 6,
      text: "Tutor Status",
    },
    {
      id: 7,
      text: "Service(s)",
    },
    {
      id: 8,
      text: "Join Date",
    },
    {
      id: 9,
      text: "",
    },
  ];

  const [assignStudentModalActive, setAssignStudentModalActive] =
    useState(false);
  const handleClose2 = () => setAssignStudentModalActive(false);
  const [getUserDetail, getUserDetailResp] = useLazyGetUserDetailQuery();
  const [getTutorDetail, userDetailResp] = useLazyGetTutorDetailsQuery();
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false);
  const [filterItems, setFilterItems] = useState([]);
  const [addUserBtnDisabled, setAddUserBtnDisabled] = useState(false);

  const [blockUser, blockUserResp] = useBlockUserMutation();
  const [unblockUser, unblockUserResp] = useUnblockUserMutation();
  const [fetchSettings, settingsResp] = useLazyGetSettingsQuery();
  const [userToDelete, setUserToDelete] = useState({});

  const [fetchUsers, fetchUsersResp] = useLazyGetAllUsersQuery();
  const [getAllUsers, setAllUsers] = useLazyGetAllOrgUsersQuery();
  const [addUser, addUserResp] = useAddUserMutation();
  const [signupUser, signupUserResp] = useSignupUserMutation();
  const [deleteUser, deleteUserResp] = useDeleteUserMutation();

  const [maxPageSize, setMaxPageSize] = useState(15);
  const [loading, setLoading] = useState(false);

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [allTutors, setAllTutors] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [numberChecked, setnumberChecked] = useState(0);
  const [filterData, setFilterData] = useState({
    typeName: "",
    userType: [],
    status: [],
    specialization: [],
    userStatus: [],
    tutor: [],
  });

  useEffect(() => {
    setSettings(organization.settings);
  }, [organization]);

  // console.log(settings)

  const fetch = () => {
    setUsersData([]);
    setFilteredUsersData([]);
    // console.log('shi',filteredUsersData)
    let urlParams = `?limit=${maxPageSize}&page=${currentPage}`;
    if (filterData.userType.length > 0) {
      filterData.userType.forEach((item) => {
        urlParams = urlParams + `&role=${item}`;
      });
    }
    if (filterData.userStatus.length > 0) {
      filterData.userStatus.forEach((item) => {
        urlParams = urlParams + `&userStatus=${item}`;
      });
    }
    if (filterData.specialization.length > 0) {
      let specArr = [];
      specArr = `&specialization=${filterData.specialization.join(",")}`;
      urlParams = urlParams + specArr;
    }
    if (filterData.status.length > 0) {
      filterData.status.forEach((item) => {
        urlParams = urlParams + `&leadstatus=${item}`;
      });
    }
    if (filterData.tutor.length > 0) {
      let ids = [];
      filterData.tutor.forEach((selectedTutorName) => {
        let tutor = allTutors.find((item) => item.value === selectedTutorName);
        if (tutor === undefined) return;
        ids.push(tutor._id);
      });
      ids.map((tutorId) => {
        urlParams = urlParams + `&assiginedTutors=${tutorId}`;
      });
    }
    if (filterData.typeName.length > 0) {
      urlParams = urlParams + `&search=${filterData.typeName}`;
    }

    console.log("urlParams", urlParams);
    fetchUsers(urlParams).then((res) => {
      // console.log("all-users", res.data.data.user);
      // if(res.data.data.no_of_users < maxPageSize){
      //    setTotalPages(15)
      // }else{
      if (res?.data?.data) setTotalPages(res?.data?.data?.total_users);
      // }
      // console.log('total users', res.data.data.total_users);

      const fetchDetails = async () => {
        let tempData = [];
        await res?.data?.data?.user?.map(async (user) => {
          let obj = {
            _id: user._id,
            block: user.block,
            userStatus: user.userStatus,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email ? user.email : "-",
            userType: user.role ? user.role : "-",
            phone: user.phone ? user.phone : "-",
            createdAt: user.createdAt,
            assignedTutor: user.assiginedTutors ? user.assiginedTutors : "",
            leadStatus: "-",
            tutorStatus: "-",
            specialization: user.specialization ? user.specialization : [],
          };
          tempData.push(obj);
          // if (user.role === 'tutor') {
          //    // console.log('tutor', user._id);
          //    await getTutorDetail({ id: user._id })
          //       .then(resp => {
          //          // console.log('TUTOR RESp', resp);

          //          setFilterItems(prev => [...prev])
          //          // console.log('tutor-details', resp.data.data);
          //          let status = '-'
          //          if (resp.data.data.details) {
          //             status = resp.data.data.details.leadStatus
          //             obj.leadStatus = status ? status : '-'
          //          }
          //          setUsersData(prev => [...prev, obj])
          //          setFilteredUsersData(prev => [...prev, obj])
          //       })
          // } else {
          //    await getUserDetail({ id: user._id })
          //       .then(resp => {
          //          setFilterItems(prev => [...prev])
          //          // console.log('user-details', resp.data.data);
          //          let status = '-'
          //          if (resp.data.data.userdetails) {
          //             status = resp.data.data.userdetails.leadStatus
          //             obj.leadStatus = status ? status : '-'
          //          }
          //          setUsersData(prev => [...prev, obj])
          //          setFilteredUsersData(prev => [...prev, obj])
          //       })
          // }
        });
        setUsersData(tempData);

        setFilteredUsersData(tempData);
      };

      fetchDetails();

      // setUsersData(data)
      // setFilteredUsersData(data)
    });
  };
  console.log("shivam", filteredUsersData);
  const fetchTutors = () => {
    let urlParams = `?role=tutor`;

    fetchUsers(urlParams).then((res) => {
      // console.log('tutors', res.data.data);
      if (!res?.data?.data?.user) return;
      let data = res.data.data.user.map((item) => {
        const { firstName, lastName } = item;
        return {
          _id: item._id,
          value: `${firstName} ${lastName}`,
        };
      });
      setAllTutors(data);
    });
  };

  useEffect(() => {
    fetchTutors();
  }, []);
  const changeUserField = (field, id) => {
    let temp = filteredUsersData.map((item) => {
      // console.log(item[Object.keys(field)[0]]);
      if (item._id === id) {
        return { ...item, ...field };
      } else {
        return { ...item };
      }
    });
    let tempAllusers = usersData.map((item) => {
      if (item._id === id) {
        return { ...item, ...field };
      } else {
        return { ...item };
      }
    });
    // console.log('shivam',temp);
    setFilteredUsersData(temp);
    setUsersData(tempAllusers);
  };

  useEffect(() => {
    fetch();
    //console.log('shivam yadav 1',filteredUsersData)
  }, [maxPageSize, currentPage]);
  // console.log('currentPage', currentPage);

  useEffect(() => {
    let tempdata = [...usersData];
    // console.log('all users data', usersData)
    // console.log('filterData.specialization', filterData.specialization)
    fetch();

    setCurrentPage(1);
    return;
    // setTotalPages(0)
    //USER TYPE FILTER
    if (filterData.userType.length > 0) {
      tempdata = tempdata.filter((user) =>
        filterData.userType.includes(user.userType)
      );
    } else {
      tempdata = tempdata.filter((user) => user.userType !== "");
    }

    //LEAD STATUS FILTER
    if (filterData.status.length > 0) {
      tempdata = tempdata.filter((user) =>
        filterData.status.includes(user.leadStatus)
      );
    } else {
      tempdata = tempdata.filter((user) => user.leadStatus !== "");
    }

    if (filterData.specialization.length > 0) {
      tempdata = tempdata.filter((user) =>
        checkIfExistInNestedArray(
          user.specialization,
          filterData.specialization
        )
      );
    } else {
      tempdata = tempdata.filter((user) => user.specialization !== "");
    }
    if (filterData.userStatus.length > 0) {
      tempdata = tempdata.filter((user) =>
        filterData.userStatus.includes(user.userStatus)
      );
    } else {
      tempdata = tempdata.filter((user) => user.userStatus !== "");
    }

    //NAME FILTER
    if (filterData.typeName !== "") {
      const regex2 = new RegExp(`${filterData.typeName.toLowerCase()}`, "i");
      tempdata = tempdata.filter((user) => user.name.match(regex2));
    } else {
      tempdata = tempdata.filter((user) => user.name !== "");
    }
    // setFilteredUsersData(tempdata)
  }, [filterData]);

  const removeFilter = (key, text, isArray) => {
    if (isArray) {
      let tempFilterData = { ...filterData };
      tempFilterData[key] = tempFilterData[key].filter((item) => item !== text);
      // tempFilterData[key] = [ tempFilterData[key].filter(text => text !==)]
      setFilterData(tempFilterData);
    } else {
      let tempFilterData = { ...filterData };
      tempFilterData[key] = "";
      console.log("tempFilterData", tempFilterData);
      setFilterData(tempFilterData);
    }
  };

  useEffect(() => {
    let arr = Object.keys(filterData)
      .map((key) => {
        if (filterData[key] !== "") {
          return {
            text: filterData[key],
            type: key,
            removeFilter: (key, text, isArray) =>
              removeFilter(key, text, isArray),
          };
        }
      })
      .filter((item) => item !== undefined);
    setFilterItems(arr);
  }, [filterData]);

  const onRemoveFilter = (item, text, isArray) => {
    // console.log(item, text, isArray);
    item.removeFilter(item.type, text, isArray);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalData.userType === "") return alert("Fill all the fields");
    let body = {
      firstName: modalData.firstName,
      lastName: modalData.lastName,
      email: modalData.email,
      phone: `${numberPrefix}${modalData.phone}`,
    };
    setLoading(true);
    if (modalData.userType === "tutor") {
      console.log(body);
      body.role = modalData.userType;
      addUser(body).then((res) => {
        console.log(res);
        setLoading(false);
        if (res.error) {
          alert(res.error.data.message);
          return;
        }
        fetch();
        alert("Invitation sent!");
        setModalData(initialState);
        handleClose();
      });
      return;
    } else {
      body.role = modalData.userType;
      console.log(body);
      addUser(body).then((res) => {
        setLoading(false);
        console.log(res);
        if (res.error) {
          alert(res.error.data.message);
          return;
        }
        fetch();
        alert("Invitation sent!");
        setModalData(initialState);
        handleClose();
      });
    }
  };
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const handleClose = () => setModalActive(false);

  const redirect = (item) => {
    // console.log(item)
    if (roles.includes(item.userType) && item.userType !== "admin") {
      navigate(`/profile/${item.userType}/${item._id}`);
    }
  };

  const handleTutorStatus = (item) => {
    console.log(item);
    if (item.block === false) {
      blockUser({ id: item._id }).then((res) => {
        if (res.data.status === "success") {
          let temp = usersData.map((user) => {
            if (user._id === item._id) {
              return { ...user, block: true };
            } else {
              return { ...user };
            }
          });
          setUsersData(temp);
          setFilterData({ ...filterData });
        }
      });
    } else if (item.block === true) {
      unblockUser({ id: item._id }).then((res) => {
        let temp = usersData.map((user) => {
          if (user._id === item._id) {
            return { ...user, block: false };
          } else {
            return { ...user };
          }
        });
        setUsersData(temp);
        setFilterData({ ...filterData });
      });
    }
  };

  const handleDelete = (item) => {
    setUserToDelete(item);
    setDeleteModalActive(true);
  };

  const onDelete = () => {
    setDeleteLoading(true);
    deleteUser(userToDelete._id).then((res) => {
      setDeleteLoading(false);
      setDeleteModalActive(false);
      if (res.error) {
        return console.log(res.error);
      }
      console.log(res.data);
      fetch();
    });
  };

  function isEmail(val) {
    let regEmail =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regEmail.test(val)) {
      return false;
    } else {
      return true;
    }
  }

  useEffect(() => {
    if (
      modalData.email.trim() === "" ||
      modalData.firstName.trim() === "" ||
      modalData.lastName.trim() === "" ||
      // modalData.phone.trim() === "" ||
      modalData.userType.trim() === ""
    ) {
      setAddUserBtnDisabled(true);
    } else {
      if (
        // modalData.phone.length < 10 ||
        !isEmail(modalData.email)
        // !isPhoneNumber(modalData.phone)
      ) {
        setAddUserBtnDisabled(true);
      } else {
        setAddUserBtnDisabled(false);
      }
    }
  }, [
    modalData.email,
    modalData.firstName,
    modalData.lastName,
    modalData.phone,
    modalData.userType,
  ]);

  useEffect(() => {
    if (!settings.servicesAndSpecialization) return;
    let specs = [];
    settings.servicesAndSpecialization.map((service) => {
      specs.push(...service.specialization);
    });
    setSpecializations(specs);
    console.log("specs", specs);
  }, [settings]);

  const handleTutorChange = (item) => {
    console.log("item", item);
    console.log("filterData tutor", filterData.tutor);
    if (filterData.tutor.includes(item.value)) {
      let updated = filterData.tutor.filter((tutor) => tutor !== item.value);
      setFilterData({
        ...filterData,
        tutor: updated,
      });
    } else {
      setFilterData({
        ...filterData,
        tutor: [...filterData.tutor, item.value],
      });
      // setUpdatedSubscriptionData(prev => ({
      //    ...prev,
      //    tests: [...updatedSubscriptionData.tests, item._id]
      // }))
    }
  };

  //console.log("shivam", { csvData }, { filteredUsersData });
  const [csvLoad, setCsvLoad] = useState(false);
  const [successFetched, setsuccessFetched] = useState(false);
  const handleBulkExport = async () => {
    setCsvLoad(true);
    getAllUsers()
      .then((res) => {
        let result = res?.data?.data?.user;

        if (result) {
          let arr = [];
          result?.forEach((it) => {
            let obj = {};
            obj.name = it.firstName + " " + it.lastName;
            obj._id = it._id;
            obj.userType = it.role;
            obj.block = it.block;
            obj.createdAt = it.createdAt;
            obj.specialization = it.specialization;
            obj.tutorStatus = it.userStatus;
            obj.leadStatus = "";
            obj.assignedTutor = it.assiginedTutors;
            obj.phone = it.phone;
            obj.email = it.email;
            arr.push(obj);
          });
          setCsvData(arr);
        }
        setsuccessFetched(true);
        setCsvLoad(false);
      })
      .catch((err) => {
        setCsvLoad(false);
      });
  };

  const [students, setStudents] = useState([]);
  const upload = () => {
    setBulkUpload(true);
  };
  const saveData = async () => {
    if (xlsFile !== undefined) {
      const formdata = new FormData();
      formdata.append("file", xlsFile);
      await axios
        .post(`${BASE_URL}api/user/bulkUploadUsers`, formdata, {
          headers: getAuthHeader(),
        })
        .then((res) => {
          alert("File Uploaded");

        })
        .catch((err) => {
          console.log(err);
          alert('Error Occured')
          setXlsFile(undefined);
        });
    }
  };
  const bulkInvite = async () => {
    if (xlsFile !== undefined) {
      const formdata = new FormData();
      formdata.append("file", xlsFile);
      await axios
        .post(`${BASE_URL}api/user/bulkInviteUsers`, formdata, {
          headers: getAuthHeader(),
        })
        .then((res) => {
          alert("File Uploaded");
          setXlsFile(undefined);
        })
        .catch((err) => {
          console.log("error in bulk upload and invite");
          alert('Error Occured')
          setXlsFile(undefined);
        });
    }
  };
  return (
    <div className="w-[83.6989583333vw] mx-auto bg-lightWhite min-h-screen">
      <div className="pb-10 px-5 mt-[50px]">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[#24A3D9] mb-6 text-xl">
            {organization?.company +
              "  >  " +
              firstName +
              "  " +
              lastName +
              "  >  "}
            <span className="font-semibold">CRM</span>
          </p>
          <button
            className="bg-[#24A3D9] w-[188px] text-[15px] justify-center flex py-2 px-5 items-center text-white font-semibold rounded-lg"
            onClick={() => navigate("/assigned-tutors")}
          >
            Tutor Mapping
            <img src={PlusIcon} className="ml-3" alt="PlusIcon" />
          </button>
        </div>
        <div>
          <div className="flex mb-[46px]">
            <button className="bg-[#517CA8] w-[158px] text-[15px] justify-center flex  items-center text-white  rounded-lg mr-[25px]">
              {csvLoad ? <LoaderNew /> : ""}
              {!csvLoad && !successFetched ? (
                <p onClick={handleBulkExport}>Export Data</p>
              ) : (
                ""
              )}

              {csvData.length > 0 && successFetched && (
                <CSVLink
                  filename={"Evallo_CRM_Data.csv"}
                  data={csvData}
                  headers={csvHeaders}
                  onClick={(event, done) => {
                    setCsvData([]);
                    setsuccessFetched(false);
                  }}
                >
                  {" "}
                  Download File{" "}
                </CSVLink>
              )}

              {!csvLoad && (
                <img src={ExportIcon} className="ml-3" alt="ExportIcon" />
              )}
            </button>
            <button
              onClick={upload}
              className="bg-[#517CA8] w-[158px] text-[15px] justify-center flex  items-center text-white  rounded-lg mr-[25px]"
            >
              Bulk Upload{" "}
              <img src={UploadIcon} className="ml-3" alt="UploadIcon" />
            </button>

            <PrimaryButton
              type="submit"
              children={
                <>
                  Add New User
                  <img src={PlusIcon} className="ml-3" alt="add-icon" />
                </>
              }
              onClick={() => setModalActive(true)}
              className=" flex items-center text-[15px]  py-3 px-3"
            />

            {bulkUpload && (
              <Modal
                title="Bulk Upload"
                classname={"max-w-[760px] mx-auto"}
                cancelBtnClassName="max-w-140"
                titleClassName="flex  items-start ml-5"
                handleClose={() => setBulkUpload(false)}
                //  primaryBtn={{
                //    text: "Assign",
                //    className: "max-w-140 pl-8 pr-8",
                //    onClick: (e) => handleSubmit(e),
                //    disabled: submitBtnDisabled,
                //    loading: loading,
                //  }}

                //  handleClose={}

                body={
                  <>
                    <div className="">
                      <div className="flex justify-center">
                        <div
                          className="max h-[200px] max w-[300px] mb-10 "
                          style={{
                            border: "2.5px dashed #CBD6E2",
                            borderRadius: "10px",
                          }}
                        >
                          <div className="mt-12 flex justify-center">
                            {/* This thing is for displaying xls logo if file is selected */}
                            {/* {xlsFile==undefined ? (<img src={fileupload}></img>):(<img src={}></img>)} */}
                            <img src={fileupload}></img>
                          </div>

                          <div className="flex justify-center">
                            {xlsFile == undefined ? (
                              <label
                                htmlFor="file"
                                className="block text-white bg-[#517CA8] hover:bg-[#517CA8] items-center justify-center font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#517CA8] dark:hover:bg-[#517CA8] "
                              >
                                Choose File
                              </label>
                            ) : (
                              <label htmlFor="file">{xlsFile.name}</label>
                            )}

                            <input
                              onChange={(e) => setXlsFile(e.target.files[0])}
                              type="file"
                              id="file"
                              accept=".xls,.xlsx"
                            ></input>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <button
                          data-modal-target="popup-modal"
                          data-modal-toggle="popup-modal"
                          className="block mr-6 text-white bg-[#FFA28D] hover:bg-[#FFA28D]  font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#FFA28D] dark:hover:bg-[#FFA28D] "
                          type="button"
                          onClick={saveData}
                        >
                          Save Data Only
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setInviteUsers(true);
                            setBulkUpload(false);
                          }}
                          className="  block text-orange-500 border-2 border-[#FFA28D] bg-white hover:bg-[#FFA28D] hover:text-white-500 ms-3 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-white dark:hover:bg-[#FFA28D] dark:hover:text-orange-500"
                        >
                          Save Data and Invite User
                        </button>
                      </div>
                    </div>
                  </>
                }
              ></Modal>
            )}
            {/* invite user modal */}
            {inviteUsers && (
              <Modal
                title="Are You Sure You Want to Invite XX User To Join Evallo?"
                classname={"max-w-[760px] mx-auto"}
                titleClassName={"mt-5"}
                handleClose={() => setInviteUsers(false)}
                //  primaryBtn={{
                //    text: "Assign",
                //    className: "max-w-140 pl-8 pr-8",
                //    onClick: (e) => handleSubmit(e),
                //    disabled: submitBtnDisabled,
                //    loading: loading,
                //  }}

                //  handleClose={}

                body={
                  <>
                    {" "}
                    <div className="text-center ">
                      <p className="text-[#517CA8] font-semibold">
                        {" "}
                        All users that are invited to the platform will receive
                        an email invitation to create an account within your
                        organization. If you only want to store their data and
                        do not want to invite them to create an account, please
                        click on “Save Data Only” button.
                        <br></br>If you want to continue inviting the users,
                        please click on the “Confirm Email Invitations” button
                        below.
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <button
                        data-modal-target="popup-modal"
                        data-modal-toggle="popup-modal"
                        className="block text-white mr-6 bg-[#FFA28D] hover:bg-[#FFA28D] me-3 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#FFA28D] dark:hover:bg-[#FFA28D] "
                        type="button"
                        onClick={bulkInvite}
                      >
                        Yes, Confirm
                      </button>
                      <button
                        type="button"
                        className="max-w-140 text-orange-500 border-3 border-[#FFA28D] bg-white hover:bg-[#FFA28D] hover:text-orange-500 ms-3 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-white dark:hover:bg-[#FFA28D] dark:hover:text-orange-500"
                        onClick={() => setInviteUsers(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                }
              ></Modal>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center gap-7 mb-6">
          <InputField
            IconRight={SearchIcon}
            placeholder="Search"
            inputClassName="pl-4"
            parentClassName="w-full w-[300px] py-1"
            inputContainerClassName="text-sm mt-1 shadow-[0px_0px_2.4999988079071045px_0px_#00000040] border-white text-sm bg-white  px-[20px] py-[10px] mb-1"
            type="text"
            value={filterData.typeName}
            onChange={(e) =>
              setFilterData({ ...filterData, typeName: e.target.value })
            }
          />
          <InputSelect
            optionData={userTypesList}
            inputContainerClassName="text-sm shadow-[0px_0px_2.4999988079071045px_0px_#00000040] border-white bg-white px-[20px] py-[16px]"
            placeholder="User Type"
            parentClassName="w-full w-1/6"
            type="select"
            value={filterData.userType.length > 0 ? filterData.userType[0] : ""}
            checkbox={{
              visible: true,
              name: "test",
              match: filterData.userType,
            }}
            onChange={(val) =>
              setFilterData({
                ...filterData,
                userType: filterData.userType.includes(val)
                  ? filterData.userType.filter((item) => item !== val)
                  : [...filterData.userType, val],
              })
            }
          />
          <InputSelect
            optionData={settings.leadStatus}
            placeholder="Lead Status"
            parentClassName="w-full w-1/6 border-none "
            inputContainerClassName="text-sm rounded-md shadow-[0px_0px_2.4999988079071045px_0px_#00000040] border-white bg-white px-[20px] py-[16px]"
            type="select"
            checkbox={{
              visible: true,
              name: "test",
              match: filterData.status,
            }}
            onChange={(val) =>
              setFilterData({
                ...filterData,
                status: filterData.status.includes(val)
                  ? filterData.status.filter((item) => item !== val)
                  : [...filterData.status, val],
              })
            }
            value={filterData.status.length > 0 ? filterData.status[0] : ""}
          />
          <InputSelect
            optionData={specializations}
            placeholder="Services"
            parentClassName="w-full w-1/6"
            type="select"
            inputContainerClassName="text-sm rounded-md shadow-[0px_0px_2.4999988079071045px_0px_#00000040] border-white bg-white px-[20px] py-[16px]"
            value={
              filterData.specialization.length > 0
                ? filterData.specialization[0]
                : ""
            }
            checkbox={{
              visible: true,
              name: "test",
              match: filterData.specialization,
            }}
            onChange={(val) =>
              setFilterData({
                ...filterData,
                specialization: filterData.specialization.includes(val)
                  ? filterData.specialization.filter((item) => item !== val)
                  : [...filterData.specialization, val],
              })
            }
          />
          {/* <InputSelect optionData={['active', 'blocked', 'dormant']}
                  placeholder='User Status'
                  parentClassName='w-full w-1/6 capitalize'
                  type='select'
                  inputContainerClassName='text-sm border bg-white px-[20px] py-[16px]'
                  value={filterData.userStatus.length > 0 ? filterData.userStatus[0] : ''}
                  checkbox={{
                     visible: true,
                     name: 'test',
                     match: filterData.userStatus
                  }}
                  onChange={val => setFilterData({
                     ...filterData,
                     userStatus: filterData.userStatus.includes(val) ?
                        filterData.userStatus.filter(item => item !== val)
                        : [...filterData.userStatus, val]
                  })}
               /> */}
          <InputSelect
            optionData={allTutors}
            placeholder="Tutor"
            parentClassName="w-full w-1/6"
            type="select"
            inputContainerClassName="text-sm rounded-md shadow-[0px_0px_2.4999988079071045px_0px_#00000040] border-white bg-white px-[20px] py-[16px]"
            optionType="object"
            value={filterData.tutor.length > 0 ? filterData.tutor[0] : ""}
            checkbox={{
              visible: true,
              name: "test",
              match: filterData.tutor,
              matchKey: "value",
            }}
            onChange={(val) => {
              handleTutorChange(val);
              // setFilterData({ ...filterData, tutor: val })
            }}
          />
        </div>
        {/* <div className="flex mb-6">
          <button className="bg-[#26435f80] px-3 py-2 rounded-md text-sm text-[#FFFFFF] mr-2">
            Student
          </button>
          <button className="relative bg-[#26435f80] px-3 py-2 rounded-md text-sm text-[#FFFFFF]">
            Parent
            <img
              className="absolute top-[-10px] left-[55px]"
              src={XIcon}
              alt=""
            />
          </button>
        </div> */}
        <div className="flex justify-between ">
          {/* <div className="flex">
            <label
              className={`${styles["checkbox-label"]} block text-[#26435F] font-medium`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <span
                className={`${styles["custom-checkbox"]} ${
                  isChecked ? "checked" : ""
                }`}
              ></span>
              <span className="ml-6">2 Selected</span>
            </label>
            <div></div>
          </div> */}
        </div>
        {/* <div className="flex align-center mt-0 gap-[20px]"></div> */}
        <div>
          <FilterItems
            items={filterItems}
            setData={setFilterItems}
            onRemoveFilter={onRemoveFilter}
          />
        </div>
        <div className="flex justify-between items-center mt-5">
          <div className="ml-6 ">
            <label className={`  text-[#26435F] font-medium flex items-center`}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <span
                className={`${styles["custom-checkbox"]} ${isChecked ? "checked" : ""
                  }`}
              ></span>
              <span className="block">{numberChecked} Selected</span>
            </label>
          </div>
          <div>
            <button className="bg-[#26435F] px-7 py-2 rounded-md text-white ml-auto">
              Save
            </button>
          </div>
        </div>

        <div className="mt-6">
          <Table
            dataFor="allUsers"
            data={filteredUsersData}
            onClick={{ redirect, handleTutorStatus, handleDelete }}
            tableHeaders={tableHeaders}
            headerObject={true}
            maxPageSize={10}
            numberChecked={numberChecked}
            setnumberChecked={setnumberChecked}
            isCallingApi={true}
            isChecked={isChecked}
            setIsChecked={setIsChecked}
            total_pages={Math.ceil(totalPages / maxPageSize)}
            setMaxPageSize={setMaxPageSize}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            fetch={changeUserField}
            extraData={allTutors}
          />
        </div>
      </div>

      {modalActive && (
        <Modal
          classname={"max-w-[700px] mx-auto rounded-md"}
          title="Add a New User"
          cancelBtn={true}
          titleClassName="text-start mb-3 pb-3 border-b border-b-gray-300"
          primaryCancel={true}
          cancelBtnClassName="w-130"
          primaryBtn={{
            text: "Invite User",
            className:
              "rounded-lg bg-transparent border-2 border-[#FFA28D] py-2 text-[#FFA28D]",
            form: "add-user-form",
            onClick: handleSubmit,
            loading: loading,
            type: "submit",
            disabled: addUserBtnDisabled,
          }}
          handleClose={handleClose}
          body={
            <form
              id="add-user-form"
              onSubmit={handleSubmit}
              className="px-[3px] mb-0.5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2  gap-x-2 md:gap-x-3 gap-y-3 gap-y-4 mb-5">
                <div>
                  <InputField
                    label="First Name"
                    labelClassname="ml-4 mb-0.5 text-[#26435F] font-semibold"
                    placeholder="First Name"
                    inputContainerClassName="text-sm pt-3.5 pb-3.5 px-5 bg-primary-50 border-0"
                    inputClassName="bg-transparent"
                    parentClassName="w-full"
                    type="text"
                    value={modalData.firstName}
                    isRequired={true}
                    onChange={(e) =>
                      setModalData({ ...modalData, firstName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <InputField
                    label="Last Name"
                    labelClassname="ml-4 mb-0.5 text-[#26435F] font-semibold"
                    isRequired={true}
                    placeholder="Last Name"
                    inputContainerClassName="text-sm pt-3.5 pb-3.5 px-5 bg-primary-50 border-0"
                    inputClassName="bg-transparent"
                    parentClassName="w-full"
                    type="text"
                    value={modalData.lastName}
                    onChange={(e) =>
                      setModalData({ ...modalData, lastName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <InputField
                    label="Email Addresss "
                    labelClassname="ml-4 mt-2 mb-0.5 text-[#26435F] font-semibold"
                    isRequired={true}
                    placeholder="Email Addresss"
                    inputContainerClassName="text-sm pt-3.5 pb-3.5 px-5 bg-primary-50 border-0"
                    inputClassName="bg-transparent"
                    parentClassName="w-full"
                    type="text"
                    value={modalData.email}
                    onChange={(e) =>
                      setModalData({ ...modalData, email: e.target.value })
                    }
                  />
                </div>
                <div className="mt-[7px]">
                  <InputSelect
                    value={modalData.userType}
                    onChange={(val) =>
                      setModalData({ ...modalData, userType: val })
                    }
                    isRequired={true}
                    type="select"
                    placeholder="Select User Type "
                    label="User Type"
                    labelClassname="ml-0  text-[#26435F] font-bold"
                    optionData={userTypeOptions}
                    inputContainerClassName="text-sm pt-3.5 pb-3.5 px-5 bg-primary-50 border-0"
                    parentClassName="w-full"
                  />
                </div>
              </div>
            </form>
          }
        />
      )}
      {deleteModalActive && (
        <Modal
          title={
            <span className="leading-10">
              Are you sure <br />
              you want to delete user{" "}
              {`${userToDelete.name} ${userToDelete._id}`} and all associated
              data ?
            </span>
          }
          titleClassName="mb-12 leading-10"
          cancelBtn={true}
          cancelBtnClassName="max-w-140"
          primaryBtn={{
            text: "Delete",
            className: "w-[140px] pl-4 px-4",
            onClick: () => onDelete(),
            bgDanger: true,
            loading: deleteLoading,
          }}
          handleClose={() => setDeleteModalActive(false)}
          classname={"max-w-567 mx-auto"}
        />
      )}
      {assignStudentModalActive && (
        <Modal
          title="Assign Tutor"
          classname={"max-w-[760px] mx-auto"}
          cancelBtn={true}
          cancelBtnClassName="max-w-140"
          primaryBtn={{
            text: "Assign",
            className: "max-w-140 pl-8 pr-8",
            onClick: (e) => handleSubmit(e),
            disabled: submitBtnDisabled,
            loading: loading,
          }}
          handleClose={handleClose2}
          body={
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 md:gap-x-3 gap-y-4 mb-5">
                <div>
                  <InputSearch
                    label="Student Name"
                    value={modalData.studentName}
                    onChange={(e) =>
                      setModalData({
                        ...modalData,
                        studentName: e.target.value,
                      })
                    }
                    optionData={students}
                    onOptionClick={(item) => {
                      setModalData({
                        ...modalData,
                        studentName: item.value,
                        studentId: item._id,
                      });
                    }}
                    optionPrefix="s"
                    parentClassName="w-full mr-4"
                    labelClassname="ml-2 mb-0.5"
                    inputContainerClassName="px-5 py-3.5 text-sm bg-primary-50 border-0"
                    inputClassName="bg-transparent"
                    placeholder="Student Name"
                    type="select"
                  />
                </div>
                <div>
                  <InputSearch
                    label="Tutor Name"
                    value={modalData.tutorName}
                    onChange={(e) =>
                      setModalData({
                        ...modalData,
                        tutorName: e.target.value,
                      })
                    }
                    optionData={tutors}
                    onOptionClick={(item) => {
                      setModalData({
                        ...modalData,
                        tutorName: item.value,
                        tutorId: item._id,
                      });
                    }}
                    optionPrefix="t"
                    parentClassName="w-full mr-4"
                    labelClassname="ml-2 mb-0.5"
                    inputContainerClassName="px-5 py-3.5 text-sm bg-primary-50 border-0"
                    inputClassName="bg-transparent"
                    placeholder="Tutor Name"
                    type="select"
                  />
                </div>
              </div>
            </>
          }
        />
      )}
    </div>
  );
}
