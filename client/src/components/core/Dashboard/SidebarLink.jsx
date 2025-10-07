import React from 'react'
import * as VscIcons from 'react-icons/vsc';
import { useDispatch } from 'react-redux';
import { NavLink,useLocation } from 'react-router-dom';

const SidebarLink = ({link,iconName}) => {
      const DynamicIcon = VscIcons[iconName];  //
      const dispatch = useDispatch();
      const location = useLocation();

  return (
      
    <div>
      <NavLink to={link.path}  className={({ isActive }) =>
                  `px-3 py-2 text-md font-medium flex  ${
                        isActive ? "text-yellow-100 bg-yellow-800 gap-4 border-l-[0.2rem]" : "text-richblack-100"
                  }`
            }
      >
            <div>
                  
                  <div className='flex flex-row  gap-2 '>
                        {DynamicIcon && <DynamicIcon className="w-6 h-6" />}
                        <span>{link.name}</span>
                  </div>
                  
            </div>
      </NavLink>
    </div>
  )
}

export default SidebarLink