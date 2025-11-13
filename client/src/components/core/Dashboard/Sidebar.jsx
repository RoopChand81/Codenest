import React from 'react'
import { sidebarLinks } from '../../../data/dashboard-links'
import { useSelector } from 'react-redux'
import SidebarLink from './SidebarLink'
import { useLocation } from 'react-router-dom'
import { VscSignOut } from "react-icons/vsc";
import Spinnner from "../../common/Loading"

const Sidebar = ({ showModalHandler,showModal }) => {
  const { user, loading: loadingProfile } = useSelector((state) => state.profile);

  if (loadingProfile) {
    return <div>
      <Spinnner/>
    </div>
  }

  const location = useLocation();
  return (
    <div className='min-h-[calc(100vh-3.5rem)] w-[200px] md:w-[20%] bg-richblack-800 border-r-[1px]
    border-r-richblack-700 flex flex-col items-center md:items-start px-2 gap-4 py-6'>

      {/* Sidebar Links */}
      <div className='flex flex-col gap-4 w-full'>
        {
          //sidebarLinks static data;
          sidebarLinks.map((link) => {
            //jo link Login user ke link se match karenge o functionality show karenge
            if (link.type && user?.accountType !== link.type) return null;
            return (
              <SidebarLink link={link} key={link.id} iconName={link.icon} />
            )
          })
        }
      </div>

      {/* Divider */}
      <div className='w-full h-[1.5px] bg-richblack-700 my-4'></div>

      {/* Settings & Logout  Show for every login type user*/}
      <div className='flex flex-col w-full gap-3'>
        <SidebarLink link={{ name: "Setting", path: "dashboard/settings" }} iconName={"VscSettingsGear"} />

        <button
          onClick={showModalHandler}
          className="text-richblack-100 text-md font-medium flex gap-2 items-center"
        >
          <VscSignOut className="w-6 h-6" />
          <span className='md:inline'>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar;
