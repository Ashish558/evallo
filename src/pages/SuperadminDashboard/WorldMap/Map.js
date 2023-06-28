import axios from 'axios';
import { worldMill } from "@react-jvectormap/world";
import { VectorMap } from "@react-jvectormap/core";
import React, { useEffect, useState } from 'react';
import { colorScale, countries, missingCountries } from './Countries';


const Map = () => {
    return (
        <div className='m-auto w-full h-[300px]' >
            <VectorMap
                map={worldMill}
                containerStyle={{
                    // width: "700px",
                    height: "700px",
                    backgroundColor:'#EBEBEB'
                }}
                backgroundColor="white"
                markers={missingCountries}
                markerStyle={{
                    initial: {
                        fill: "red",
                    },
                }}
               
                regionStyle={ {
                    initial: {
                      fill: '#EBEBEB', // Set the color for unused regions
                     
                    },
                }}
                series={{
                    regions: [
                        {
                            scale: colorScale,
                            values: countries,
                            min: 0,
                            max: 100,
                        },
                    ],
                }}
                onRegionTipShow={function reginalTip(event, label, code) {
                    return label.html(`
                    <div style="background-color: white;outline:none;  border-color:white; border-radius: 6px;  min-height: 50px; width: 125px; color: black"; padding: 5px>
                      <p>
                      <b>
                      ${label.html()}
                      </b>
                      </p>
                      <p>
                      ${countries[code]}
                      </p>
                      </div>`);
                }}
                onMarkerTipShow={function markerTip(event, label, code) {
                    return label.html(`
                    <div style="background-color: white; border-radius: 6px; min-height: 50px; width: 125px; color: black !important; padding-left: 10px>
                      <p style="color: black !important;">
                      <b>
                      ${label.html()}
                      </b>
                      </p>
                      </div>`);
                }}
            />
            <div className='flex justify-between px-8' >
             <p>Last 11 days</p>
             <div className='flex items-center gap-4'>
                <span>
                    100
                </span>
                <span style={{background:'linear-gradient(to right, #FFA28D 100%, #FFA28D 13%)'}} className='w-24 h-4'>
                  
                </span>
                <span>
                    100
                </span>
             </div>
            </div>
        </div>
    );
}

export default Map;