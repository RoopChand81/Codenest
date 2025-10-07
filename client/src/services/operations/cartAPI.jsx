import { toast } from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { cartEndpoints } from "../apis"
import {resetCart,removeFromCart} from "../../slices/cartSlice"

const {
  ADD_TO_CART_API,
  REMOVE_FROM_CART_API,
  CLEAR_CART_API,
  GET_USER_CART_API,
} = cartEndpoints

// Add a course to cart
export const addToCart= async (courseId, token,dispatch)=> {
    const toastId = toast.loading("Adding course to cart...")
    let result=null;
    try {
      const response = await apiConnector("POST",ADD_TO_CART_API,
        { courseId },
        {
          Authorization: `Bearer ${token}`,
        }
      )
      console.log("ADD TO CART RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      result=response;
    } catch (error) {
      console.log("ADD TO CART ERROR............", error)
      toast.error("Failed to add this course")
    }
    toast.dismiss(toastId);
    return result;
}


// Remove a course from cart
export const removeCart=async (courseId, token,dispatch)=> {
    let result=null;
    try {
      const response = await apiConnector(
        "DELETE",
        REMOVE_FROM_CART_API,
        
        { courseId },
        {
          Authorization: `Bearer ${token}`,
        }
      )

      console.log("REMOVE FROM CART RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      dispatch(removeFromCart(courseId))
      result=response;
    } catch (error) {
      console.log("REMOVE FROM CART ERROR............", error)
      toast.error("Failed to remove course")
    }
    return result;
}

// Clear entire cart
export const clearCart=async(token,dispatch)=> {
    try {
      const response = await apiConnector(
        "DELETE",
        CLEAR_CART_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      )
      console.log("CLEAR CART RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      dispatch( resetCart()) // ✅ empty the cart in Redux
      return response;
    } catch (error) {
      console.log("CLEAR CART ERROR............", error)
      toast.error("Failed to clear cart")
    }
    
  
}

// Get user cart
export function getUserCart(token) {
  return async (dispatch) => {
    const toastId = toast.loading("Fetching cart...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector(
        "GET",
        GET_USER_CART_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      )

      console.log("GET USER CART RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Cart fetched")
      dispatch(setCart(response.data.courses)) // ✅ store courses in Redux slice
      return response.data.courses
    } catch (error) {
      console.log("GET USER CART ERROR............", error)
      toast.error("Failed to fetch cart")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}
