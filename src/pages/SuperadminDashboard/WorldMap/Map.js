import axios from "axios";
import { worldMill } from "@react-jvectormap/world";
import { VectorMap } from "@react-jvectormap/core";
import React, { useEffect, useState } from "react";
import { colorScale, countries, missingCountries } from "./Countries";
import styles from "./styles.module.css";
import ReactCountryFlag from "react-country-flag";
const Map = ({ markings, countryMarking, countryFlag }) => {
  // console.log(markings);
  const [locate, setLocation] = useState([]);
  const [loading, setLoading] = useState(true);
  const ct = { [countryMarking[0]?.iso2]: 90 };

  useEffect(() => {
    let pointedLocation = [];
    if (markings.length > 0) {
      markings.map((m) => {
        pointedLocation.push({
          name: m.name,
          latLng: [Number(m.latitude), Number(m.longitude)],
          ...m,
        });
      });
    }

    setLocation([...pointedLocation]);
    setLoading(false);
  }, [markings]);

  //console.log(locate, markings, countryMarking,ct);
  //const [currentDemographicArea, setCurrentDemographicArea] =useState([])
  //const [fetchDemography, setDemography] = useAddUserDemographyMutation();
  return (
    <div className="m-auto w-full h-[400px]">
      {(loading === true || locate.length === 0) && (
        <VectorMap
          map={worldMill}
          zoomButtons={false}
          containerStyle={{
            
            height: "700px",
            backgroundColor: "#EBEBEB",
          }}
          backgroundColor="white"
          markers={locate ? locate : missingCountries}
          markerStyle={{
            initial: {
              fill: "red",
            },
          }}
          regionStyle={{
            initial: {
              fill: "#EBEBEB", // Set the color for unused regions
            },
          }}
          series={{
            regions: [
              {
                scale: colorScale,
                values: {},
                min: 0,
                max: 100,
              },
            ],
          }}
          onRegionTipShow={function reginalTip(event, label, code) {
            label.css("opacity", 0);
            return label.html(`
                    `);
          }}
        />
      )}
      {locate.length > 0 && loading === false && (
        <VectorMap
          map={worldMill}
          zoomButtons={false}
          containerStyle={{
            
            height: "700px",
            backgroundColor: "#EBEBEB",
          }}
          backgroundColor="white"
          markers={locate ? locate : missingCountries}
          markerStyle={{
            initial: {
              fill: "red",
            },
          }}
          regionStyle={{
            initial: {
              fill: "#EBEBEB", // Set the color for unused regions
            },
          }}
          series={{
            regions: [
              {
                scale: colorScale,
                values: ct,
                min: 0,
                max: 100,
              },
            ],
          }}
          onRegionTipShow={function reginalTip(event, label, code) {
            label.css({
              border: "white",
              background: "white",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
              padding: "3px",
              marginLeft: "130px",
              marginTop: "-10px",
            });
            
            return label.html(`
                    <div style="background-color: white;outline:none;  border-color:white; border-radius: 6px;  min-height: 50px; width: 125px; color: black"; padding: 5px>
                      <p>
                      <b>
                      
                      ${label.html()}
                      </b>
                      </p>
                      <p>
                       
                      </p>
                      </div>`);
          }}
          onMarkerTipShow={function markerTip(event, label, code) {
            label.css({
              border: "white",
              background: "white",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
              padding: "3px",
              marginLeft: "130px",
              marginTop: "-10px",
            });
            return label.html(`
                    <div style="background-color:display:block;position:relative; white; border-radius: 6px; border-color:white; min-height: 50px; width: 125px; color: black !important; padding-left: 10px>
                      <p style="color: black !important;">
                      <b>
                      ${label.html()}
                      </b>
                      </br/>
                      ${locate[code].no_of_orgs} ${
              locate[code].no_of_orgs > 1 ? " Users" : " User"
            }  
                      </p>
                      <div className='${styles.point}'></div>
                      </div>
                     
                      `);
          }}
          getTooltipContent={function (event, tip, code) {
            // Customize the tooltip content based on the region code
            return tip.html(`<div style="background-color: #FFF;
            color: #333;
            border: 1px solid #888;
            padding: 8px;
            font-size: 14px;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">${788}</div>`); // Example: Displaying the region code
          }}
        />
      )}
    </div>
  );
};

export default React.memo(Map);
