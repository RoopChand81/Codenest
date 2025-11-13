import React from 'react'
import IconBtn from '../../common/IconBtn'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const MyProfile = () => {
  const {user}=useSelector(state=>state.profile)
  const navigate=useNavigate();
  //console.log(user);
  const name=user.firstName+" "+user.lastName;
  const about=user.additionalDetails.about?user.additionalDetails.about:"Write Somthing about Yourself";
  const firstName=user?.firstName?user.firstName:"User";
  const lastName=user?.lastName?user.lastName:"";
  const email=user?.email?user.email:"NA";
  const gender=user?.additionalDetails?.gender?user.additionalDetails.gender:"NA";
  const phoneNo=user?.additionalDetails?.contactNumber?user.additionalDetails.contactNumber:"NA";
  const dateOfBirth=user?.additionalDetails?.dateOfBirth?user.additionalDetails?.dateOfBirth:"NA"
  return (
    <div className='w-11/12 flex  flex-col py-10'>
      <div className='py-10'>
        <h1 className='text-richblack-5 text-3xl mb-[3.5rem] font-medium '>My Profile</h1>
        
        {/* Section 1 */}
        <div className='flex justify-between items-center bg-richblack-800 border-[1px] border-richblack-700 rounded-md p-3 md:p-8 md:px-12'>

          <div className='flex flex-row gap-3'>
            <img src={user?.image}
                alt="Profile Image"
                className='aspect-square w-[78px] rounded-full object-cover'
            />
            <div className='flex flex-col w-full justify-center' >
              <p className='text-white'>{name}</p>
              <p className='text-white'>{user?.email}</p>
            </div>
          </div>

          <div className='flex items-center'>
              <IconBtn text={"Edit"} icon={true} onclick={()=>{navigate("/dashboard/settings")}}/>
          </div>
        </div>

        
        {/* Section 2 */}
        <div className='my-10 flex flex-col gap-y-3 md:gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-3 md:p-8 md:px-12'>
            <div className='flex w-full items-center justify-between'>
              <p className='text-lg font-semibold text-richblack-5'>About</p>
              <div>
                <IconBtn text={"Edit"}  icon={true} onclick={()=>{navigate("/dashboard/settings")}}/>
              </div>

            </div>
            <p className='text-richblack-400  text-sm font-medium'>{about}</p>
        </div>


        {/* Section 3 */}

        <div className='my-10 flex flex-col gap-y-3 md:gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-3 md:p-8 md:px-12'>
            <div className='flex w-full items-center justify-between'>
              <p className='text-lg font-semibold text-richblack-5'>Personal Details </p>
              <div>
                <IconBtn text={"Edit"}  icon={true} onclick={()=>{navigate("/dashboard/settings")}}/>
              </div>

            </div>
            <div className='flex flex-row gap-[20vw] font-medium'>
              <div className='flex flex-col'>
                <p className='text-richblack-400'>First Name</p>
                <p className='text-richblack-5 mb-[15px] mt-[2px]'>{firstName}</p>
               <p className='text-richblack-400'>Email</p>
               <p className='text-richblack-5 mb-[15px] mt-[2px]'>{email}</p>
               <p className='text-richblack-400'>Gender</p>
                <p className='text-richblack-5 mb-[15px] mt-[2px]'>{gender}</p>

              </div>
              <div className='flex flex-col'>
                <p className='text-richblack-400'>Last Name</p>
               <p className='text-richblack-5 mb-[15px] mt-[2px]'>{lastName}</p>
                <p className='text-richblack-400'>Phone Number</p>
                <p className='text-richblack-5 mb-[15px] mt-[2px]'>{phoneNo}</p>
                <p className='text-richblack-400'>Date of Birth</p>
               <p className='text-richblack-5 mb-[15px] mt-[2px]'>{dateOfBirth}</p>
              </div>
            </div>
        </div>

      </div>

    </div>
  )
}

export default MyProfile