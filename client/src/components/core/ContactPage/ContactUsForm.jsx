//Actual contact only form which contain input field and submit button and handle form submission
// using react-hook-form and send data to backend api;
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import CountryCode from "../../../data/countrycode.json"
import { apiConnector } from "../../../services/apiconnector"
import { contactusEndpoint } from "../../../services/apis"
import toast from "react-hot-toast"

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false)

  // Form hook setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm()

  // Submit function
  const submitContactForm = async (data) => {
    // console.log("Form Data - ", data)
    const toastId = toast.loading("Sending...")
    try {
     
      const res = await apiConnector(
        "POST",
        contactusEndpoint.CONTACT_US_API,
        data
      )
      //console.log("Email Res - ", res)
      setLoading(false)
      if(res.data.success){
        toast.dismiss(toastId);
        toast.success(res.data.message);
      }
      else{
        toast.dismiss(toastId);
        toast.error("Server busy Try Again!");
      }
    } catch (error) {
      //console.log("ERROR MESSAGE - ", error.message)
      setLoading(false);
      toast.dismiss(toastId);
      toast.error("Server Down Try Again!");
    }
  }

  // Reset form on successful submit
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstname: "",
        lastname: "",
        message: "",
        phoneNo: "",
        countrycode:"+91"
      })
    }
  }, [reset, isSubmitSuccessful])

  return (
    <form
      onSubmit={handleSubmit(submitContactForm)}
      className="flex flex-col gap-8 bg-transparent p-6 rounded-lg shadow-md backdrop-blur-sm"
    >
      {/* First + Last Name */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* First Name */}
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="firstname" className="text-sm font-semibold text-white">
            First Name
          </label>

          <input
            type="text"
            id="firstname"
            placeholder="Enter first name"
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            {...register("firstname", { required: true })}//link data and m
          />

          {errors.firstname && (
            <span className="text-xs text-yellow-100">Please enter your name.</span>
          )}
        </div>

        {/* Last Name */}
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="lastname" className="text-sm font-semibold text-white">
            Last Name
          </label>
          <input
            type="text"
            id="lastname"
            placeholder="Enter last name"
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            {...register("lastname")}
          />
        </div>
      </div>

      {/* Email Address */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-semibold text-white">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter email address"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <span className="text-xs text-yellow-100">Please enter your Email address.</span>
        )}
      </div>

      {/* Phone Number */}
      <div className="flex flex-col gap-2">
        <label htmlFor="phonenumber" className="text-sm font-semibold text-white">
          Phone Number
        </label>
        <div className="flex gap-5"> {/* Increased gap for better spacing */}
          
          {/* Country Code Dropdown */}
          <div className="">
            <select
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-21 rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
              {...register("countrycode", { required: true })}
            >
              
              {CountryCode.map((element, index) => (
                <option key={index} value={element.code}  selected={element.country === "India"} >
                  {element.code} - {element.country}
                </option>
              ))}
            </select>

          </div>
          {/* Phone Number Input */}
          <div className="flex-1">
            <input
              type="number"
              id="phonenumber"
              placeholder="12345 67890" 
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
              {...register("phoneNo", {
                required: {
                  value: true,
                  message: "Please enter your Phone Number.",
                },
                maxLength: { value: 12, message: "Invalid Phone Number" },
                minLength: { value: 10, message: "Invalid Phone Number" },
              })}
            />
          </div>

        </div>
        {errors.phoneNo && (
          <span className="text-xs text-yellow-100">{errors.phoneNo.message}</span>
        )}
      </div>
      {/* Message */}
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-semibold text-white">
          Message
        </label>
        <textarea
          id="message"
          rows="6"
          placeholder="Enter your message here"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
          {...register("message", { required: true })}
        />
        {errors.message && (
          <span className="text-xs text-yellow-100">Please enter your Message.</span>
        )}
      </div>
      {/* Submit Button */}
      <button
        disabled={loading}
        type="submit"
        className="hover:scale-95 hover:shadow-inner rounded-md bg-yellow-50 px-6 py-3 sm:text-base text-center text-sm font-bold text-richblack-900 duration-200  transition-all"  
        
      >
        Send Message
      </button>
    </form>
  )
}

export default ContactUsForm
