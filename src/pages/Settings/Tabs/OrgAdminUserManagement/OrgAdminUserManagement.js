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

import {
  useLazyGetPersonalDetailQuery,
  useLazyGetOrganizationQuery,
} from "../../../../app/services/users";

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
        for(let i = 0; i < 30; i++) {
            arr.push("");
        }
        setActiveTutorNamesList(arr);
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [organization]);

    function togglePermissions(key, value){
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

    function handlePermissionOption(value, key){
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

    function fetchSettings(){
        if (organization.settings) {
            // setSettingsData(organization.settings);
            if (organization?.settings?.permissions?.length > 0)
            setThePermission(organization.settings.permissions);
            

        }
    };

    function updateAndFetchsettings(updatedSetting){
        if(!organization|| !settingsData || !updatedSetting)return
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

    function renderColoredText(text){
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

    const [activeTutorsCount, setActiveTutorsCount] = useState(0)

    console.log("activeTutorsCount - " + activeTutorsCount);
  
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
                      if(data.data.customerSubscriptions?.data){
                          if(data.data.customerSubscriptions?.data[0]){
                              const metadata = data.data.customerSubscriptions?.data[0].metadata
                              if(metadata.type === 'default'){
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
              <p className="pr-2">Set Permissions </p>
              <p>
                <img src={questionMark} alt="" />
              </p>
            </div>

            <div className={`bg-[#FFFFFF] px-[82px] mb-[30px] rounded-[15px] shadow-[0px_0px_30px_rgba(213,230,250,0.5)] ${styles.permission}`}>
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
            </div>

            <div
                className="bg-[#FFFFFF] mb-[30px] pl-[30px] pb-[30px] pt-[30px] rounded-[15px] shadow-[0px_0px_30px_rgba(213,230,250,0.5)]"
            >
                <div className="font-[500] text-[#26435F] text-[14px]" >Select Active Tutors</div>

                <div className="font-[100] mt-[5px] text-[#26435F] text-[12px]" style={{width: "97%"}} >
                    {`Tutors with an “Active” account status will be able to login to their Evallo account within your organization. 
                    This number is limited by your chosen subscription plan (for detailed breakdown of each subscription, please visit our `}<button className="inline text-[#24A3D9]" >pricing page</button>{`). 
                    Currently, your `}<span className="font-[600]" >{currentSubscriptionName}</span>{` subscription plan allows `}<span className="font-[600]" >{tutorLimit}</span>{` number of Active Tutor slots. Please fill them below.`}
                </div>

                <div className={`flex mt-[50px] ${styles.tutorSelectionContainer}`} >
                    <div
                        className="flex flex-col flex-wrap"
                        style={{width: "70%"}}
                    >
                        {
                            activeTutorNamesList.map((item, index) => {
                              const isDisabled = index > activeTutorsCount - 1;
                                return (
                                    <React.Fragment>
                                        <div className="flex mb-[15px] items-center h-[40px]" >
                                            <div className="text-[#26435F] text-[14px] w-[20px]" >{index + 1}.</div>
                                            <InputSelect
                                                labelClassname="h-[0px]"
                                                inputContainerClassName=" text-base-17-5 h-full shadow-[0px_0px_2.500000476837158px_0px_#00000040] bg-[#FFFFFF]"
                                                optionListClassName="text-base-17-5" 
                                                optionClassName="text-base-17-5"
                                                optionData={["Ryan", "Bruce"]}
                                                placeholder={"Select"}
                                                placeholderClass="text-base-17-5" 
                                                parentClassName=" ml-[10px] text-base-17-5 py-0 h-full w-[230px]"
                                                disabled={isDisabled}
                                                customArrow={isDisabled ? null : downChevronEnabledState}
                                                downArrowClassName="h-[15px] w-[15px]"
                                                // label="Default Time Zone"
                                                value={""}
                                                // onChange={(val) => handleChange("timeZone", val)}
                                            />
                                        </div>
                                    </React.Fragment>
                                )
                            })
                        }
                    </div>

                    <div className="ml-[20px]" >
                      <div className="flex items-center" >
                        <SCheckbox
                          checked={true}
                        />
                        <div className="font-[300] text-[#507CA8] text-[12px]" >Enable autofill when spots are empty</div>
                      </div>

                      <div className="flex items-center mt-[20px]" >
                        <SCheckbox
                          checked={true}
                        />
                        <div className="font-[300] text-[#507CA8] text-[12px] w-[250px]" >Notify tutors when their account status is changed by an Admin</div>
                      </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrgAdminUserManagement;