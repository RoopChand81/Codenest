import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { setPaymentLoading } from "../../slices/courseSlice";
import { removeCart, clearCart} from "./cartAPI";

const {
    COURSE_PAYMENT_API,
    COURSE_VERIFY_API, 
    SEND_PAYMENT_SUCCESS_EMAIL_API
} = studentEndpoints;

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        }
        script.onerror= () =>{
            resolve(false);
        }
        document.body.appendChild(script);
    })
}



export const buyCourse= async (token, courses, userDetails, navigate, dispatch)=> {
    const toastId = toast.loading("Loading...");
    let result=null;
    try{
        //load the script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if(!res) {
            toast.error("RazorPay SDK failed to load");
            return;
        }

        //initiate the order using server;
        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, 
            {courses},
            {
                Authorization: `Bearer ${token}`,
            }
        )

        if(!orderResponse.data.success) {
            throw new Error(orderResponse.data.message);
        }
        console.log("PRINTING orderResponse", orderResponse);
        console.log("toatal courses:",courses);

        //create payment option detailed
        const options = {
            key:"rzp_test_OrocmKYRZqrXer",//razorpay id (public)
            currency: orderResponse.data.currency,
            amount: `${orderResponse.data.amount}`,
            order_id:orderResponse.data.orderId,
            name:"Codenext",
            description: "Thank You for Purchasing the Course",
            prefill: {
                name:`${userDetails.firstName}`,
                email:userDetails.email
            },
            handler: function(response) {
                //after payment Done these Action;

                //send successful wala mail
                sendPaymentSuccessEmail(response, orderResponse.data.amount,token );
                updateCart(courses,token,dispatch);
                //verifyPayment
                verifyPayment({...response, courses}, token, navigate, dispatch);
                //update the cart
                

            }
        }
        //open payment window 
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function(response) {
            toast.error("oops, payment failed");
            console.log(response.error);
        })
        result=orderResponse;

    }
    catch(error) {
        console.log("PAYMENT API ERROR.....", error);
        toast.error("Could not make Payment");
    }
    toast.dismiss(toastId);
    return result;
}


async function sendPaymentSuccessEmail(response, amount, token) {
    try{
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount,
        },{
            Authorization: `Bearer ${token}`
        })
    }
    catch(error) {
        console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
    }
}

//verify payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment....");
    dispatch(setPaymentLoading(true));
    try{
        const response  = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
            Authorization:`Bearer ${token}`,
        })

        if(!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.success("payment Successful, addded to the course");
        navigate("/dashboard/enrolled-courses");
    }   
    catch(error) {
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}

async function updateCart(courses, token,dispatch) {
  try {
    let response;
    if (courses.length === 1) {
      // remove first course only
      const courseId = courses[0];
      response = await removeCart(courseId, token,dispatch);
    } else {
      // if only 1 course, clear entire cart
      console.log("this is the payment clear cart");
      response = await clearCart(token,dispatch);
    }

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to update cart");
    }
    console.log("Cart reset",response);
    toast.success("Cart updated successfully");
    
  } catch (error) {
    console.error("UPDATE CART ERROR....", error);
    toast.error(error.message || "Something went wrong while updating cart");
    throw error; // rethrow for caller if needed
  }   
}
