//This Page Show the ForgetPassword Page  which responsible to Show both page  
//send a link on email passowrd and  check email Password Page;


import { useState } from "react"
import { BiArrowBack } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { getPasswordResetToken } from "../services/operations/authAPI"

function ForgotPassword() {
  
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)//it decied which show and also stauts of emailSent or Not
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth)

  const handleOnSubmit = (e) => {
    e.preventDefault()
    dispatch(getPasswordResetToken(email, setEmailSent))
  }

  return (
      //Base on emailSent or not render all things Beacause it cover the both page functionalty base on emailSent 
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">

          <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
            {!emailSent ? "Reset your password" : "Check email"}
          </h1>

          <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
            {!emailSent
              ? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
              : `We have sent the reset email to ${email}`}
          </p>
          <form onSubmit={handleOnSubmit}>

            {!emailSent && (
                  <label className="w-full block">
                  <p className="mb-2 text-sm font-medium text-richblack-100">
                        Email Address <sup className="text-pink-300">*</sup>
                  </p>

                  <div className="relative">
                        <input
                              required
                              type="email"
                              name="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Enter email address"
                              className="peer w-full rounded-xl border border-richblack-700 bg-richblack-800 px-4 py-3 text-richblack-5 placeholder:text-richblack-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                        />
                        <span className="pointer-events-none absolute left-4 top-[0.85rem] text-sm text-richblack-400 transition-all peer-placeholder-shown:top-[0.85rem] peer-focus:top-[-0.6rem] peer-focus:text-xs peer-focus:text-blue-400">
                              {/* floating label effect can be done here if needed */}
                        </span>
                  </div>
            </label>

            )}

            <button
              type="submit"
              className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
            >
              {!emailSent ? "Sumbit" : "Resend Email"}
            </button>

          </form>

          <div className="mt-6 flex items-center justify-between">
            <Link to="/login">
              <p className="flex items-center gap-x-2 text-richblack-5">
                <BiArrowBack /> Back To Login
              </p>
            </Link>
          </div>

        </div>
      )}
    </div>
  )
}

export default ForgotPassword