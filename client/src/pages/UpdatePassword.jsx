//this Page render when we click link which send on email for reset the Password
//this page perform the reset the Password ;

import React, { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux'
import { useLocation,Link, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/operations/authAPI';
import {BiArrowBack} from "react-icons/bi"


const UpdatePassword = () => {
      const navigate = useNavigate()
      const dispatch=useDispatch();
      const location=useLocation();//useing this HooK we take a Path Value or a single Part of Path
    
      const [formData,setFormData]=useState({
            Password: "",
            confirmPassword:"",
      })
      
      const {loading}=useSelector((state)=>state.auth)
      const [showPassword,setShowPassword]=useState(false);
      const [showConfirmPassword,setShowConfirmPassword]=useState(false);

      const {password,confirmPassword}=formData;//extract password Value which send using dispatch;
      
      const handleOnChange=(e)=>{
            setFormData((preData)=>(
                  {
                        ...preData,
                        [e.target.name]:e.target.value,
                  }
            ))
      }

      const handleOnSubmit=(e)=>{
            e.preventDefault();               
            //pathName se Data Lo and fir Use split karo array ke form base on / and return rightMost (last) Value of Array;
            const token=location.pathname.split('/').at(-1);
            dispatch(resetPassword(password,confirmPassword,token,navigate));
      }

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-richblack-900 px-4">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="w-full max-w-[500px] rounded-xl bg-richblack-800 p-6 shadow-xl lg:p-10">
          <h1 className="text-3xl font-bold text-richblack-5">
            Choose New Password
          </h1>
          <p className="mt-3 text-base text-richblack-100">
            Almost done. Enter your new password and you’re all set.
          </p>

          <form onSubmit={handleOnSubmit} className="mt-6 space-y-5">
            {/* Password */}
            <label className="relative block">
              <p className="mb-1 text-sm text-richblack-5">
                New Password <sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="Enter new password"
                className="w-full rounded-md border border-richblack-600 bg-richblack-700 py-3 pl-4 pr-12 text-richblack-5 placeholder:text-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-50"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-[42px] z-10 cursor-pointer"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={22} className="text-richblack-300" />
                ) : (
                  <AiOutlineEye size={22} className="text-richblack-300" />
                )}
              </span>
            </label>

            {/* Confirm Password */}
            <label className="relative block">
              <p className="mb-1 text-sm text-richblack-5">
                Confirm New Password <sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleOnChange}
                placeholder="Confirm new password"
                className="w-full rounded-md border border-richblack-600 bg-richblack-700 py-3 pl-4 pr-12 text-richblack-5 placeholder:text-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-50"
              />
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-[42px] z-10 cursor-pointer"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible size={22} className="text-richblack-300" />
                ) : (
                  <AiOutlineEye size={22} className="text-richblack-300" />
                )}
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-yellow-50 py-3 text-center text-base font-semibold text-richblack-900 transition-all duration-200 hover:bg-yellow-100"
            >
              Reset Password
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <Link to="/login">
              <p className="flex items-center gap-2 text-richblack-200 hover:text-richblack-5 transition-colors">
                <BiArrowBack size={18} /> Back To Login
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default UpdatePassword