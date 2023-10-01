import React, { useState } from 'react';
export default function AnnotationPopup({ selectedText, onCancel }) {
  const [highlightText, setHighlightText] = useState(selectedText);
  const [textAreaInput, setTextAreaInput] = useState(selectedText);
  const [isEditing, setIsEditing] = useState(true);
  

  const handleSave = () => {
    
    console.log(`Saved annotation: ${highlightText}`);
    setIsEditing(false);
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
    <div className="popup absolute w-[100%] left-0 right-0 bottom-2 transform translate-y-full transition-transform duration-300">
      <div className="popup-content bg-white p-4 shadow-lg rounded-lg">
        <div className="popup-header w-[100%] bg-black text-white p-2 flex justify-between items-center">
          <h2>New Annotation:</h2>
          <p className='text-center font-bold'> {highlightText}</p>
          <button
            className="text-white hover:text-red-800 focus:outline-none"
            onClick={handleCancel}
          >
            Close X
          </button>
        </div>
        <div className="popup-body">
          {isEditing ? (
            <div className="">
              <div className="header-container flex mt-2">
                <div className="header-item flex">
                  <h2 className="header-text font-bold " >Highlight Color:</h2>
                  {highlightText && (
                    <div
                      className="highlight-circle ml-2"
                      style={{
                        background: 'yellow',
                        display: 'inline-block',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border:'3px solid'
                      }}
                    ></div>
                  )}
                </div>
                <div className="header-item flex">
                  <h2 className="header-text font-bold ml-[50px]" >Underline Style:</h2>
                  {highlightText && (
                    <span className="underline-symbol font-bold ml-2" style={{ textDecoration: 'underline' }}>
                      {` U`}
                    </span>
                  )}
                </div>
              </div>

              <textarea
                placeholder="Write your annotation here..."
                onChange={handleInputChange}
                onBlur={() => {
                  setHighlightText(textAreaInput);
                }}
                style={{
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
          ) : null}
        </div>
      </div>
    </div>
  );
}
