import React from 'react'
import { useEffect, useState } from 'react';
import Desmos from 'desmos'
export default function Calculator() {
  useEffect(()=>
  {
    var elt = document.getElementById('calculator');
    var calculator = Desmos.GraphingCalculator(elt);

  },[])
  return (
    <div className=' absolute' >
    <div id="calculator" style={{width: "600px", height: "400px"}}></div>
    </div>
  )
}
