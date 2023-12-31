import React, { useEffect, useRef, useState } from "react";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import EditIcon from "../../assets/icons/edit-white.svg";
import ActiveTab from "../../assets/icons/active-tab.svg";
import SettingsCard from "../../components/SettingsCard/SettingsCard";
import ToggleBar from "../../components/SettingsCard/ToogleBar";
import AddTag from "../../components/Buttons/AddTag";
import "./tab2.css"
import FilterItems from "../../components/FilterItems/filterItems";
import InputField from "../../components/InputField/inputField";
import Modal from "../../components/Modal/Modal";
import { useLazyGetSettingsQuery } from "../../app/services/session";
import questionMark from "../../assets/icons/blue_query.svg";
import toggleRectIcon from "../../assets/icons/toggle-rect.svg";
import toggleRectActiveIcon from "../../assets/icons/toggle-rect-active.svg";
import toggleCircleIcon from "../../assets/icons/toggle-circle.svg";
import {
  useGetAllPermissionQuery,
  useUpdateOfferImageMutation,
  useUpdateOrgSettingMutation,
  useUpdatePermissionMutation,
} from "../../app/services/settings";
import { getSessionTagName } from "../../utils/utils";
import { BASE_URL, getAuthHeader } from "../../app/constants/constants";
import axios from "axios";
import DeleteIcon from "../../assets/icons/delete (2).svg";
import PauseIcon from "../../assets/icons/pause.svg";
import AddIcon from "../../assets/Settings/add-white.svg";
import PlayIcon from "../../assets/icons/play.svg";
import down from "../../assets/icons/down.png";
import OrgDefaultLogo from "../../assets/icons/org-default 2.svg";
import OrgDefaultLogo2 from "../../assets/icons/org-default.svg";
import CAndBLogo from "../../assets/icons/company & brand.svg";
import CAndBLogo2 from "../../assets/icons/company & brand 2.svg";
import AccOverviewLogo from "../../assets/icons/account overview.svg";
import AccOverviewLogo2 from "../../assets/icons/account-overview 2.svg";
import ClientsSignupLogo from "../../assets/icons/Client sign up 1.svg";
import ClientsSignupLogo2 from "../../assets/icons/Client sign up 2.svg";
import EditBlueIcon from "../../assets/YIcons/edit2.svg";
import fileupload from "../../assets/icons/basil_file-upload-outline (2).svg";
import InputSearch from "../../components/InputSearch/InputSearch";
import { useSelector, useDispatch } from "react-redux";
import { useUpdateUserFieldsMutation } from "../../app/services/users";
import { updateUserDetails } from "../../app/slices/user";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./styles.module.css";
import SignupTab from "./Tabs/Signup/signup";
import CompanyAndBround from "./Tabs/CompanyAndBrand/CompanyAndBround";
import AccountOverview from "./Tabs/AccountOverview/AccountOverview";
import AddNewQuestion from "../Frames/AddNewQuestion/AddNewQuestion";
import { useAddNewQuestionMutation } from "../../app/services/admin";
import { updateOrganizationSettings } from "../../app/slices/organization";
import InputSelect from "../../components/InputSelect/InputSelect";
import { permissionsStaticData } from "./Tabs/staticData";
import InputFieldDropdown from "../../components/InputField/inputFieldDropdown";
import moment from "moment-timezone";
import AccountOverviewWithSubscriptionInfo from "./Tabs/AccountOverviewWithSubscriptionInfo/AccountOverviewWithSubscriptionInfo";
import OrgAdminUserManagement from "./Tabs/OrgAdminUserManagement/OrgAdminUserManagement";
import UserManagementLogo1 from "../../assets/icons/User-Management-1.svg";
import UserManagementLogo2 from "../../assets/icons/User-Management-2.svg";

// import questionMark from '../../assets/images/question-mark.svg'
const initialState = {
  name: "",
  phone: "",
  email: "",
};
const subModalInitialState = {
  code: "",
  expiry: "",
  tests: [],
  editing: false,
};

const initialTabs = [
  {
    Icon: OrgDefaultLogo2,
    Icon2: OrgDefaultLogo,
    selectedStateIcon: OrgDefaultLogo2,
    unselectedStateIcon: OrgDefaultLogo,
    name: "Organization Defaults",
    selected: true,
  },
  {
    Icon: CAndBLogo2,
    Icon2: CAndBLogo,
    selectedStateIcon: CAndBLogo2,
    unselectedStateIcon: CAndBLogo,
    name: "Company and Brand",
    selected: false,
  },

  {
    Icon: AccOverviewLogo2,
    Icon2: AccOverviewLogo,
    selectedStateIcon: AccOverviewLogo2,
    unselectedStateIcon: AccOverviewLogo,
    name: `Account  Overview`,
    selected: false,
  },
  {
    Icon: ClientsSignupLogo2,
    Icon2: ClientsSignupLogo,
    selectedStateIcon: ClientsSignupLogo2,
    unselectedStateIcon: ClientsSignupLogo,
    name: "Clients Sign Up",
    selected: false,
  },
  {
    Icon: UserManagementLogo2,
    Icon2: UserManagementLogo1,
    selectedStateIcon: UserManagementLogo2,
    unselectedStateIcon: UserManagementLogo1,
    name: "User Management",
    selected: false,
  },
];
export default function Settings() {
  const [modalActive, setModalActive] = useState(false);
  const { firstName, lastName } = useSelector((state) => state.user);
  const [tagModalActive, setTagModalActive] = useState(false);
  const [addCodeModalActive, setAddCodeModalActive] = useState(false);
  const [subModalData, setSubModalData] = useState(subModalInitialState);
  const [addTestModalActive, setAddTestModalActive] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [fetchS, setFetchS] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    type: "Paragraph",
    text: "Add",
    values: [],
  });
  const { organization } = useSelector((state) => state.organization);

  const [searchParams, setSearchParams] = useSearchParams();
  const [tabs, setTabs] = useState(initialTabs);
  const [activeTab, setActiveTab] = useState(1);
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
  const timeZones = moment.tz.names(); // String[]

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
  const [updateSetting, updateSettingResp] = useUpdateOrgSettingMutation();
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
    offer: true,
    Expertise: false,
    Answer: false,
    Sessions: false,
    Scheduled: false,
  });

  const imageUploadRef = useRef();
  const [tagImage, setTagImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [tagText, setTagText] = useState("");
  const [modalData, setModalData] = useState(initialState);
  const dispatch = useDispatch();

  const [fetchedPermissions, setThePermission] = useState([]);

  const handlePermissionOption = (value, key) => {
    let nvalue = value;
    if (!isNaN(Number(value))) {
      nvalue = Number(value);
    }
    const arr = fetchedPermissions?.map((per) => {
      if (per._id === key) {
        return { ...per, choosedValue: nvalue };
      }
      return { ...per };
    });
    const body = {
      orgId: organization._id,
      permissionId: key,
      choosedValue: value,
    };

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

  const handleClose = () => {
    setModalActive(false);

  }
  const handleTagModal = (text) => {
    //console.log(text);
    setTagModalActive(true);
    setSelectedImageTag(text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const reqBody = { ...adminModalDetails };
    updateFields({ id: user.id, fields: reqBody }).then((res) => {
      handleClose();
      if (res.error) {
        return; //console.log(res.error);
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
      setSettingsData(organization?.settings);

      setThePermission(organization?.settings?.permissions);
    });

  };

  const onRemoveTextImageTag = (item, key, idx) => {
    let updatedField = settingsData[key].filter((item, i) => i !== idx);
    let updatedSetting = {
      [key]: updatedField,
    };

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

  const updateAndFetchsettings = (updatedSetting, setloadingCustom) => {
    if (!organization || !settingsData || !updatedSetting) return;
    const settings = {
      ...settingsData,
      ...updatedSetting,
    };
    const body = {
      settings,
    };

    setloadingCustom && setloadingCustom(true);
    setSaveLoading(true);
    updateSetting(body)
      .then((res) => {
        setloadingCustom && setloadingCustom(false);
        setSaveLoading(false);
        setSettingsData(res.data.data.updatedOrg.settings);
        dispatch(updateOrganizationSettings(res.data.data.updatedOrg.settings));
      })
      .catch((err) => {
        setloadingCustom && setloadingCustom(false);
        setSaveLoading(false);
        //console.log("err", err);
      });
  };

  const submitImageModal = (e) => {
    e.preventDefault();
    // //console.log(tagText)
    // //console.log(tagImage)
    // //console.log(selectedImageTag)

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
    // //console.log(append)

    if (append === "") return;
    setSaveLoading(true);
    axios
      .patch(`${BASE_URL}api/user/Orgsettings/${append}`, formData, {
        headers: getAuthHeader(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      })
      .then((res) => {
        console.log('resp--', res.data);
        dispatch(
          updateOrganizationSettings(res.data.data.updatedSetting.settings)
        );
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
    //   //console.log(e.target.files[0])
    setImage(e.target.files[0]);
    const formData = new FormData();
    formData.append("offer", e.target.files[0]);
    // updateImage(formData)
    //    .then(res => {
    //       //console.log(res)
    //       setSettingsData(res.data.data.setting)
    //    })
    axios
      .patch(`${BASE_URL}api/user/setting/addimage`, formData)
      .then((res) => {
        // //console.log(res)
        setImage(null);
        fetchSettings();
      });
  };

  const onRemoveImage = (itemToRemove) => {
    //console.log(itemToRemove);
    let updatedField = settingsData.offerImages.filter(
      (item) => item._id !== itemToRemove._id
    );
    let updatedSetting = {
      offerImages: updatedField,
    };
    //console.log(updatedSetting);
    updateAndFetchsettings(updatedSetting);
  };
  const handleaddimage = (idx, file) => {
    //     const arr = [...offerImages]; // Create a shallow copy of the array
    // // Create a new object with the same properties as the first object in arr
    // console.log(file);
    // const modifiedObject = { ...arr[idx], image: file };

    // // Update the array with the modified object
    // arr[idx] = modifiedObject;
    // console.log('asdasd',arr);
    //    let updatedSetting = {
    //      offerImages: arr,
    //    };
    //    console.log(arr);

    //   updateAndFetchsettings(updatedSetting);
    // user/setting/updateSpecificImg
    const formData = new FormData();
    console.log({ file, idx })
    formData.append("file", file);
    formData.append("imageIndex", idx);
    setSaveLoading(true);
    axios.patch(`${BASE_URL}api/user/setting/updateSpecificImg`, formData, {
      headers: getAuthHeader(),
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    }).then((res) => {
      console.log(res.data.data.setting.settings);
      dispatch(
        updateOrganizationSettings(res.data.data.setting.settings)
      );
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
  }
  const handleImageRemoval = (idx) => {
    console.log(idx);
    if (offerImages[idx]?.link == '' && offerImages[idx]?.buttonText == '') {
      const arr = offerImages.filter((item, i) => {
        return i !== idx;
      });
      let updatedSetting = {
        offerImages: arr,
      };

      updateAndFetchsettings(updatedSetting);
    }
    else {
      const arr = [...offerImages]; // Create a shallow copy of the array
      // Create a new object with the same properties as the first object in arr
      const modifiedObject = { ...arr[idx], image: '' };

      // Update the array with the modified object
      arr[idx] = modifiedObject;
      let updatedSetting = {
        offerImages: arr,
      };
      updateAndFetchsettings(updatedSetting);
    }
  };
  const handleOfferChange = (i, key, value) => {
    let updatedField = settingsData.offerImages.map((item, idx) => {
      if (idx == i) {
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

  const onRemoveService = (itemToRemove) => {
    let updated = settingsData.servicesAndSpecialization.filter(
      (item) => item._id !== itemToRemove._id
    );
    let updatedSetting = {
      servicesAndSpecialization: updated,
    };
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

  useEffect(() => {
    fetchSettings();
  }, [organization]);

  const onAddService = (val) => {
    //console.log(val);
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
  const handleAddSpecialization = (text, key) => {
    let tempSettings = { ...settingsData };

    let updated = servicesAndSpecialization.map((serv) => {
      if (serv.service === key) {
        setSubModalServiceData((prev) => {
          return { ...prev, specialization: [...prev.specialization, text] };
        });
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
  };

  const handleAddSessionTag = (text, key) => {
    let tempSettings = { ...settingsData };

    let updated = sessionTags.map((serv) => {
      if (serv.heading === key) {
        setSubModalSessionData((prev) => {
          return { ...prev, items: [...prev.items, text] };
        });
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
    // //console.log('updatedSetting', updatedSetting)
  };
  const onRemoveSpecialization = (text, service) => {
    // //console.log(text);
    // //console.log(service);
    let updated = servicesAndSpecialization.map((serv) => {
      if (serv.service === service) {
        let updatedSpec = serv.specialization.filter((spec) => spec !== text);
        setSubModalServiceData({ ...serv, specialization: updatedSpec });
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

  const onRemoveSessionTagItem = (text, heading) => {
    // //console.log(text);
    // //console.log(service);
    let updated = sessionTags.map((serv) => {
      if (serv.heading === heading) {
        let updatedSpec = serv.items.filter((spec) => spec !== text);
        setSubModalSessionData({ ...serv, items: updatedSpec });
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
      // //console.log('updatedSetting', updatedSetting);
      updateAndFetchsettingsNew2(updatedSetting);
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
      // //console.log('updatedSetting', updatedSetting);
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
    axios
      .get(`${BASE_URL}api/test`, { headers: getAuthHeader() })
      .then((res) => {
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
  //console.log("tests", allTestData, filteredTests);

  useEffect(() => {
    fetchTests();
  }, []);
  const handleAddTest = (code) => {
    //console.log(code);
    setSelectedSubscriptionData(code);
    setAddTestModalActive(true);
  };

  const handleADdTestSubmit = (e) => {
    e.preventDefault();
    //console.log(updatedSubscriptionData);
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
    //console.log("updatedSetting", updatedSetting);
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
    //console.log(updatedSetting);
    updateAndFetchsettings(updatedSetting);
  };
  const onRemoveCode = (code) => {
    let updated = settingsData.subscriptionCode.filter(
      (item) => item._id !== code._id
    );
    let updatedSetting = {
      subscriptionCode: updated,
    };
    // //console.log(updatedSetting);
    updateAndFetchsettings(updatedSetting);
  };
  const onEditCode = (code) => {
    //console.log("session", code);
    setSubModalData({
      ...code,
      editing: true,
    });
    setSelectedSubscriptionData(code);
    setAddCodeModalActive(true);
  };

  const handleTestChange = (item) => {
    //console.log("tsests", item);
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
    if (organization?.settings?.customFields?.length === 5)
      return alert("Only 5 fields are allowed");
    const body = {
      orgId: user.associatedOrg,
      name: newQuestion.text,
      dataType: newQuestion.type,
      values: newQuestion.values,
    };
    setAddNewQuestionModalActive(false);
    addNewQuestion(body).then((res) => {
      if (res.error) {
        //console.log(res.error);
        return;
      }
      //  window.location.reload();
      // //console.log("reshi", res);

      fetchSettings();
      setFetchS(res);
    });
  };

  useEffect(() => {
    const activeTab = searchParams.get("tab");
    if (activeTab) {
      setActiveTab(parseInt(activeTab));
    }
  }, [searchParams.get("tab")]);
  /* new */

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
  const [addServiceModalActive, setAddServiceModalActive] = useState(false);
  const [addSessionModalActive, setAddSessionModalActive] = useState(false);
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
  const [offersNew, setOffersNew] = useState([]);
  const [addServices2, setServices2] = useState({
    service: "",
    specialization: [],
  });
  const [addSession2, setSession2] = useState({
    heading: "",
    items: [],
  });

  const [addOne, setOne] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const onRemoveSpecialization2 = (text, service) => {


    let arr = [...selectedServiceData?.specialization];

    arr = arr.filter((it) => it !== text);

    setSelectedServiceData({
      ...selectedServiceData,
      specialization: arr,
    });
  };
  const onRemoveSessionTagItem2 = (text, heading) => {

    let arr = [...selectedSessionData?.items];

    arr = arr.filter((it) => it !== text);

    setSelectedSessionData({
      ...selectedSessionData,
      items: arr,
    });

  };
  const handleAddSpecialization2 = (text, key) => {
    let tempSettings = { ...settingsData };

    let arr = [...selectedServiceData?.specialization];
    arr.push(text);
    setSelectedServiceData({
      ...selectedServiceData,
      specialization: arr,
    });
  };
  const handleAddSessionTag2 = (text, key) => {
    let arr = [...selectedSessionData?.items];

    arr.push(text);

    setSelectedSessionData({
      ...selectedSessionData,
      items: arr,
    });



  };

  useEffect(() => {
    if (settingsData && settingsData?.offerImages) {
      let arr = [];
      for (let i = 0; i < 4 - settingsData?.offerImages.length; i++) {
        arr.push({
          link: "",
          image: "",
          buttonText: "",
        });
      }
      setOffersNew([...arr]);
    }
  }, [settingsData?.offerImages, settingsData]);
  useEffect(() => {
    setUpdatedSessionData(selectedSessionData);
  }, [selectedSessionData]);
  useEffect(() => {
    setUpdatedServiceData(selectedServiceData);
  }, [selectedServiceData]);


  const selectAssignmentOnblur = () => {
    // if (searchedTest.length === 0) {
    if (subModalData.tests.length > 0) {
      try {
        const test = filteredTests.find(test => test._id === subModalData.tests[0])
        if (test) {
          setSearchedTest(test.value)
        }
      } catch (error) {

      }

    }
    // }
  }
  // console.log('settingsData', settingsData);
  if (!settingsData) return <></>;
  if (Object.keys(settingsData).length === 0) return <></>;
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
    // //console.log(updatedSetting);
    updateAndFetchsettings(updatedSetting);
  };

  const handleChange = (key, value) => {
    const body = {
      [key]: value,
    };
    updateAndFetchsettings(body);
  };
  {
    //console.log("searchTests0", searchedTest);
  }

  const onEditService = (code) => {
    setSubModalServiceData({
      ...code,

      editing: true,
    });
    setSelectedServiceData(code);
    setAddServiceModalActive(true);
  };
  const onEditSession = (code) => {
    //console.log("session", code);
    setSubModalSessionData({
      ...code,
      editing: true,
    });
    setSelectedSessionData(code);
    setAddSessionModalActive(true);
  };
  const handleServicePause = (item) => {
    let key = item?._id;
    let tempSettings = { ...settingsData };

    console.log('item', item);
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
    console.log("updated", updated);
    let updatedSetting = {
      servicesAndSpecialization: updated,
    };
    updateAndFetchsettings(updatedSetting);
  };

  const handleServicePause2 = (item) => {
    let key = item?._id;
    let tempSettings = { ...settingsData };
    console.log("item--", item);

    let updated = sessionTags.map((serv) => {
      if (serv._id === key) {
        return {
          ...serv,
          pause: !serv?.pause,
        };
      } else {
        return { ...serv };
      }
    });
    let updatedSetting = {
      sessionTags: updated,
    };
    console.log("updatedSetting", updatedSetting);

    updateAndFetchsettings(updatedSetting);
  };

  const handleAddServiceName2 = (text, key) => {
    let tempSettings = { ...settingsData };

    let updated = servicesAndSpecialization.map((serv) => {
      if (serv._id === key) {
        return selectedServiceData;
      } else {
        return { ...serv };
      }
    });

    let updatedSetting = {
      servicesAndSpecialization: updated,
    };
    updateAndFetchsettings(updatedSetting);
    setAddServiceModalActive(false);
    setSubModalServiceData(subModalInitialServiceState);
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
    ////console.log("upper",updated)
    let updatedSetting = {
      sessionTags: updated,
    };
    updateAndFetchsettings(updatedSetting);
    setAddSessionModalActive(false);
    setSubModalSessionData(subModalInitialSessionState);
    // //console.log('updatedSetting', updatedSetting)
  };
  const handleAddSessionName2 = (text, key) => {
    let tempSettings = { ...settingsData };

    let updated = sessionTags.map((serv) => {
      if (serv._id === key) {
        return selectedSessionData
      } else {
        return { ...serv };
      }
    });

    let updatedSetting = {
      sessionTags: updated,
    };
    updateAndFetchsettings(updatedSetting);
    setAddSessionModalActive(false);
    setSubModalSessionData(subModalInitialSessionState);
  };

  const submitImageModalNew = (file2, val, e) => {
    // //console.log(tagText)
    // //console.log(tagImage)
    // //console.log(selectedImageTag)
    e.preventDefault();
    const file = file2;
    if (!file) {
      return;
    }
    e.target.value = "";
    let size = file.size / 1024;
    size = size / 1024;
    if (size > 1) {
      alert("File size is larger than than 1MB");
      return;
    }
    if (loading2) return;
    const formData = new FormData();

    let append = "";

    append = "addimage";
    // formData.append("image", file);
    formData.append("link", val?.link);
    formData.append("offer", file);
    formData.append("buttonText", val?.buttonText);

    setLoading2(true);
    setSaveLoading(true);
    axios
      .patch(`${BASE_URL}api/user/Orgsettings/${append}`, formData, {
        headers: getAuthHeader(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      })
      .then((res) => {
        setSaveLoading(false);
        setLoading2(false);
        console.log("resp--", res.data);
        dispatch(
          updateOrganizationSettings(res.data.data.updatedSetting.settings)
        );
        fetchSettings();
        let settingsData2 = res.data.data.updatedSetting.settings;
        if (settingsData2?.offerImages) {
          let updatedField = settingsData2.offerImages?.map((it, id) => {
            if (id === settingsData2.offerImages?.length - 1) {
              return { ...it, buttonText: val?.buttonText };
            }
            return { ...it };
          });

          let updatedSetting = {
            offerImages: updatedField,
          };
          console.log("updatedSetting", updatedSetting);
          updateAndFetchsettings(updatedSetting);
        } else {
          // setTagImage(null);
          // setTagText("");
          // setSelectedImageTag("");
          // setImageName("");
          // setTagModalActive(false);
          fetchSettings();
        }
        setSaveLoading(false);
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
  const handleOfferChange2 = (offer, key, value) => {
    let updatedField = settingsData.offerImages.map((item) => {
      if (item._id === offer._id) {
        return { ...item, [key]: value };
      } else {
        return item;
      }
    });
    // let updatedSetting = {
    //   offerImages: updatedField,
    // };
    //console.log("updatedSetting", updatedSetting);
    // updateAndFetchsettings(updatedSetting);
  };

  const updateAndFetchsettingsNew2 = (updatedSetting) => {
    if (!organization || !settingsData || !updatedSetting) return;
    const settings = {
      ...settingsData,
      ...updatedSetting,
    };
    const body = {
      settings,
    };
    //console.log("body", body);

    setSaveLoading(true);
    updateSetting(body)
      .then((res) => {
        //console.log("updated", res.data.data);
        alert("Succesfully Added!");
        setOne(false);
        setAddServiceModalActive(false);
        setAddSessionModalActive(false);
        setAddCodeModalActive(false);
        setServices2({ service: "", specialization: [] });
        setSession2({
          heading: "",
          items: [],
        });
        setAddCodeModalActive(false);
        setSubModalData(subModalInitialState);
        setSaveLoading(false);
        setSettingsData(res.data.data.updatedOrg.settings);
        dispatch(updateOrganizationSettings(res.data.data.updatedOrg.settings));
      })
      .catch((err) => {
        alert("Error Occured!");
        setSaveLoading(false);
        //console.log("err", err);
      });
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
    //console.log("tsests", item);
    if (subModalData?.tests?.includes(item._id)) {
      let updated = subModalData.tests.filter((test) => test !== item._id);
      setSubModalData((prev) => ({
        ...prev,
        tests: updated,
      }));
    } else {
      setSubModalData((prev) => ({
        ...prev,
        tests: [...subModalData.tests, item._id],
      }));
    }
  };

  return (
    <>
      <div className="  min-h-screen px-[140px] mx-auto pt-[50px]">
        <p className="text-[#24A3D9]   text-20 mb-7">
          <span onClick={() => navigate("/")} className="cursor-pointer ">
            {organization?.company +
              "  >  " +
              firstName +
              "  " +
              lastName +
              "  >  "}
          </span>
          <span className="font-semibold">Settings</span>
        </p>
        <div className={`flex items-end overflow-hidden pl-[17px] ${styles.navBar}`} >
          {
            tabs.map((item, index) => {
              const isActive = activeTab === index + 1;
              return (
                <button
                  key={index}
                  style={{ height: "88.88%" }}
                  className={`relative flex items-center ${styles.navItem}
                                  ${isActive ? styles.active : ""}
              `}
                  onClick={() => changeTab(index + 1)}
                >
                  <div className="mr-[10px]" >
                    <img
                      src={
                        isActive ? item.selectedStateIcon : item.unselectedStateIcon
                      }
                    />
                  </div>
                  <div className={`${styles.name}`} >
                    {item.name}
                  </div>

                  {
                    isActive ? (
                      <>
                        <div className="absolute bg-[#fff] h-full w-[10px] -translate-x-full z-[3]"
                          style={{
                            left: "1px",
                          }}
                        ></div>
                        <div className="absolute bg-[#26435F] h-full w-[12px] left-0 -translate-x-full z-[3]"
                          style={{
                            left: "1px",
                            borderBottomRightRadius: "100px"
                          }}
                        ></div>

                        <div className="absolute bg-[#fff] h-full w-[10px] translate-x-full z-[3]"
                          style={{
                            right: "1px"
                          }}
                        ></div>
                        <div className="absolute bg-[#26435F] h-full w-[11px] translate-x-full z-[3]"
                          style={{
                            right: "1px",
                            borderBottomLeftRadius: "100px"
                          }}
                        ></div>
                      </>
                    ) : (<></>)
                  }
                </button>
              )
            })
          }
        </div>
        <div className=" flex w-full flex-1 items-center mb-[30px]">
          <div
            className={`${styles.tabsContainer} gap-7 flex-1 !shadow-[0px_0px_2.5px_0px_rgba(0,0,0,0.25)]`}
          >
            {/* {tabs.map((item, idx) => {
              return (
                <div
                  className={`${styles.tab} ${activeTab === idx + 1 ? styles.selectedTab : ""
                    } cursor-pointer h-full`}
                  onClick={() => changeTab(idx + 1)}
                >
                  <div className={`"h-full  w-full flex justify-center items-center ${activeTab === idx + 1?'':''}`}>
                    <div>
                      {activeTab === idx + 1 && (
                        <img src={item.Icon} className="w-[15px] h-[15px]" alt="item-logo" />
                      )}
                      {activeTab === idx + 1 || (
                        <img src={item.Icon2} className="w-[15px] h-[15px]" alt="item-logo" />
                      )}
                    </div>
                    <p className="flex items-center py-2  w-[calc(191*0.0522vw)] justify-center text-base-17-5  whitespace-nowrap">{item.name} </p>
                  </div>
                  {/ {activeTab === idx + 1 && (
                    <img
                      src={ActiveTab}

                      className={`${styles.activeBgIcon} lg:top-[10px] `}
                      alt="item-background"
                    />
                  )} }
                </div>
              );
            })} */}
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
            <div className="flex items-center gap-x-8 mb-4">
              <div>
                <InputSelect
                  labelClassname="text-20 mb-1"
                  inputContainerClassName=" text-base-17-5 shadow-[0px_0px_2.500000476837158px_0px_#00000040] bg-[#FFFFFF]"
                  optionListClassName="text-base-17-5"
                  optionClassName="text-base-17-5"
                  optionData={timeZones}
                  placeholderClass="text-base-17-5"
                  parentClassName=" text-base-17-5 py-0 min-w-[387.5px]"
                  label="Default Time Zone"
                  value={settingsData.timeZone}
                  onChange={(val) => handleChange("timeZone", val)}
                  Tooltip={
                    <span className="absolute   left-[30px] z-[1000] w-[450px] scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
                      <h2 className="text-[#24A3D9] font-medium text-[16px] capitalize mb-[16px]">Default Time Zone</h2>
                       Note: Default Timezone will be used by default for calendar view and scheduling sessions. You can still view the calendar or schedule sessions in timezones different than the default timezone through the schedule tab. 
                    </span>
                  }
                />
              </div>
              <InputSelect
                labelClassname="text-20 mb-1"
                inputContainerClassName=" text-base-17-5 shadow-[0px_0px_2.500000476837158px_0px_#00000040] bg-[#FFFFFF]"
                optionListClassName="text-base-17-5"
                optionClassName="text-base-17-5"
                optionData={["dd/mm/yy", "mm/dd/yy", "yy/mm/dd"]}
                placeholderClass="text-base-17-5"
                parentClassName=" text-base-17-5 py-0 min-w-[387.5px]"
                label="Default Date Format"
                value={settingsData.dateFormat}
                onChange={(val) => handleChange("dateFormat", val)}
              />
            </div>
            <div className="h-[1.25px] bg-[#CBD6E2] mb-4 mt-8"></div>
            <SettingsCard
              titleClassName="text-20"
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
              Tooltip={
                <span className="absolute   left-[30px] z-[1000] w-[450px] scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
                  <h2 className="text-[#24A3D9] font-medium text-[16px] capitalize mb-[16px]">Lead Status Items (Parent / Student)</h2>
                  Note: Lead Status Item can be used to manage and keep track of your exisitng or potential clients on the platform. You can create your own client tagging system by adding various items to manage your CRM. For example, "Cold", "Warm", "Interested", "Active" and "Finished" can be some of the tags that you use to manage your leads.
                </span>
              }
            />
            <div className="h-[1.25px] bg-[#CBD6E2] my-4"></div>
            <SettingsCard
              titleClassName="text-20"
              title="Tutor Status Items"
              body={
                <div className="flex items-center flex-wrap [&>*]:mb-[10px] gap-x-[18.75px] gap-y-[25px] px-[31.25px] py-[26.25px]  bg-white shadow-small p-4 rounded-5 text-base-17-5">
                  <AddTag onAddTag={handleAddTag} keyName="tutorStatus" className='w-[143.25px] bg-primary mr-[1px]' />
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
              Tooltip={
                <span className="absolute   left-[30px] z-[1000] w-[450px] scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
                  <h2 className="text-[#24A3D9] font-medium text-[16px] capitalize mb-[16px]">Tutor Status Items</h2>
                  Note: Tutor Status Item can be used to manage and keep track of your tutors and their availability. You can create your own tutor tagging system by adding various items to manage your CRM. For example, "Applied", "Interviewd", "Under Training", "Working" and "Former" can be some of the tags that you use to manage your tutors.
                </span>
              }
            />
            <div className="h-[1.25px] bg-[#CBD6E2] mb-8"></div>
            <SettingsCard
              titleClassName="text-20"
              title="Manage Referral Codes"
              className={styles["bordered-settings-container"]}
              body={
                <div>
                  <div className="max-h-[330px] overflow-auto custom-scroller p-1 scrollbar-vertical ">
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
                              openModal={true
                              onAddTag={(code) => handleAddTest(subscription)}
                              keyName={subscription.code}
                              text="Add Tests"
                            /> */}
                                <FilterItems
                                  isString={true}
                                  onlyItems={true}
                                  keyName={subscription.code}
                                  items={subscription.tests}
                                  fetchData={true}
                                  filteredTests={filteredTests}
                                  api="test"
                                  onRemoveFilter={onRemoveCodeTest}
                                  className="pt-1 pb-1 text-base-17-5"
                                />
                              </div>
                              <div className="flex items-center gap-x-4">
                                <ToggleBar
                                  boxClass="!h-[16px]"
                                  toggle={{
                                    value: !subscription.pause,
                                    key: "code",
                                  }}
                                  onToggle={() => handlePause(subscription)}
                                ></ToggleBar>

                                <div
                                  className="w-5 h-5 flex items-center justify-center  rounded-full cursor-pointer"
                                  onClick={() => onEditCode(subscription)}
                                >
                                  <img
                                    src={EditBlueIcon}
                                    className="w-4"
                                    alt="edit"
                                  />
                                </div>
                                <div
                                  className="w-5 h-5 flex items-center justify-center  rounded-full cursor-pointer"
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
                  </div>
                  <AddTag
                    children="Add New Code"
                    className="px-[12px] py-3 mt-5 bg-primary text-white w-[189.25px]"
                    text="Add New Code"
                    hideIcon={false}
                    openModal={true}
                    onAddTag={onAddCode}
                  />
                </div>
              }
              Tooltip={
                <span className="absolute   left-[30px] z-[1000] w-[450px] scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
                  <h2 className="text-[#24A3D9] font-medium text-[16px] capitalize mb-[16px]">Manage Referral Codes</h2>
                  Note: Referral codes can be used by your leads (parents and students) to sign up for accessing Evallo’s portal. You can choose how long you want to provide them this access and what assignments should show up automatically after they sign up with your organization.
                </span>
              }
            />

            <SettingsCard
              titleClassName="text-20"
              title="Manage Services & Topics"
              className={styles["bordered-settings-container"]}
              body={
                <div>
                  <div className="max-h-[340px] overflow-auto custom-scroller p-1 scrollbar-vertical">
                    {servicesAndSpecialization !== undefined &&
                      servicesAndSpecialization.map((service, i) => {
                        return (
                          <div
                            key={i}
                            className="bg-white shadow-small px-[31.25px] py-[26.25px] mb-3 rounded-md"
                          >
                            <div className="flex items-center gap-3 justify-between pr-8">
                              <p className="font-medium text-[#24A3D9] text-medium min-w-[100px]">
                                {service.service}
                              </p>
                              <div className="flex ml-16 flex-1 gap-x-[27.5px] gap-y-[25px] items-center flex-wrap ">
                                {/* <AddTag
                                onAddTag={handleAddSpecialization}
                                keyName={service.service}
                                text="Add Item"
                              /> */}
                                <FilterItems
                                  isString={true}
                                  onlyItems={true}
                                  keyName={service.service}
                                  items={service.specialization}
                                  onRemoveFilter={onRemoveSpecialization}
                                  className="pt-1 pb-1 text-base-17-5"
                                />
                              </div>
                              <div className="flex items-center gap-x-4">
                                <ToggleBar
                                  boxClass="!h-[16px]"
                                  toggle={{
                                    value: !service.pause,
                                    key: "code",
                                  }}
                                  // manual={true}
                                  onToggle={() => handleServicePause(service)}
                                ></ToggleBar>
                                <div
                                  className="w-5 h-5 flex items-center justify-center  rounded-full cursor-pointer"
                                  onClick={() => onEditService(service)}
                                >
                                  <img
                                    src={EditBlueIcon}
                                    className="w-4"
                                    alt="edit"
                                  />
                                </div>

                                <div
                                  className="w-5 h-5 flex items-center justify-center  rounded-full cursor-pointer"
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
                    className="px-[18px] py-3 mt-5 bg-primary text-white"
                    text="Add Service"
                   // onAddTag={onAddService}
                   onAddTag={()=>{
                    setOne(true)
                    setAddServiceModalActive(true);

                   }}
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
              Tooltip={
                <span className="absolute   left-[30px] z-[1000] w-[450px] scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
                  <h2 className="text-[#24A3D9] font-medium text-[16px] capitalize mb-[16px]">Manage Services & Topics</h2>
                  Note: Services refer to the core offerings that your business provides in a broad category. Topics are more specific items that you specialize in while providing these services. For example, Test Prep can be a “Service” with “SAT” and “ACT” as two topics under it. Read detailed documentation in Evallo’s knowledge base.
                </span>
              }
            />

            <SettingsCard
              titleClassName="text-20"
              title="Session Tags & Reconciliation"
              className={styles["bordered-settings-container"]}
              body={
                <div>
                  <div className="max-h-[360px] overflow-auto custom-scroller p-1 scrollbar-vertical">
                    {sessionTags !== undefined &&
                      sessionTags.map((service, i) => {
                        return (
                          <div
                            key={i}
                            className="bg-white shadow-small px-[31.25px] py-[26.25px] mb-3 rounded-md"
                          >
                            <div className="flex items-center  py-1 justify-between pr-8">
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
                                  className="pt-1 pb-1 text-base-17-5"
                                />
                              </div>
                              <div className="flex items-center gap-x-4">
                                <ToggleBar
                                  boxClass="!h-[16px]"
                                  toggle={{
                                    value: !service.pause,
                                    key: "code",
                                  }}
                                  // manual={true}
                                  onToggle={() => handleServicePause2(service)}
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
              Tooltip={
                <span className="absolute   left-[30px] z-[1000] w-[450px] scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
                  <h2 className="text-[#24A3D9] font-medium text-[16px] capitalize mb-[16px]">Session Tags & Reconciliation</h2>
                  Note: Session Tags are used for optimizing the time it takes for your tutors to reconcile sessions. These are checkboxes available when reconciling sessions in the Calendar that can be quickly used to add further details about the session, such as the topics covered, homework assigned, student mood, etc. Read detailed documentation in Evallo’s knowledge base.
                </span>
              }
            />

            <SettingsCard
              titleClassName="text-20"
              title="Edit Announcements"
              toggle={{ value: toggleImage.offer, key: "offer" }}
              onToggle={onToggle}
              body={
                <div className=" bg-white w-full  gap-x-5 py-5 px-[52px] rounded-br-5 rounded-bl-5 pr-12">
                  <p className="text-medium font-medium mt-[-5px] text-[#667085] mb-6">
                    <span className="font-bold mr-1">⚠️ Note:</span>
                    Announcements, as the name implies, can be used to announce
                    important aspects of your business. Displayed on the
                    top-left corner in Parent and Student Dashboards, these can
                    be used to highlight your services, offers, referral
                    incentives, webinars, events, proctored tests, tutorial
                    videos, and pretty much anything you want your Clients to
                    see as soon as they log into their Evallo dashboard. You can
                    add a maximum of 4 Announcements at a time. Read detailed
                    documentation in Evallo’s
                    <span
                      className="text-[#24A3D9] cursor-pointer underline"
                      onClick={() => navigate("/support")}
                    >
                      {" "}
                      knowledge base.
                    </span>
                  </p>
                  <div className="flex items-center flex-1 !w-[100%] overflow-x-auto custom-scroller-2 [&>*]:mb-[10px] bg-white rounded-br-5 rounded-bl-5 mb-3 py-5 ">
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
                    className="pt-1 pb-1 text-base-17-5"
                  /> */}

                    {offerImages?.map((offer, i) => {
                      return (
                        <>
                          <div className="flex-shrink-0 w-[300px]" key={offer._id}>
                            <div className="relative">
                              {toggleImage.offer && (
                                <div className=" overflow-hidden mb-5">
                                  <div className="flex">
                                    {offer.image !== '' ?
                                      <div className="w-[300px] h-[150px]">
                                        <img
                                          src={`${awsLink}${offer.image}`}
                                          alt="offer-image3"
                                          className="w-full h-full object-cover rounded-7"
                                        />
                                      </div>
                                      : <div className="w-[300px] h-[150px] flex-1">
                                        <div className="flex w-[100%] bg-[#F5F8FA] rounded-md mb-8 flex-col justify-center items-center">
                                          <div className="mt-[20px] mb-[10px] items-center flex justify-center">
                                            <img
                                              src={fileupload}
                                              alt="fileuploadIcon"
                                            ></img>
                                          </div>
                                          <div className="flex justify-center">
                                            <label
                                              htmlFor="file3"
                                              className={`block cursor-pointer text-sm text-white bg-[#517CA8] hover:bg-[#517CA8] items-center justify-center  rounded-[5px]  px-3 py-2 text-base-17-5 text-center ${loading2 ? "cursor-wait" : ""
                                                }`}
                                            >
                                              {loading2 && offer?.image
                                                ? "Submitting..."
                                                : " Choose File"}
                                            </label>
                                            <input
                                              accept="image/*"
                                              className="hidden"
                                              onChange={(e) => {
                                                console.log('szszs', e.target.files[0]);
                                                handleaddimage(i, e.target.files[0])
                                                // setImageName(e.target.files[0].name);
                                              }}
                                              id="file3"
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
                                      </div>
                                    }
                                  </div>
                                </div>
                              )}
                              <div>
                                {/* {offer.image !== '' && <div
                                  onClick={() => handleImageRemoval(i)}
                                  className="w-7 h-7 z-5000 -top-2 right-[9px] flex items-center absolute justify-center  rounded-full cursor-pointer"
                                >
                                  <img
                                    src={DeleteIcon}
                                    className="w-5"
                                    alt="delete"
                                  />
                                </div>} */}
                                <InputField
                                  defaultValue={offer?.link?.trim()}
                                  inputClassName={" text-base-17-5 bg-[#F5F8FA]"}
                                  parentClassName={"mb-3 bg-[#F5F8FA]"}
                                  placeholder={"Hyperlink"}
                                  onBlur={(e) =>
                                    handleOfferChange(
                                      i,
                                      "link",
                                      e.target.value
                                    )
                                  }
                                />
                                <InputField
                                  defaultValue={offer.buttonText}
                                  parentClassName={"bg-[#F5F8FA]"}
                                  inputClassName={" text-base-17-5 bg-[#F5F8FA]"}
                                  placeholder={
                                    "Button Text (eg. View, Enroll, etc.)"
                                  }
                                  onBlur={(e) =>
                                    handleOfferChange(
                                      i,
                                      "buttonText",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          {
                            offerImages.length - 1 > i ?
                              <div className=" relative w-[2px] rounded-md  bg-[#00000030] !h-[300px] mx-[50px]"></div>
                              : <></>
                          }
                        </>
                      );
                    })}
                    {offersNew?.length > 0 &&
                      offersNew?.map((off, idx) => {
                        return (
                          <div className="relative flex min-w-[250px] ">
                            <div className=" relative w-[2px] rounded-md  bg-[#00000030] !h-[300px] mx-[50px]"></div>

                            <div className="flex-shrink-0 w-[300px]">
                              <div className="flex w-[100%] bg-[#F5F8FA] rounded-md mb-8 flex-col justify-center items-center">
                                <div className="mt-[20px] mb-[10px] items-center flex justify-center">
                                  <img
                                    src={fileupload}
                                    alt="fileuploadIcon"
                                  ></img>
                                </div>

                                <div className="flex items-center text-center justify-center text-base-15">
                                </div>

                                <div className="flex justify-center">
                                  <label
                                    htmlFor="file2"
                                    disabled={loading2}
                                    className={`block cursor-pointer text-sm text-white bg-[#517CA8] hover:bg-[#517CA8] items-center justify-center  rounded-[5px]  px-3 py-2 text-base-17-5 text-center ${loading2 ? "cursor-wait" : ""
                                      }`}
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
                                      let arr = offersNew;
                                      arr[idx].image = e.target.files[0];
                                      setOffersNew((prev) => [...arr]);
                                      submitImageModalNew(off?.image, off, e);
                                      // setImageName(e.target.files[0].name);
                                    }}
                                    id="file2"
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

            {/* <div className="flex items-center pb-2 text-[#26435F] font-medium text-xl text-20">
              <p className="pr-2">Set Permissions </p>
              <div className="group relative">
                <p>
                  <img
                    src={questionMark}
                    alt=""
                    onClick={() => {
                      console.log("set perm tool tip");
                    }}
                  />
                </p>

                <span className="absolute  -top-10 left-10 z-20 w-[333px]  scale-0 rounded-[13px] bg-[rgba(0,0,0,0.80)] text-white group-hover:scale-100 whitespace-normal py-5 px-3">
                  <h3 className="text-[#24A3D9] text-[20px] py-1 font-medium mb-1">
                    Set Permissions
                  </h3>
                  <span className="font-light leading-[0.5px] text-[18px]">
                    Here, you can select Viewing, Editing or Deleting
                    permissions for various users. Use the toggles below to
                    select these permissions for specific items related to
                    specific users. By default, we have set some these up for
                    you.
                  </span>
                </span>
              </div>
            </div>

            <div
              className={`bg-[#FFFFFF] border-[2.5px] px-[82px] border-dotted border-[#CBD6E2] mb-[30px] ${styles.permission}`}
            >
              {console.log(fetchedPermissions)}
              {fetchedPermissions?.map((item, id) => {
                return (
                  <>
                    {item.choosedValue === true ||
                      item.choosedValue === false ? (
                      <div
                        key={id}
                        className={`${id === 3 ? "!opacity-[0.7]" : ""
                          } pt-[34px] pb-[30px] border-b-2 border-[#CBD6E2] text-[#24A3D9] font-medium text-[17.5px] flex items-center justify-between text-base-17-5`}
                      >
                        <div className="flex items-center flex-row justify-start">
                          <p>{renderColoredText(item.name)}</p>
                          {id == 5 || id == 7 ? (
                            <div className="pl-4 group relative">
                              <p>
                                <img
                                  src={questionMark}
                                  alt=""
                                  onClick={() => {
                                    console.log("set perm tool tip");
                                  }}
                                />
                              </p>

                              <span className="absolute  -top-10 left-10 z-20 w-[333px]  scale-0 rounded-[13px] bg-[rgba(0,0,0,0.80)] text-white group-hover:scale-100 whitespace-normal py-5 px-3">
                                <h3 className="text-[#24A3D9] text-[20px] py-1 font-medium mb-1">
                                  {id == 5
                                    ? "Set Permissions"
                                    : id == 7
                                      ? " New Assignment Email Notifications "
                                      : null}{" "}
                                </h3>
                                <span className="font-light leading-[0.5px] text-[17.5px]">
                                  {id == 5
                                    ? "Enable or disable tutor access to add, update or delete sessions scheduled on a calendar. When disabled, tutors in your Organization will only be able to reconcile sessions and add session notes & tags, but will not be able to make any changes to the remaining details of a session. Enable this if you want to provide more autonomy to your tutors. Disable if you want to discourage them from managing their own schedule."
                                    : id == 7
                                      ? "Select whether you want to send email notifications when a new test is assigned to a student by a tutor or an admin."
                                      : null}
                                </span>
                              </span>
                            </div>
                          ) : null}
                        </div>

                        <ToggleBar
                          toggle={{ value: item.choosedValue, key: item._id }}
                          onToggle={(e) => id !== 3 && togglePermissions(e)}
                        ></ToggleBar>
                      </div>
                    ) : (
                      <div
                        className={`pt-[34px] pb-[30px]   text-[#24A3D9] font-medium text-[17.5px] flex justify-between border-b-2 border-[#CBD6E2] ${styles.permission} text-base-17-5`}
                      >
                        {" "}
                        <div className="flex items-center flex-row justify-start">
                          <p>{renderColoredText(item.name)}</p>
                          {id == 5 || id == 7 ? (
                            <div className="pl-4 group relative">
                              <p>
                                <img
                                  src={questionMark}
                                  alt=""
                                  onClick={() => {
                                    console.log("set perm tool tip");
                                  }}
                                />
                              </p>

                              <span className="absolute  -top-10 left-10 z-20 w-[333px]  scale-0 rounded-[13px] bg-[rgba(0,0,0,0.80)] text-white group-hover:scale-100 whitespace-normal py-5 px-3">
                                <h3 className="text-[#24A3D9] text-[20px] py-1 font-medium mb-1">
                                  {id == 5
                                    ? "Set Permissions"
                                    : id == 7
                                      ? " New Assignment Email Notifications "
                                      : null}{" "}
                                </h3>
                                <span className="font-light leading-[0.5px] text-[17.5px]">
                                  {id == 5
                                    ? "Enable or disable tutor access to add, update or delete sessions scheduled on a calendar. When disabled, tutors in your Organization will only be able to reconcile sessions and add session notes & tags, but will not be able to make any changes to the remaining details of a session. Enable this if you want to provide more autonomy to your tutors. Disable if you want to discourage them from managing their own schedule."
                                    : id == 7
                                      ? "Select whether you want to send email notifications when a new test is assigned to a student by a tutor or an admin."
                                      : null}
                                </span>
                              </span>
                            </div>
                          ) : null}{" "}
                        </div>
                        <p>
                          <select
                            onChange={(e) =>
                              handlePermissionOption(e.target.value, item._id)
                            }
                            id="option"
                            className="border border-gray-300 px-2  rounded-md text-[#26435F] bg-[#E9ECEF]"
                          >
                            <option value={item.choosedValue}>
                              {`   ${item.permissionActionName ===
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
                                    {` ${item.permissionActionName ===
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
            </div> */}
          </div>
        ) : (
          <></>
        )}
        {activeTab === 2 && <CompanyAndBround />}
        {activeTab === 4 && (
          <SignupTab
            setAddNewQuestionModalActive={setAddNewQuestionModalActive}
            fetchS={fetchS}
            orgData={user}
            fetchSettings={fetchSettings}
            organization={organization}
            updateAndFetchsettings={updateAndFetchsettings}
          />
        )}
        {activeTab === 3 && <AccountOverviewWithSubscriptionInfo />}
        {activeTab === 5 && <OrgAdminUserManagement />}
      </div>
      {modalActive && (
        <Modal
          classname={"max-w-840 mx-auto"}
          titleClassName="text-20 mb-[18px]"
          title="Edit Details"
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
                    labelClassname="text-20 ml-4 mb-0.5"
                    placeholder="Admin Name"
                    inputContainerClassName=" text-base-17-5 px-5 bg-primary-50 border-0"
                    inputClassName="bg-transparent"
                    placeholderClass="text-base-17-5"
                    parentClassName=" text-base-17-5 py-0 w-full mr-4"
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
                    labelClassname="text-20 ml-4 mb-0.5"
                    placeholder="Admin Name"
                    inputContainerClassName=" text-base-17-5 px-5 bg-primary-50 border-0"
                    inputClassName="bg-transparent"
                    placeholderClass="text-base-17-5"
                    parentClassName=" text-base-17-5 py-0 w-full mr-4"
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
                    labelClassname="text-20 ml-4 mb-0.5"
                    isRequired={true}
                    placeholder="+91 Phone Number"
                    inputContainerClassName=" text-base-17-5 px-5 bg-primary-50 border-0"
                    inputClassName="bg-transparent"
                    placeholderClass="text-base-17-5"
                    parentClassName=" text-base-17-5 py-0 w-full mr-4"
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
                    labelClassname="text-20 ml-4 mb-0.5"
                    isRequired={true}
                    placeholder="Email Address"
                    type="email"
                    inputContainerClassName=" text-base-17-5 px-5 bg-primary-50 border-0"
                    inputClassName="bg-transparent"
                    placeholderClass="text-base-17-5"
                    parentClassName=" text-base-17-5 py-0 w-full mr-4"
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
          classname={"max-w-[560px] mx-auto"}
          titleClassName="text-20 mb-[18px]"
          title="Add / Edit Referral Code"
          cancelBtn={false}
          cancelBtnClassName="w-140 "
          handleClose={() => {
            setAddCodeModalActive(false);
            setSubModalData(subModalInitialState);
            // setAllTestData([])
            setFilteredTests([])
            setSearchedTest('')
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
                <span
                  className="text-[#24A3D9] cursor-pointer underline"
                  onClick={() => navigate("/support")}
                >
                  {" "}
                  knowledge base.
                </span>
              </p>

              <div className="  grid-cols-1 md:grid-cols-2  gap-x-2 md:gap-x-3 gap-y-2 gap-y-4 mb-5 mt-3">
                <div className="flex-1 flex gap-5 ">
                  <div className="flex-1">
                    <InputField
                      label="Referral Code"
                      labelClassname="text-20 text-[#26435F] mb-0.5"
                      placeholder="Add a single-word referral code"
                      inputContainerClassName=" text-base-17-5 !px-3 bg-primary-50 border-0"
                      inputClassName="bg-transparent"
                      placeholderClass="text-base-17-5"
                      parentClassName=" text-base-17-5 py-0 w-full mr-4"
                      type="text"
                      value={subModalData.code}
                      isRequired={true}
                      onChange={(e) => {
                        if (!e.target.value?.includes(" "))
                          setSubModalData({
                            ...subModalData,
                            code: e.target.value,
                          });
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <InputField
                      label="Duration (in weeks)"
                      labelClassname="text-20 text-[#26435F] mb-0.5"
                      isRequired={true}
                      placeholder="Access duration allowed in weeks"
                      inputContainerClassName=" text-base-17-5 !px-3 bg-primary-50 border-0"
                      inputClassName="bg-transparent"
                      placeholderClass="text-base-17-5"
                      parentClassName=" text-base-17-5 py-0 w-full mr-4"
                      type="text"
                      value={subModalData.expiry}
                      onChange={(e) => {
                        console.log(e.target.value);
                        console.log("shivam", e.target, e.target.value);
                        if (parseInt(e.target.value) < 0 || e.target.value < 0)
                          return;
                        if (
                          (/^\d+$/.test(e.target.value) &&
                            parseInt(e.target.value) >= 0) ||
                          e.target.value?.length === 0
                        )
                          setSubModalData({
                            ...subModalData,
                            expiry: e.target.value,
                          });
                      }}
                    />
                  </div>
                </div>
                <div className="mt-3 flex-1">
                  <InputSearch
                    label="Select Assignments (optional)"
                    labelClassname="text-20 text-[#26435F] mb-0.5"
                    placeholder="Select"
                    placeholderClass="text-base-17-5"
                    parentClassName=" text-base-17-5 py-0 w-full  mb-10"
                    inputContainerClassName=" text-base-17-5 bg-[#F3F5F7] border-0 pt-3.5 pb-3.5"
                    inputClassName="bg-[#F3F5F7]"
                    type="text"
                    value={searchedTest}
                    checkbox={{
                      visible: true,
                      name: "test",
                      match: subModalData.tests,
                    }}
                    onBlur={selectAssignmentOnblur}
                    onChange={(e) => setSearchedTest(e.target.value)}
                    optionListClassName="text-base-17-5"
                    optionClassName="text-base-17-5"
                    optionData={filteredTests}
                    rightIcon={down}
                    onOptionClick={(item) => {
                      handleTestChange2(item);
                      // setStudent(item.value);
                      // handleStudentsChange(item)
                      // setCurrentToEdit({ ...currentToEdit, students: [... item._id] });
                    }}
                  />
                  {/* <InputField
                  label="Select Assignments (optional)"
                  labelClassname="text-20 text-[#26435F] mb-0.5"
                  placeholder="Select"
                  inputContainerClassName="bg-primary-50 w-[100%]"
                  inputClassName="bg-transparent"
                  IconLeft ={down}
                  /> */}
                </div>
                <div className="flex gap-4 items-center justify-center mt-3">
                  <button
                    disabled={saveLoading}
                    className={`${saveLoading ? "cursor-wait" : ""
                      } rounded-lg bg-[#FFA28D] border-2 border-[#FFA28D] py-[6px] text-[#FFFFFF] w-[146px]`}
                  >
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
          titleClassName="text-20 mb-[18px]"
          title="Add / Edit Services"
          cancelBtn={false}
          cancelBtnClassName="w-140 "
          handleClose={() => {
            setAddServiceModalActive(false);
            if (addOne) {
              setServices2({ service: "", specialization: [] });
              setOne(false);
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
                  handleAddServiceName2(
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
                <span
                  className="text-[#24A3D9] cursor-pointer underline"
                  onClick={() => navigate("/support")}
                >
                  {" "}
                  knowledge base.
                </span>
              </p>

              <div className="  grid-cols-1 md:grid-cols-2  gap-x-2 md:gap-x-3 gap-y-2 gap-y-4 mb-5 mt-3">
                <div className="flex-1 flex gap-5 ">
                  <div className="flex-1">
                    <InputField
                      label="Service Name"
                      labelClassname="text-20 text-[#26435F] mb-0.5"
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
                <div className="flex items-center flex-wrap [&>*]:mb-[10px] px-[31.25px] py-[26.25px]  mt-5">
                  <AddTag
                    onAddTag={
                      addOne
                        ? handleAddNewSpecialisation
                        : handleAddSpecialization2
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
                        : selectedServiceData.service
                    }
                    items={
                      addOne
                        ? addServices2?.specialization
                        : selectedServiceData.specialization
                    }
                    onRemoveFilter={
                      addOne ? handleNewServiceRemove : onRemoveSpecialization2
                    }
                    className="pt-1 pb-1 text-base-17-5"
                  />
                </div>
                <div className="w-full border-[1.33px_solid_#00000033] bg-[#00000033] my-5 h-[1.3px]"></div>
                <div className="flex gap-4 items-center justify-center mt-3">
                  <button
                    disabled={saveLoading}
                    className={`${saveLoading ? "cursor-wait" : ""
                      } rounded-lg bg-[#FFA28D] border-2 border-[#FFA28D] py-[6px] text-[#FFFFFF] w-[146px]`}
                  >
                    Save{" "}
                  </button>
                  <button
                    className="rounded-lg bg-transparent border-2 border-[#FFA28D] py-[6px] text-[#FFA28D]  w-[146px]"
                    onClick={() => {
                      setAddServiceModalActive(false);
                      if (addOne) {
                        setServices2({ service: "", specialization: [] });
                        setOne(false);
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
          classname={"max-w-[667px] mx-auto"}
          titleClassName="text-20 mb-[18px]"
          title="Add / Edit Sessions Tags"
          cancelBtn={false}
          cancelBtnClassName="w-140 "
          handleClose={() => {
            setAddSessionModalActive(false);
            if (addOne) {
              setSession2({
                heading: "",
                items: [],
              });
              setOne(false);
            } else {
              setSubModalSessionData(subModalInitialSessionState);
            }
          }}
          body={
            <form
              id="settings-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (addOne) {
                  handleAddNewSession();
                } else {
                  handleAddSessionName2(
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
                <span
                  className="text-[#24A3D9] cursor-pointer underline"
                  onClick={() => navigate("/support")}
                >
                  {" "}
                  knowledge base.
                </span>
              </p>

              <div className="  grid-cols-1 md:grid-cols-2  gap-x-2 md:gap-x-3 gap-y-2 gap-y-4 mb-5 mt-3">
                <div className="flex-1 flex gap-5 ">
                  <div className="flex-1">
                    <InputField
                      label="Session Tag Heading"
                      labelClassname="text-20 text-[#26435F] mb-0.5"
                      placeholder="Add a heading for session tags (such as “Topics Covered”)"
                      inputContainerClassName=" text-base-17-5 !px-3 bg-primary-50 border-0"
                      inputClassName="bg-transparent"
                      placeholderClass="text-base-17-5"
                      parentClassName=" text-base-17-5 py-0 w-full mr-4"
                      type="text"
                      value={
                        addOne
                          ? addSession2?.heading
                          : selectedSessionData?.heading
                      }
                      isRequired={true}
                      onChange={(e) => {
                        if (addOne) {
                          setSession2({
                            ...addSession2,
                            heading: e.target.value,
                          });
                        } else {
                          setSelectedSessionData({
                            ...selectedSessionData,
                            heading: e.target.value,
                          });
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center flex-wrap [&>*]:mb-[10px] px-[31.25px] py-[26.25px]  mt-5">
                  <AddTag
                    onAddTag={addOne ? handleAddNewTags : handleAddSessionTag2}
                    keyName={
                      addOne
                        ? addSession2?.heading
                        : subModalSessionData.heading
                    }
                    text="Add Tags"
                  />
                  <FilterItems
                    isString={true}
                    onlyItems={true}
                    keyName={
                      addOne
                        ? addSession2?.heading
                        : selectedSessionData.heading
                    }
                    items={
                      addOne ? addSession2?.items : selectedSessionData.items
                    }
                    onRemoveFilter={
                      addOne ? handleNewSessionRemove : onRemoveSessionTagItem2
                    }
                    className="pt-1 pb-1 text-base-17-5"
                  />
                </div>
                <div className="w-full border-[1.33px_solid_#00000033] bg-[#00000033] my-5 h-[1.3px]"></div>
                <div className="flex gap-4 items-center justify-center mt-3">
                  <button
                    disabled={saveLoading}
                    className={`${saveLoading ? "cursor-wait" : ""
                      } rounded-lg bg-[#FFA28D] border-2 border-[#FFA28D] py-[6px] text-[#FFFFFF] w-[146px]`}
                  >
                    Save{" "}
                  </button>
                  <button
                    className="rounded-lg bg-transparent border-2 border-[#FFA28D] py-[6px] text-[#FFA28D]  w-[146px]"
                    onClick={() => {
                      setAddSessionModalActive(false);
                      if (addOne) {
                        setSession2({
                          heading: "",
                          items: [],
                        });
                        setOne(false);
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
          titleClassName="text-20 mb-[18px]"
          title="Add Tests"
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
                    labelClassname="text-20 hidden"
                    placeholder="Type Test Name"
                    placeholderClass="text-base-17-5"
                    parentClassName=" text-base-17-5 py-0 w-full  mb-10"
                    inputContainerClassName=" text-base-17-5 bg-[#F3F5F7] border-0 pt-3.5 pb-3.5"
                    inputClassName="bg-[#F3F5F7]"
                    type="text"
                    value={searchedTest}
                    checkbox={{
                      visible: true,
                      name: "test",
                      match: updatedSubscriptionData.tests,
                    }}
                    onChange={(e) => setSearchedTest(e.target.value)}
                    optionListClassName="text-base-17-5"
                    optionClassName="text-base-17-5"
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
          titleClassName="text-20 mb-[18px]"
          title=""
          cancelBtn={true}
          cancelBtnClassName="w-140 hidden"
          primaryBtn={{
            text: "Save",
            className: `w-140 ml-0 bg-primaryOrange mt-2 ${tagText.trim().length < 1 || tagImage === null
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
                  labelClassname="text-20 ml-4 mb-0.5"
                  placeholder="Text"
                  inputContainerClassName=" text-base-17-5 px-5 pt-3 pb-3 bg-primary-50 border-0"
                  inputClassName="bg-transparent"
                  placeholderClass="text-base-17-5"
                  parentClassName=" text-base-17-5 py-0 w-full mr-4 mb-3"
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
          classname={"max-w-[650px] mx-auto"}
          titleClassName="text-20 mb-[18px]"
          title="Add Question"
          cancelBtn={true}
          buttonParentClassName="justify-center"
          cancelBtnClassName="w-140 bg-transparent  border-2 border-[#26435F] text-[#26435F]"
          primaryBtn={{
            text: "Add",
            className: "w-[147px] h-[46px] ",
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