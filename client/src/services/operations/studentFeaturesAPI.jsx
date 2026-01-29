import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { studentEndpoints } from "../apis";
import { removeCart, clearCart } from "./cartAPI";

const { COURSE_PAYMENT_API } = studentEndpoints;

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export const buyCourse = async (
  token,
  courses,
  userDetails,
  navigate,
  dispatch
) => {
  const toastId = toast.loading("Redirecting to payment...");

  try {
    const loaded = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!loaded) {
      toast.error("Razorpay SDK failed");
      return;
    }

    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      { courses },
      { Authorization: `Bearer ${token}` }
    );

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message);
    }

    const options = {
      key: "rzp_test_OrocmKYRZqrXer",
      amount: orderResponse.data.amount,
      currency: orderResponse.data.currency,
      order_id: orderResponse.data.orderId,
      name: "CodeNest",
      description: "Course Purchase",
      prefill: {
        name: userDetails.firstName,
        email: userDetails.email,
      },
      handler: function () {
        updateCart(courses, token, dispatch);
        toast.success("Payment successful! Course will be added shortly.");
        navigate("/dashboard/enrolled-courses");
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

    paymentObject.on("payment.failed", () => {
      toast.error("Payment failed");
    });
  } catch (error) {
    toast.error("Payment initiation failed");
  }

  toast.dismiss(toastId);
};

async function updateCart(courses, token,dispatch) {
  try {
    let response;
    if (courses.length === 1) {
      // remove first course only
      const courseId = courses[0];
      response = await removeCart(courseId, token,dispatch);
    } else {
      // if only 1 course, clear entire cart
      //console.log("this is the payment clear cart");
      response = await clearCart(token,dispatch);
    }

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to update cart");
    }
    
    //console.log("Cart reset",response);
    toast.success("Cart updated successfully");
    
  } catch (error) {
    console.error("UPDATE CART ERROR....", error);
    toast.error(error.message || "Something went wrong while updating cart");
    throw error; // rethrow for caller if needed
  }   
}
