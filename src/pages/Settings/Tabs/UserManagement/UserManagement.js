import React, { useEffect, useState } from "react";

import Table from "../../../../components/Table/Table";
import FilterItems from "../../../../components/FilterItemsNew/filterItems";
import Modal from "../../../../components/Modal/Modal";
import InputField from "../../../../components/InputField/inputField";
import InputSelect from "../../../../components/InputSelect/InputSelect";
import AddManager from "../../../../assets/YIcons/+ Add Manager.svg"
import AddIcon from "../../../../assets/icons/add.svg";
import SearchIcon from "../../../../assets/icons/search.svg";
import { userTypesList } from "./tempData";
import {
  useAddManagerMutation,
  useAddUserMutation,
  useLazyGetAllUsersQuery,
  useLazyGetTutorDetailsQuery,
  useLazyGetUserDetailQuery,
} from "../../../../app/services/users";
import {
  useForgotPasswordMutation,
  useSignupUserMutation,
} from "../../../../app/services/auth";
import { useNavigate } from "react-router-dom";
import { roles } from "../../../../constants/constants";
import {
  useBlockUserMutation,
  useDeleteUserMutation,
  useUnblockUserMutation,
} from "../../../../app/services/admin";
import { useLazyGetSettingsQuery } from "../../../../app/services/session";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import CountryCode from "../../../../components/CountryCode/CountryCode";
import { isPhoneNumber } from "../../../Signup/utils/util";
import { checkIfExistInNestedArray } from "../../../../utils/utils";
import InputSelectNew from "../../../../components/InputSelectNew/InputSelectNew";
import { useSelector } from "react-redux";
import { useAddManager2Mutation } from "../../../../app/services/superAdmin";

const optionData = ["option 1", "option 2", "option 3", "option 4", "option 5"];

const userTypeOptions = ["tutor", "parent", "student"];

const initialState = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  userType: "",
};

export default function UserManagement() {
  const [modalActive, setModalActive] = useState(false);
  const navigate = useNavigate();
  const [modalData, setModalData] = useState(initialState);
  const [validData, setValidData] = useState(true);
  const [deleteModalActive, setDeleteModalActive] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [specializations, setSpecializations] = useState([]);
  const [numberPrefix, setNumberPrefix] = useState("+1");
  const [usersData, setUsersData] = useState([]);
  const [filteredUsersData, setFilteredUsersData] = useState([]);
  const [forgotPassword, forgotPasswordResp] = useForgotPasswordMutation();
  const { role } = useSelector((state) => state.user);
  const [addManager,setManager]=useAddManagerMutation()
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

  let tableHeaders = [
    {
      id: 1,
      text: "Full Name",
      className: "text-left pl-7",
      onCick: sortByName,
    },
    {
      id: 2,
      text: "Email",
    },
    {
      id: 3,
      text: "Usertype",
    },
    {
      id: 4,
      text: "Last login",
    },
    {
      id: 5,
      text: "Profile",
    },
    {
      id: 6,
      text: "Password",
    },
    {
      id: 7,
      text: "",
    },
  ];

  if (role === 'manager') {
    tableHeaders = [
      {
        id: 1,
        text: "Full Name",
        className: "text-left pl-6",
        onCick: sortByName,
      },
      {
        id: 2,
        text: "Usertype",
      },
      {
        id: 3,
        text: "Email",
      },
      {
        id: 7,
        text: "Last login",
      },
    ];
  }
  const handleResetPassword = (email) => {
    forgotPassword({ email: email }).then((res) => {
      if (res.error) {
        console.log(res.error);
        alert(res.error.data.message);
        return;
      }
      console.log(res.data);
      alert("Password reset link sent to the email.");
      // window.open(res.data.link)
    });
  };

  const [getUserDetail, getUserDetailResp] = useLazyGetUserDetailQuery();
  const [getTutorDetail, userDetailResp] = useLazyGetTutorDetailsQuery();

  const [filterItems, setFilterItems] = useState([]);
  const [addUserBtnDisabled, setAddUserBtnDisabled] = useState(false);

  const [blockUser, blockUserResp] = useBlockUserMutation();
  const [unblockUser, unblockUserResp] = useUnblockUserMutation();
  const [fetchSettings, settingsResp] = useLazyGetSettingsQuery();
  const [userToDelete, setUserToDelete] = useState({});

  const [fetchUsers, fetchUsersResp] = useLazyGetAllUsersQuery();
  const [addUser, addUserResp] = useAddUserMutation();
  const [addManager2,setManager2status]=useAddManager2Mutation()
  const [signupUser, signupUserResp] = useSignupUserMutation();
  const [deleteUser, deleteUserResp] = useDeleteUserMutation();

  const [maxPageSize, setMaxPageSize] = useState(15);
  const [loading, setLoading] = useState(false);

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [allTutors, setAllTutors] = useState([]);

  const [filterData, setFilterData] = useState({
    typeName: "",
    userType: [],
    status: [],
    specialization: [],
    userStatus: [],
    tutor: [],
  });

  useEffect(() => {
    fetchSettings().then((res) => {
      setSettings(res.data.data.setting);
    });
  }, []);

  // console.log(settings)

  const fetch = () => {
    setUsersData([]);
    setFilteredUsersData([]);

    let urlParams = `?limit=${maxPageSize}&page=${currentPage}&role=manager&role=superAdmin`;
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
      console.log("all-users", res.data.data.user);
      // if(res.data.data.no_of_users < maxPageSize){
      //    setTotalPages(15)
      // }else{
      setTotalPages(res.data.data.total_users);
      // }
      // console.log('total users', res.data.data.total_users);

      const fetchDetails = async () => {
        await res.data.data.user.map(async (user) => {
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
            lastLogin: user.lastLogin,
            tutorStatus: "-",
            specialization: user.specialization ? user.specialization : [],
          };
          setUsersData((prev) => [...prev, obj]);
          setFilteredUsersData((prev) => [...prev, obj]);
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
      };

      fetchDetails();
      // setUsersData(data)
      // setFilteredUsersData(data)
    });
  };

  const fetchTutors = () => {
    let urlParams = `?role=tutor`;

    fetchUsers(urlParams).then((res) => {
      // console.log('tutors', res.data.data);
      if (!res.data.data.user) return;
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
    // console.log(temp);
    setFilteredUsersData(temp);
    setUsersData(tempAllusers);
  };

  useEffect(() => {
    fetch();
  }, [maxPageSize, currentPage]);
  // console.log('currentPage', currentPage);

  useEffect(() => {
    let tempdata = [...usersData];
     console.log('all users data', usersData)
    // console.log('filterData.specialization', filterData.specialization)
    fetch();
    setCurrentPage(1);
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
    }
    else if(modalData.userType==='manager'){
      addManager2(body).then((res) => {
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
    else {
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
    console.log(item);
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
      modalData.phone.trim() === "" ||
      modalData.userType.trim() === ""
    ) {
      setAddUserBtnDisabled(true);
    } else {
      if (
        modalData.phone.length < 10 ||
        !isEmail(modalData.email) ||
        !isPhoneNumber(modalData.phone)
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
console.log({addUserBtnDisabled})
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
    // console.log(item);
    // console.log('filterData tutor', filterData.tutor);
    if (filterData.tutor.includes(item.value)) {
      let updated = filterData.tutor.filter((tutor) => tutor !== item.value);
      // setUpdatedSubscriptionData(prev => ({
      //    ...prev,
      //    tests: updated
      // }))
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

  const filteredUserData = [];

  filteredUsersData.map((user) => {
    const ids = filteredUserData.map((item) => item._id);
    if (!ids.includes(user._id)) {
      filteredUserData.push(user);
    }
  });

console.log({modalData})
  return (
    <div className=" bg-lightWhite min-h-screen">
      <div className="py-14 pt-0 ">

        <div className="mt-6">
          <Table
            dataFor={role === 'superAdmin' ? "allUsersSuperAdmin" : 'allUsersManager'}
            noArrow={true}
            data={filteredUserData}
            onClick={{
              redirect,
              handleTutorStatus,
              handleDelete,
              handleResetPassword,
            }}
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
        <div onClick={()=>{setModalActive(true) ;setModalData({ ...modalData, userType: 'manager' })}} className="text-[#26435F] -mt-2 cursor-pointer"><img src={AddManager} alt="add manager" /></div>
      </div>

      {
        modalActive && (
          <Modal
          underline="false"
            classname={"max-w-[700px] mx-auto rounded-md"}
            title="Add A Manager"
            // cancelBtn={true}
            titleClassName="text-start mb-3 pb-3 border-b border-b-gray-300"
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
                  <div>
                    <InputField
                      label="Phone "
                      labelClassname="ml-4 mt-2 mb-0.5 text-[#26435F] font-semibold"
                      isRequired={true}
                      placeholder="Phone"
                      inputContainerClassName="text-sm pt-3.5 pb-3.5 px-5 bg-primary-50 border-0"
                      inputClassName="bg-transparent"
                      parentClassName="w-full"
                      type="text"
                      value={modalData.phone}
                      onChange={(e) =>
                        setModalData({ ...modalData, phone: e.target.value })
                      }
                    />
                  </div>
                 
                </div>
                <div className='flex items-center justify-center gap-4'>
               
                <button className="rounded-lg bg-transparent border-2 border-[#FFA28D] py-2 text-[#FFA28D]  w-[146px]" onClick={handleSubmit} disabled={addUserBtnDisabled}>Invite User</button>
                <button onClick={(e)=>{e.preventDefault();handleClose()}} className="rounded-lg bg-[#FFA28D] border-2 border-[#FFA28D] py-2 text-[#FFFFFF] w-[146px]">Cancel</button>
                </div>
              </form>
            }
          />
        )
      }
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
    </div>
  );
}
