import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import WMap from "../WorldMap/Map";
import indianFlag from "../../../assets/icons/emojione-v1_flag-for-india.svg";
import downArrow from "../../../assets/icons/Vectordown Country.svg";
import { useAddUserDemographyMutation } from "../../../app/services/superAdmin";
import { useState } from "react";
import { useEffect } from "react";
import { Country, State } from "country-state-city";
import InputSelect from "../../../components/InputSelect/InputSelect";
import ReactCountryFlag from "react-country-flag";
import InputSelectNew from "../../../components/InputSelectNew/InputSelectNew";
const Demography1 = ({ dateRange }) => {
  const [currentDemographicArea, setCurrentDemographicArea] = useState([]);
  const [fetchDemography, setDemography] = useAddUserDemographyMutation();
  const [country, setCountry] = useState([]);
  const [states, setStates] = useState([]);
  const [countryName, setCountryName] = useState("India");
  const [userName, setUserName] = useState("");
  const [countryFlag, setCountryFlag] = useState("");
  const [countryMarking, setCountryMarking] = useState({});
  const handleState = async (c, stateData) => {
    if (!c) return;
    const state1 = country.filter((x) => x.name === c);

    setCountryFlag(state1[0]?.iso2);
    let requiredStates = [];
    const currentState = state1[0]?.states?.map((s) => {
      stateData.map((a) => {
        if (s.name.toLowerCase() === a.state_name.toLowerCase())
          requiredStates.push({ ...s, ...a });
      });
    });

    setStates([...requiredStates]);
    setCountryMarking(state1);
  };
  useEffect(() => {
    if (country.length === 0) {
      fetch("countryData.json")
        .then((res) => res.json())
        .then((data) => setCountry(data));
    }
  }, []);

  useEffect(() => {
    fetchDemography({ country: countryName, ...dateRange }).then((res) => {
      console.log("demog", res)
      setCurrentDemographicArea(res?.data?.aggregatedData);
    });
  }, [fetchDemography, countryName, dateRange]);
  useEffect(() => {
    handleState(countryName, currentDemographicArea);
  }, [currentDemographicArea, countryName]);

  return (
    <div className="bg-[#FFFFFF] flex justify-center items-center border border-gray-200 p-3 mt-[6px] rounded-md relative">
      <div className="grid grid-cols-2 gap-x-5 mt-14">
        <div className="">
          <div className="absolute top-0 z-10 left-0 pt-[18px] pl-[28px]" >
            <button >
              <InputSelectNew
                arrowWidth="h-[6px]"
                placeholder={"User"}
                parentClassName="ml-0  scale-[0.8] items-center flex text-[#FFA28D] text-xs !border-[1.7px] px-1 py-2 border-[#FFA28D] rounded-full  "
                inputContainerClassName=" bg-white my-0 py-[5px] px-[35px] text-[15px] min-w-[114px] "
                placeHolderClass="text-[#FFA28D] "
                labelClassname="text-[15px]"
                inputClassName="bg-transparent"
                value={userName}
                IconDemography={true}
                optionData={[
                  { name: "Admin" },
                  { name: "Tutor" },
                  { name: "Parent" },
                  { name: "Student" },
                ]}
                optionType={"object"}
                onChange={(e) => setUserName(e.name)}
              />
            </button>
            <button className="">
              <InputSelectNew
                arrowWidth="h-[6px]"
                placeholder={"Country"}
                parentClassName="ml-0  scale-[0.8] items-center flex text-[#FFA28D] text-xs !border-[1.7px] px-1 py-[9px] border-[#FFA28D] rounded-full  "
                inputContainerClassName=" bg-white py-[4.8px] px-[35px] text-[15px] min-w-[114px]"
                labelClassname="text-[15px]"
                inputClassName="bg-transparent "
                value={countryName}
                optionData={country}
                IconDemography={true}
                optionType={"object"}
                onChange={(e) => setCountryName(e.name)}
              />
            </button>
          </div>

          <WMap markings={states} countryMarking={countryMarking} countryFlag={countryFlag} />
          <div className="flex justify-between px-8 text-[13px] text-[#26435F] font-medium">
            <p>Last 11 days</p>
            <div className="flex items-center gap-4">
              <span>100</span>
              <span
                style={{
                  background: "linear-gradient(to right, #FFA28D , #FEE )",
                }}
                className="w-32 h-4"
              ></span>
              <span>10</span>
            </div>
          </div>
        </div>
        <div>
          <p className="text-[#26435F]  font-semibold ">
            <span className="shadow-md rounded-md ml-[-20px] mr-2 ">
              <ReactCountryFlag
                countryCode={countryFlag}
                svg
                cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                cdnSuffix="svg"
                title={countryFlag}

              />
            </span>

            {countryName.toUpperCase()}
            <span >
              <img className="ml-2 inline-block" src={downArrow} alt={"downArrow"} />
            </span>
          </p>
          <div className=" h-[360px] py-0 relative w-[40.2083vw] overflow-y-auto">


            <table className="table-auto !border-spacing-y-[6px] px-1 customTable border-separate w-full whitespace-nowrap">
              <thead className="sticky top-0">
                <tr>
                  <th className="px-4">State </th>
                  <th className="px-4"># of orgs </th>
                  <th className="px-4">Avg. # of S / O </th>
                  <th className="px-4">Avg. # of T / O</th>
                </tr>
              </thead>
              <tbody >
                {currentDemographicArea?.map((state, id) => {
                  return (
                    <tr className={`my-8 overflow-hidden `} key={id}>
                      <td className={`mb-2 ${id % 2 ? "bg-[#F5F8FA]" : 'bg-white'}`}>
                        {state.state_name.charAt(0).toUpperCase() +
                          state.state_name.slice(1)}
                      </td>
                      <td className={`mb-2 ${id % 2 ? "bg-[#F5F8FA]" : 'bg-white'}`}>{state.no_of_orgs}</td>
                      <td className={`mb-2 ${id % 2 ? "bg-[#F5F8FA]" : 'bg-white'}`}>{Math.round(state.average_students)}</td>
                      <td className={` mb-2 ${id % 2 ? "bg-[#F5F8FA]" : 'bg-white'}`}>{Math.round(state.average_tutors)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Demography1);
