//This function send a Mail on given mailAddress;
const nodemailer= require("nodemailer");
const mailSender =async(email,title,body)=>{
      try{
            //create a mail Transporter;
            let transporter=nodemailer.createTransport({
                  host:process.env.MAIL_HOST,// SMTP Server (e.g., Gmail, Outlook, etc.)
                  auth:{
                        user:process.env.MAIL_USER,// Sender Email address (from environment variable)
                        pass:process.env.MAIL_PASS,// Email password (not your actual Gmail password)
                  }
            });
         
            //this is send the actual email on given mail Address
            let info=await transporter.sendMail({
                  from:'CodeNest',//The sender's name (this is displayed in the recipient's inbox)
                  to:`${email}`,//reciver mail
                  subject:`${title}`,//title or Subject 
                  html:`${body}`,//body of mail formate as HTML;
            });
            return info;
      }
      catch(error){
            console.log(error.message);
      }
}

module.exports=mailSender;

