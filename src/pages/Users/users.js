import React, { useEffect, useRef, useState } from "react";
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
import Dropdown from "../../assets/icons/custom_dropdown.svg";
import PlusIcon from "../../assets/icons/add_plus.svg";
import ExportIcon from "../../assets/icons/export.svg";
import UploadIcon from "../../assets/icons/upload.svg";
import XIcon from "../../assets/icons/x.png";
import SearchIcon from "../../assets/icons/Search_shade.svg";
import fileupload from "../../assets/icons/basil_file-upload-outline (2).svg";
import { tableData, userTypesList } from "./tempData";
import { BASE_URL, getAuthHeader } from "../../app/constants/constants";
import dropdownIcon from "../../assets/icons/coloured_dropdown.svg";
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
  useCRMBulkChangeAssignedTutorMutation,
  useCRMBulkChangeLeadStatusMutation,
  useCRMBulkChangeTutorStatusMutation,
  useCRMBulkDeleteUserMutation,
  useCRMBulkInviteUserMutation,
  useDeleteUserMutation,
  useLazyGetExportDataQuery,
  useUnblockUserMutation,
} from "../../app/services/admin";
import ques from "../../assets/icons/tooltip.svg";
import { useLazyGetSettingsQuery } from "../../app/services/session";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
// import CountryCode from "../../components/CountryCode/CountryCode";
// import { isPhoneNumber } from "../Signup/utils/util";
import {
  checkIfExistInNestedArray,
  getFormattedDateTime,
} from "../../utils/utils";
// import InputSelectNew from "../../components/InputSelectNew/InputSelectNew";
import InputSearch from "../../components/InputSearch/InputSearch";
import { useSelector } from "react-redux";
import axios from "axios";
// import Loader from "../../components/Loader";
import LoaderNew from "../../components/Loader/LoaderNew";
import SCheckbox from "../../components/CCheckbox/SCheckbox";
import AssignedTutors from "../AssignedTutors/AssignedTutors";

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

  const SORT_STATES = {
    ASCENDING_ORDER: "ASCENDING_ORDER",
    DESCENDING_ORDER: "DESCENDING_ORDER",
    UNSORTED: "UNSORTED",
  };

  const { firstName, lastName } = useSelector((state) => state.user);
  const [modalData, setModalData] = useState(initialState);
  const [validData, setValidData] = useState(true);
  const [deleteModalActive, setDeleteModalActive] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [specializations, setSpecializations] = useState([]);
  const [numberPrefix, setNumberPrefix] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [usernameSortState, setUsernameSortState] = useState(
    SORT_STATES.UNSORTED
  );
  const [userTypeSortState, setUserTypeSortState] = useState(
    SORT_STATES.UNSORTED
  );
  const [emailSortState, setEmailSortState] = useState(SORT_STATES.UNSORTED);
  const [phoneSortState, setPhoneSortState] = useState(SORT_STATES.UNSORTED);
  const [accountStatusSortState, setAccountStatusSortState] = useState(
    SORT_STATES.UNSORTED
  );
  const [joinDateSortState, setJoinDateSortState] = useState(
    SORT_STATES.UNSORTED
  );
  const [filteredUsersData, setFilteredUsersData] = useState([]);
  const [bulkUpload, setBulkUpload] = useState(false);
  const [xlsFile, setXlsFile] = useState();
  const [inviteUsers, setInviteUsers] = useState(false);
  const csvLinkRef = useRef()
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
    console.log("sortByName");
    if (
      usernameSortState === SORT_STATES.UNSORTED ||
      usernameSortState === SORT_STATES.DESCENDING_ORDER
    ) {
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

      setUsernameSortState(SORT_STATES.ASCENDING_ORDER);
    } else if (usernameSortState === SORT_STATES.ASCENDING_ORDER) {
      setUsersData((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.name < b.name) {
            return 1;
          }
          if (a.name > b.name) {
            return -1;
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
            return 1;
          }
          if (a.name > b.name) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setUsernameSortState(SORT_STATES.DESCENDING_ORDER);
    }
  };

  const sortByUserType = () => {
    if (
      userTypeSortState === SORT_STATES.UNSORTED ||
      userTypeSortState === SORT_STATES.DESCENDING_ORDER
    ) {
      setUsersData((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.userType < b.userType) {
            return -1;
          }
          if (a.userType > b.userType) {
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
          if (a.userType < b.userType) {
            return -1;
          }
          if (a.userType > b.userType) {
            return 1;
          }
          return 0;
        });
        return arr;
      });

      setUserTypeSortState(SORT_STATES.ASCENDING_ORDER);
    } else if (userTypeSortState === SORT_STATES.ASCENDING_ORDER) {
      setUsersData((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.userType < b.userType) {
            return 1;
          }
          if (a.userType > b.userType) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setFilteredUsersData((prev) => {
        let arr = [...prev];
        //console.log("arr", arr);
        arr = arr.sort(function (a, b) {
          if (a.userType < b.userType) {
            return 1;
          }
          if (a.userType > b.userType) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setUserTypeSortState(SORT_STATES.DESCENDING_ORDER);
    }
  };

  const sortByEmail = () => {
    if (
      emailSortState === SORT_STATES.UNSORTED ||
      emailSortState === SORT_STATES.DESCENDING_ORDER
    ) {
      setUsersData((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.email < b.email) {
            return -1;
          }
          if (a.email > b.email) {
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
          if (a.email < b.email) {
            return -1;
          }
          if (a.email > b.email) {
            return 1;
          }
          return 0;
        });
        return arr;
      });

      setEmailSortState(SORT_STATES.ASCENDING_ORDER);
    } else if (emailSortState === SORT_STATES.ASCENDING_ORDER) {
      setUsersData((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.email < b.email) {
            return 1;
          }
          if (a.email > b.email) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setFilteredUsersData((prev) => {
        let arr = [...prev];
        //console.log("arr", arr);
        arr = arr.sort(function (a, b) {
          if (a.email < b.email) {
            return 1;
          }
          if (a.email > b.email) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setEmailSortState(SORT_STATES.DESCENDING_ORDER);
    }
  };

  const sortByPhone = () => {
    if (
      phoneSortState === SORT_STATES.UNSORTED ||
      phoneSortState === SORT_STATES.DESCENDING_ORDER
    ) {
      setUsersData((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (parseInt(a.phone) < parseInt(b.phone)) {
            return -1;
          }
          if (parseInt(a.phone) > parseInt(b.phone)) {
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
          if (parseInt(a.phone) < parseInt(a.phone)) {
            return -1;
          }
          if (parseInt(a.phone) > parseInt(a.phone)) {
            return 1;
          }
          return 0;
        });
        return arr;
      });

      setPhoneSortState(SORT_STATES.ASCENDING_ORDER);
    } else if (phoneSortState === SORT_STATES.ASCENDING_ORDER) {
      setUsersData((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (parseInt(a.phone) < parseInt(a.phone)) {
            return 1;
          }
          if (parseInt(a.phone) > parseInt(a.phone)) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setFilteredUsersData((prev) => {
        let arr = [...prev];
        //console.log("arr", arr);
        arr = arr.sort(function (a, b) {
          if (parseInt(a.phone) < parseInt(a.phone)) {
            return 1;
          }
          if (parseInt(a.phone) > parseInt(a.phone)) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setPhoneSortState(SORT_STATES.DESCENDING_ORDER);
    }
  };

  const sortByAccountStatus = () => {
    if (
      accountStatusSortState === SORT_STATES.UNSORTED ||
      accountStatusSortState === SORT_STATES.DESCENDING_ORDER
    ) {
      setUsersData((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.accountStatus < b.accountStatus) {
            return -1;
          }
          if (a.accountStatus > b.accountStatus) {
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
          if (a.accountStatus < b.accountStatus) {
            return -1;
          }
          if (a.accountStatus > b.accountStatus) {
            return 1;
          }
          return 0;
        });
        return arr;
      });

      setAccountStatusSortState(SORT_STATES.ASCENDING_ORDER);
    } else if (accountStatusSortState === SORT_STATES.ASCENDING_ORDER) {
      setUsersData((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.accountStatus < b.accountStatus) {
            return 1;
          }
          if (a.accountStatus > b.accountStatus) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setFilteredUsersData((prev) => {
        let arr = [...prev];
        //console.log("arr", arr);
        arr = arr.sort(function (a, b) {
          if (a.accountStatus < b.accountStatus) {
            return 1;
          }
          if (a.accountStatus > b.accountStatus) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setAccountStatusSortState(SORT_STATES.DESCENDING_ORDER);
    }
  };

  const sortByJoinDate = () => {
    if (
      joinDateSortState === SORT_STATES.UNSORTED ||
      joinDateSortState === SORT_STATES.DESCENDING_ORDER
    ) {
      setUsersData((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (
            getFormattedDateTime(a.createdAt) <
            getFormattedDateTime(b.createdAt)
          ) {
            return -1;
          }
          if (
            getFormattedDateTime(a.createdAt) >
            getFormattedDateTime(b.createdAt)
          ) {
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
          if (
            getFormattedDateTime(a.createdAt) <
            getFormattedDateTime(b.createdAt)
          ) {
            return -1;
          }
          if (
            getFormattedDateTime(a.createdAt) >
            getFormattedDateTime(b.createdAt)
          ) {
            return 1;
          }
          return 0;
        });
        return arr;
      });

      setJoinDateSortState(SORT_STATES.ASCENDING_ORDER);
    } else if (joinDateSortState === SORT_STATES.ASCENDING_ORDER) {
      setUsersData((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (
            getFormattedDateTime(a.createdAt) <
            getFormattedDateTime(b.createdAt)
          ) {
            return 1;
          }
          if (a.createdAt > b.createdAt) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setFilteredUsersData((prev) => {
        let arr = [...prev];
        //console.log("arr", arr);
        arr = arr.sort(function (a, b) {
          if (
            getFormattedDateTime(a.createdAt) <
            getFormattedDateTime(b.createdAt)
          ) {
            return 1;
          }
          if (
            getFormattedDateTime(a.createdAt) >
            getFormattedDateTime(b.createdAt)
          ) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setJoinDateSortState(SORT_STATES.DESCENDING_ORDER);
    }
  };

  const tableHeaders = [
    {
      id: 1,
      text: "Full Name",
      className: "text-left pl-5 text-white",
      wrapperClassName: 'justify-start',
      onCick: sortByName, // I know it should be onClick and not "onCick" but it was already written like this and I don't wanna mess around with the code
      willDisplayDownArrow: usernameSortState !== SORT_STATES.DESCENDING_ORDER,
    },
    {
      id: 2,
      text: "User Type",
      className: "text-left pl-2",
      wrapperClassName: 'justify-start',
      onCick: sortByUserType, // I know it should be onClick and not "onCick" but it was already written like this and I don't wanna mess around with the code
      willDisplayDownArrow: userTypeSortState !== SORT_STATES.DESCENDING_ORDER,
    },
    {
      id: 3,
      text: "Email",
      className: "text-left pl-4",
      onCick: sortByEmail, // I know it should be onClick and not "onCick" but it was already written like this and I don't wanna mess around with the code
      willDisplayDownArrow: emailSortState !== SORT_STATES.DESCENDING_ORDER,
    },
    {
      id: 4,
      text: "Phone",
      className: "text-left pl-9",
      onCick: sortByPhone, // I know it should be onClick and not "onCick" but it was already written like this and I don't wanna mess around with the code
      willDisplayDownArrow: phoneSortState !== SORT_STATES.DESCENDING_ORDER,
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
      onCick: sortByAccountStatus, // I know it should be onClick and not "onCick" but it was already written like this and I don't wanna mess around with the code
      willDisplayDownArrow:
        accountStatusSortState !== SORT_STATES.DESCENDING_ORDER,
    },
    {
      id: 9,
      text: "Join Date",
      onCick: sortByJoinDate, // I know it should be onClick and not "onCick" but it was already written like this and I don't wanna mess around with the code
      willDisplayDownArrow: joinDateSortState !== SORT_STATES.DESCENDING_ORDER,
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
  const [getExportData, getExportDataStatus] = useLazyGetExportDataQuery()
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
      console.log("crm", res);
      if (res?.data?.data) setTotalPages(res?.data?.data?.total_users);

      const fetchDetails = async () => {
        let tempData = [];
        await res?.data?.data?.user?.map(async (user) => {
          // console.log("user", user);
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
    console.log("add save");
    if (modalData.userType === "") return alert("Fill all the fields");
    let f = /[a-z]/i.test(modalData?.firstName);
    f = f && /[a-z]/i.test(modalData?.lastName);
    if (!f) {
      alert("Enter a valid name!");
      return;
    }
    let body = {
      firstName: modalData.firstName,
      lastName: modalData.lastName,
      email: modalData.email,
      phone: `${numberPrefix}${modalData.phone}`,
      type: "dont send invite.",
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
        alert("User Saved Successfully!");
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
        alert("User Saved Successfully!");
        setModalData(initialState);
        handleClose();
      });
    }
  };
  const [loadingInvite, setLoadingInvite] = useState(false);
  const handleInvite1 = (e) => {
    e.preventDefault();
    console.log("add invite");
    if (modalData.userType === "") return alert("Fill all the fields");
    let f = /[a-z]/i.test(modalData?.firstName);
    f = f && /[a-z]/i.test(modalData?.lastName);
    if (!f) {
      alert("Enter a valid name!");
      return;
    }
    let body = {
      firstName: modalData.firstName,
      lastName: modalData.lastName,
      email: modalData.email,
      phone: `${numberPrefix}${modalData.phone}`,
    };

    setLoadingInvite(true);
    if (modalData.userType === "tutor") {
      //console.log(body);
      body.role = modalData.userType.toLowerCase();
      addUser(body).then((res) => {
        //console.log(res);
        setLoadingInvite(false);
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
        setLoadingInvite(false);
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

  const handleCheckboxChange = (e) => {
    if (!isChecked) {
      let data = filteredUsersData;
      data = data?.slice(0, maxPageSize);

      setSelectedId([...data]);
    } else {
      setSelectedId([]);
      setBulkEdits({});
    }
    setIsChecked(!isChecked);
  };
  useEffect(() => {
    setIsChecked(false);
    setSelectedId([]);
  }, [filteredUsersData]);
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
      // specs.push(...service.specialization);
      specs.push(service.service);
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


  const generateExcel = (csvData) => {
    const wb = XLSX.utils.book_new();

    csvData.forEach(sheet => {
      const ws = XLSX.utils.json_to_sheet(sheet.data);
      XLSX.utils.book_append_sheet(wb, ws, sheet.sheetName);
    });
    const blob = XLSX.write(wb, { bookType: 'xlsx', type: "base64", mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const blobObject = new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blobObject);
    link.download = 'data.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkExportUsers = () => {
    getAllUsers()
      .then((res) => {
        let result = res?.data?.data?.user;
        console.log('exprting user..', result);
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
          setCsvLoad(false)
        }
        setsuccessFetched(true);
        setCsvLoad(false);
      })
      .catch((err) => {
        console.log('err', err);
        setCsvLoad(false);
      });
  }
  
  useEffect(() => {
    handleBulkExportUsers()
  }, [])

  const handleBulkExport = async (event, done) => {
    getExportData().then((res) => {
      const csvSheetData = [
        { data: [{ name: true }], sheetName: 'parents' },
        { data: [{ name: true }], sheetName: 'students' },
        { data: [{ name: true }], sheetName: 'tutors' },
      ];
      // generateExcel(csvSheetData)
    })
    if (selectedId?.length === 0) {
      setCsvLoad(true);
      handleBulkExportUsers()
    } else {
      setCsvData(selectedId);
      setsuccessFetched(true);
      setCsvLoad(false);
    }
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
          alert("Bulk Users Saved!");
          setBulkUpload(false);

        })
        .catch((err) => {
          if (err.response?.data?.message) {
            alert(err.response?.data?.message);
          } else {
            alert('An error occured while uploading the file!')
          }
          setXlsFile(undefined);
          setBulkUpload(false);
        });
    }
  };
  const bulkInvite = async () => {
    if (xlsFile !== undefined) {
      const formdata = new FormData();
      formdata.append("file", xlsFile);
      formdata.append("uploadType", "saveAndInvite");
      await axios
        .post(`${BASE_URL}api/user/bulkUploadUsers`, formdata, {
          headers: getAuthHeader(),
        })
        .then((res) => {
          setInviteUsers(false);
          setXlsFile(null);
          setCsvLength("XX");
          setInviteUsers(false);
          alert("Invite sent to bulk users!");
          // setXlsFile(undefined);
        })
        .catch((err) => {
          if (err.response?.data?.message) {
            alert(err.response?.data?.message);
          } else {
            alert('An error occured while uploading the file!')
          }

          //console.log("error in bulk upload and invite");
          setXlsFile(undefined);
          setInviteUsers(false);
        });
    }
  };
  const [selectedId, setSelectedId] = useState([]);
  const [addLeadStatus, sls] = useCRMBulkChangeLeadStatusMutation();
  const [addTutorStatus, slst] = useCRMBulkChangeTutorStatusMutation();
  const [addAssignedTutor, slsAt] = useCRMBulkChangeAssignedTutorMutation();
  const [addInviteUser, slsiu] = useCRMBulkInviteUserMutation();
  const [addDeleteUser, slsdu] = useCRMBulkDeleteUserMutation();
  const [bulkEdits, setBulkEdits] = useState({});
  const [checkSave, setChecksave] = useState({ ch: 0, done: false, count: 0 });
  const handleSave = () => {
    let users = selectedId?.map((ii) => ii?._id);
    if (!users || users?.length === 0) return;
    let b = 0;

    // setSaveSelectLoading(true)
    if (bulkEdits?.leadStatus && bulkEdits?.leadStatus?.value) {
      b++;
      setSaveSelectLoading(true);
      addLeadStatus({ leadStatus: bulkEdits.leadStatus.value, users }).then(
        (res) => {
          console.log("successleadStatus", res, checkSave);
          setChecksave((prev) => {
            return { ...prev, done: true, count: prev?.count + 1 };
          });
          setSaveSelectLoading(false);
          setSaveBulkModalActive(false);
        }
      );
    }
    if (bulkEdits?.tutorStatus && bulkEdits?.tutorStatus?.value) {
      setSaveSelectLoading(true);
      b++;
      addTutorStatus({ tutorStatus: bulkEdits.tutorStatus.value, users }).then(
        (res) => {
          console.log("successtutorStatus", res, checkSave);

          setSaveSelectLoading(false);
          setSaveBulkModalActive(false);
          // if(checkSave?.ch &&  checkSave?.count+1===checkSave?.ch){
          //   alert("Changes Saved Successfully")

          //   setChecksave({})
          // }
          setChecksave((prev) => {
            return { ...prev, done: true, count: prev?.count + 1 };
          });
        }
      );
    }
    if (bulkEdits?.assignedTutor && bulkEdits?.assignedTutor?.id) {
      setSaveSelectLoading(true);
      b++;
      addAssignedTutor({ tutorId: bulkEdits.assignedTutor.id, users }).then(
        (res) => {
          console.log("successassignedTutor", res, checkSave);
          setChecksave((prev) => {
            return { ...prev, done: true, count: prev?.count + 1 };
          });
          setSaveSelectLoading(false);
          setSaveBulkModalActive(false);
        }
      );
    }
    setChecksave((prev) => {
      return { done: false, count: 0, ch: b };
    });
    if (!b) {
      alert("No filter selected!");
    }
  };
  useEffect(() => {
    if (
      checkSave?.ch > 0 &&
      checkSave?.count &&
      checkSave?.ch === checkSave?.count
    ) {
      alert("Changes Saved Successfully!");
      fetch();
      setChecksave({});
      setBulkEdits({});
    }
  }, [checkSave]);

  //console.log({checkSave})
  const bulkSelectInvite = () => {
    let users = selectedId?.map((ii) => ii?._id);
    if (!users || users?.length === 0) return;
    setInviteSelectLoading(true);
    addInviteUser({ users }).then((res) => {
      console.log("successInvite", res);
      if (res?.data) alert("User(s) invited successfully!");

      setInviteSelectLoading(false);
      setInviteBulkModalActive(false);
      fetch();
    });
  };
  const bulkSelectDelete = () => {
    let users = selectedId?.map((ii) => ii?._id);
    if (!users || users?.length === 0) return;
    setDeleteSelectLoading(true);
    addDeleteUser({ users }).then((res) => {
      console.log("successDelete", res);
      if (res?.data) alert("User(s) deleted successfully!");
      setDeleteSelectLoading(false);
      setDeleteBulkModalActive(false);
      fetch();
    });
  };
  const [assignedTutorOpen, setAssignedTutorOpen] = useState(false);
  const [deleteBulkModalActive, setDeleteBulkModalActive] = useState(false);
  const [deleteSelectLoading, setDeleteSelectLoading] = useState(false);
  const [InviteBulkModalActive, setInviteBulkModalActive] = useState(false);
  const [InviteSelectLoading, setInviteSelectLoading] = useState(false);
  const [SaveBulkModalActive, setSaveBulkModalActive] = useState(false);
  const [saveSelectLoading, setSaveSelectLoading] = useState(false);
  const [showTooltip, setTooltip] = useState(false);
  const [adminSelectedForDelete, setAdminSelectedForDelete] = useState(false);
  useEffect(() => {
    if (selectedId?.length === 0) setBulkEdits({});
    setAdminSelectedForDelete(false);
    if (selectedId?.length > 0) {
      let check = selectedId?.find((it) => it?.userType === "admin");
      setAdminSelectedForDelete(check ? true : false);
    }
  }, [selectedId]);

  const numberKey = Object.keys(bulkEdits)?.length > 0;
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);



  //console.log("users",{selectedId,bulkEdits})
  return (
    <div className="px-[120px] mx-auto min-h-screen">
      <div className="pb-10  mt-[50px] ">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[#24A3D9] mb-6 text-xl text-base-20 cursor-pointer">
            <span onClick={() => navigate("/")}>
              {organization?.company +
                "  >  " +
                firstName +
                "  " +
                lastName +
                "  >  "}
            </span>
            <span className="font-semibold">CRM</span>
          </p>
        </div>
        <div>
          <div className="flex mb-[46px]">
            <button className="bg-[#517CA8] w-[158px] text-[15px] justify-center flex  items-center text-white  rounded-lg mr-[25px]">
              {csvLoad ? <LoaderNew /> : ""}
              {/* {!csvLoad && !successFetched ? (
                <p onClick={handleBulkExport}>Export Data</p>
              ) : (
                ""
              )}  */}

              {/* {csvData.length > 0 && successFetched && ( */}
              <CSVLink
                filename={"Evallo_CRM_Data.csv"}
                data={csvData}
                asyncOnClick={true}
                headers={csvHeaders}
                onClick={handleBulkExport}
              >
                Export Data{" "}
              </CSVLink>
              {/* )} */}

              {!csvLoad && (
                <img src={ExportIcon} className="ml-3" alt="ExportIcon" />
              )}
            </button>
            <button
              onClick={upload}
              className="bg-[#517CA8] w-[160px] text-[15px] justify-center flex  items-center text-white  rounded-lg mr-[25px]"
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
              className=" flex items-center  !text-white font-semibold py-[10px]  w-[203px] h-[45px] !px-1"
            />
            <button
              className="bg-[#FFA28D] justify-center flex py-2 pr-[17.9px] pl-[17px]  items-center text-white text-[17.5px] font-semibold rounded-lg ml-auto"
              onClick={() => setAssignedTutorOpen(true)}
            >
              Tutor Mapping
              <img src={PlusIcon} className="ml-[5px]" alt="PlusIcon" />
            </button>
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
                          disabled={!xlsFile}
                          className="block mr-6 text-white bg-[#FFA28D] hover:bg-[#FFA28D]  font-medium rounded-lg  px-[13.33px] py-3 text-center dark:bg-[#FFA28D] dark:hover:bg-[#FFA28D] disabled:opacity-60"
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
                          className="  block text-[#FFA28D] border-[1.33px] border-[#FFA28D] bg-white hover:shadow-md ms-3 font-medium rounded-lg  px-[13.33px] py-3 text-center dark:bg-white disabled:opacity-50"
                        >
                          Save Data and Invite Users
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
                titleInvite={csvLength}
                classname={"max-w-[781px] mx-auto"}
                titleClassName={"mb-5 text-center"}
                handleClose={() => setInviteUsers(false)}
                body={
                  <>
                    <div className="text-center mb-7">
                      <p className="text-[#517CA8]  text-lg ">
                        All users that are invited to the platform will receive
                        an email invitation to create an account within your
                        organization. If you only want to store their data and
                        do not want to invite them to create an account, please
                        click on “Save Data Only” button.
                        <br />
                        <span className="pt-1">
                          If you want to continue inviting the users, please
                          click on the{" "}
                          <span className="font-semibold">
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
        <div
          className={`flex justify-between items-center gap-x-[46.25px] mb-6 relative ${showTooltip ? "z-[1]" : "z-[50]"
            }`}
        >
          <InputField
            IconRight={SearchIcon}
            placeholder="Search"
            inputClassName="text-base-17-5 pl-4 text-[#667085] placeholder:text-[#667085]"
            parentClassName="w-[423.75px]"
            inputContainerClassName="text-base-17-5 shadow-[0px_0px_2px_rgba(0,0,0,0.25)] rounded-[7.5px] border-white bg-white !py-[14.5px]"
            type="text"
            value={filterData.typeName}
            onChange={(e) =>
              setFilterData({ ...filterData, typeName: e.target.value })
            }
          />
          <InputSelect
            placeholderClass="text-base-17-5"
            customArrow={dropdownIcon}
            customArrowClassName={`w-[12px] h-[12px]`}
            optionData={userTypesList}
            optionListClassName="text-base-17-5 text-[#667085]"
            inputContainerClassName="text-sm  shadow-[0px_0px_2px_rgba(0,0,0,0.25)] rounded-[7.5px] border-white bg-white px-[20px] h-[50px] py-[14.5px]"
            placeholder="User type"
            parentClassName="flex-1 relative w-[247.83px] relative z-[50]  text-[#667085]"
            type="select"
            value={filterData.userType.length > 0 ? filterData.userType[0] : ""}
            checkbox={{
              visible: true,
              name: "test",
              match: filterData.userType,
            }}
            onChange={(val) => {
              setFilterData({
                ...filterData,
                userType: filterData.userType.includes(val)
                  ? filterData.userType.filter((item) => item !== val)
                  : [...filterData.userType, val],
              });
            }}
          />
          <InputSelect
            customArrow={dropdownIcon}
            customArrowClassName={`w-[12px] h-[12px]`}
            optionListClassName="text-base-17-5 text-[#667085]"
            placeholderClass="text-base-17-5"
            optionData={settings.leadStatus}
            placeholder="Lead Status"
            parentClassName="flex-1 w-[247.83px] relative  relative  border-none text-[#667085]"
            inputContainerClassName="text-sm  shadow-[0px_0px_2px_rgba(0,0,0,0.25)] rounded-[7.5px] border-white bg-white px-[20px] h-[50px] py-[14.5px]"
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
            customArrow={dropdownIcon}
            customArrowClassName={`w-[12px] h-[12px]`}
            optionListClassName="text-base-17-5 text-[#667085]"
            placeholderClass="text-base-17-5"
            optionData={specializations}
            placeholder="Services"
            parentClassName="flex-1 relative w-[247.83px] relative text-[#667085] -z-5000"
            type="select"
            inputContainerClassName="text-sm  shadow-[0px_0px_2px_rgba(0,0,0,0.25)] rounded-[7.5px] border-white bg-white px-[20px] h-[50px] py-[14.5px]"
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
            customArrow={dropdownIcon}
            customArrowClassName={`w-[12px] h-[12px]`}
            optionListClassName="text-base-17-5 text-[#667085]"
            placeholderClass="text-base-17-5"
            optionData={allTutors?.map((iyt) => {
              return {
                ...iyt,
                name: iyt.value,
              };
            })}
            placeholder="Tutor"
            parentClassName="flex-1 w-[247.83px] relative relative text-[#667085] -z-5000"
            type="select"
            inputContainerClassName="text-sm  shadow-[0px_0px_2px_rgba(0,0,0,0.25)] rounded-[7.5px] border-white bg-white px-[20px] h-[50px] py-[14.5px]"
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
        <div className="flex gap-6 items-center relative z-[10]   mt-[23.75px]">
          <div className="ml-6 flex gap-3 items-center">
            <SCheckbox stopM={true} checked={selectedId.length > 0} />
            <span className="text-[#26435F] inline-block text-[17.5px] text-base-17-5 min-w-[70px] font-medium opacity-[0.8]">
              {selectedId?.length} Selected
            </span>
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
          <InputSelect
            optionListClassName="text-medium text-[#667085]"
            placeholderClass="text-medium !custom-scroller-2 overflow-x-auto !text-[#26435F] !mr-0"
            optionData={organization?.settings?.leadStatus?.map((iyt) => {
              return {
                value: iyt,
                name: iyt,
              };
            })}
            hideRight={true}
            placeholder="Lead Status"
            parentClassName=" text-[#26435F]"
            type="select"
            IconSearch={Dropdown}
            inputClassName="bg-white border border-white  w-[125px]"
            inputContainerClassName="bg-white shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] h-[43px] lg:px-3 2xl:px-4 text-center rounded-[5px]"
            optionType="object"
            value={bulkEdits?.leadStatus?.value}
            onChange={(val) => {
              let temp = bulkEdits;
              temp = {
                ...temp,
                leadStatus: {
                  value: val?.value,
                },
              };
              setBulkEdits(temp);
            }}
          />

          <InputSelect
            optionListClassName="text-[#667085] text-medium"
            placeholderClass="!custom-scroller-2 text-medium overflow-x-auto !text-[#26435F] !mr-0"
            optionData={organization?.settings?.tutorStatus?.map((iyt) => {
              return {
                value: iyt,
                name: iyt,
              };
            })}
            placeholder="Tutor Status"
            parentClassName="text-[#26435F]"
            type="select"
            IconSearch={Dropdown}
            inputClassName="bg-white border border-[rgb(255,255,255)]  w-[125px]"
            inputContainerClassName="bg-white shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] h-[43px] lg:px-3 2xl:px-4 text-center rounded-[5px]"
            hideRight={true}
            optionType="object"
            value={bulkEdits?.tutorStatus?.value}
            onChange={(val) => {
              let temp = bulkEdits;
              temp = {
                ...temp,
                tutorStatus: {
                  value: val?.value,
                },
              };

              setBulkEdits(temp);
            }}
          />

          <InputSelect
            hideRight={true}
            optionListClassName="text-medium text-[#667085] !font-normal"
            placeholderClass="text-medium !custom-scroller-2  overflow-x-auto !text-[#26435F] !mr-0 !font-normal"
            optionData={allTutors?.map((iyt) => {
              return {
                ...iyt,
                name: iyt.value,
              };
            })}
            placeholder="Assigned Tutor"
            parentClassName="text-[#26435F] flex-shrink-0"
            type="select"
            IconSearch={Dropdown}
            inputClassName="bg-white border   "
            inputContainerClassName="bg-white shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] h-[43px] w-[175px] px-[20px] lg:pl-2 2xl:pl-3 rounded-[5px] !font-normal"
            optionType="object"
            value={bulkEdits?.assignedTutor?.value}
            onChange={(val) => {
              let temp = bulkEdits;
              temp = {
                ...temp,
                assignedTutor: {
                  id: val?._id,
                  value: val?.value,
                },
              };

              setBulkEdits(temp);
            }}
          />

          <div>
            <button
              disabled={selectedId?.length === 0 || !numberKey ? true : false}
              onClick={() =>
                selectedId?.length > 0 && setSaveBulkModalActive(true)
              }
              className={`bg-[rgba(38,67,95,1)] font-medium text-[15px] px-[10px] py-[10px] rounded-[7.5px] text-white ml-auto  h-[43.75px] w-[100px] ${selectedId?.length === 0 || !numberKey ? "opacity-75" : ""
                } `}
            >
              Save
            </button>
          </div>
          <div className="flex justify-end flex-1 items-end gap-x-5 relative z-[50] ">
            <button
              disabled={selectedId?.length === 0 ? true : false}
              onClick={() =>
                selectedId?.length > 0 && setInviteBulkModalActive(true)
              }
              className={`bg-[#517CA8] flex justify-center opacity-100 text-[17.5px]  font-semibold tracking-wider relative whitespace-nowrap py-[9px] pb-[13px] rounded-[7.5px] text-white w-[157px] h-[44px] ${selectedId?.length === 0 ? "opacity-75" : ""
                } `}
            >
              + Invite Users
              <span className="absolute right-[-9px] z-[500] top-[-12px]">
                <div className="group relative z-[500]">
                  <img
                    src={ques}
                    onMouseEnter={(e) => {
                      e.preventDefault();
                      setTooltip(true);
                    }}
                    onMouseOut={(e) => {
                      e.preventDefault();
                      setTooltip(false);
                    }}
                    className="inline-block"
                    alt="ques"
                  />
                  {showTooltip && (
                    <span className="absolute top-[-237px]  design:top-[-248px]  left-[-140px] z-5000 w-[336px] design:w-[380px]  scale-0 rounded-[13px] bg-[rgba(0,0,0,0.80)]  text-[13px] text-white group-hover:scale-100 whitespace-normal py-[20px] px-[13px] text-left">
                      <h3 className="text-[#517CA8] text-left  py-0 font-semibold mb-1">
                        Invite Users
                      </h3>
                      <span className="font-light relative z-40 text-left">
                        This will allow you to invite the selected users to
                        create an account within your Organization’s database.
                        They will receive a verification email to set a new
                        password and logging into the platform. Note that this
                        is useful if you “Saved” user data instead of inviting
                        them when adding them to the CRM.
                        <br />
                        <span className="text-[#FF7979] font-light text-left">
                          Please ensure that you have consent from the user
                          before inviting them to create an account.
                        </span>
                      </span>
                    </span>
                  )}
                </div>
              </span>
            </button>

            <button
              disabled={
                true || selectedId?.length === 0 || adminSelectedForDelete
                  ? true
                  : false
              }
              onClick={() =>
                false &&
                selectedId?.length > 0 &&
                setDeleteBulkModalActive(true)
              }
              className={`bg-[#FF7979] opacity-100  text-[17.5px] flex gap-x-[10px] justify-center items-center gap-2 w-[175px] h-[43.75px] font-semibold py-[9.5px] rounded-[5px] text-white ${selectedId?.length === 0 || true || adminSelectedForDelete
                ? "opacity-75 cursor-not-allowed"
                : ""
                } `}
            >
              <span>
                <img
                  src={DeleteIcon2}
                  className="inline-block my-auto"
                  alt="delete"
                />
              </span>{" "}
              <span className="pt-[2px] flex"> Delete User(s)</span>
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
            setIsChecked={handleCheckboxChange}
            tableHeaders={tableHeaders}
            headerObject={true}
            maxPageSize={10}
            isChecked={isChecked}
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
              <div className="grid grid-cols-1 md:grid-cols-2  gap-x-5 md:gap-x-6  gap-y-4 mb-7">
                <div>
                  <InputField
                    label="First Name"
                    biggerText={true}
                    labelClassname=" mb-0.5 text-[#26435F] !font-medium "
                    placeholder="First Name"
                    inputContainerClassName="text-[16px] pt-3.5 pb-3.5 px-5 bg-primary-50 border-0 font-normal placeholder:text-[#B3BDC7]"
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
                    biggerText={true}
                    label="Last Name"
                    labelClassname=" mb-0.5 text-[#26435F] !font-medium !text-lg"
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
                    biggerText={true}
                    label="Email Address"
                    labelClassname=" mt-2 mb-0.5 text-[#26435F] !font-medium !text-lg"
                    isRequired={true}
                    placeholder="Email Address"
                    inputContainerClassName="text-sm pt-3.5 pb-3.5 px-5 bg-primary-50 border-0 !placeholder:!text-[#B3BDC7]"
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
                    placeholder="Select"
                    label="User Type"
                    labelClassname="ml-0  text-[#26435F] !font-medium !text-lg"
                    optionData={userTypeOptions}
                    inputContainerClassName="text-[16px] pt-3.5 pb-3.5 px-5 bg-primary-50 border-0 font-normal placeholder:text-[#B3BDC7]"
                    parentClassName="w-full"
                  />
                </div>
              </div>
              <div
                className={`flex items-center justify-center gap-4 ${addUserBtnDisabled ? "opacity-80" : ""
                  }`}
              >
                <button
                  disabled={addUserBtnDisabled || loading || loadingInvite}
                  className="rounded-lg bg-[#FFA28D] border-2 border-[#FFA28D] py-2 text-[#FFFFFF] w-[146px]"
                >
                  {loading ? "Saving..." : "Save User"}
                </button>

                <button
                  className="rounded-lg bg-transparent border-2 border-[#FFA28D] py-2 text-[#FFA28D]  w-[146px]"
                  onClick={(e) => handleInvite1(e, "invite")}
                  disabled={addUserBtnDisabled || loading || loadingInvite}
                >
                  {loadingInvite ? "Inviting..." : "Invite User"}
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
          titleClassName="mb-5 leading-10"
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
          classname={"max-w-[600px]  mx-auto"}
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
      {deleteBulkModalActive && (
        <Modal
          title={
            <span className="leading-10">
              Are You Sure You Want To Delete Selected User(s)
            </span>
          }
          titleClassName="mb-5 leading-10 !text-[21.33px] font-semibold"
          cancelBtn={true}
          crossBtn={true}
          cancelBtnClassName="!w-[146px] text-[#FFA28D] border-[1.5px] border-[#FFA28D] bg-white hover:bg-[#FFA28D] hover:text-white  font-medium rounded-lg  px-[10px] py-[17.33px] text-center dark:bg-white dark:hover:bg-[#FFA28D] "
          primaryBtn={{
            text: "Delete",
            className: "!w-[146px]  px-4 !bg-[#FF7979] text-white h-[46px]",
            onClick: () => bulkSelectDelete(),
            bgDanger: true,
            loading: deleteSelectLoading,
          }}
          body={
            <>
              <p className="text-base -mt-[21px] text-[#667085] mb-6">
                <span className="font-semibold mr-1">⚠️Note:</span>
                Once the users are deleted from your Organization, you will not
                be able to recover their data. Read detailed documentation in
                Evallo’s{" "}
                <span
                  className="text-[#24A3D9] underline cursor-pointer font-medium"
                  onClick={() => navigate("/support")}
                >
                  knowledge base.
                </span>
              </p>
            </>
          }
          handleClose={() => setDeleteBulkModalActive(false)}
          classname={"max-w-[600px]  mx-auto"}
        />
      )}
      {SaveBulkModalActive && (
        <Modal
          title={
            <span className="leading-10">
              Are You Sure You Want to Bulk Edit?
            </span>
          }
          titleClassName="mb-5 leading-10"
          cancelBtn={true}
          crossBtn={true}
          cancelBtnClassName="max-w-140 !bg-transparent !border  !border-[#FFA28D]  text-[#FFA28D]"
          primaryBtn={{
            text: "Save",
            className: "w-[140px]  pl-4 px-4 !bg-[#FF7979] text-white",
            onClick: () => handleSave(),
            bgDanger: true,
            loading: saveSelectLoading,
          }}
          handleClose={() => setSaveBulkModalActive(false)}
          classname={"max-w-[600px]  mx-auto"}
        />
      )}
      {InviteBulkModalActive && (
        <Modal
          crossBtn={true}
          underline={true}
          titleInvite={selectedId?.length}
          classname={"max-w-[781px] mx-auto"}
          titleClassName={"mb-5 text-center"}
          handleClose={() => setInviteBulkModalActive(false)}
          body={
            <>
              <div className="text-center mb-7">
                <p className="text-[#517CA8]  text-lg">
                  <span className="">
                    {" "}
                    All users that are invited to the platform will receive an
                    email invitation to create an account within your
                    organization. If you only want to store their data and do
                    not want to invite them to create an account, please click
                    on “Save Data Only” button.
                  </span>
                  <br />
                  <span className="pt-1">
                    If you want to continue inviting the users, please click on
                    the{" "}
                    <span className="!font-semibold">
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
                  className="block text-white  bg-[#FFA28D] hover:bg-[#FFA28D] mr-[40px] font-medium rounded-lg  px-6 py-[10] h-[46px] text-center dark:bg-[#FFA28D] dark:hover:bg-[#FFA28D] "
                  type="button"
                  disabled={InviteSelectLoading}
                  loading={InviteSelectLoading}
                  onClick={() => {
                    bulkSelectInvite();
                  }}
                >
                  {InviteSelectLoading ? "Inviting..." : "Yes, Confirm"}
                </button>
                <button
                  type="button"
                  className="w-[146px] text-[#FFA28D] border-[1.5px] border-[#FFA28D] bg-white hover:bg-[#FFA28D] hover:text-white  font-medium rounded-lg  px-[4px] py-[10] h-[46px] text-center dark:bg-white dark:hover:bg-[#FFA28D]"
                  onClick={() => setInviteBulkModalActive(false)}
                >
                  Cancel
                </button>
              </div>
            </>
          }
        ></Modal>
      )}

      <AssignedTutors
        assignedTutorOpen={assignedTutorOpen}
        setAssignedTutorOpen={setAssignedTutorOpen}
        fetch2={fetch}
      />
    </div>
  );
}
