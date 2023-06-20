import axios from 'axios';
import { worldMill } from "@react-jvectormap/world";
import { VectorMap } from "@react-jvectormap/core";
import React, { useEffect, useState } from 'react';
import { colorScale, countries, missingCountries } from './Countries';


const Map = () => {
    return (
        <div style={{ margin: "auto", width: "100%", height: "300px" }}>
            <VectorMap
                map={worldMill}
                containerStyle={{
                    // width: "700px",
                    height: "700px",
                }}
                backgroundColor="#282c34"
                markers={missingCountries}
                markerStyle={{
                    initial: {
                        fill: "red",
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
                    <div style="background-color: black; border-radius: 6px; min-height: 50px; width: 125px; color: white"; padding-left: 10px>
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
        </div>
    );
}

export default Map;