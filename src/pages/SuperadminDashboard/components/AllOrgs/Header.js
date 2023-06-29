import React from 'react'
import icon3 from '../../../../assets/icons/all orgsGroup 31327.svg'
import icon2 from '../../../../assets/icons/all orgsGroup 31330.svg'
import icon1 from '../../../../assets/icons/all orgsGroup 31331.svg'
const Header = () => {
  return (
    <div>


        <div className="h-10 w-full bg-[#26435F]" >
          <div className="w-full items-center h-full justify-end px-10 flex gap-5" >
            <img src={icon1} />
            <img src={icon2} />
            <img src={icon3} />

          </div>
          
        </div>
    </div>
  )
}

export default Header