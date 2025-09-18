import { toast } from "react-hot-toast"

import { setLoading, setToken } from "../../slices/authSlice"
import { setCart } from "../../slices/cartSlice"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiconnector"
import { cartEndpoints, endpoints } from "../apis";

//fetch all api or route of backend;
const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints
const{
  GET_USER_CART_API
}=cartEndpoints;



//send request to backend to run sendOTP api logic 
export function sendOtp(email,navigate,name) {
  //const name="Ram";
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))

    //make Backend Call to Access the Backend logic for that Route
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        name,
        checkUserPresent: true,
      })
      console.log("SENDOTP API RESPONSE............", response)

    

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("OTP Sent Successfully")
      navigate("/verify-email")
    } catch (error) {
      console.log("SENDOTP API ERROR............", error)
      toast.error("Could Not Send OTP")
    }


    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

//====================SignUp Data send ======================
//signup fuction to send Data to backend
export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        //These all Data send to backend Server on signup Api which a post type request
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      })

      console.log("SIGNUP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Signup Successful")
      navigate("/login")
    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      toast.error("Signup Failed")
      navigate("/signup")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

//=============Login function=====================
export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      })

      console.log("LOGIN API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Login Successful")
      dispatch(setToken(response.data.token))
      dispatch(setUser(response.data.user))
      
      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
      dispatch(setUser({ ...response.data.user, image: userImage }))
      
      //set token and user in localStroge of webBrowser;
     const expiryTime = Date.now() + 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem("token", JSON.stringify(response.data.token))
      localStorage.setItem("user", JSON.stringify(response.data.user))
      localStorage.setItem("tokenExpiry", expiryTime)

      // 🔥 Fetch user cart after login
      try {
        const cartResponse = await apiConnector("GET",GET_USER_CART_API,
          null,
          {
            Authorization: `Bearer ${response.data.token}`,
          }
        )
        console.log("USER CART RESPONSE............", cartResponse)

        if (cartResponse.data.success) {
          const courses=cartResponse.data.courses;
          for (const course of courses) {
            dispatch(setCart(course)) // save to Redux slice
          }
        }
      } catch (cartErr) {
        console.log("FETCH CART ERROR............", cartErr)
        //call to logout page and navigate to login page 
      }
      navigate("/dashboard/my-profile")
    } catch (error) {
      console.log("LOGIN API ERROR............", error)
      toast.error("Login Failed")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
   // dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("cart")
    localStorage.removeItem("totalItems")
    localStorage.removeItem("total");
    toast.success("Logged Out")
    navigate("/")
  }
}

//==================Send the email time and genrate the Token=================

export function getPasswordResetToken(email , setEmailSent) {
  return async(dispatch) => {
    dispatch(setLoading(true));
    const toastId = toast.loading("Sending...")
    try{
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {email,})

      console.log("RESET PASSWORD TOKEN RESPONSE....", response);

      if(!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Reset Email Sent");
      setEmailSent(true);
    }
    catch(error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error("Failed to send email for resetting password");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId)
  }
}

//======================After geting link (after genrating Token)==================
export function resetPassword(password, confirmPassword, token,navigate) {
  return async(dispatch) => {
    dispatch(setLoading(true));
    try{
      const response = await apiConnector("POST", RESETPASSWORD_API, {password, confirmPassword, token});

      console.log("RESET Password RESPONSE ... ", response);


      if(!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password has been reset successfully");
    }
    catch(error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error("Unable to reset password");
    }
    dispatch(setLoading(false));
    
    navigate("/login")
  }
}