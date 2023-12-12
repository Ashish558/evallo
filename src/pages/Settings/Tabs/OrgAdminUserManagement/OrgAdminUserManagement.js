import React, {
  useState,
  useEffect,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./styles.module.css";
import {
  useGetAllPermissionQuery,
  useUpdateOfferImageMutation,
  useUpdateOrgSettingMutation,
  useUpdatePermissionMutation,
} from "../../../../app/services/settings";
import { updateOrganizationSettings } from "../../../../app/slices/organization";
import ToggleBar from "../../../../components/SettingsCard/ToogleBar";
import InputSelect from "../../../../components/InputSelect/InputSelect";
import questionMark from "../../../../assets/images/Vector (6).svg";
import SCheckbox from "../../../../components/CCheckbox/SCheckbox";
import downChevronEnabledState from "../../../../assets/icons/down-chevron-dark-blue.svg";
import downChevronDisabledState from "../../../../assets/icons/down-chevron-grey.svg";

import {
  useLazyGetPersonalDetailQuery,
  useLazyGetOrganizationQuery,
  useLazyGetAllUsersQuery,
  useBulkChangeUserStatusMutation,
} from "../../../../app/services/users";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";

function OrgAdminUserManagement() {
  const dispatch = useDispatch();
  const { organization } = useSelector((state) => state.organization);
  const [fetchedPermissions, setThePermission] = useState([]);
  const [settingsData, setSettingsData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [currentSubscriptionName, setCurrentSubscriptionName] = useState("Professional");
  const [tutorLimit, setTutorLimit] = useState(10);
  const [activeTutorNamesList, setActiveTutorNamesList] = useState([]);
  const [updateSetting, updateSettingResp] = useUpdateOrgSettingMutation();
  const [getOrgDetails, getOrgDetailsResp] = useLazyGetOrganizationQuery();
  const [getPersonalDetail, getPersonalDetailResp] = useLazyGetPersonalDetailQuery();

  useEffect(() => {
    const arr = [];
    for (let i = 0; i < 30; i++) {
      arr.push("");
    }
    setActiveTutorNamesList(arr);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [organization]);
  const [fetchAllUsers,] = useLazyGetAllUsersQuery();
  const [bulkChangeUser,] = useBulkChangeUserStatusMutation();

  const [allTutors, setAllTutors] = useState([])

  const fetchTutors = () => {
    let urlParams = `?role=tutor`;

    fetchAllUsers(urlParams).then((res) => {
      console.log('res tutors');
      console.log(res);
      if (!res?.data?.data?.user) return;
      /* let data = res.data.data.user.map((item) => {
        const { firstName, lastName } = item;
        console.log("userStatus of tutor - " + firstName);
        console.log(item.userStatus);
        return {
          _id: item._id,
          name: `${firstName} ${lastName}`,
        };
      }); */
      const data = [];
      const activeT = [];
      for(let i = 0; i < res.data.data.user.length; i++) {
        const { firstName, lastName, _id, userStatus } = res.data.data.user[i];
        data.push({
          _id: _id,
          name: `${firstName} ${lastName}`,
        })
        if(userStatus === "active") {
          activeT.push({
            _id: _id,
            name: `${firstName} ${lastName}`,
          });
        }
      }
      setAllTutors(data);
      setSelectedTutors(data);
      bulkChangeUser({ tutorIds: data.map(tutor => tutor._id) })
      .then(res => {
        if (res.error) {
          console.log('err', res.error);
        } else {
          console.log('res', res.data);
          if(!res.error){
            // alert("Tutor is activated successfully")
          }
        }

      })
    });
  };

  useEffect(() => {
    fetchTutors();
  }, []);
  function togglePermissions(key, value) {
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

  function handlePermissionOption(value, key) {
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

  function fetchSettings() {
    if (organization.settings) {
      // setSettingsData(organization.settings);
      if (organization?.settings?.permissions?.length > 0)
        setThePermission(organization.settings.permissions);


    }
  };

  function updateAndFetchsettings(updatedSetting) {
    if (!organization || !settingsData || !updatedSetting) return
    const settings = {
      ...settingsData,
      ...updatedSetting,
    };
    const body = {
      settings,
    };
    console.log("body", body);

    setSaveLoading(true);
    updateSetting(body)
      .then((res) => {
        console.log("updated", res.data.data);
        setSaveLoading(false);
        setSettingsData(res.data.data.updatedOrg.settings);
        dispatch(updateOrganizationSettings(res.data.data.updatedOrg.settings));
      })
      .catch((err) => {
        setSaveLoading(false);
        console.log("err", err);
      });
  };

  function renderColoredText(text) {
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
  const [selectedTutors, setSelectedTutors] = useState([])

  const handlChange = (item) => {
    console.log(item);
    setSelectedTutors([...selectedTutors, {
      idx: item.idx,
      _id: item._id,
      name: item.name
    }])

  }

  const handleSave = () => {
    /* if(selectedTutors.map(tutor => tutor._id).length<1){
      alert("Please select tutors");
      return;
    } */
    bulkChangeUser({ tutorIds: selectedTutors.map(tutor => tutor._id) })
      .then(res => {
        if (res.error) {
          console.log('err', res.error);
        } else {
          console.log('res', res.data);
          if(!res.error){
            // alert("Tutor is activated successfully")
          }
        }

      })
  }
  const [activeTutorsCount, setActiveTutorsCount] = useState(10)

  // console.log(selectedTutors);

  function OnChangingTutor(item) {
    const newSelectedTutors = [...selectedTutors, {
      idx: item.idx,
      _id: item._id,
      name: item.name
    }];

    setSelectedTutors(newSelectedTutors);
    bulkChangeUser({ tutorIds: newSelectedTutors.map(i => i._id) })
    .then(res => {
      if (res.error) {
        console.log('err', res.error);
        return;
      } 
      console.log("response from bulkChangeUser");
      console.log(res);
    })
  }

  useEffect(() => {
    getPersonalDetail()
      .then(data => {
        // console.log("getPersonalDetail");
        // console.log(data);
        const user = data.data.data.user;

        getOrgDetails(user.associatedOrg)
          .then(data => {
            console.log('getOrgDetails', data.data);
            try {
              if (data.data.customerSubscriptions?.data) {
                if (data.data.customerSubscriptions?.data[0]) {
                  const metadata = data.data.customerSubscriptions?.data[0].metadata
                  if (metadata.type === 'default') {
                    setActiveTutorsCount(parseInt(metadata.active_tutors))
                  }
                }
              }
            }
            catch (error) {

            }
          })
          .catch(error => {
            console.log(error);
          });

      })
      .catch(error => {

      });

    return;


  }, []);

  return (
    <div>
      <div className="flex items-center pb-2 text-[#26435F] font-medium text-xl text-base-20">
        <p className="pr-2 text-[20px]">Set Permissions </p>
        <p className="group relative">
          <img src={questionMark} alt="questionMark" className="cursor-pointer" />
                <span className="absolute   left-[30px] z-[1000] w-[450px] scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
                  <h2 className="text-[#24A3D9] font-medium text-[16px] capitalize mb-[16px]">Set Permissions</h2>
                  Here, you can select Viewing, Editing or Deleting permissions for various users. Use the toggles below to select these permissions for specific items related to specific users. By default, we have set some these up for you.
                </span>
        </p>
      </div>

      <div className={`bg-[#FFFFFF] px-[82px] mb-[30px] mt-[5px] rounded-[15px] shadow-[0px_0px_30px_rgba(213,230,250,0.5)] ${styles.permission}`}>
        {fetchedPermissions?.map((item, id) => {
          return (
            <>
              {item.choosedValue === true ||
                item.choosedValue === false ? (
                <div
                  key={id}
                  className="pt-[34px] pb-[30px] border-b-2 border-[#CBD6E2] text-[#24A3D9] font-medium text-[17.5px] flex items-center justify-between text-base-17-5"     >
                  <p>{renderColoredText(item.name)}</p>

                  <ToggleBar
                    toggle={{ value: item.choosedValue, key: item._id }}
                    onToggle={togglePermissions}
                  ></ToggleBar>
                </div>
              ) : (
                <div className={`pt-[34px] pb-[30px]   text-[#24A3D9] font-medium text-[17.5px] flex justify-between border-b-2 border-[#CBD6E2] ${styles.permission} text-base-17-5`}>
                  <p>{renderColoredText(item.name)}</p>

                  <p>
                    <select
                      onChange={(e) =>
                        handlePermissionOption(e.target.value, item._id)
                      }
                      id="option"
                      className="px-2 text-[#26435F] bg-[#fff] rounded-[5px] shadow-[0px_0px_2px_rgba(0,0,0,0.25)] h-[40px] w-[200px]"
                    >
                      <option 
                        className="text-[#26435F] text-[17.5px]"
                        value={item.choosedValue}>
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
                            <option key={i} value={values} className="text-[#26435F] text-[17.5px]" >
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
      </div>

      <div
        className="bg-[#FFFFFF] mb-[30px] pl-[50px] pb-[30px] pt-[50px] rounded-[15px] shadow-[0px_0px_30px_rgba(213,230,250,0.5)] h-[896px]"
      >
        <div className="font-[500] text-[#26435F] text-[18.67px]" >Select Active Tutors</div>

        <div className="font-[300] mt-[5px] text-[#26435F] text-[15px] w-[1501px]">
          {`Tutors with an “Active” account status will be able to login to their Evallo account within your organization. 
                    This number is limited by your chosen subscription plan (for detailed breakdown of each subscription, please visit our `}<button className="inline text-[#24A3D9]" >pricing page</button>{`). 
                    Currently, your `}<span className="font-[500]" >{currentSubscriptionName}</span>{` subscription plan allows `}<span className="font-[500]" >{tutorLimit}</span>{` number of Active Tutor slots. Please fill them below.`}
        </div>

        <div className={`flex mt-[50px]`} >
          <div
            className="flex flex-col flex-wrap gap-x-[50px] h-[680px] w-[1108px]"
            // style={{ width: "70%" }}
          >
            {
              [...Array(30)].map((item, index) => {
                const tutor = selectedTutors.find((user, idx) => idx === index)
                const isEnabled = index < tutorLimit ? true : false;
                return (
                  <React.Fragment>
                    <div className="flex mb-[15px] items-center h-[50px]" >
                      <div className={`font-[500] text-[20px] w-[36px]
                                       ${isEnabled ? "text-[#26435F]" : "text-[#B3BDC7]"}
                      `} 
                      >{index + 1}.</div>
                      <InputSelect
                        labelClassname="h-[0px]"
                        inputContainerClassName="text-base-17-5 h-full w-[300px] shadow-[0px_0px_2.500000476837158px_0px_#00000040] bg-[#FFFFFF]"
                        optionListClassName="text-base-17-5"
                        optionClassName="text-base-17-5"
                        optionData={allTutors}
                        placeholder={"Select"}
                        placeholderClass={`text-base-17-5
                                           ${isEnabled ? "text-[#26435F]" : "text-[#B3BDC7]"}
                        `}
                        parentClassName=" ml-[0px] text-base-17-5 py-0 h-full w-[230px]"
                        disabled={!isEnabled}
                        optionType={'object'}
                        customArrow={(isEnabled ? downChevronEnabledState : downChevronDisabledState)}
                        downArrowClassName="h-[8.79px] w-[15.26px]"
                        // label="Default Time Zone"
                        value={tutor ? tutor.name : ''}
                        onChange={val => {
                          /* handlChange({...val, idx: index});
                          handleSave(); */
                          OnChangingTutor({...val, idx: index});
                        }}
                      // onChange={(val) => handleChange("timeZone", val)}
                      />
                    </div>
                  </React.Fragment>
                )
              })
            }
            {/* <div className="flex justify-end"> */}

            {/* <PrimaryButton children={'Change Status'} className='w-[170px] ml-auto' onClick={handleSave} /> */}
            {/* </div> */}
          </div>

          <div className="ml-[50px]" >
            <div className="flex items-center" >
              <SCheckbox
                checked={true}
              />
              <div className="font-[400] text-[#507CA8] text-[15px]" >Enable autofill when spots are empty</div>
            </div>

            <div className="flex mt-[10px]" >
              <SCheckbox
                className="mt-[3px]"
                checked={true}
              />
              <div className="font-[400] leading-[19.5px] text-[#507CA8] text-[15px] w-[308px]" >Notify tutors when their account status is changed by an Admin</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrgAdminUserManagement;