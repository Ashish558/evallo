import React from 'react'
import { useEffect, useState } from 'react';
export default function Calculator() {
    
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isNumeric, setIsNumeric] = useState(true);
  const [func,setFunc] = useState(false)
  const [trig,setTrig] = useState('')

  const handleButtonClick = (value) => {
    if (value === '=') {
      try {
        if(input[0] === "s" || "t"||"c")
        {
            setTrig('Math.'+input)
        const result = eval(trig); 
        console.log(trig)  
        return setOutput(result.toString());
      
        }
        const result = eval(input);
        setOutput(result.toString());
      } catch (error) {
        setOutput('Error');
      }
    } else if (value === 'C') {
      setInput('');
      setOutput('');
    } else if (value === 'A') {
      setIsNumeric(!isNumeric);
    } else if (value == 'funcs'){
         setFunc(!func)
    }
     else {
      setInput((prevInput) => prevInput + value);
      if(func)setFunc(false)
    }
  };

  const numericButtons = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '/','(',')','<','>', '-','+', '*', '.', '='
   
  ];


  const alphabetButtons = 'abcdefghijklmnopqrstuvwxyz'.split('');

  const scientificButtons = [
    'sin', 'cos', 'tan', 'sqrt', '^', 'log', 'ln', 'pi', 'e'
  ];
  // const handleTrigFunction = (func) => {
  //   try {
  //     const angleInDegrees = parseFloat(input);
  //     if (!isNaN(angleInDegrees)) {
  //       const radians = (angleInDegrees * Math.PI) / 180;
  //       const trigResult = func(radians);
  //       setOutput(trigResult);
  //     } else {
  //       setOutput('Invalid input');
  //     }
  //   } catch (error) {
  //     setOutput('Error');
  //   }
  // };
  let set={
    width : "100%"
  }
  return (
    <div className=' absolute  ' >
        <div className="  mx-auto mt-8 p-4  " style={set}>
      <div className="bg-white  border border-gray-300 rounded-lg p-4 shadow-lg">
        <div className="mb-4 flex relative  py-2 px-4 border border-gray-300 rounded-lg text-xl">
          <input
            onChange={handleButtonClick}
            className="w-full border-none "
            type="text"
            value={input}
            readOnly
          />
          <span className=" text-lg font-normal absolute right-1">{output}</span>
        </div>
        <div className="grid  grid-cols-5 gap-1 gap-x-1">
          {isNumeric
            ? numericButtons.map((button) => (
                <button
                  key={button}
                  onClick={() => handleButtonClick(button)}
                  className=" w-12 rounded-sm  bg-gray-300 hover:bg-gray-400"
                >
                  {button}
                </button>
              ))
            : alphabetButtons.map((button) => (
                <button
                  key={button}
                  onClick={() => handleButtonClick(button)}
                  className=" px-2 w-14 rounded-sm bg-gray-300 hover:bg-gray-400"
                >
                  {button}
                </button>
              ))}
          <button
            onClick={() => handleButtonClick('A')}
            className="py-2  w-12 rounded-sm bg-gray-300 hover:bg-blue-600 "
          >
            {isNumeric ? 'ABC' : '123'}
          </button>
          <button
            onClick={() => handleButtonClick('C')}
            className="py-2 px-4 w-12 rounded-sm  bg-gray-300 hover:bg-red-600 "
          >
            C
          </button>
          <button
            onClick={() => handleButtonClick('funcs')}
            className="py-2   w-16 rounded-sm bg-gray-300 hover:bg-green-600 "
          >
            Funcs
          </button>
        </div>
        {func && (
          <div className=" p-6 bg-white top-28 shadow-lg rounded-lg border border-gray-300  mt-4 absolute d-none grid grid-cols-4 gap-2">
            {scientificButtons.map((button) => (
              <button
                key={button}
                onClick={() => handleButtonClick(button+'(')}
                className="py-2 px-4 rounded-sm bg-gray-300 hover:bg-gray-400"
              >
                {button}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  )
}
