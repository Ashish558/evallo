import React, { useEffect, useRef, useState } from "react";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import EditIcon from "../../assets/icons/edit-white.svg";
import AddIcon from "../../assets/Settings/add-white.svg";
import ActiveTab from "../../assets/icons/active-tab.svg";
import SettingsCard from "../../components/SettingsCard/SettingsCard";
import AddTag from "../../components/Buttons/AddTag";
import FilterItems from "../../components/FilterItems/filterItems";
import InputField from "../../components/InputField/inputField";
import Modal from "../../components/Modal/Modal";
import questionMark from "../../assets/images/Vector (6).svg";
import ToggleBar from "../../components/SettingsCard/ToogleBar";
import down from "../../assets/YIcons/Vectordown2.svg";
import fileupload from "../../assets/icons/basil_file-upload-outline (2).svg";
import { useLazyGetSettingsQuery } from "../../app/services/session";
import {
  useGetAllPermissionQuery,
  useUpdateOrgSettingMutation,
  useUpdatePermissionMutation,
  useUpdateOfferImageMutation,
  useUpdateSettingMutation,
} from "../../app/services/settings";
import { permissionsStaticData } from "./Tabs/staticData";
import { getSessionTagName } from "../../utils/utils";
import { BASE_URL, getAuthHeader } from "../../app/constants/constants";
import axios from "axios";
import DeleteIcon from "../../assets/icons/delete (2).svg";
import PauseIcon from "../../assets/icons/pause.svg";
import PlayIcon from "../../assets/icons/play.svg";
import AccountOverviewLogo from "../../assets/icons/account overview.svg";
import AccountOverviewLogo2 from "../../assets/icons/account-overview 2.svg";
import OrgDefaultLogo from "../../assets/icons/org-default.png";
import org1 from "../../assets/icons/org-default 2.svg";
import org2 from "../../assets/icons/org-default.svg";
import OrgDefaultLogo2 from "../../assets/icons/org default2.png";
import OrgDefaultContentLogo2 from "../../assets/icons/org-default-content.svg";
import OrgDefaultContentLogo from "../../assets/icons/org-default-content (2).svg";
import EditBlueIcon from "../../assets/YIcons/edit2.svg";
import InputSearch from "../../components/InputSearch/InputSearch";
import { useSelector, useDispatch } from "react-redux";
import { useUpdateUserFieldsMutation } from "../../app/services/users";
import { updateUserDetails } from "../../app/slices/user";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./styles.module.css";
import SignupTab from "./Tabs/Signup/signup";
import AddNewQuestion from "../Frames/AddNewQuestion/AddNewQuestion";
import { useAddNewQuestionMutation } from "../../app/services/admin";
import { updateOrganizationSettings } from "../../app/slices/organization";
import AccountOverview from "./Tabs/SuperAdminAccountOverview/SuperAdminAccountOverview";
import UserManagement from "./Tabs/UserManagement/UserManagement";
import OrgDefaultContent from "./Tabs/OrgDefaultContent/OrgDefaultContent";
import { timeZones } from "../../constants/constants";
import InputSelect from "../../components/InputSelect/InputSelect";
import ToogleBar from "../../components/SettingsCard/ToogleBar";
import moment from "moment-timezone";

const initialState = {
  name: "",
  phone: "",
  email: "",
};
const subModalInitialState = {
  code: "",
  expiry: "",
  tests:[],
  editing: false,
};

const initialTabs = [
  {
    Icon: AccountOverviewLogo2,
    Icon2: AccountOverviewLogo,
    name: "Account Overview",
    selected: true,
  },
  {
    Icon: AccountOverviewLogo2,
    Icon2: AccountOverviewLogo,
    name: "User Management",
    selected: false,
  },
  {
    Icon: org2,
    Icon2: org1,
    name: "Org Defaults",
    selected: false,
  },
  {
    Icon: OrgDefaultContentLogo2,
    Icon2: OrgDefaultContentLogo,
    name: "Org Default Content",
    selected: false,
  },
];
export default function SuperAdminSettings() {
  const { firstName, lastName } = useSelector((state) => state.user);
  const [modalActive, setModalActive] = useState(false);
  const [tagModalActive, setTagModalActive] = useState(false);
  const [addCodeModalActive, setAddCodeModalActive] = useState(false);
  const [subModalData, setSubModalData] = useState(subModalInitialState);
  const [company,setCompany]=useState("Company Name")
  const timeZones = moment.tz.names(); // String[]

  const [addTestModalActive, setAddTestModalActive] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [fetchS, setFetchS] = useState(false);
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
  const [activeTab, setActiveTab] = useState(1);
  const [adminModalDetails, setAdminModalDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [selectedSubscriptionData, setSelectedSubscriptionData] = useState({
    code: "",
    expiry: "",
    tests: [],
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
  const { awsLink } = useSelector((state) => state.user);

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
  const [fetchedPermissions, setThePermission] = useState([]);
  const dispatch = useDispatch();
  const [selectedtest, setselectedtest] = useState([])


  console.log("for company name",organization)

  const handlePermissionOption = (value, key) => {
    let nvalue = value;
    if (!isNaN(Number(value))) {
      nvalue = Number(value);
    }
    const arr = fetchedPermissions.map((per) => {
      if (per._id === key) {
        return { ...per, choosedValue: nvalue };
      }
      return { ...per };
    });

    setThePermission(arr);
    let updatedSetting = {
      permissions: arr,
    };

    updateAndFetchsettings(updatedSetting);
  };
  const togglePermissions = (key, value) => {
    const arr = fetchedPermissions?.map((per) => {
      if (per._id === key) {
        return { ...per, choosedValue: !per.choosedValue };
      }
      return { ...per };
    });

    setThePermission(arr);

    let updatedSetting = {
      permissions: arr,
    };
    updateAndFetchsettings(updatedSetting);
  };
  const renderColoredText = (text) => {
    const keywords = [
      "students",
      "parents",
      "admins",
      "tutors",
      "parent",
      "student",
      "tutor",
      "admin",
      "&",
      "/",
      "tutors / parents",
      "tutors & parents",
      "parents / students",
      "parents & students",
      "students / parents",
      "students or parents",
      "students and parents",
      "students & parents",
    ];
    const parts = text.split(new RegExp(`(${keywords.join("|")})`, "i"));

    return (
      <>
        {parts.map((part, index) => {
          if (keywords.includes(part.toLowerCase())) {
            return (
              <span key={index} style={{ color: "#FFA28D" }}>
                {part}
              </span>
            );
          }
          return <span style={{ color: "#24A3D9" }}>{part}</span>;
        })}
      </>
    );
  };

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
      console.log("settings  new", res.data);
      // setBaseLink(res.data.data.baseLink);
      if (res.data.data.setting === null) return;
      setSettingsData(res.data.data.setting);
      setThePermission(res.data.data.setting.permissions);
    });
  };

  // console.log("organization", organization);
  const onRemoveTextImageTag = (item, key, idx) => {
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
    const setting = {
      ...settingsData,
      ...updatedSetting,
    };
    const body = {
      setting,
    };
    console.log("body set", body);
    // return;
    setSaveLoading(true);
    updateSetting(updatedSetting)
      .then((res) => {
        setSaveLoading(false);
        console.log("res", res);
        setSettingsData(res.data.data.setting);
        dispatch(updateOrganizationSettings(res.data.data.setting));
        // console.log('updated', res.data.data.setting.settings);
      })
      .catch((err) => {
        setSaveLoading(false);
        console.log("err", err);
      });
  };
  const { role: persona } = useSelector((state) => state.user);
  /* new */
  const [addServiceModalActive, setAddServiceModalActive] = useState(false);
  const [addSessionModalActive, setAddSessionModalActive] = useState(false);
  const subModalInitialServiceState = {
    service: "",
    specialization: [],
    editing: false,
  };
  const subModalInitialSessionState = {
    heading: "",
    items: [],
    editing: false,
  };

  const [subModalServiceData, setSubModalServiceData] = useState(
    subModalInitialServiceState
  );
  const [subModalSessionData, setSubModalSessionData] = useState(
    subModalInitialSessionState
  );
  const [selectedSessionData, setSelectedSessionData] = useState({
    heading: "",
    items: [],
    // editing: false,
  });

  const [updatedSessionData, setUpdatedSessionData] = useState({
    heading: "",
    items: [],
    //editing: false,
  });
  const [selectedServiceData, setSelectedServiceData] = useState({
    service: "",
    specialization: [],
    // editing: false,
  });

  const [updatedServiceData, setUpdatedServiceData] = useState({
    service: "",
    specialization: [],
    // editing: false,
  });

  useEffect(() => {
    setUpdatedSessionData(selectedSessionData);
  }, [selectedSessionData]);
  useEffect(() => {
    setUpdatedServiceData(selectedServiceData);
  }, [selectedServiceData]);



  const [addServices2, setServices2] = useState({
    service: "",
    specialization: [],
  });
  const [addSession2, setSession2] = useState({ heading: "",
  items: [],});
 
  const [addOne, setOne] = useState(false);
  const [loading2, setLoading2] = useState(false);
  useEffect(() => {
    if (settingsData && settingsData?.offerImages) {
      let arr = [];
      for (let i = 0; i < 4 - settingsData?.offerImages.length; i++) {
        arr.push({
          link: "",
          image: null,
          buttonText: "",
        });
      }
      setOffersNew([...arr]);
    }
  }, [settingsData?.offerImages, settingsData]);

  const onEditService = (code) => {
    setSubModalServiceData({
      ...code,

      editing: true,
    });
    setSelectedServiceData(code);
    setAddServiceModalActive(true);
  };
  const onEditSession = (code) => {
    console.log("session", code);
    setSubModalSessionData({
      ...code,
      editing: true,
    });
    setSelectedSessionData(code);
    setAddSessionModalActive(true);
  };
  const handleServicePause = (item) => {
    console.log({ item });
    let key = item?._id;
    let tempSettings = { ...settingsData };

    let updated = servicesAndSpecialization.map((serv) => {
      if (serv._id === key) {
        return {
          ...serv,
          pause: !serv?.pause,
        };
      } else {
        return { ...serv };
      }
    });
    console.log("upper", updated);
    let updatedSetting = {
      servicesAndSpecialization: updated,
    };
    updateAndFetchsettings(updatedSetting);
  };

  const handleAddServiceName = (text, key) => {
    let tempSettings = { ...settingsData };

    let updated = servicesAndSpecialization.map((serv) => {
      if (serv._id === key) {
        return {
          ...serv,
          service: text,
        };
      } else {
        return { ...serv };
      }
    });
    //console.log("upper",updated)
    let updatedSetting = {
      servicesAndSpecialization: updated,
    };
    updateAndFetchsettings(updatedSetting);
    setAddServiceModalActive(false);
    setSubModalServiceData(subModalInitialServiceState);
    // console.log('updatedSetting', updatedSetting)
  };
  const handleAddSessionName = (text, key) => {
    let tempSettings = { ...settingsData };

    let updated = sessionTags.map((serv) => {
      if (serv._id === key) {
        return {
          ...serv,
          heading: text,
        };
      } else {
        return { ...serv };
      }
    });
    //console.log("upper",updated)
    let updatedSetting = {
      sessionTags: updated,
    };
    updateAndFetchsettings(updatedSetting);
    setAddSessionModalActive(false);
    setSubModalSessionData(subModalInitialSessionState);
    // console.log('updatedSetting', updatedSetting)
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
    setLoading2(true);
    setSaveLoading(true);
    
    axios
      .patch(`${BASE_URL}api/user/setting/${append}`, formData, {
        headers: getAuthHeader(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      })
      .then((res) => {
        setLoading2(false);
        setSaveLoading(false)
        // console.log('resp--' ,res.data.data.updatedSetting.settings);
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
           setLoading2(false);
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
        setSubModalServiceData((prev)=>{return {...prev,specialization:[...prev.specialization,text]}})
     
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
        setSubModalServiceData({ ...serv, specialization: updatedSpec })
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
          tests: subModalData?.tests,
        },
      ];
      let updatedSetting = {
        subscriptionCode: updated,
      };
      // console.log('updatedSetting', updatedSetting);
      updateAndFetchsettingsNew2(updatedSetting);
     
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
    try {
    axios.get(`${BASE_URL}api/test/${persona}/getAllTest`,{ headers: getAuthHeader() }).then((res) => {
      console.log('res', res.data.data);
     
      if (res.data.data) {
        let arr = res.data.data.map((item) => {
          return {
            _id: item._id,
            value: item.testName,
          };
        });
        setAllTestData(arr);
        setFilteredTests(arr);
      }
    });}
    catch(err) {
      console.log("fetching tests error",err)
    }
  };
//console.log("tests",allTestData,filteredTests)

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
    if (organization?.customFields?.length === 5)
      return alert("Only 5 fields are allowed");
    const { option1, option2, option3, option4 } = newQuestion.values;
    const body = {
      orgId: user.associatedOrg,
      name: newQuestion.text,
      dataType: newQuestion.type,
      values: [option1, option2, option3, option4],
    };
    setAddNewQuestionModalActive(false);
    addNewQuestion(body).then((res) => {
      if (res.error) {
        console.log(res.error);
        return;
      }
      //window.location.reload()
      // console.log("reshi", res);

      setFetchS(res);
    });
  };

  useEffect(() => {
    const activeTab = searchParams.get("tab");
    if (activeTab) {
      setActiveTab(parseInt(activeTab));
    }
  }, [searchParams.get("tab")]);
  const [offersNew, setOffersNew] = useState([]);
  if (!settingsData) return <></>;
  if (Object.keys(settingsData).length === 0) return <></>;
  
  
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

  const onRemoveSessionTag = (itemToRemove) => {
    
    let updated = settingsData.sessionTags.filter(
      (item) => item._id !== itemToRemove._id
    );
    let updatedSetting = {
      sessionTags: updated,
    };
    updateAndFetchsettings(updatedSetting);
  };

  const handleAddSessionTag = (text, key) => {
    let tempSettings = { ...settingsData };

    let updated = sessionTags.map((serv) => {
      if (serv.heading === key) {
        setSubModalSessionData((prev)=>{return {...prev,items:[...prev.items,text]}})
     
        return {
          ...serv,
          items: [...serv.items, text],
        };
      } else {
        return { ...serv };
      }
    });

    let updatedSetting = {
      sessionTags: updated,
    };
    updateAndFetchsettings(updatedSetting);
    // console.log('updatedSetting', updatedSetting)
  };
  const handleImageRemoval = (offer) => {
    //console.log(offer);
    const arr = offerImages.filter((item) => {
      return item._id !== offer._id;
    });
    let updatedSetting = {
      offerImages: arr,
    };
    updateAndFetchsettings(updatedSetting);
  };
  const handleOfferChange = (offer, key, value) => {
    let updatedField = settingsData.offerImages.map((item) => {
      if (item._id === offer._id) {
        return { ...item, [key]: value };
      } else {
        return item;
      }
    });
    let updatedSetting = {
      offerImages: updatedField,
    };
    console.log("updatedSetting", updatedSetting);
    updateAndFetchsettings(updatedSetting);
  };

  const onRemoveSessionTagItem = (text, heading) => {
    // console.log(text);
    // console.log(service);
    let updated = sessionTags.map((serv) => {
      if (serv.heading === heading) {
        let updatedSpec = serv.items.filter((spec) => spec !== text);
        setSubModalSessionData({ ...serv, items: updatedSpec})
        return { ...serv, items: updatedSpec };
      } else {
        return { ...serv };
      }
    });
    let updatedSetting = {
      sessionTags: updated,
    };
    updateAndFetchsettings(updatedSetting);
  };

  const onAddSessionTag = (val) => {
    let tempSettings = { ...settingsData };
    let updatedSetting = {
      sessionTags: [
        ...tempSettings["sessionTags"],
        {
          heading: val,
          items: [],
        },
      ],
    };

    updateAndFetchsettings(updatedSetting);
  };

  const handleChange = (key, value) => {
    const body = {
      [key]: value,
    };
    updateAndFetchsettings(body);
  };
 
  const submitImageModalNew = (file2, val, e) => {
    e.preventDefault();
    const file=file2
    if(!file) {
      
      return
    }
   e.target.value = ''
   let size=file.size/1024;
   size=size/1024;
   if(size>1){
     alert("File size is larger than than 1MB")
     return 
   }
    // //console.log(tagText)
    // //console.log(tagImage)
    // //console.log(selectedImageTag)
    console.log({ file, val, link: val?.link });
    const formData = new FormData();

    let append = "";

    append = "addimage";
    // formData.append("image", file);
    formData.append("link", val?.link?val?.link:" ");
    formData.append("offer", file);
    formData.append("buttonText", val?.buttonText);
   

    if (append === "") return;
    setLoading2(true);
    setSaveLoading(true);
    axios
      .patch(`${BASE_URL}api/user/setting/${append}`, formData, {
        headers: getAuthHeader(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      })
      .then((res) => {
        // console.log("resp--", res.data.data.updatedSetting.settings);
        // dispatch(
        //   updateOrganizationSettings(res.data.data.updatedSetting.settings)
        // );
        // fetchSettings();
        // let settingsData2 = res.data.data.updatedSetting.settings;
        // if (settingsData2?.offerImages) {
        //   let updatedField = settingsData2.offerImages?.map((it, id) => {
        //     if (id === settingsData2.offerImages?.length - 1) {
        //       return { ...it, buttonText: val?.buttonText };
        //     }
        //     return { ...it };
        //   });

        //   let updatedSetting = {
        //     offerImages: updatedField,
        //   };
        //   console.log("updatedSetting", updatedSetting);
        //   updateAndFetchsettings(updatedSetting);
        // } else {
        //   // setTagImage(null);
        //   // setTagText("");
        //   // setSelectedImageTag("");
        //   // setImageName("");
        //   // setTagModalActive(false);
        //   fetchSettings();
        // }
        setLoading2(false);
        setSaveLoading(false);
        fetchSettings();
       
      })
      .catch((err) => {
        setLoading2(false);
        console.log("err", err);
        alert("Could not upload image");
        setSaveLoading(false);
      });
  };
  const handleImageRemoval2 = (offer) => {
    //console.log(offer);
    const arr = offerImages.filter((item) => {
      return item._id !== offer._id;
    });
    let updatedSetting = {
      offerImages: arr,
    };
    updateAndFetchsettings(updatedSetting);
  };

  const updateAndFetchsettingsNew2 = (updatedSetting) => {
    if (!organization || !settingsData || !updatedSetting) return;
    const setting = {
      ...settingsData,
      ...updatedSetting,
    };
    const body = {
      setting,
    };
    console.log("body set", body);
    // return;
    setSaveLoading(true);
    updateSetting(updatedSetting)
      .then((res) => {
        setSaveLoading(false);
        console.log("res", res);
        alert("Succesfully Added!")
        setOne(false)
        setAddServiceModalActive(false)
        setAddSessionModalActive(false)
        setAddCodeModalActive(false)
        setServices2({ service: "", specialization: [] });
        setSession2({ heading: "",
        items: [] });
        setAddCodeModalActive(false);
        setSubModalData(subModalInitialState);
        setSaveLoading(false);
        setSettingsData(res.data.data.setting);
        dispatch(updateOrganizationSettings(res.data.data.setting));
        // console.log('updated', res.data.data.setting.settings);
      })
      .catch((err) => {
        setSaveLoading(false);
        console.log("err", err);
      });
    // const settings = {
    //   ...settingsData,
    //   ...updatedSetting,
    // };
    // const body = {
    //   settings,
    // };
    // console.log("body", body);

    // setSaveLoading(true);
    // updateSetting(body)
    //   .then((res) => {
    //     console.log("updated", res.data.data);
    //     alert("Succesfully Added!")
    //     setOne(false)
    //     setAddServiceModalActive(false)
    //     setAddSessionModalActive(false)
    //     setAddCodeModalActive(false)
    //     setServices2({ service: "", specialization: [] });
    //     setSession2({ heading: "",
    //     items: [] });
    //     setAddCodeModalActive(false);
    //     setSubModalData(subModalInitialState);
    //     setSaveLoading(false);
    //     setSettingsData(res.data.data.setting);
    //     dispatch(updateOrganizationSettings(res.data.data.setting));
    //   })
    //   .catch((err) => {
    //     alert("Error Occured!")
    //     setSaveLoading(false);
    //     //console.log("err", err);
    //   });
  };
  const handleNewServiceRemove = (e) => {
    if (addServices2?.specialization) {
      let temp = addServices2;
      temp.specialization = temp?.specialization?.filter((it) => it !== e);
      setServices2({ ...temp });
    }
    console.log(e);
  };
  const handleAddNewService = (e) => {
    console.log(addServices2);
    let tempSettings = { ...settingsData };
    let updatedSetting = {
      servicesAndSpecialization: [
        ...tempSettings["servicesAndSpecialization"],
        {
          service: addServices2?.service,
          specialization: addServices2?.specialization,
        },
      ],
    };

    updateAndFetchsettingsNew2(updatedSetting);
   //setAddServiceModalActive(false)
  };
  const handleAddNewSpecialisation = (e) => {
    if (addServices2?.specialization) {
      let temp = addServices2;
      temp?.specialization?.push(e);
      setServices2({ ...temp });
    }
    console.log(e);
  };
  const handleNewSessionRemove = (e) => {
    if (addSession2?.items) {
      let temp = addSession2;
      temp.items = temp?.items?.filter((it) => it !== e);
      setSession2({ ...temp });
    }
    console.log(e);
  };
  const handleAddNewSession = (e) => {
    console.log(addSession2);
    let tempSettings = { ...settingsData };
    let updatedSetting = {
      sessionTags: [
        ...tempSettings["sessionTags"],
        {
          heading: addSession2?.heading,
          items: addSession2?.items,
        },
      ],
    };

    updateAndFetchsettingsNew2(updatedSetting);
   //setAddServiceModalActive(false)
  };
  const handleAddNewTags = (e) => {
    if (addSession2?.items) {
      let temp = addSession2;
      temp?.items?.push(e);
      setSession2({ ...temp });
    }
    console.log(e);
  };
  const handleTestChange2 = (item) => {
    console.log("tsests", item);
    if (subModalData.tests.includes(item._id)) {
      let updated = subModalData.tests.filter(
        (test) => test !== item._id
      );
      setSubModalData((prev) => ({
        ...prev,
        tests: updated,
      }));
      const up=selectedtest.filter(
        test=>test!=item.value
      )
      setselectedtest(up)
    } else {
      setSubModalData((prev) => ({
        ...prev,
        tests: [...subModalData.tests, item._id],
      }));
     const selecttt=selectedtest;
     selecttt.push(item.value);
    }
  };
  return (
    <>
      <div className={` bg-lightWhite min-h-screen px-24 pt-[30px] pb-[50px] ${activeTab===1? 'mt-0':'mt-5' } `}>
        <p className="text-[#24A3D9]  mb-9">
          <span className="font-[400] text-[23px] ">
            {" "}
           Settings
          </span>
        </p>
        <div className="w-[1706.67px] flex justify-between items-center mb-[40px]">
          <div className={`${styles.tabsContainer} w-full`}>
            {tabs.map((item, idx) => {
              return (
                <div
                  className={`${styles.tab} w-[200px]  ${
                    activeTab === idx + 1 ? styles.selectedTab : ""
                  } cursor-pointer`}
                  onClick={() => changeTab(idx + 1)}
                >
                
                  <div className={` flex justify-center items-center w-full `}>
                    <div className="">
                      {activeTab === idx + 1 && (
                        <img src={item.Icon} className="mb-1 w-[18px] h-[18px]" alt="item-logo" />
                      )}
                      {activeTab === idx + 1 || (
                        <img src={item.Icon2} className="mb-1 w-[18px] h-[18px]" alt="item-logo" />
                      )}
                    </div>
                    <p className="font-medium">{item.name}</p>
                  </div>
                  {activeTab === idx + 1 && (
                    <img
                      src={ActiveTab}
                      className={styles.activeBgIcon}
                      alt="item-background"
                    />
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
        {activeTab === 1 || !activeTab ? <AccountOverview /> : <></>}
        {activeTab === 3 ? (
          <div className="ml-14 w-[93%]">
          <div className="company_name flex  ml-1 mb-9 item-center">
          {/* in below this company state variable  created on line no.101 */}
              <p className="text-[#24A3D9] pr-1 text-[22px] ">&#123;<span>{company}</span> &#125;</p> 
              <p className="text-[#24A3D9]  text-[22px]"> <span className="pl-[2px] pr-[2px]">&gt; </span> <span className="text-[#24A3D9] font-medium pt-[3px]">Settings</span></p>
            </div>
            <div className="flex items-center gap-x-[50px]  mb-4">
            
              <div>

          
                <InputSelect
                    labelClassname="text-20 mb-1"
                  IconRight={
                    <img
                      src={down}
                      className={`${
                        down ? `w-[12px] h-[12px] ` : `w-[12px] h-[12px]`
                      }   absolute right-5`}
                      alt="down-arrow"
                    />
                  }
                  inputContainerClassName="shadow-[0px_0px_2.500000476837158px_0px_#00000040] bg-[#FFFFFF] w-[387px]"
                  placeholder="Select"
                  optionData={timeZones}
                  parentClassName="py-0 min-w-[387.5px]"
                  label="Default Time Zone"
                  value={settingsData.timeZone}
                  onChange={(val) => handleChange("timeZone", val)}
                />
              </div>
              <InputSelect
                labelClassname="mb-1 text-[20px]"
                placeholder="Select"
                IconRight={
                  <img
                    src={down}
                    className={`${
                      down ? `w-[12px] h-[12px] ` : `w-[12px] h-[12px]`
                    }   absolute right-5`}
                    alt="down-arrow"
                  />
                }
                inputContainerClassName="shadow-[0px_0px_2.500000476837158px_0px_#00000040] bg-[#FFFFFF] w-[387px]"
                optionData={["dd/mm/yy", "mm/dd/yy", "yy/mm/dd"]}
                parentClassName=" text-base-17-5 py-0 min-w-[387.5px]"
                label="Default Date Format"
                value={settingsData.dateFormat}
                onChange={(val) => handleChange("dateFormat", val)}
              />
            </div>
            <div className="h-[1.25px] bg-[#CBD6E2] mb-[21px] mt-[37px]"></div>
            <SettingsCard
              titleClassName="font-medium text-[20px] !text-[#26435F]"
              title="Lead Status Items (Parent / Student)"
              body={
                <div className="flex items-center flex-wrap gap-x-[18.75px] gap-y-[25px] [&>*]:mb-[10px] px-[31.25px] py-[26.25px] bg-white shadow-small rounded-5">
                  <AddTag onAddTag={handleAddTag} keyName="leadStatus" className='w-[143.25px] bg-primary mr-[1px]' />
                  <FilterItems
                    onlyItems={true}
                    isString={true}
                    items={leadStatus ? leadStatus : []}
                    keyName="leadStatus"
                    onRemoveFilter={onRemoveFilter}
                    className="pt-1 pb-1"
                  />
                </div>
              }
            />
            <div className="h-[1.25px] bg-[#CBD6E2] my-[21px]"></div>
            <SettingsCard
              titleClassName="font-medium text-[20px] !text-[#26435F]"
              title="Tutor Status Items"
              body={
                <div className="flex items-center flex-wrap [&>*]:mb-[10px] gap-x-[18.75px] gap-y-[25px] px-[31.25px] py-[26.25px]  bg-white shadow-small p-4 rounded-5 text-base-17-5">
                  <AddTag onAddTag={handleAddTag} keyName="tutorStatus" className='w-[143.25px] bg-primary mr-[1px]'  />
                  <FilterItems
                    onlyItems={true}
                    isString={true}
                    items={tutorStatus ? tutorStatus : []}
                    keyName="tutorStatus"
                    onRemoveFilter={onRemoveFilter}
                    className="pt-1 pb-1 text-base-17-5"
                  />
                </div>
              }
            />
            <div className="h-[1.25px] bg-[#CBD6E2] mt-[21px] mb-[37px]"></div>
            <SettingsCard
              title=" Manage Referral Codes"
              titleClassName="font-medium text-[20px] !text-[#26435F]"
              className={`${styles["bordered-settings-container"]}`}
              body={
                <div className="max-h-[360px] overflow-auto custom-scroller p-1 scrollbar-vertical ">
                  {subscriptionCode !== undefined &&
                    subscriptionCode.map((subscription, i) => {
                      return (
                        <div
                        key={i}
                        className="bg-white px-[31.25px] py-[26.25px] shadow-small mb-3 shadow-[0px_0px_2.500000476837158px_0px_#00000040] rounded-md"
                      >
                         <div className="flex items-center justify-between gap-3 pr-8">
                              <p className="font-medium text-[#24A3D9] text-medium">
                              {subscription.code}
                              <span className="inline-block ml-6 -mt-1 font-light text-[#517CA8]">
                                {subscription.expiry} Weeks
                              </span>
                            </p>
                            <div className="flex items-center ml-6 gap-x-[27.5px] gap-y-[25px] flex-1 flex-wrap">
                            {/* <AddTag
                              openModal={true}
                              onAddTag={(code) => handleAddTest(subscription)}
                              keyName={subscription.code}
                              text="Add Tests"
                            /> */}
                            <FilterItems
                              isString={true}
                              onlyItems={true}
                              keyName={subscription.code}
                              items={subscription.tests}
                              filteredTests={filteredTests}
                              fetchData={true}
                              api="test"
                              onRemoveFilter={onRemoveCodeTest}
                              className="pt-1 pb-1 "
                            />
                          </div>
                            <div className="flex items-center gap-x-4">
                              {/* {subscription.pause === false ? (
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
                              )} */}
                              <ToggleBar
                                  boxClass="!h-[16px]"
                                  toggle={{
                                    value: !subscription.pause,
                                    key: "code",
                                  }}
                                  onToggle={() => handlePause(subscription)}
                                ></ToggleBar>
                              <div
                                className=" flex items-center justify-center  rounded-full cursor-pointer"
                                onClick={() => onEditCode(subscription)}
                              >
                                <img
                                  src={EditBlueIcon}
                                  className="w-4"
                                  alt="edit"
                                />
                              </div>
                              <div
                                className=" flex items-center justify-center  rounded-full cursor-pointer"
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
                         
                        </div>
                      );
                    })}
                  <AddTag
                    children="Add New Code"
                    className="pl-3 pr-3 pt-1.4 pb-1.5 mt-5 bg-primary text-white  w-[189.25px]"
                    text="Add New Code"
                    hideIcon={false}
                    openModal={true}
                    onAddTag={onAddCode}
                  />
                </div>
              }
            />

            <SettingsCard
              titleClassName="font-medium text-[20px] !text-[#26435F] "
              title="Manage Services and Topics"
              className={styles["bordered-settings-container"]}
              body={
                <div>
                  <div className="max-h-[360px]  overflow-auto custom-scroller p-1 scrollbar-vertical">
                    {servicesAndSpecialization !== undefined &&
                      servicesAndSpecialization.map((service, i) => {
                        return (
                          <div
                            key={i}
                            className="bg-white shadow-small rounded-md px-[31.25px] py-[26.25px]  mb-3 shadow-[0px_0px_2.500000476837158px_0px_#00000040] "
                          >
                             <div className="flex items-center gap-3 justify-between pr-8">
                              <p className="font-medium text-[#24A3D9] text-medium min-w-[100px]">
                                {service.service}
                              </p>
                              <div className="flex ml-16 flex-1 gap-x-[27.5px] gap-y-[25px] items-center flex-wrap ">
                              {/* <AddTag
                                onAddTag={handleAddSpecialization}
                                keyName={service.service}
                                text="Add Service"
                              /> */}
                              <FilterItems
                                isString={true}
                                onlyItems={true}
                                keyName={service.service}
                                items={service.specialization}
                                onRemoveFilter={onRemoveSpecialization}
                                className="pt-1 pb-1"
                              />
                            </div>
                              <div className="flex items-center gap-x-4">
                                <ToggleBar
                                  boxClass="!h-[16px]"
                                  circleColor="bg-[rgba(119,221,119,1)]"
                                  t
                                  toggle={{
                                    value: !service.pause,
                                    key: "code",
                                  }}
                                  manual={true}
                                ></ToggleBar>
                                <div
                                  className=" flex items-center justify-center  rounded-full cursor-pointer"
                                  onClick={() => onEditService(service)}
                                >
                                  <img
                                    src={EditBlueIcon}
                                    className="w-4"
                                    alt="edit"
                                  />
                                </div>
                                <div
                                  className=" flex items-center justify-center  rounded-full cursor-pointer"
                                  onClick={() => onRemoveService(service)}
                                >
                                  <img
                                    src={DeleteIcon}
                                    className="w-4"
                                    alt="delete"
                                  />
                                </div>
                              </div>
                            </div>
                           
                          </div>
                        );
                      })}
                  </div>
                  {/* <AddTag
                    children="Add Service"
                    className="pl-3 pr-3 pt-1.4 pb-1.5 mt-5 bg-primary text-white"
                    text="Add Service"
                    onAddTag={onAddService}
                  /> */}
                   <button
                    onClick={() => {
                      setOne(true);
                      setAddServiceModalActive(true);
                    }}
                    className="px-2 bg-primary flex items-center text-white font-medium text-[17.5px] pl-3 pr-3 pt-1.4 pb-1.5 rounded-7 mr-[15px]  text-base-17-5 "
                  >
                    <span> Add Service </span>
                    <img src={AddIcon} className="w-4 ml-1" alt="add" />
                  </button>
                </div>
              }
            />

            {/* <SettingsCard
              title="Session Tags & Reconciliation"
              className={styles["bordered-settings-container"]}
              body={
                
                <div className="max-h-[360px] overflow-auto custom-scroller p-1 scrollbar-vertical">
                  {sessionTags !== undefined &&
                    sessionTags.map((service, i) => {
                      return (
                        <div key={i} className="bg-white rounded-md shadow-small p-4 mb-3 shadow-[0px_0px_2.500000476837158px_0px_#00000040] ">
                          <div className="flex items-center justify-between pr-8">
                            <p className="font-medium text-[#24A3D9] ">
                              {service.heading}
                            </p>
                            <div className="flex items-center gap-x-4">
                            <ToggleBar
                            boxClass="!h-[16px]"
                                circleColor="bg-[rgba(119,221,119,1)]"
                                toggle={{ value: 5, key: 'code' }}
                                onToggle={togglePermissions}
                              ></ToggleBar>
                              <div
                                className=" flex items-center justify-center  rounded-full cursor-pointer"
                                // onClick={() => onEditService(service)}
                              >
                                <img
                                  src={EditBlueIcon}
                                  className="w-4"
                                  alt="edit"
                                />
                              </div>
                              <div
                                className=" flex items-center justify-center  rounded-full cursor-pointer"
                                onClick={() => onRemoveSessionTag(service)}
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
                              onAddTag={handleAddSessionTag}
                              keyName={service.heading}
                              text="Add Items"
                            /> 
                            <FilterItems
                              isString={true}
                              onlyItems={true}
                              keyName={service.heading}
                              items={service.items}
                              onRemoveFilter={onRemoveSessionTagItem}
                              className="pt-1 pb-1 mr-15"
                            />
                          </div>
                        </div>
                      );
                    })}
                  <AddTag
                    children="Add Heading"
                    className="pl-3 pr-3 pt-1.4 pb-1.5 mt-5 bg-primary text-white"
                    text="Add Heading"
                    hideIcon={false}
                    onAddTag={onAddSessionTag}
                  />
                </div>
              }
            /> */}

            <SettingsCard
              titleClassName="font-medium text-[20px] !text-[#26435F] "
              title="Session Tags & Reconciliation "
              className={styles["bordered-settings-container"]}
              body={
                <div className="">
                  <div className="max-h-[360px] p-1  overflow-auto  scrollbar-vertical custom-scroller">
                    {sessionTags !== undefined &&
                      sessionTags.map((service, i) => {
                        return (
                          <div
                            key={i}
                            className="bg-white shadow-small px-[31.25px] py-[26.25px] mb-3 rounded-md"
                          >
                            <div className="flex items-center justify-between py-1 pr-8">
                            <p className="font-medium text-[#24A3D9] text-medium min-w-[100px]">
                                {service.heading}
                              </p>
                              <div className="flex items-center gap-x-[27.5px] gap-y-[25px] flex-wrap flex-1 ml-16">
                              {/* <AddTag
                                onAddTag={handleAddSessionTag}
                                keyName={service.heading}
                                text="Add Items"
                              /> */}
                              <FilterItems
                                isString={true}
                                onlyItems={true}
                                keyName={service.heading}
                                items={service.items}
                                onRemoveFilter={onRemoveSessionTagItem}
                                className="pt-1 pb-1"
                              />
                            </div>
                              <div className="flex items-center gap-x-4">
                                <ToggleBar
                                  boxClass="!h-[16px]"
                                  circleColor="bg-[rgba(119,221,119,1)]"
                                  toggle={{
                                    value: true,
                                    key: "code",
                                  }}
                                  manual={true}
                                ></ToggleBar>
                                <div
                                  className=" flex items-center justify-center  rounded-full cursor-pointer"
                                  onClick={() => onEditSession(service)}
                                >
                                  <img
                                    src={EditBlueIcon}
                                    className="w-4"
                                    alt="edit"
                                  />
                                </div>
                                <div
                                  className="w-5 h-5 flex items-center justify-center  rounded-full cursor-pointer"
                                  onClick={() => onRemoveSessionTag(service)}
                                >
                                  <img
                                    src={DeleteIcon}
                                    className="w-4"
                                    alt="delete"
                                  />
                                </div>
                              </div>
                            </div>
                          
                          </div>
                        );
                      })}
                  </div>

                  {/* <AddTag
                    children="Add Heading"
                    className="px-[18px] py-3 mt-5 bg-primary text-white"
                    text="Add Heading"
                    hideIcon={false}
                    onAddTag={onAddSessionTag}
                  /> */}
                    <button
                    onClick={() => {
                      setOne(true);
                      setAddSessionModalActive(true);
                    }}
                    className="px-2 bg-primary flex items-center text-white font-medium text-[17.5px] pl-3 pr-3 pt-1.4 pb-1.5 rounded-7 mr-[15px]  text-base-17-5 "
                  >
                    <span> Add Heading </span>
                    <img src={AddIcon} className="w-4 ml-1" alt="add" />
                  </button>
                </div>
              }
            />
           <SettingsCard
              titleClassName="font-medium text-20 !text-[#26435F]"
              title="Edit Announcements"
              toggle={{ value: toggleImage.offer, key: "offer" }}
              onToggle={onToggle}
              body={
                <div className=" bg-white w-full  gap-x-5 p-4 rounded-br-5 rounded-bl-5 !pr-4">
                  <p className="text-base-17-5 mt-[-5px] text-[#667085] mb-6">
                    <span className="font-semibold mr-1">⚠️ Note:</span>
                    Announcements, as the name implies, can be used to announce
                    important aspects of your business. Displayed on the
                    top-left corner in Parent and Student Dashboards, these can
                    be used to highlight your services, offers, referral
                    incentives, webinars, events, proctored tests, tutorial
                    videos, and pretty much anything you want your Clients to
                    see as soon as they log into their Evallo dashboard. You can
                    add a maximum of 4 Announcements at a time. Read detailed
                    documentation in Evallo’s
                    <span className="text-[#24A3D9] cursor-pointer" onClick={()=>window.location.href = process.env.REACT_APP_SUPPORT_LINK}> knowledge base.</span>
                  </p>
                  <div className="flex items-center gap-5 pr-3  flex-1 !w-[100%] overflow-x-auto custom-scroller-2    [&>*]:mb-[10px] bg-white  gap-x-5 p-4 rounded-br-5 rounded-bl-5 mb-3 !px-6 py-5 ">
                    {/* <input type='file' ref={inputRef} className='hidden' accept="image/*"
                           onChange={e => onImageChange(e)} /> */}

                    {/* <FilterItems
                    isString={false}
                    // image={toggleImage.offer}
                    offerImage={toggleImage.offer}
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
                    baseLink={awsLink}
                    onRemoveFilter={onRemoveImage}
                    // onRemoveFilter={onRemoveFilter}
                    className="pt-1 pb-1 mr-15 text-base-17-5"
                  /> */}
                
                    {offerImages?.map((offer) => {
                      return (
                        <div className="flex-shrink-0 w-[300px]" key={offer._id}>
                        
                          <div className="relative">
                            {toggleImage.offer || true&& (
                              <div className=" mb-5">
                                <div className="flex">
                                  <div className="w-[300px] h-[150px]">
                                    <img
                                      src={`${awsLink}${offer?.image}`}
                                      alt="offer-image3"
                                      className="w-full h-full object-cover rounded-7"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                            <div>
                              <div
                                onClick={() => handleImageRemoval(offer)}
                                className="w-7 h-7 z-5000 -top-2 right-[9px] flex items-center absolute justify-center  rounded-full cursor-pointer"
                              >
                                <img
                                  src={DeleteIcon}
                                  className="w-5"
                                  alt="delete"
                                />
                              </div>
                              <InputField
                                defaultValue={offer?.link?.trim()}

                                inputClassName={" text-base-17-5 bg-[#F5F8FA]"}
                                placeholder={"Hyperlink"}
                                parentClassName={"mb-3 bg-[#F5F8FA]"}
                                onBlur={(e) =>
                                  handleOfferChange(
                                    offer,
                                    "link",
                                    e.target.value
                                  )
                                }
                              />
                              <InputField
                                defaultValue={offer.buttonText}
                                parentClassName={"bg-[#F5F8FA]"}
                                placeholder={
                                  "Button Text (eg. View, Enroll, etc.)"
                                }
                                inputClassName={" text-base-17-5 bg-[#F5F8FA]"}
                              
                                onBlur={(e) =>
                                  handleOfferChange(
                                    offer,
                                    "buttonText",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {offersNew?.length > 0 &&
                      offersNew?.map((off, idx) => {
                        return (
                          <div className="relative flex min-w-[250px] ">
                          <div className=" relative w-[2px] rounded-md  bg-[#00000030] !h-[300px] mx-[45px]"></div>

                          <div className="flex-shrink-0 w-[300px]">
                              <div className="flex w-[100%] bg-[#F5F8FA] rounded-md mb-8 flex-col justify-center items-center">
                                <div className="mt-[20px] mb-[10px] items-center flex justify-center">
                                  <img
                                    src={fileupload}
                                    alt="fileuploadIcon"
                                  ></img>
                                </div>

                                <div className="flex items-center text-center justify-center text-base-15">
                                  {/* {xlsFile == undefined ? (
                    <p className=""></p>
                  ) : (
                    <p className="block ">{xlsFile.name}</p>
                  )} */}
                                </div>
                                <div className="flex justify-center">
                                    <label
                                      htmlFor={"file2"+idx}
                                      disabled={loading2}
                                      className={`block cursor-pointer text-sm text-white bg-[#517CA8] hover:bg-[#517CA8] items-center justify-center  rounded-[5px]  px-3 py-2 text-base-17-5 text-center ${loading2?"cursor-wait":""}`}
                                    >
                                       {loading2 && off?.image

                                        ? "Submitting..."
                                        : " Choose File"}
                                    </label>
                                    <input
                                     accept="image/*"
                                     className="hidden"
                                     disabled={loading2}
                                       
                                      onChange={(e) => {
                                        console.log("ee")
                                        let arr = offersNew;
                                        arr[idx].image = e.target.files[0];
                                        setOffersNew((prev)=>(
                                          [
                                            ...arr,
                                          ]
                                        )
                                         );
                                        submitImageModalNew(e.target.files[0], off,e)
                                        // setImageName(e.target.files[0].name);
                                      }}
                                      id={"file2"+idx}
                                      type="file"
                                    />
                                  </div>

                                <label
                                  htmlFor="file"
                                  className="block text-xs items-center justify-center  rounded-[5px]  px-4 py-2 font-normal text-center text-[#517CA8] text-base-15"
                                >
                                  Less than 1 MB
                                </label>
                              </div>
                              <div>
                                <div
                                  //   onClick={() => handleImageRemoval(offer)}
                                  className="w-7 h-7 z-5000 -top-2 right-[9px] flex items-center absolute justify-center  rounded-full cursor-pointer"
                                >
                                  {/* <img
                                    src={DeleteIcon}
                                    className="w-5"
                                    alt="delete"
                                  /> */}
                                </div>
                                {false && (
                                  <span className="text-[#517CA8] text-base-15 mb-1 !text-center flex justify-center items-center">
                                    {" "}
                                    Button text can only be edited after
                                    uploading image!{" "}
                                  </span>
                                )}
                                <InputField
                                  //  defaultValue={offer.link}
                                  inputClassName={
                                    " text-base-17-5 bg-[#F5F8FA]"
                                  }
                                  parentClassName={"mb-3 bg-[#F5F8FA]"}
                                  placeholder={"Hyperlink"}
                                  required={true}
                                  onChange={(e) => {
                                    let arr = offersNew;
                                    arr[idx].link = e.target.value;
                                    setOffersNew([...arr]);
                                  }}
                                />
                                <InputField
                                  // defaultValue={offer.buttonText}
                                  parentClassName={"bg-[#F5F8FA]"}
                                  inputClassName={
                                    " text-base-17-5 bg-[#F5F8FA]"
                                  }
                                  placeholder={
                                    "Button Text (eg. View, Enroll, etc.)"
                                  }
                                  onChange={(e) => {
                                    let arr = offersNew;
                                    arr[idx].buttonText = e.target.value;
                                    setOffersNew([...arr]);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* <AddTag
                    openModal={true}
                    text="Add Announcement"
                    onAddTag={() => handleTagModal("offer")}
                  /> */}
                </div>
              }
            />
            <div className="flex items-center pb-2 text-[#26435F] font-medium text-xl">
              <p className="pr-2 !text-[#26435F]">Set Permissions </p>
              <p>
                <img src={questionMark} alt="" />
              </p>
            </div>

            <div
              className={`bg-[#FFFFFF] border-[2.5px] px-[82px] border-dotted border-[#CBD6E2] mb-[30px] ${styles.permission}`}
            >
              {fetchedPermissions?.map((item, id) => {
                return (
                  <>
                    {item.choosedValue === true ||
                    item.choosedValue === false ? (
                      <div
                        key={id}
                        className={` pt-[34px] pb-[30px] border-b-2 border-[#CBD6E2] text-[#24A3D9] font-medium text-[17.5px] flex items-center justify-between`}
                      >
                        <p>{renderColoredText(item.name)}</p>

                        <ToggleBar
                          toggle={{ value: item.choosedValue, key: item._id }}
                          onToggle={(e)=>id!==3&&togglePermissions(e)}
                        ></ToggleBar>
                      </div>
                    ) : (
                      <div className={`  pt-[34px] pb-[30px] border-b-2 border-[#CBD6E2] text-[#24A3D9] font-medium text-[17.5px] flex justify-between`}>
                        <p>{renderColoredText(item.name)}</p>

                        <p>
                          <select
                            onChange={(e) =>
                              handlePermissionOption(e.target.value, item._id)
                            }
                            id="option"
                            className="border border-gray-300 px-2 w-[200px]  rounded-md text-[#26435F] bg-[#E9ECEF] py-1"
                          >
                            <option value={item.choosedValue}>
                              {`   ${
                                item.permissionActionName ===
                                "notifyParentBefSession"
                                  ? item.choosedValue === 0
                                    ? "OFF"
                                    : item.choosedValue + " hours before"
                                  : item.choosedValue
                              }`}
                            </option>
                            {item.values.map((values, i) => {
                              return (
                                item.choosedValue !== values && (
                                  <option key={i} value={values}>
                                    {` ${
                                      item.permissionActionName ===
                                      "notifyParentBefSession"
                                        ? values === 0
                                          ? "OFF"
                                          : values + " hours before"
                                        : values
                                    }`}
                                  </option>
                                )
                              );
                            })}
                          </select>
                        </p>
                      </div>
                    )}
                  </>
                );
              })}
            </div>
          </div>
        ) : (
          <></>
        )}
        {activeTab === 2 && <UserManagement />}
        {activeTab === 4 && <OrgDefaultContent />}
      </div>
      {modalActive && (
        <Modal
          classname={"max-w-840 mx-auto"}
          title="Edit Details"
          titleClassName="font-medium mb-[18px]"
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
              <div className="grid grid-cols-1 md:grid-cols-2  gap-x-2 md:gap-x-3 gap-y-4 mb-5">
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
      {/* {addCodeModalActive && (
        <Modal
          classname={"max-w-[700px] mx-auto"}
          title="Add / Edit Subscription Code"
          titleClassName="font-medium mb-[18px]"
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
      )} */}
        {console.log(subModalData)}

 {addCodeModalActive && (
        <Modal
          classname={"max-w-[560px] mx-auto"}
          titleClassName="font-medium text-base-20 mb-[18px]"
          title="Add / Edit Referral Code"
          cancelBtn={false}
          cancelBtnClassName="w-140 "
          handleClose={() => {
            setAddCodeModalActive(false);
            setSubModalData(subModalInitialState);
            setselectedtest([])
          }}
          body={
            <form
              id="settings-form"
              onSubmit={(e) => {
                //handleADdTestSubmit(e);
                handleCodeSubmit(e);
              }}
            >
              <p className="text-base-17-5 mt-[-10px] text-[#667085]">
                <span className="font-semibold ">⚠️ Note:</span> Referral codes
                can be used by your leads (parents and students) to sign up for
                accessing Evallo’s portal. You can choose how long you want to
                provide them this access and what assignments should show up
                automatically after they sign up with your organization. Read
                detailed documentation in Evallo’s{" "}
                <span className="text-[#24A3D9] cursor-pointer" onClick={()=>window.location.href = process.env.REACT_APP_SUPPORT_LINK}> knowledge base.</span>
              </p>

              <div className="  grid-cols-1 md:grid-cols-2  gap-x-2 md:gap-x-3 gap-y-2 gap-y-4 mb-5 mt-3">
                <div className="flex-1 flex gap-5 ">
                  <div className="flex-1">
                    <InputField
                      label="Referral Code"
                      labelClassname="text-base-20 text-[#26435F] mb-0.5"
                      placeholder="Add a single-word referral code"
                      inputContainerClassName=" text-base-17-5 !px-3 bg-primary-50 border-0"
                      inputClassName="bg-transparent"
                      placeholderClass="text-base-17-5"
                      parentClassName=" text-base-17-5 py-0 w-full mr-4"
                      type="text"
                      value={subModalData.code}
                      isRequired={true}
                      onChange={(e) =>{
                        if(!e.target.value?.includes(" "))
                        setSubModalData({
                          ...subModalData,
                          code: e.target.value,
                        })
                      }
                    }
                    />
                  </div>
                  <div className="flex-1">
                    <InputField
                      label="Duration (in weeks)"
                      labelClassname="text-base-20 text-[#26435F] mb-0.5"
                      isRequired={true}
                      placeholder="Access duration allowed in weeks"
                      inputContainerClassName=" text-base-17-5 !px-3 bg-primary-50 border-0"
                      inputClassName="bg-transparent"
                      placeholderClass="text-base-17-5"
                      parentClassName=" text-base-17-5 py-0 w-full mr-4"
                      type="text"
                  
                      value={subModalData.expiry}
                      onChange={(e) =>{
                     
                        if(parseInt(e.target.value)<0 || e.target.value<0  )return 
                        if((/^\d+$/.test(e.target.value) && parseInt(e.target.value)>=0 )|| e.target.value?.length===0  )
                        setSubModalData({
                          ...subModalData,
                          expiry: e.target.value,
                        })
                      }
                    }
                    />
                  </div>
                </div>
                <div className="mt-3   mb-10 flex-1">
                  <InputSearch
                    label="Select Assignments (optional)"
                    labelClassname="text-base-20 text-[#26435F] mb-0.5"
                    placeholder="Select"
                    placeholderClass="text-base-17-5"
                    parentClassName=" text-base-17-5 py-0 w-full"
                    inputContainerClassName=" text-base-17-5 bg-[#F3F5F7] border-0 pt-3.5 pb-3.5"
                    inputClassName="bg-[#F3F5F7]"
                    type="text"
                    value={searchedTest}
                    checkbox={{
                      visible: true,
                      name: "test",
                      match: subModalData.tests,
                    }}
                    onChange={(e) => setSearchedTest(e.target.value)}
                    optionListClassName="text-base-17-5"
                    optionClassName="text-base-17-5"
                    optionData={filteredTests}
                    right={<img className="" src={down} />}
                    onOptionClick={(item) => {
                      handleTestChange2(item);
                      // setStudent(item.value);
                      // handleStudentsChange(item)
                      // setCurrentToEdit({ ...currentToEdit, students: [... item._id] });
                    }}
                  />
                  <div className="flex flex-row items-center">
                  {
                    selectedtest?.length>0?
                    <>
                    <p className="font-medium whitespace-nowrap text-base-18 text-[#667085]"> {selectedtest[0]}</p>
                    {selectedtest?.length>1?<>
                      <p className="font-medium whitespace-nowrap text-base-18 text-[#667085]">, {selectedtest[1]}</p>
                      {selectedtest?.length>2?
                      <>
                        <p className="font-medium whitespace-nowrap text-base-18 text-[#667085]">, {selectedtest[2]}</p>
                        {selectedtest.length>3?
                        <>
                        <p className="font-medium whitespace-nowrap text-base-18 text-[#667085]">... total {selectedtest.length} selected</p>
                        </>
                      :null}
                      </> :null}
                      </>
                    :null}
                    </>
                    :null

                  }
                  </div>
                  {/* <InputField
                  label="Select Assignments (optional)"
                  labelClassname="text-base-20 text-[#26435F] mb-0.5"
                  placeholder="Select"
                  inputContainerClassName="bg-primary-50 w-[100%]"
                  inputClassName="bg-transparent"
                  IconLeft ={down}
                  /> */}
                </div>
                <div className="flex gap-4 items-center justify-center mt-3">
                <button disabled={saveLoading} className={`${saveLoading?"cursor-wait":""} rounded-lg bg-[#FFA28D] border-2 border-[#FFA28D] py-[6px] text-[#FFFFFF] w-[146px]`}>
                    Save{" "}
                  </button>
                  <button
                    className="rounded-lg bg-transparent border-2 border-[#FFA28D] py-[6px] text-[#FFA28D]  w-[146px]"
                    onClick={() => setAddCodeModalActive(!addCodeModalActive)}
                  >
                    Cancel{" "}
                  </button>
                </div>
              </div>
            </form>
          }
        />
      )}
      {addServiceModalActive && (
        <Modal
          classname={"max-w-[560px] mx-auto"}
          titleClassName="font-medium text-base-20 mb-[18px]"
          title="Add / Edit Services"
          cancelBtn={false}
          cancelBtnClassName="w-140 "
          handleClose={() => {
            setAddServiceModalActive(false);
            if (addOne) {
              setServices2({ service: "", specialization: [] });
              setOne(false)
            } else {
              setSubModalServiceData(subModalInitialServiceState);
            }
          }}
          body={
            <form
              id="settings-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (addOne) {
                  handleAddNewService();
                } else {
                  handleAddServiceName(
                    selectedServiceData?.service,
                    subModalServiceData?._id
                  );
                }
              }}
            >
              <p className="text-base-17-5 mt-[-10px] text-[#667085]">
                <span className="font-semibold mr-1">⚠️ Note:</span>
                Services refer to the core offerings that your business provides
                in a broad category. Topics are more specific items that you
                specialize in while providing these services. For example, Test
                Prep can be a “Service” with “SAT” and “ACT” as two topics under
                it. Read detailed documentation in Evallo's
                <span className="text-[#24A3D9] cursor-pointer" onClick={()=>window.location.href = process.env.REACT_APP_SUPPORT_LINK}> knowledge base.</span>
              </p>

              <div className="  grid-cols-1 md:grid-cols-2  gap-x-2 md:gap-x-3 gap-y-2 gap-y-4 mb-5 mt-3">
                <div className="flex-1 flex gap-5 ">
                  <div className="flex-1">
                    <InputField
                      label="Service Name"
                      labelClassname="text-base-20 text-[#26435F] mb-0.5"
                      placeholder="Add a service you provide (Test Prep, Career Counseling, Evaluations, etc.)"
                      inputContainerClassName=" text-base-17-5 !px-3 bg-primary-50 border-0"
                      inputClassName="bg-transparent"
                      placeholderClass="text-base-17-5"
                      parentClassName=" text-base-17-5 py-0 w-full mr-4"
                      type="text"
                      value={
                        addOne
                          ? addServices2?.service
                          : selectedServiceData?.service
                      }
                      isRequired={true}
                      onChange={(e) => {
                        if (addOne) {
                          setServices2({
                            ...addServices2,
                            service: e.target.value,
                          });
                        } else {
                          setSelectedServiceData({
                            ...selectedServiceData,
                            service: e.target.value,
                          });
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center flex-wrap [&>*]:mb-[10px] mt-5">
                  <AddTag
                    onAddTag={
                      addOne
                        ? handleAddNewSpecialisation
                        : handleAddSpecialization
                    }
                    keyName={
                      addOne
                        ? addServices2?.service
                        : subModalServiceData.service
                    }
                    text="Add Topic"
                  />
                  <FilterItems
                    isString={true}
                    onlyItems={true}
                    keyName={
                      addOne
                        ? addServices2?.service
                        : subModalServiceData.service
                    }
                    items={
                      addOne
                        ? addServices2?.specialization
                        : subModalServiceData.specialization
                    }
                    onRemoveFilter={
                      addOne ? handleNewServiceRemove : onRemoveSpecialization
                    }
                    className="pt-1 pb-1 mr-15 text-base-17-5"
                  />
                </div>
                <div className="w-full border-[1.33px_solid_#00000033] bg-[#00000033] my-5 h-[1.3px]"></div>
                <div className="flex gap-4 items-center justify-center mt-3">
                  <button disabled={saveLoading} className={`${saveLoading?"cursor-wait":""} rounded-lg bg-[#FFA28D] border-2 border-[#FFA28D] py-[6px] text-[#FFFFFF] w-[146px]`}>
                    Save{" "}
                  </button>
                  <button
                    className="rounded-lg bg-transparent border-2 border-[#FFA28D] py-[6px] text-[#FFA28D]  w-[146px]"
                    onClick={() => {
                      setAddServiceModalActive(false);
                      if (addOne) {
                        setServices2({ service: "", specialization: [] });
                        setOne(false)
                      } else {
                        setSubModalServiceData(subModalInitialServiceState);
                      }
                    }}
                  >
                    Cancel{" "}
                  </button>
                </div>
              </div>
            </form>
          }
        />
      )}
      {addSessionModalActive && (
        <Modal
          classname={"max-w-[560px] mx-auto"}
          titleClassName="font-medium text-base-20 mb-[18px]"
          title="Add / Edit Session Tags"
          cancelBtn={false}
          cancelBtnClassName="w-140 "
          handleClose={() => {
            setAddSessionModalActive(false);
                      if (addOne) {
                        setSession2({ heading: "",
                        items: [] });
                        setOne(false)
                      } else {
                        setSubModalSessionData(subModalInitialSessionState);
                      }
                    }
          }
          body={
            <form
              id="settings-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (addOne) {
                 handleAddNewSession()
                } else {
                  handleAddSessionName(
                    selectedSessionData?.heading,
                    subModalSessionData?._id
                  );
                }
               
              }}
            >
              <p className="text-base-17-5 mt-[-10px] text-[#667085]">
                <span className="font-semibold mr-1 ">⚠️ Note:</span>
                Session Tags are used for optimizing the time it takes for your
                tutors to reconcile sessions. These are checkboxes available
                when reconciling sessions in the Calendar that can be quickly
                used to add further details about the session, such as the
                topics covered, homework assigned, student mood, etc. Read
                detailed documentation in Evallo’s
                <span className="text-[#24A3D9] cursor-pointer" onClick={()=>window.location.href = process.env.REACT_APP_SUPPORT_LINK}> knowledge base.</span>
              </p>

              <div className="  grid-cols-1 md:grid-cols-2  gap-x-2 md:gap-x-3 gap-y-2 gap-y-4 mb-5 mt-3">
                <div className="flex-1 flex gap-5 ">
                  <div className="flex-1">
                    <InputField
                      label="Session Tag Heading"
                      labelClassname="text-base-20 text-[#26435F] mb-0.5"
                      placeholder="Add a heading for session tags (such as “Topics Covered”)"
                      inputContainerClassName=" text-base-17-5 !px-3 bg-primary-50 border-0"
                      inputClassName="bg-transparent"
                      placeholderClass="text-base-17-5"
                      parentClassName=" text-base-17-5 py-0 w-full mr-4"
                      type="text"
                      value={ addOne ? addSession2?.heading :selectedSessionData?.heading}
                      isRequired={true}
                      onChange={(e) =>{
                        if (addOne) {
                          setSession2({
                            ...addSession2,
                            heading: e.target.value,
                          });
                        } else {
                          setSelectedSessionData({
                            ...selectedSessionData,
                            heading: e.target.value,
                          })
                        }
                      }
                       
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center flex-wrap [&>*]:mb-[10px] mt-5">
                  <AddTag
                    onAddTag={ addOne ? handleAddNewTags :handleAddSessionTag}
                    keyName={ addOne ? addSession2?.heading :subModalSessionData.heading}
                    text="Add Tags"
                  />
                  <FilterItems
                    isString={true}
                    onlyItems={true}
                    keyName={ addOne ? addSession2?.heading :subModalSessionData.heading}
                    items={ addOne ? addSession2?.items :subModalSessionData.items}
                    onRemoveFilter={ addOne ? handleNewSessionRemove :onRemoveSessionTagItem}
                    className="pt-1 pb-1 mr-15 text-base-17-5"
                  />
                </div>
                <div className="w-full border-[1.33px_solid_#00000033] bg-[#00000033] my-5 h-[1.3px]"></div>
                <div className="flex gap-4 items-center justify-center mt-3">
                <button disabled={saveLoading} className={`${saveLoading?"cursor-wait":""} rounded-lg bg-[#FFA28D] border-2 border-[#FFA28D] py-[6px] text-[#FFFFFF] w-[146px]`}>
                    Save{" "}
                  </button>
                  <button
                  
                    className="rounded-lg bg-transparent border-2 border-[#FFA28D] py-[6px] text-[#FFA28D]  w-[146px]"
                    onClick={() => {
                      setAddSessionModalActive(false);
                      if (addOne) {
                        setSession2({ heading: "",
                        items: [] });
                        setOne(false)
                      } else {
                        setSubModalSessionData(subModalInitialSessionState);
                      }
                    }}
                  >
                    Cancel{" "}
                  </button>
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
          titleClassName="font-medium mb-[18px]"
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
          titleClassName="font-medium mb-[18px]"
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
          titleClassName="font-medium mb-[18px]"
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