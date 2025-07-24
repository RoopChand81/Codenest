import {settingsEndpoints} from "../apis"
import { apiConnector } from "../apiconnector"
import { setUser } from "../../slices/profileSlice"
import { setToken } from "../../slices/authSlice";
import toast from "react-hot-toast";


const {
      UPDATE_DISPLAY_PICTURE_API,
      CHANGE_PASSWORD_API,
      UPDATE_PROFILE_API,
      DELETE_PROFILE_API,

}=settingsEndpoints;


export function updateDisplayPicture(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      )
      console.log(
        "UPDATE_DISPLAY_PICTURE_API API RESPONSE............",
        response
      )

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      dispatch(setUser(response.data.user));
      localStorage.removeItem("user")
      localStorage.setItem("user", JSON.stringify(response.data.user))

      toast.success("Display Picture Updated Successfully")
      
      
    } catch (error) {
      console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error)
      toast.error("Could Not Update Display Picture")
    }
    toast.dismiss(toastId)
  }
}


export function changePassword(token,oldPassword,newPassword,confirmPassword){
      return async (dispatch) => {
            const toastId = toast.loading("Updating...")
            console.log("change Password");
         try{
            const response=await apiConnector(
                  "POST",
                  CHANGE_PASSWORD_API,
                  {
                        oldPassword,
                        newPassword,
                        confirmPassword,
                        token,
                  },
                  // {
                  //       Authorization: `Bearer ${token}`, 
                  // }
            );

            console.log("CHANGE_PASSWORD_API API RESPONSE............",response)

            if(!response.data.success){
                  throw new Error(response.data.message)
            }
           
         }catch(error){
            console.log(error);
            console.log("Password Update fail");
            toast.error("Could Not Update Password");
         }
         toast.dismiss(toastId)

      }

}

export function updateProfile(token,data){
  return  async(dispatch)=>{
    const toastId = toast.loading("Updating...")
    try{
      const response=await apiConnector(
        "PUT",
        UPDATE_PROFILE_API,
        data,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      )
      console.log("Update the Profile ",response);
      if(!response.data.success){
          throw new Error(response.data.message);
      }
      dispatch(setUser(response.data.user));
      localStorage.removeItem("user")
      localStorage.setItem("user", JSON.stringify(response.data.user))

      toast.success("Profile Updated Successfully");
    }catch(error){
      console.log(error);
      toast.error("Could Not update the profile");

    }
    toast.dismiss(toastId)
  }
}

export function deleteProfile(token,navigate) {
  return async(dispatch)=>{
    const toastId = toast.loading("Updating...");
    try{
      const response=await apiConnector(
        "DELETE",
        DELETE_PROFILE_API,
        {
          token,
        }
      )
      console.log("Delete Account",response);

      if(!response.data.success){
        throw new Error(response.data.message);
      }
      dispatch(setToken(null))
      dispatch(setUser(null))
      // dispatch(resetCart())
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      toast.success("Account Deleted Successfully");

      navigate("/");

    }catch(error){
      console.log("Error to deteleting the Account ",error.message);
      toast.error("Account Not Deleted")

    }
    toast.dismiss(toastId)


  }
  
}
