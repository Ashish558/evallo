import React, { useState } from 'react';
export default function AnnotationPopup({sethovert,i,setIsEditing,isEditing, color,underline,setunderline, setcolor,onCancel }) {
  const [highlightText, setHighlightText] = useState('');
  const [textAreaInput, setTextAreaInput] = useState('');
  

  const handleSave = () => {
    sethovert(prevAnnotations => {
      const updatedAnnotations = [...prevAnnotations];
      updatedAnnotations[i-1].push(highlightText);
      return updatedAnnotations;})
    console.log(`Saved annotation: ${highlightText}`);
  };

  const handleCancel = () => {
    setHighlightText('');
    setTextAreaInput('');
    setIsEditing(false);

    if (onCancel) {
      onCancel();
    }
  };

  const handleInputChange = (e) => {
  
    setTextAreaInput(e.target.value);
  };

  return (
    <div className="popup absolute w-[100%] left-0 right-0 bottom-2 transform z-10 translate-y-full transition-transform duration-300">
      {isEditing ?<><div className="popup-content bg-white p-4 shadow-lg rounded-lg">
        <div className="popup-header w-[100%] bg-black text-white p-2 flex justify-between items-center">
          <h2>New Annotation:</h2>
          <button
            className="text-white hover:text-red-800 focus:outline-none"
            onClick={handleCancel}
          >
            Close X
          </button>
        </div>
        <div className="popup-body">
            <div className="">
              <div className="header-container flex mt-2">
                <div className="header-item relative flex items-center">
                  <h2 className="header-text font-bold " >Highlight Color:</h2>
                  <div 
    onClick={() => document.getElementById('hiddenColorPicker').click()}
    style={{
        width: '25px',
        height: '25px',
        borderRadius: '50%',
        backgroundColor: color,
        marginLeft:'5px',
        cursor: 'pointer',
        border: '1px solid #000', // optional, in case you want a border
    }}
></div>

<input 
    type='color' 
    id='hiddenColorPicker' 
    value={color} 
    style={{ display: 'none' }} 
    onChange={(e) => setcolor(e.target.value)}
/>

                   </div>
                <div className="header-item flex">
                  <h2 className="header-text font-bold ml-[50px]" >Underline Style:</h2>         
                    <p className={`underline-symbol transition-all font-bold ml-2 cursor-pointer px-2 ${underline==='underline'&&' border border-black'}`} style={{ textDecoration: 'underline' }} onClick={()=>setunderline(underline=='none'? 'underline':'none')}>
                      {` U`}
                    </p>
                </div>
              </div>

              <textarea
                placeholder="Write your annotation here..."
                onChange={handleInputChange}
                onBlur={() => {
                  setHighlightText(textAreaInput);
                }}
                style={{
                  padding:'10px',
                  marginTop: '10px',
                  width: '50%',
                  height: '150px',
                  minWidth: '300px',
                  border: '1px solid',
                }}
              />
              <div className="popup-actions mt-2">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mr-2"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          
        </div>
      </div></> : null}
    </div>
  );
}
