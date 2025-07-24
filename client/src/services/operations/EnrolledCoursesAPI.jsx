import toast from "react-hot-toast";
import { profileEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";// ✅ Make sure this is imported

const {
  GET_USER_ENROLLED_COURSES_API,
  GET_INSTRUCTOR_DATA_API,
} = profileEndpoints;

//Student fetch all enrolled Courses
export function getUserEnrolledCourses(token) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector(
        "GET",
        GET_USER_ENROLLED_COURSES_API,
        null,
        {
          Authorization: `Bearer ${token}`, // ✅ Headers passed in 4th argument
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      console.log("in operation",response);
      toast.dismiss(toastId);
      return response;

    } catch (error) {
      console.error(error);
      toast.error("Error fetching courses");
      toast.dismiss(toastId);
      return;
    }
  };
}


export async function getInstructorData(token) {
  const toastId = toast.loading("Loading...");
  let result = [];
  try{
    const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, 
    {
      Authorization: `Bearer ${token}`,
    })

    console.log("GET_INSTRUCTOR_API_RESPONSE", response);
    result = response?.data?.courses

  }
  catch(error) {
    console.log("GET_INSTRUCTOR_API ERROR", error);
    toast.error("Could not Get Instructor Data")
  }
  toast.dismiss(toastId);
  return result;
}
