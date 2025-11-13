const { contactUsEmail } = require("../mail/templates/contactFormRes");
const mailSender = require("../utils/mailSender");

exports.contactUs = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } =req.body;
  try {
    const senderNotify = await mailSender(
      email,
      "Your Data send successfully",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    );
    if (!senderNotify.success) {
      throw new Error("Failed to send email");
    }

    const adminEmail="karanagrahari33@gmail.com";

    const  admminNotify = await mailSender(
      adminEmail,
      "New Contact Us Message Received",
      `You have received a new message from <br/>
      Name:-${firstname}  ${lastname} <br/>
      email:-(${email}<br/>
      Country Code:-${countrycode}<br/>
      Phone No:-${phoneNo})
      <br/><br/> 
      Problem:- ${message}`
    );
    if (!admminNotify.success) {
      throw new Error("Failed to send email to admin");
    }
    return res.json({
      success: true,
      message: "Email send successfully",
    });

  } catch (error) {
    //console.log("Error", error);
    //console.log("Error message :", error.message);
    return res.json({
      success: false,
      message: "Email not send try again",
    });
  }
};
