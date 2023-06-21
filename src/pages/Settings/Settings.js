import React, { useEffect, useRef, useState } from "react";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import EditIcon from "../../assets/icons/edit-white.svg";
import ActiveTab from "../../assets/icons/active-tab.svg";
import SettingsCard from "../../components/SettingsCard/SettingsCard";
import AddTag from "../../components/Buttons/AddTag";
import FilterItems from "../../components/FilterItems/filterItems";
import InputField from "../../components/InputField/inputField";
import Modal from "../../components/Modal/Modal";
import { useLazyGetSettingsQuery } from "../../app/services/session";
import {
  useUpdateOfferImageMutation,
  useUpdateSettingMutation,
} from "../../app/services/settings";
import { getSessionTagName } from "../../utils/utils";
import { BASE_URL, getAuthHeader } from "../../app/constants/constants";
import axios from "axios";
import DeleteIcon from "../../assets/icons/delete.svg";
import PauseIcon from "../../assets/icons/pause.svg";
import PlayIcon from "../../assets/icons/play.svg";
import EditBlueIcon from "../../assets/icons/edit-blue.svg";
import InputSearch from "../../components/InputSearch/InputSearch";
import { useSelector, useDispatch } from "react-redux";
import { useUpdateUserFieldsMutation } from "../../app/services/users";
import { updateUserDetails } from "../../app/slices/user";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./styles.module.css";
import SignupTab from "./Tabs/Signup/signup";
import AddNewQuestion from "../Frames/AddNewQuestion/AddNewQuestion";
import { useAddNewQuestionMutation } from "../../app/services/admin";

const initialState = {
  name: "",
  phone: "",
  email: "",
};
const subModalInitialState = {
  code: "",
  expiry: "",
  editing: false,
};

const initialTabs = [
  {
    Icon: PlayIcon,
    name: "Organization Defaults",
    selected: true,
  },
  {
    Icon: PlayIcon,
    name: "Company and Brand",
    selected: false,
  },
  {
    Icon: PlayIcon,
    name: "signup form detail",
    selected: false,
  },
  {
    Icon: PlayIcon,
    name: "Account  Overview",
    selected: false,
  },
];
export default function Settings() {
  const [modalActive, setModalActive] = useState(false);
  const [tagModalActive, setTagModalActive] = useState(false);
  const [addCodeModalActive, setAddCodeModalActive] = useState(false);
  const [subModalData, setSubModalData] = useState(subModalInitialState);
  const [addTestModalActive, setAddTestModalActive] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    type: "String",
    text: "Add",
    values: {
      option1: "",
      option2: "",
      option3: "",
      option4: "",
    },
  });
  const { organization } = useSelector((state) => state.organization);

  const [searchParams, setSearchParams] = useSearchParams();
  const [tabs, setTabs] = useState(initialTabs);
  const [activeTab, setActiveTab] = useState("1");
  const [selectedSubscriptionData, setSelectedSubscriptionData] = useState({
    code: "",
    expiry: "",
    tests: [],
  });
  const [adminModalDetails, setAdminModalDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [updatedSubscriptionData, setUpdatedSubscriptionData] = useState({
    code: "",
    expiry: "",
    tests: [],
  });
  const user = useSelector((state) => state.user);

  useEffect(() => {
    setAdminModalDetails({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    });
  }, [user]);

  const [searchedTest, setSearchedTest] = useState("");
  const [allTestData, setAllTestData] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const navigate = useNavigate();
  const [settingsData, setSettingsData] = useState({});
  const inputRef = useRef();
  const [image, setImage] = useState(null);
  const [getSettings, getSettingsResp] = useLazyGetSettingsQuery();
  const [updateSetting, updateSettingResp] = useUpdateSettingMutation();
  const [baseLink, setBaseLink] = useState("");
  const [addNewQuestionModalActive, setAddNewQuestionModalActive] =
    useState(false);

  const [addNewQuestion, addNewQuestionResp] = useAddNewQuestionMutation();
  const [updateFields, updateFieldsResp] = useUpdateUserFieldsMutation();
  // const [updateImage, updateImageResp] = useUpdateOfferImageMutation()
  const [selectedImageTag, setSelectedImageTag] = useState("");
  const [toggleImage, setToggleImage] = useState({
    personality: false,
    interest: false,
    offer: false,
    Expertise: false,
  });

  const imageUploadRef = useRef();
  const [tagImage, setTagImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [tagText, setTagText] = useState("");
  const [modalData, setModalData] = useState(initialState);
  const dispatch = useDispatch();

  const handleClose = () => setModalActive(false);
  const handleTagModal = (text) => {
    console.log(text);
    setTagModalActive(true);
    setSelectedImageTag(text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const reqBody = { ...adminModalDetails };
    updateFields({ id: user.id, fields: reqBody }).then((res) => {
      handleClose();
      if (res.error) {
        return console.log(res.error);
      }
      const {
        firstName,
        lastName,
        _id,
        amountToPay,
        credits,
        role,
        email,
        phone,
      } = res.data.data.user;
      let timeZone = "";
      if (res.data.data.userdetails) {
        timeZone = res.data.data.userdetails.timeZone;
      }
      dispatch(
        updateUserDetails({
          firstName,
          lastName,
          id: _id,
          amountToPay,
          credits,
          role,
          timeZone: timeZone ? timeZone : "",
          email,
          phone,
        })
      );
    });
  };

  const fetchSettings = () => {
    getSettings().then((res) => {
      if (res.error) {
        console.log("settings fetch err", res.error);
        return;
      }
      console.log("settings", res.data);
      setBaseLink(res.data.data.baseLink);
      if (res.data.data.setting === null) return;
      setSettingsData(res.data.data.setting);
    });
  };

  const onRemoveTextImageTag = (item, key, idx) => {
    // console.log(item)
    // console.log(key)
    // console.log(idx)
    let updatedField = settingsData[key].filter((item, i) => i !== idx);
    let updatedSetting = {
      [key]: updatedField,
    };
    // console.log(updatedSetting)
    updateAndFetchsettings(updatedSetting);
  };

  const onRemoveFilter = (item, key, idx) => {
    if (key === undefined || item === undefined) return;
    // let updatedField = settingsData[key].filter(text => text !== item)
    let updatedField = settingsData[key].filter((text, i) => i !== idx);
    let updatedSetting = {
      [key]: updatedField,
    };
    updateAndFetchsettings(updatedSetting);
  };

  const onRemoveSessionTag = (item, key, idx) => {
    let updatedSessionTag = { ...settingsData.sessionTags };
    // let updatedField = settingsData.sessionTags[key].filter(text => text !== item)
    let updatedField = settingsData.sessionTags[key].filter(
      (text, i) => i !== idx
    );
    updatedSessionTag[key] = updatedField;

    const updatedSetting = { sessionTags: updatedSessionTag };
    updateAndFetchsettings(updatedSetting);
  };

  const handleAddTag = (text, key) => {
    let tempSettings = { ...settingsData };
    let updatedSetting = {
      [key]: [...tempSettings[key], text],
    };
    updateAndFetchsettings(updatedSetting);
  };

  const handleSessionAddTag = (text, key) => {
    let tempSettings = { ...settingsData };
    let updatedSessionTag = {
      ...tempSettings.sessionTags,
      [key]: [...tempSettings.sessionTags[key], text],
    };
    const updatedSetting = { sessionTags: updatedSessionTag };
    updateAndFetchsettings(updatedSetting);
  };

  const updateAndFetchsettings = (updatedSetting) => {
    setSaveLoading(true);
    updateSetting(updatedSetting)
      .then((res) => {
        setSaveLoading(false);
        // console.log('updated', res.data);
        setSettingsData(res.data.data.setting);
      })
      .catch((err) => {
        setSaveLoading(false);
        console.log("err", err);
      });
  };

  const submitImageModal = (e) => {
    e.preventDefault();
    // console.log(tagText)
    // console.log(tagImage)
    // console.log(selectedImageTag)

    const formData = new FormData();
    formData.append("text", tagText);
    formData.append("image", tagImage);

    let append = "";
    if (selectedImageTag === "Expertise") {
      append = "addservicespecialisation";
    } else if (selectedImageTag === "personality") {
      append = "addpersonality";
    } else if (selectedImageTag === "interest") {
      append = "addinterest";
    } else if (selectedImageTag === "offer") {
      append = "addimage";
      formData.append("link", tagText);
      formData.append("offer", tagImage);
      formData.delete("text");
      formData.delete("image");
    }

    // console.log(append)

    if (append === "") return;
    setSaveLoading(true);
    axios
      .patch(`${BASE_URL}api/user/setting/${append}`, formData, {
        headers: getAuthHeader(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      })
      .then((res) => {
        console.log(res);
        setTagImage(null);
        setTagText("");
        setSelectedImageTag("");
        setImageName("");
        setTagModalActive(false);
        fetchSettings();
        setSaveLoading(false);
      })
      .catch((err) => {
        console.log("err", err);
        alert("Could not upload image");
        setSaveLoading(false);
      });
  };

  const handleImageUpload = () => {
    inputRef.current.click();
  };

  const onImageChange = (e) => {
    //   console.log(e.target.files[0])
    setImage(e.target.files[0]);
    const formData = new FormData();
    formData.append("offer", e.target.files[0]);
    // updateImage(formData)
    //    .then(res => {
    //       console.log(res)
    //       setSettingsData(res.data.data.setting)
    //    })
    axios
      .patch(`${BASE_URL}api/user/setting/addimage`, formData)
      .then((res) => {
        // console.log(res)
        setImage(null);
        fetchSettings();
      });
  };

  const onRemoveImage = (itemToRemove) => {
    console.log(itemToRemove);
    let updatedField = settingsData.offerImages.filter(
      (item) => item._id !== itemToRemove._id
    );
    let updatedSetting = {
      offerImages: updatedField,
    };
    console.log(updatedSetting);
    updateAndFetchsettings(updatedSetting);
  };
  const onRemoveService = (itemToRemove) => {
    let updated = settingsData.servicesAndSpecialization.filter(
      (item) => item._id !== itemToRemove._id
    );
    let updatedSetting = {
      servicesAndSpecialization: updated,
    };
    updateAndFetchsettings(updatedSetting);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const onAddService = (val) => {
    console.log(val);
    let tempSettings = { ...settingsData };
    let updatedSetting = {
      servicesAndSpecialization: [
        ...tempSettings["servicesAndSpecialization"],
        {
          service: val,
          specialization: [],
        },
      ],
    };

    updateAndFetchsettings(updatedSetting);
  };
  const handleAddSpecialization = (text, key) => {
    let tempSettings = { ...settingsData };

    let updated = servicesAndSpecialization.map((serv) => {
      if (serv.service === key) {
        return {
          ...serv,
          specialization: [...serv.specialization, text],
        };
      } else {
        return { ...serv };
      }
    });

    let updatedSetting = {
      servicesAndSpecialization: updated,
    };
    updateAndFetchsettings(updatedSetting);
    // console.log('updatedSetting', updatedSetting)
  };

  const onRemoveSpecialization = (text, service) => {
    // console.log(text);
    // console.log(service);
    let updated = servicesAndSpecialization.map((serv) => {
      if (serv.service === service) {
        let updatedSpec = serv.specialization.filter((spec) => spec !== text);
        return { ...serv, specialization: updatedSpec };
      } else {
        return { ...serv };
      }
    });
    let updatedSetting = {
      servicesAndSpecialization: updated,
    };
    updateAndFetchsettings(updatedSetting);
  };

  const onToggle = (key, value) => {
    setToggleImage((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const onAddCode = () => {
    setAddCodeModalActive(true);
    setSubModalData({ ...subModalData, editing: false });
  };
  const handleCodeSubmit = (e) => {
    e.preventDefault();

    if (subModalData.editing === true) {
      let updated = subscriptionCode.map((subscription) => {
        if (subscription._id === subModalData._id) {
          return { ...subModalData };
        } else {
          return { ...subscription };
        }
      });
      let updatedSetting = {
        subscriptionCode: updated,
      };
      // console.log('updatedSetting', updatedSetting);
      updateAndFetchsettings(updatedSetting);
      setAddCodeModalActive(false);
      setSubModalData(subModalInitialState);
    } else {
      let updated = [
        ...subscriptionCode,
        {
          code: subModalData.code,
          expiry: subModalData.expiry,
          tests: [],
        },
      ];
      let updatedSetting = {
        subscriptionCode: updated,
      };
      // console.log('updatedSetting', updatedSetting);
      updateAndFetchsettings(updatedSetting);
      setAddCodeModalActive(false);
      setSubModalData(subModalInitialState);
    }
  };

  useEffect(() => {
    setUpdatedSubscriptionData(selectedSubscriptionData);
  }, [selectedSubscriptionData]);

  useEffect(() => {
    if (allTestData.length === 0) return;
    const regex2 = new RegExp(`${searchedTest.toLowerCase()}`, "i");
    let tempdata = allTestData.filter((test) => test.value.match(regex2));
    setFilteredTests(tempdata);
  }, [searchedTest, allTestData]);

  const fetchTests = () => {
    axios.get(`${BASE_URL}api/test`).then((res) => {
      if (res.data.data.test) {
        let arr = res.data.data.test.map((item) => {
          return {
            _id: item._id,
            value: item.testName,
          };
        });
        setAllTestData(arr);
        setFilteredTests(arr);
      }
    });
  };

  useEffect(() => {
    fetchTests();
  }, []);
  const handleAddTest = (code) => {
    console.log(code);
    setSelectedSubscriptionData(code);
    setAddTestModalActive(true);
  };

  const handleADdTestSubmit = (e) => {
    e.preventDefault();
    console.log(updatedSubscriptionData);
    let updated = subscriptionCode.map((sub) => {
      if (sub._id === updatedSubscriptionData._id) {
        return { ...updatedSubscriptionData };
      } else {
        return { ...sub };
      }
    });
    let updatedSetting = {
      subscriptionCode: updated,
    };
    console.log("updatedSetting", updatedSetting);
    updateAndFetchsettings(updatedSetting);
    setAddTestModalActive(false);
    setSelectedSubscriptionData({
      code: "",
      expiry: "",
      tests: [],
    });
  };
  const onRemoveCodeTest = (text, code) => {
    let updated = subscriptionCode.map((subscription) => {
      if (subscription.code === code) {
        let updatedSub = subscription.tests.filter((test) => test !== text);
        return { ...subscription, tests: updatedSub };
      } else {
        return { ...subscription };
      }
    });
    let updatedSetting = {
      subscriptionCode: updated,
    };
    console.log(updatedSetting);
    updateAndFetchsettings(updatedSetting);
  };
  const onRemoveCode = (code) => {
    let updated = settingsData.subscriptionCode.filter(
      (item) => item._id !== code._id
    );
    let updatedSetting = {
      subscriptionCode: updated,
    };
    // console.log(updatedSetting);
    updateAndFetchsettings(updatedSetting);
  };
  const onEditCode = (code) => {
    setSubModalData({
      ...code,
      editing: true,
    });
    setAddCodeModalActive(true);
  };

  const handleTestChange = (item) => {
    if (updatedSubscriptionData.tests.includes(item._id)) {
      let updated = updatedSubscriptionData.tests.filter(
        (test) => test !== item._id
      );
      setUpdatedSubscriptionData((prev) => ({
        ...prev,
        tests: updated,
      }));
    } else {
      setUpdatedSubscriptionData((prev) => ({
        ...prev,
        tests: [...updatedSubscriptionData.tests, item._id],
      }));
    }
  };

  const changeTab = (num) => {
    navigate(`/settings?tab=${num}`);
    setActiveTab(num);
  };

  const submitNewQuestion = (e) => {
    e.preventDefault();
    if(organization?.customFields?.length === 5) return alert('Only 5 fields are allowed')
    const { option1, option2, option3, option4 } = newQuestion.values;
    const body = {
      orgId: user.associatedOrg,
      name: newQuestion.text,
      dataType: newQuestion.type,
      values: [option1, option2, option3, option4],
    };
    addNewQuestion(body).then((res) => {
      if (res.error) {
        console.log(res.error);
        return;
      }
      window.location.reload()
      console.log("res", res);
    });
  };

  useEffect(() => {
    const activeTab = searchParams.get("tab");
  }, [searchParams.get("tab")]);
  // if (Object.keys(settingsData).length === 0) return <></>
  const {
    classes,
    servicesAndSpecialization,
    Expertise,
    sessionTags,
    leadStatus,
    tutorStatus,
    offerImages,
    subscriptionCode,
    personality,
    interest,
  } = settingsData;

  const handlePause = (item) => {
    let updated = settingsData.subscriptionCode.map((subscription) => {
      if (item._id === subscription._id) {
        return { ...item, pause: !item.pause };
      } else {
        return { ...subscription };
      }
    });
    let updatedSetting = {
      subscriptionCode: updated,
    };
    // console.log(updatedSetting);
    updateAndFetchsettings(updatedSetting);
  };

  // console.log('subscriptionCode', settingsData.subscriptionCode);

  return (
    <>
      <div className="lg:ml-pageLeft bg-lightWhite min-h-screen px-8 pt-[50px] pb-[50px]">
        <div className="flex justify-between items-center mb-[45px]">
          <div className={styles.tabsContainer}>
            {tabs.map((item, idx) => {
              return (
                <div
                  className={`${styles.tab} ${
                    activeTab === idx + 1 ? styles.selectedTab : ""
                  }`}
                  onClick={() => changeTab(idx + 1)}
                >
                  <img src={item.Icon} />
                  <p> {item.name} </p>
                  {activeTab === idx + 1 && (
                    <img src={ActiveTab} className={styles.activeBgIcon} />
                  )}
                </div>
              );
            })}
          </div>
          {/* <div>
                  <p className='font-bold text-4xl mb-[54px] text-[#25335A]'> Settings </p>
                  <div className='text-base'>
                     <div className='flex items-center mb-4'>
                        <p className='opacity-60  mr-[15px]'> Full Name:</p>
                        <p className='font-bold'> {user.firstName} {user.lastName} </p>
                     </div>
                     <div className='flex items-center mb-4'>
                        <p className='opacity-60 mr-[23px]'>  Email:</p>
                        <p className='font-bold'> {user.email} </p>
                     </div>
                     <div className='flex items-center mb-4'>
                        <p className='opacity-60 mr-[15px]'>Phone:</p>
                        <p className='font-bold'> {user.phone} </p>
                     </div>
                  </div>
               </div> */}

          {/* <PrimaryButton
                  className='w-[174px] px-4'
                  onClick={() => setModalActive(true)}
                  children={
                     <div className='flex items-center justify-center'>
                        <p className='mr-3 text-lf font-semibold whitespace-nowrap text-[18px]'>
                           Edit Details
                        </p>
                        <img src={EditIcon} />
                     </div>} /> */}
        </div>
        {activeTab === 1 || !activeTab ? (
          <div>
            <SettingsCard
              title="Lead Status Items"
              body={
                <div className="flex items-center flex-wrap [&>*]:mb-[10px]">
                  <AddTag onAddTag={handleAddTag} keyName="leadStatus" />
                  <FilterItems
                    onlyItems={true}
                    isString={true}
                    items={leadStatus ? leadStatus : []}
                    keyName="leadStatus"
                    onRemoveFilter={onRemoveFilter}
                    className="pt-1 pb-1 mr-15"
                  />
                </div>
              }
            />

            <SettingsCard
              title="Tutor Status Items"
              body={
                <div className="flex items-center flex-wrap [&>*]:mb-[10px]">
                  <AddTag onAddTag={handleAddTag} keyName="tutorStatus" />
                  <FilterItems
                    onlyItems={true}
                    isString={true}
                    items={tutorStatus ? tutorStatus : []}
                    keyName="tutorStatus"
                    onRemoveFilter={onRemoveFilter}
                    className="pt-1 pb-1 mr-15"
                  />
                </div>
              }
            />
            <SettingsCard
              title="Manage Subscription Codes"
              body={
                <div className="max-h-[360px] overflow-auto scrollbar-content scrollbar-vertical">
                  {subscriptionCode !== undefined &&
                    subscriptionCode.map((subscription, i) => {
                      return (
                        <div key={i}>
                          <div className="flex items-center justify-between pr-8">
                            <p className="font-bold text-primary-dark mb-4">
                              {subscription.code}
                              <span className="inline-block ml-4 font-normal">
                                {subscription.expiry} Weeks
                              </span>
                            </p>
                            <div className="flex items-center gap-x-4">
                              {subscription.pause === false ? (
                                <img
                                  src={PlayIcon}
                                  className="w-4 cursor-pointer"
                                  alt="play"
                                  onClick={() => handlePause(subscription)}
                                />
                              ) : (
                                <img
                                  src={PauseIcon}
                                  className="w-4 cursor-pointer"
                                  alt="play"
                                  onClick={() => handlePause(subscription)}
                                />
                              )}
                              <div
                                className="w-5 h-5 flex items-center justify-center bg-[#E3E3E3] rounded-full cursor-pointer"
                                onClick={() => onEditCode(subscription)}
                              >
                                <img
                                  src={EditBlueIcon}
                                  className="w-4"
                                  alt="edit"
                                />
                              </div>
                              <div
                                className="w-5 h-5 flex items-center justify-center bg-[#E3E3E3] rounded-full cursor-pointer"
                                onClick={() => onRemoveCode(subscription)}
                              >
                                <img
                                  src={DeleteIcon}
                                  className="w-4"
                                  alt="delete"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center flex-wrap [&>*]:mb-[18px]">
                            <AddTag
                              openModal={true}
                              onAddTag={(code) => handleAddTest(subscription)}
                              keyName={subscription.code}
                              text="Add Tests"
                            />
                            <FilterItems
                              isString={true}
                              onlyItems={true}
                              keyName={subscription.code}
                              items={subscription.tests}
                              fetchData={true}
                              api="test"
                              onRemoveFilter={onRemoveCodeTest}
                              className="pt-1 pb-1 mr-15"
                            />
                          </div>
                        </div>
                      );
                    })}
                  <AddTag
                    children="Add Code"
                    className="pl-3 pr-3 pt-1.4 pb-1.5 mt-5 bg-primary text-white"
                    text="Add Code"
                    hideIcon={true}
                    openModal={true}
                    onAddTag={onAddCode}
                  />
                </div>
              }
            />

            <SettingsCard
              title="Session Tags"
              titleClassName="text-[21px] mb-[15px]"
              body={
                <div>
                  {sessionTags !== undefined &&
                    Object.keys(sessionTags).map((tag, i) => {
                      return (
                        <div key={i}>
                          <p className="font-bold text-primary-dark mb-[25px]">
                            {getSessionTagName(Object.keys(sessionTags)[i])}
                          </p>
                          <div className="flex items-center flex-wrap [&>*]:mb-[10px]">
                            <AddTag
                              onAddTag={handleSessionAddTag}
                              keyName={Object.keys(sessionTags)[i]}
                            />
                            <FilterItems
                              isString={true}
                              onlyItems={true}
                              keyName={Object.keys(sessionTags)[i]}
                              items={sessionTags[tag]}
                              onRemoveFilter={onRemoveSessionTag}
                              className="pt-1 pb-1 mr-15"
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              }
            />

            <SettingsCard
              title="Expertise"
              toggle={{ value: toggleImage.Expertise, key: "Expertise" }}
              onToggle={onToggle}
              body={
                <div className="flex items-center flex-wrap [&>*]:mb-[10px]">
                  <AddTag
                    keyName="Expertise"
                    openModal={true}
                    onAddTag={() => handleTagModal("Expertise")}
                  />
                  <FilterItems
                    isString={false}
                    onlyItems={true}
                    image={toggleImage.Expertise}
                    items={
                      sessionTags !== undefined
                        ? Expertise.map((item) => item)
                        : []
                    }
                    keyName="Expertise"
                    baseLink={baseLink}
                    onRemoveFilter={onRemoveTextImageTag}
                    className="pt-1 pb-1 mr-15"
                  />
                </div>
              }
            />

            <SettingsCard
              title="Service and specialization"
              className=""
              titleClassName="text-[21px] mb-[15px]"
              body={
                <div className="max-h-[360px] overflow-auto scrollbar-content scrollbar-vertical">
                  {servicesAndSpecialization !== undefined &&
                    servicesAndSpecialization.map((service, i) => {
                      return (
                        <div key={i}>
                          <div className="flex items-center justify-between pr-8">
                            <p className="font-bold text-primary-dark mb-4">
                              {service.service}
                            </p>
                            <div
                              className="w-5 h-5 flex items-center justify-center bg-[#E3E3E3] rounded-full cursor-pointer"
                              onClick={() => onRemoveService(service)}
                            >
                              <img
                                src={DeleteIcon}
                                className="w-4"
                                alt="delete"
                              />
                            </div>
                          </div>
                          <div className="flex items-center flex-wrap [&>*]:mb-[18px]">
                            <AddTag
                              onAddTag={handleAddSpecialization}
                              keyName={service.service}
                              text="Add Specialization"
                            />
                            <FilterItems
                              isString={true}
                              onlyItems={true}
                              keyName={service.service}
                              items={service.specialization}
                              onRemoveFilter={onRemoveSpecialization}
                              className="pt-1 pb-1 mr-15"
                            />
                          </div>
                        </div>
                      );
                    })}
                  <AddTag
                    children="Add service"
                    className="pl-3 pr-3 pt-1.4 pb-1.5 mt-5 bg-primary text-white"
                    text="Add service"
                    hideIcon={true}
                    onAddTag={onAddService}
                  />
                </div>
              }
            />

            <SettingsCard
              title="Personality"
              toggle={{ value: toggleImage.personality, key: "personality" }}
              onToggle={onToggle}
              body={
                <div className="flex items-center flex-wrap [&>*]:mb-[10px]">
                  <AddTag
                    keyName="personality"
                    openModal={true}
                    onAddTag={() => handleTagModal("personality")}
                  />
                  <FilterItems
                    isString={false}
                    onlyItems={true}
                    image={toggleImage.personality}
                    items={
                      personality !== undefined
                        ? personality.map((item) => item)
                        : []
                    }
                    keyName="personality"
                    baseLink={baseLink}
                    onRemoveFilter={onRemoveTextImageTag}
                    className="pt-1 pb-1 mr-15"
                  />
                </div>
              }
            />

            <SettingsCard
              title="Interest"
              toggle={{ value: toggleImage.interest, key: "interest" }}
              onToggle={onToggle}
              body={
                <div className="flex items-center flex-wrap [&>*]:mb-[10px]">
                  <AddTag
                    keyName="interest"
                    openModal={true}
                    onAddTag={() => handleTagModal("interest")}
                  />
                  <FilterItems
                    isString={false}
                    onlyItems={true}
                    image={toggleImage.interest}
                    items={
                      interest !== undefined ? interest.map((item) => item) : []
                    }
                    keyName="interest"
                    baseLink={baseLink}
                    onRemoveFilter={onRemoveTextImageTag}
                    className="pt-1 pb-1 mr-15"
                  />
                </div>
              }
            />

            <SettingsCard
              title="Subjects"
              body={
                <div className="flex items-center flex-wrap [&>*]:mb-[10px]">
                  <AddTag onAddTag={handleAddTag} keyName="classes" />
                  <FilterItems
                    isString={true}
                    onlyItems={true}
                    keyName="classes"
                    items={classes ? classes : []}
                    baseLink={baseLink}
                    onRemoveFilter={onRemoveFilter}
                    className="pt-1 pb-1 mr-15"
                  />
                </div>
              }
            />

            <SettingsCard
              title="Images in Offer Slide"
              toggle={{ value: toggleImage.offer, key: "offer" }}
              onToggle={onToggle}
              body={
                <div className="flex items-center flex-wrap [&>*]:mb-[10px]">
                  <AddTag
                    openModal={true}
                    onAddTag={() => handleTagModal("offer")}
                  />
                  {/* <input type='file' ref={inputRef} className='hidden' accept="image/*"
                           onChange={e => onImageChange(e)} /> */}
                  <FilterItems
                    isString={false}
                    image={toggleImage.offer}
                    onlyItems={true}
                    sliceText={true}
                    items={
                      offerImages !== undefined
                        ? offerImages.map((item) => ({
                            ...item,
                            text: item.image,
                          }))
                        : []
                    }
                    baseLink={baseLink}
                    onRemoveFilter={onRemoveImage}
                    // onRemoveFilter={onRemoveFilter}
                    className="pt-1 pb-1 mr-15"
                  />
                </div>
              }
            />
          </div>
        ) : (
          <></>
        )}
        {activeTab === 3 && (
          <SignupTab
            setAddNewQuestionModalActive={setAddNewQuestionModalActive}
          />
        )}
      </div>
      {modalActive && (
        <Modal
          classname={"max-w-840 mx-auto"}
          title="Edit Details"
          titleClassName="mb-[18px]"
          cancelBtn={true}
          cancelBtnClassName="w-140"
          primaryBtn={{
            text: "Save",
            className: "w-140",
            form: "settings-form",
            type: "submit",
          }}
          handleClose={handleClose}
          body={
            <form id="settings-form" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2  gap-x-2 md:gap-x-3 gap-y-2 gap-y-4 mb-5">
                <div>
                  <InputField
                    label="Admin First Name"
                    labelClassname="ml-4 mb-0.5"
                    placeholder="Admin Name"
                    inputContainerClassName="px-5 bg-primary-50 border-0"
                    inputClassName="bg-transparent"
                    parentClassName="w-full mr-4"
                    type="text"
                    value={adminModalDetails.firstName}
                    isRequired={true}
                    onChange={(e) =>
                      setAdminModalDetails({
                        ...adminModalDetails,
                        firstName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <InputField
                    label="Admin Last Name"
                    labelClassname="ml-4 mb-0.5"
                    placeholder="Admin Name"
                    inputContainerClassName="px-5 bg-primary-50 border-0"
                    inputClassName="bg-transparent"
                    parentClassName="w-full mr-4"
                    type="text"
                    value={adminModalDetails.lastName}
                    isRequired={true}
                    onChange={(e) =>
                      setAdminModalDetails({
                        ...adminModalDetails,
                        lastName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <InputField
                    label="Phone No."
                    labelClassname="ml-4 mb-0.5"
                    isRequired={true}
                    placeholder="+91 Phone Number"
                    inputContainerClassName="px-5 bg-primary-50 border-0"
                    inputClassName="bg-transparent"
                    parentClassName="w-full mr-4"
                    type="text"
                    value={adminModalDetails.phone}
                    onChange={(e) =>
                      setAdminModalDetails({
                        ...adminModalDetails,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <InputField
                    label="Email Address"
                    labelClassname="ml-4 mb-0.5"
                    isRequired={true}
                    placeholder="Email Address"
                    type="email"
                    inputContainerClassName="px-5 bg-primary-50 border-0"
                    inputClassName="bg-transparent"
                    parentClassName="w-full mr-4"
                    value={adminModalDetails.email}
                    onChange={(e) =>
                      setAdminModalDetails({
                        ...adminModalDetails,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </form>
          }
        />
      )}
      {addCodeModalActive && (
        <Modal
          classname={"max-w-[700px] mx-auto"}
          title="Add / Edit Subscription Code"
          titleClassName="mb-[18px]"
          cancelBtn={false}
          cancelBtnClassName="w-0"
          primaryBtn={{
            text: "Submit",
            className: "w-140 pl-3 pr-3 ml-0 my-4",
            form: "settings-form",
            type: "submit",
            loading: saveLoading,
          }}
          handleClose={() => {
            setAddCodeModalActive(false);
            setSubModalData(subModalInitialState);
          }}
          body={
            <form id="settings-form" onSubmit={handleCodeSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2  gap-x-2 md:gap-x-3 gap-y-2 gap-y-4 mb-5">
                <div>
                  <InputField
                    label="Subscription Code"
                    labelClassname="ml-4 mb-0.5"
                    placeholder="Sample Code"
                    inputContainerClassName="px-5 bg-primary-50 border-0"
                    inputClassName="bg-transparent"
                    parentClassName="w-full mr-4"
                    type="text"
                    value={subModalData.code}
                    isRequired={true}
                    onChange={(e) =>
                      setSubModalData({ ...subModalData, code: e.target.value })
                    }
                  />
                </div>
                <div>
                  <InputField
                    label="Duration (in weeks)"
                    labelClassname="ml-4 mb-0.5"
                    isRequired={true}
                    placeholder=""
                    inputContainerClassName="px-5 bg-primary-50 border-0"
                    inputClassName="bg-transparent"
                    parentClassName="w-full mr-4"
                    type="text"
                    value={subModalData.expiry}
                    onChange={(e) =>
                      setSubModalData({
                        ...subModalData,
                        expiry: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </form>
          }
        />
      )}
      {addTestModalActive && (
        <Modal
          classname={"max-w-[700px] mx-auto"}
          title="Add Tests"
          titleClassName="mb-[18px]"
          cancelBtn={false}
          cancelBtnClassName="w-0"
          primaryBtn={{
            text: "Submit",
            className: "w-140 pl-3 pr-3 ml-0 my-4",
            form: "settings-form",
            type: "submit",
            loading: saveLoading,
          }}
          handleClose={() => {
            setAddTestModalActive(false);
          }}
          body={
            <form id="settings-form" onSubmit={handleADdTestSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2  gap-x-2 md:gap-x-3 gap-y-2 gap-y-4 mb-5">
                <div>
                  <InputSearch
                    labelClassname="hidden"
                    placeholder="Type Test Name"
                    parentClassName="w-full  mb-10"
                    inputContainerClassName="bg-[#F3F5F7] border-0 pt-3.5 pb-3.5"
                    inputClassName="bg-[#F3F5F7]"
                    type="text"
                    value={searchedTest}
                    checkbox={{
                      visible: true,
                      name: "test",
                      match: updatedSubscriptionData.tests,
                    }}
                    onChange={(e) => setSearchedTest(e.target.value)}
                    optionData={filteredTests}
                    onOptionClick={(item) => {
                      handleTestChange(item);
                      // setStudent(item.value);
                      // handleStudentsChange(item)
                      // setCurrentToEdit({ ...currentToEdit, students: [... item._id] });
                    }}
                  />
                </div>
              </div>
            </form>
          }
        />
      )}
      {tagModalActive && (
        <Modal
          classname={"max-w-[540px] mx-auto"}
          title=""
          titleClassName="mb-[18px]"
          cancelBtn={true}
          cancelBtnClassName="w-140 hidden"
          primaryBtn={{
            text: "Save",
            className: `w-140 ml-0 bg-primaryOrange mt-2 ${
              tagText.trim().length < 1 || tagImage === null
                ? "pointer-events-none opacity-60"
                : ""
            } `,
            form: "settings-form",
            type: "submit",
            loading: saveLoading,
          }}
          handleClose={() => setTagModalActive(false)}
          body={
            <form id="settings-form" onSubmit={submitImageModal}>
              <div className="flex flex-col items-start mb-5">
                <InputField
                  label="Text"
                  labelClassname="ml-4 mb-0.5"
                  placeholder="Text"
                  inputContainerClassName="px-5 pt-3 pb-3 bg-primary-50 border-0"
                  inputClassName="bg-transparent"
                  parentClassName="w-full mr-4 mb-3"
                  type="text"
                  value={tagText}
                  isRequired={true}
                  onChange={(e) => setTagText(e.target.value)}
                />
                <input
                  type="file"
                  accept="/image"
                  onChange={(e) => {
                    setTagImage(e.target.files[0]);
                    setImageName(e.target.files[0].name);
                  }}
                  className="hidden "
                  ref={imageUploadRef}
                />

                <PrimaryButton
                  children="Upload image"
                  className="mx-auto pt-2.5 pb-2.5 pl-4 pr-4"
                  // disabled={`${tagImage === null ? true : false}`}
                  onClick={() => imageUploadRef.current.click()}
                />
                <p className="text-center w-full">
                  {imageName !== "" ? imageName : ""}
                </p>
              </div>
            </form>
          }
        />
      )}
      {addNewQuestionModalActive && (
        <Modal
          classname={"max-w-[700px] mx-auto"}
          title="Add Question"
          titleClassName="mb-[18px]"
          cancelBtn={true}
          cancelBtnClassName="w-140"
          primaryBtn={{
            text: "Add",
            className: "w-140",
            form: "add-question-form",
            type: "submit",
          }}
          handleClose={() => setAddNewQuestionModalActive(false)}
          body={
            <form id="add-question-form" onSubmit={submitNewQuestion}>
              <AddNewQuestion
                setNewQuestion={setNewQuestion}
                newQuestion={newQuestion}
              />
            </form>
          }
        />
      )}
    </>
  );
}
