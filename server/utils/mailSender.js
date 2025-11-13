//This function send a Mail on given mailAddress;
const nodemailer= require("nodemailer");
const mailSender =async(email,title,body)=>{
      try{
        //create a mail Transporter;
        let transporter = nodemailer.createTransport({
          host: process.env.MAIL_HOST, // SMTP Server (e.g., Gmail, Outlook, etc.)
          auth: {
            user: process.env.MAIL_USER, // Sender Email address (from environment variable)
            pass: process.env.MAIL_PASS, // Email password (not your actual Gmail password)
          },
        });

        // 2️⃣ Verify connection before sending
        await transporter.verify();

        //this is send the actual email on given mail Address
        let info = await transporter.sendMail({
          from: "CodeNest", //The sender's name (this is displayed in the recipient's inbox)
          to: `${email}`, //reciver mail
          subject: `${title}`, //title or Subject
          html: `${body}`, //body of mail formate as HTML;
        });
            //  Validate the result
            if (info.rejected.length > 0) {
            console.warn("⚠️ Some emails were rejected:", info.rejected);
            throw new Error(
                  `Email delivery failed for: ${info.rejected.join(", ")}`
            );
            }

            if (info.accepted.length === 0) {
            throw new Error("Email not accepted by the mail server.");
            }

            console.log("✅ Email sent successfully:", info.messageId);
            console.log("📩 Server response:", info.response);

            return {
                  success: true,
                  messageId: info.messageId,
                  accepted: info.accepted,
                  response: info.response,
            };
      }
      catch(error){
            //console.log(error.message);
            return {
              success: false,
              error: error.message,
            };
      }
}

module.exports=mailSender;

