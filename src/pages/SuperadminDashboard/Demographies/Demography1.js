import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import WMap from "../WorldMap/Map";
import indianFlag from "../../../assets/icons/emojione-v1_flag-for-india.svg";
import { useAddUserDemographyMutation } from "../../../app/services/superAdmin";
import { useState } from "react";
import { useEffect } from "react";
import { Country, State } from "country-state-city";
import InputSelect from "../../../components/InputSelect/InputSelect";
import InputSelectNew from "../../../components/InputSelectNew/InputSelectNew";
const Demography1 = () => {
  const [currentDemographicArea, setCurrentDemographicArea] = useState([]);
  const [fetchDemography, setDemography] = useAddUserDemographyMutation();
  const [country, setCountry] = useState([]);
  const [states, setStates] = useState([]);
  const [countryName, setCountryName] = useState("India");
  const [userName,setUserName]= useState('')
  const countryData = Country.getAllCountries().map((city) => ({
    value: city.name,
    displayValue: city.name,
  }));
  const [countryMarking, setCountryMarking] = useState({});
  const handleState = async (c, stateData) => {
    if (!c) return;
    //  console.log("country", c);
    const state1 = country.filter((x) => x.name === c);
    let requiredStates = [];
    // console.log('shyy',state1[0])
    const currentState = state1[0]?.states?.map((s) => {
      stateData.map((a) => {
        if (s.name.toLowerCase() === a.state_name.toLowerCase())
          requiredStates.push(s);
      });
    });

    setStates([...requiredStates]);
    setCountryMarking(state1);
  };
  useEffect(() => {
    // setValues(organization);

    //console.log(State.get)
    if (country.length === 0) {
      fetch("countryData.json")
        .then((res) => res.json())
        .then((data) => setCountry(data));
    }
  }, []);
  //console.log("countryData",country)

  useEffect(() => {
    fetchDemography({ country: countryName }).then((res) => {
    //  console.log('res',res.data)
      setCurrentDemographicArea(res?.data?.aggregatedData);
    });
  }, [fetchDemography, countryName]);
  useEffect(() => {
    handleState(countryName, currentDemographicArea);
  }, [currentDemographicArea, countryName]);
 // console.log("fetchDemography", currentDemographicArea, countryName);
 // console.log("req", states);

  return (
    <div className="bg-[#FFFFFF] flex justify-center items-center border border-gray-200 p-4 mt-[6px] rounded-md">
      <div className="grid grid-cols-2 gap-x-5">
        <div>
          <button className="">
            {/* User{" "}
            <FontAwesomeIcon
              className="pl-2"
              icon={faCaretDown}
            ></FontAwesomeIcon> */}
             <InputSelectNew
              placeholder={"User"}
              parentClassName="ml-4  scale-[0.8] items-center flex text-[#FFA28D] text-xs border px-1 py-2 border-[#FFA28D] rounded-full  "
              inputContainerClassName=" bg-white "
              labelClassname="text-sm"
              inputClassName="bg-transparent"
              value={userName}
              optionData={[{name:"Admin"},{name:"Tutor"},{name:"Parent"},{name:"Student"}]}
              optionType={"object"}
              onChange={(e) => setUserName(e)}
            />
          </button>
          <button className="">
            <InputSelectNew
              placeholder={"Country"}
              parentClassName="ml-4  scale-[0.8] items-center flex text-[#FFA28D] text-xs border px-1 py-2 border-[#FFA28D] rounded-full  "
              inputContainerClassName=" bg-white "
              labelClassname="text-sm"
              inputClassName="bg-transparent"
              value={countryName}
              optionData={country}
              optionType={"object"}
              onChange={(e) => setCountryName(e)}
            />
          </button>

          <WMap markings={states} countryMarking={countryMarking} />
          <div className="flex justify-between px-8">
        <p>Last 11 days</p>
        <div className="flex items-center gap-4">
          <span>100</span>
          <span
            style={{ background: "linear-gradient(to right, #FFA28D , #FEE )" }}
            className="w-32 h-4"
          ></span>
          <span>10</span>
        </div>
      </div>
        </div>
        <div>
          <p className="text-[#26435F] text-sm font-semibold mt-4 ">
            {/* <img className="inline mr-2" src={indianFlag} /> */}
            {countryName}
            {/* <FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon> */}
          </p>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-7">State </th>
                <th className="px-7"># of orgs </th>
                <th className="px-7">Avg. # of S / O </th>
                <th className="px-7">Avg. # of T / O</th>
              </tr>
            </thead>
            <tbody>
              {currentDemographicArea?.map((state, id) => {
                return (
                  <tr key={id}>
                    <td className="">{state.state_name}</td>
                    <td className="">{state.no_of_orgs}</td>
                    <td className="">{Math.round(state.average_students)}</td>
                    <td className="">{Math.round(state.average_tutors)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Demography1;
