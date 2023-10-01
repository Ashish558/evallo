import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { CSVLink, CSVDownload } from "react-csv";
import DeleteIcon2 from "../../assets/YIcons/Vectordel.svg";
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
import fileupload from "../../assets/icons/basil_file-upload-outline (2).svg";
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
import ques from "../../assets/YIcons/medical-icon_i-information-us.svg";
import { useLazyGetSettingsQuery } from "../../app/services/session";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
// import CountryCode from "../../components/CountryCode/CountryCode";
// import { isPhoneNumber } from "../Signup/utils/util";
import { checkIfExistInNestedArray } from "../../utils/utils";
// import InputSelectNew from "../../components/InputSelectNew/InputSelectNew";
import InputSearch from "../../components/InputSearch/InputSearch";
import { useSelector } from "react-redux";
import axios from "axios";
// import Loader from "../../components/Loader";
import LoaderNew from "../../components/Loader/LoaderNew";
import SCheckbox from "../../components/CCheckbox/SCheckbox";

const optionData = ["option 1", "option 2", "option 3", "option 4", "option 5"];

const userTypeOptions = ["Tutor", "Parent", "Student", "Contributor"];

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
  const [numberPrefix, setNumberPrefix] = useState("");
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
      //console.log("arr", arr);
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
      id: 7,
      text: "Service(s)",
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
      id: 8,
      text: "Account Status",
    },
    {
      id: 9,
      text: "Join Date",
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

  const fetch = () => {
    setUsersData([]);
    setFilteredUsersData([]);
    let urlParams = `?limit=${maxPageSize}&page=${currentPage}`;
    if (filterData.userType.length > 0) {
      filterData.userType.forEach((item) => {
        urlParams = urlParams + `&role=${item?.toLowerCase()}`;
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
      console.log("crm",res)
      if (res?.data?.data) setTotalPages(res?.data?.data?.total_users);
  
      const fetchDetails = async () => {
        let tempData = [];
        await res?.data?.data?.user?.map(async (user) => {
          console.log("user", user);
          let obj = {
            _id: user._id,
            block: user.block,
            userStatus: user.userStatus,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email ? user.email : "-",
            userType: user.role ? user.role : "-",
            phone: user.phone ? user.phone : "-",
            phoneCode: user.phoneCode ? user.phoneCode : "-",
            createdAt: user.createdAt,
            assignedTutor: user.assiginedTutors ? user.assiginedTutors : "",
            leadStatus: user?.leadStatus,
            tutorStatus: user?.tutorStatus,
            accountStatus: user?.userStatus,
            specialization: user?.specialization ? user.specialization : [],
          };
          tempData.push(obj);
        });
        setUsersData(tempData);

        setFilteredUsersData(tempData);
      };

      fetchDetails();
    });
  };
  //console.log("filteredUsers", filteredUsersData);
  const fetchTutors = () => {
    let urlParams = `?role=tutor`;

    fetchUsers(urlParams).then((res) => {
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

    setFilteredUsersData(temp);
    setUsersData(tempAllusers);
  };

  useEffect(() => {
    fetch();
  }, [maxPageSize, currentPage]);

  useEffect(() => {
    let tempdata = [...usersData];

    fetch();

    setCurrentPage(1);
    return;

    if (filterData.userType.length > 0) {
      tempdata = tempdata.filter((user) =>
        filterData.userType.includes(user.userType)
      );
    } else {
      tempdata = tempdata.filter((user) => user.userType !== "");
    }

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

    if (filterData.typeName !== "") {
      const regex2 = new RegExp(`${filterData.typeName.toLowerCase()}`, "i");
      tempdata = tempdata.filter((user) => user.name.match(regex2));
    } else {
      tempdata = tempdata.filter((user) => user.name !== "");
    }
  }, [filterData]);

  const removeFilter = (key, text, isArray) => {
    if (isArray) {
      let tempFilterData = { ...filterData };
      tempFilterData[key] = tempFilterData[key].filter((item) => item !== text);

      setFilterData(tempFilterData);
    } else {
      let tempFilterData = { ...filterData };
      tempFilterData[key] = "";
      //console.log("tempFilterData", tempFilterData);
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
      //console.log(body);
      body.role = modalData.userType.toLowerCase();
      addUser(body).then((res) => {
        //console.log(res);
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
      body.role = modalData.userType.toLowerCase();
      //console.log(body);
      addUser(body).then((res) => {
        setLoading(false);
        //console.log(res);
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
    if(!isChecked) {
      let data=filteredUsersData
     data=data?.slice(0,maxPageSize)

      setSelectedId([...data])
    }
    else {
      setSelectedId([])
    }
    setIsChecked(!isChecked);

  };
  useEffect(()=>{
    setIsChecked(false)
    setSelectedId([])
 },[filteredUsersData])
  const handleClose = () => setModalActive(false);

  const redirect = (item) => {
    if (roles.includes(item.userType) && item.userType !== "admin") {
      navigate(`/profile/${item.userType}/${item._id}`);
    }
  };

  const handleTutorStatus = (item) => {
    //console.log(item);
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
        return; //console.log(res.error);
      }
      //console.log(res.data);
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
      modalData.userType.trim() === ""
    ) {
      setAddUserBtnDisabled(true);
    } else {
      if (!isEmail(modalData.email)) {
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
    //console.log("specs", specs);
  }, [settings]);

  const handleTutorChange = (item) => {
    //console.log("item", item);
    //console.log("filterData tutor", filterData.tutor);
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
    }
  };

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
  const [csvLength, setCsvLength] = useState("XX");
  const [students, setStudents] = useState([]);
  const upload = () => {
    setBulkUpload(true);
  };

  const [rowCount, setRowCount] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Assuming the first sheet in the Excel file
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Convert the sheet to a CSV string
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      // Split the CSV string into rows
      const rows = csv.split("\n").filter((row) => {
        // Check if the row contains any non-comma characters
        return row.replace(/,/g, "").trim() !== "";
      });
      if (rows && rows?.length > 0) rows.length--;
      setRowCount(rows.length);
      setCsvLength(rows.length);
    };

    reader.readAsArrayBuffer(file);
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
          console.log("uploaded", res);
          setXlsFile(null);
          setCsvLength("XX");
          alert("File Uploaded");
          //setBulkUpload(false)
        })
        .catch((err) => {
          alert("Error Occured");
          setXlsFile(undefined);
          setBulkUpload(false);
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
          setInviteUsers(false);
          setXlsFile(null);
          setCsvLength("XX");
          alert("File Uploaded");
          // setXlsFile(undefined);
        })
        .catch((err) => {
          //console.log("error in bulk upload and invite");
          setXlsFile(undefined);
          setInviteUsers(false);
        });
    }
  };
const [selectedId,setSelectedId]=useState([])
console.log("users",{selectedId,filteredUsersData,filterData,maxPageSize})
  return (
    <div className="w-[83.6989583333vw] mx-auto  min-h-screen">
      <div className="pb-10  mt-[50px] !mt-[calc(50*0.0522vw)]">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[#24A3D9] mb-6 text-xl text-base-20 cursor-pointer">
            <span onClick={()=>navigate('/')}>{organization?.company +
              "  >  " +
              firstName +
              "  " +
              lastName +
              "  >  "}</span>
            <span className="font-semibold">CRM</span>
          </p>
          <button
            className="bg-[#FFA28D]  text-[15px] justify-center flex py-2 px-3 design:px-4 items-center text-white font-semibold rounded-lg text-base-15"
            onClick={() => navigate("/assigned-tutors")}
          >
            Tutor Mapping
            <img src={PlusIcon} className="ml-3" alt="PlusIcon" />
          </button>
        </div>
        <div>
          <div className="flex mb-[46px]">
            <button className="bg-[#517CA8] text-base-15 w-[158px] text-[15px] justify-center flex  items-center text-white  rounded-lg mr-[25px]">
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
              className="bg-[#517CA8] text-base-15 w-[158px] text-[15px] justify-center flex  items-center text-white  rounded-lg mr-[25px]"
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
              className=" flex items-center text-[15px]  py-[10px] px-3 text-base-15"
            />

            {bulkUpload && (
              <Modal
                title="Bulk Upload"
                classname={"max-w-[666px] mx-auto"}
                cancelBtnClassName="max-w-140"
                titleClassName="flex  items-start mb-[22px]"
                handleClose={() => setBulkUpload(false)}
                body={
                  <>
                    <div className="">
                      <div className="flex justify-center">
                        <div
                          className={`min-h-[161px] min-w-[198px] border-[1.33px]  mb-[26px] border-[#517CA8] rounded-[5px] ${styles.customborder}`}
                        >
                          <div className="mt-[18px] mb-[13px] flex justify-center">
                            <img src={fileupload} alt="fileuploadIcon"></img>
                          </div>

                          <div className="flex items-center justify-center">
                            {xlsFile == undefined ? (
                              <p className=""></p>
                            ) : (
                              <p className="block ">{xlsFile.name}</p>
                            )}
                          </div>
                          <div className="flex justify-center">
                            <label
                              htmlFor="file"
                              className="block text-white bg-[#517CA8] text-base-15 hover:bg-[#517CA8] items-center justify-center  rounded-[5px]  px-4 py-2.5 text-center dark:bg-[#517CA8] dark:hover:bg-[#517CA8] "
                            >
                              Choose file
                            </label>
                            <input
                              onChange={(e) => {
                                setXlsFile(e.target.files[0]);
                                handleFileUpload(e);
                              }}
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
                          className="block mr-6 text-white bg-[#FFA28D] hover:bg-[#FFA28D]  font-medium rounded-lg  px-[13.33px] py-3 text-center dark:bg-[#FFA28D] dark:hover:bg-[#FFA28D] "
                          type="button"
                          onClick={saveData}
                        >
                          Save Data Only
                        </button>
                        <button
                          type="button"
                          disabled={!xlsFile}
                          onClick={() => {
                            setInviteUsers(true);
                            setBulkUpload(false);
                          }}
                          className="  block text-[#FFA28D] border-[1.33px] border-[#FFA28D] bg-white hover:shadow-md ms-3 font-medium rounded-lg  px-[13.33px] py-3 text-center dark:bg-white "
                        >
                          Save Data and Invite User
                        </button>
                      </div>
                    </div>
                  </>
                }
              ></Modal>
            )}

            {inviteUsers && (
              <Modal
                crossBtn={true}
                underline={true}
                title={`Are You Sure You Want to Invite ${csvLength} Users To Join Evallo?`}
                classname={"max-w-[781px] mx-auto"}
                titleClassName={"mb-5 "}
                handleClose={() => setInviteUsers(false)}
                body={
                  <>
                    <div className="text-center mb-7">
                      <p className="text-[#517CA8]  text-lg font-light">
                        All users that are invited to the platform will receive
                        an email invitation to create an account within your
                        organization. If you only want to store their data and
                        do not want to invite them to create an account, please
                        click on “Save Data Only” button.
                        <br />
                        <span className="pt-1">
                          If you want to continue inviting the users, please
                          click on the{" "}
                          <span className="font-normal">
                            “Confirm Email Invitations”
                          </span>{" "}
                          button below.
                        </span>
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <button
                        data-modal-target="popup-modal"
                        data-modal-toggle="popup-modal"
                        className="block text-white  bg-[#FFA28D] hover:bg-[#FFA28D] mr-[40px] font-medium rounded-lg  px-6 py-[17.33px] text-center dark:bg-[#FFA28D] dark:hover:bg-[#FFA28D] "
                        type="button"
                        onClick={() => {
                          bulkInvite();
                          setInviteUsers(false);
                        }}
                      >
                        Yes, Confirm
                      </button>
                      <button
                        type="button"
                        className="max-w-140 text-[#FFA28D] border-[1.5px] border-[#FFA28D] bg-white hover:bg-[#FFA28D] hover:text-white  font-medium rounded-lg  px-[46px] py-[17.33px] text-center dark:bg-white dark:hover:bg-[#FFA28D]"
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
            inputClassName="text-base-17-5 pl-4 text-[#667085]"
            parentClassName="w-[22.03125vw]  py-1"
            inputContainerClassName="text-sm  mt-1 shadow-[0px_0px_2px_rgba(0,0,0,0.25)] rounded-[7.5px] border-white bg-white   mb-1"
            type="text"
            value={filterData.typeName}
            onChange={(e) =>
              setFilterData({ ...filterData, typeName: e.target.value })
            }
          />
          <InputSelect
            placeholderClass="text-base-17-5"
            optionData={userTypesList}
            optionListClassName="text-base-17-5 text-[#667085]"
            inputContainerClassName="text-sm  shadow-[0px_0px_2px_rgba(0,0,0,0.25)] rounded-[7.5px] border-white bg-white px-[20px] py-[16px]"
            placeholder="User Type"
            parentClassName="w-[12.8541666667vw] text-[#667085]"
            type="select"
            value={filterData.userType.length > 0 ? filterData.userType[0] : ""}
            checkbox={{
              visible: true,
              name: "test",
              match: filterData.userType,
            }}
            onChange={(val) =>{
              console.log({val,filterData})
              setFilterData({
                ...filterData,
                userType: filterData.userType.includes(val)
                  ? filterData.userType.filter((item) => item !== val)
                  : [...filterData.userType, val],
              })
            }}
          />
          <InputSelect
            optionListClassName="text-base-17-5 text-[#667085]"
            placeholderClass="text-base-17-5"
            optionData={settings.leadStatus}
            placeholder="Lead Status"
            parentClassName="w-[12.8541666667vw] border-none text-[#667085]"
            inputContainerClassName="text-sm  shadow-[0px_0px_2px_rgba(0,0,0,0.25)] rounded-[7.5px] border-white bg-white px-[20px] py-[16px]"
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
            optionListClassName="text-base-17-5 text-[#667085]"
            placeholderClass="text-base-17-5"
            optionData={specializations}
            placeholder="Services"
            parentClassName="w-[12.8541666667vw] text-[#667085]"
            type="select"
            inputContainerClassName="text-sm  shadow-[0px_0px_2px_rgba(0,0,0,0.25)] rounded-[7.5px] border-white bg-white px-[20px] py-[16px]"
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

          <InputSelect
            optionListClassName="text-base-17-5 text-[#667085]"
            placeholderClass="text-base-17-5"
            optionData={allTutors?.map((iyt)=>{
              return {
                ...iyt,
                name:iyt.value,
              }
            })}
            placeholder="Tutor"
            parentClassName="w-[12.8541666667vw] text-[#667085]"
            type="select"
            inputContainerClassName="text-sm  shadow-[0px_0px_2px_rgba(0,0,0,0.25)] rounded-[7.5px] border-white bg-white px-[20px] py-[16px]"
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
            }}
          />
        </div>

        <div className="flex justify-between "></div>

        <div>
          <FilterItems
            items={filterItems}
            setData={setFilterItems}
            onRemoveFilter={onRemoveFilter}
          />
        </div>
        <div className="flex gap-6 items-center    mt-[23.75px]">
          <div className="ml-6 flex gap-3 ">
            <SCheckbox stopM={true}  checked={isChecked} onChange={handleCheckboxChange} />
            <span className="inline-block text-[17.5px] text-base-17-5">{selectedId?.length} Selected</span>
            {/* <label className={`  text-[#26435F] font-medium flex items-center`}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <span
                className={`${styles["custom-checkbox"]} ${isChecked ? "checked" : ""
                  }`}
              ></span>
             
            </label> */}
          </div>
          <InputField
            value="Lead Status"
            IconRight={Dropdown}
            inputClassName="bg-white border border-white w-[120px]"
            inputContainerClassName="bg-white "
          ></InputField>
          <InputField
            value="Tutor Status"
            IconRight={Dropdown}
            inputClassName="bg-white border border-white w-[120px]"
            inputContainerClassName="bg-white "
          ></InputField>
          <InputField
            value="Assigned Tutor"
            IconRight={Dropdown}
            inputClassName="bg-white border border-white w-[125px]"
            inputContainerClassName="bg-white "
          ></InputField>
          <div>
            <button className="bg-[#26435F] text-[15px] px-[25px] py-[10px] rounded-[7.5px] text-white ml-auto text-base-15">
              Save
            </button>
          </div>
          <div className="flex justify-end flex-1 gap-5 relative ">
            <button className="bg-[#517CA8] text-[15px] font-semibold relative px-[25px] py-[10px] rounded-[7.5px] text-white  text-base-15">
              + Invite Users
              <span className="absolute right-[-10px] z-[500] top-[-10px]">
                <div className="group relative">
                  <img src={ques} className="inline-block" />
                  <span className="absolute  top-14 left-[-100px] z-500 w-[260px]  scale-0 rounded-lg bg-[rgba(31,41,55,0.93)]  text-[13px] text-white group-hover:scale-100 whitespace-normal py-3 px-3">
                    <h3 className="text-[#517CA8] text-left text-[16px] py-0 font-semibold mb-1">
                      Invite Users
                    </h3>
                    <span className=" text-left text-base-15 font-medium">
                      This will allow you to invite the selected users to create
                      an account within your Organization’s database. They will
                      receive a verification email to set a new password and
                      logging into the platform. Note that this is useful if you
                      “Saved” user data instead of inviting them when adding
                      them to the CRM
                      <br />
                      <br />
                      <span className="text-[#FF7979] ">
                        Please ensure that you have consent from the user before
                        inviting them to create an account.
                      </span>
                    </span>
                  </span>
                </div>
              </span>
            </button>
            <button className="bg-[#FF7979] text-[15px] flex items-center gap-2 px-[25px] font-semibold py-[10px] rounded-[7.5px] text-white  text-base-15">
              <span>
                <img
                  src={DeleteIcon2}
                  className="inline-block my-auto"
                  alt="delete"
                />
              </span>{" "}
              Delete User(s)
            </button>
          </div>
        </div>

        <div className="mt-6">
          <Table
            dataFor="allUsers"
            selectedId2={selectedId}
            setSelectedId2={setSelectedId}
            data={filteredUsersData}
            onClick={{ redirect, handleTutorStatus, handleDelete }}
            tableHeaders={tableHeaders}
            headerObject={true}
            maxPageSize={maxPageSize}
           
            isCallingApi={true}
            
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
          underline="false"
          classname={"max-w-[700px] mx-auto rounded-md"}
          title="Add A New User"
          // cancelBtn={true}
          titleClassName="text-start mb-3 pb-3 border-b-[1.5px] border-b-[#00000020]"
          // primaryCancel={true}
          // cancelBtnClassName="w-130"
          // primaryBtn={{
          //   text: "Invite User",
          //   className:
          //     "rounded-lg bg-transparent border-2 border-[#FFA28D] py-2 text-[#FFA28D]",
          //   form: "add-user-form",
          //   onClick: handleSubmit,
          //   loading: loading,
          //   type: "submit",
          //   disabled: addUserBtnDisabled,
          // }}
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
                    placeholderClass="text-base-17-5"
                    optionData={userTypeOptions}
                    inputContainerClassName="text-sm pt-3.5 pb-3.5 px-5 bg-primary-50 border-0"
                    parentClassName="w-full"
                  />
                </div>
              </div>
              <div className="flex items-center justify-center gap-4">
                <button className="rounded-lg bg-[#FFA28D] border-2 border-[#FFA28D] py-2 text-[#FFFFFF] w-[146px]">
                  Save User
                </button>
                <button
                  className="rounded-lg bg-transparent border-2 border-[#FFA28D] py-2 text-[#FFA28D]  w-[146px]"
                  onClick={handleSubmit}
                  disabled={addUserBtnDisabled}
                >
                  Invite User
                </button>
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
                    placeholderClass="text-base-17-5"
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
                    inputClassName="text-base-17-5 bg-transparent"
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
                    placeholderClass="text-base-17-5"
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
                    inputClassName="text-base-17-5 bg-transparent"
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
