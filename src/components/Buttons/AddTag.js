import React, { useRef } from 'react'
import { useState } from 'react'
import AddIcon from '../../assets/Settings/add.svg'

export default function AddTag({ keyName, onAddTag, isFile, openModal }) {

  const [isClicked, setIsClicked] = useState(false)
  const [size, setSize] = useState(1)
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  const handleChange = e => {
    // console.log(e.target.value.length)
    setValue(e.target.value)
    if (e.target.value.length === 0) return setSize(1)
    setSize(e.target.value.length)
  }

  const handleBlur = () => {
    setIsClicked(false)
    if (value.trim() === '') return
    if (onAddTag !== undefined) {
      onAddTag(value, keyName)
      setValue('')
    }
  }

  const handleClick = () => {
    if(openModal === true) return onAddTag()
    isFile ? onAddTag() : setIsClicked(true)
  }

  return (
    <button className={`bg-primaryLight flex items-center text-primary font-bold text-sm py-1.4 px-3 rounded-7 mr-[15px] ${isClicked ? 'justify-center' : ''}`}
      onClick={handleClick} >
      {
        !isClicked ?
          <>
            <p className='mr-1'>Add Tag</p>
            <img src={AddIcon} />
          </>
          :
          <div className={`w-auto`} >
            <input size={size}
              autoFocus
              ref={inputRef}
              value={value}
              className='w-full outline-0 border-0 bg-transparent transition'
              onChange={handleChange}
              // onKeyDown={e => e.key === 'Enter' && handleBlur}
              onKeyDown={e => e.key === 'Enter' && handleBlur()}
              onBlur={handleBlur} />
          </div>
      }

    </button>
  )
}
