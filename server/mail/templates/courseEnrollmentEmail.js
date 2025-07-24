const courseEnrollmentEmail = (courseName, name) => {
    const logo =
      "https://res.cloudinary.com/dgyljotfp/image/upload/v1744370877/IMAGE/folof84kwix6fnn2bn1x.png";
    return `<!DOCTYPE html>
    <html>

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Registration Successful</title>
        <style>
            body {
                background-color: #f4f4f4;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
            }

            .container {
                max-width: 600px;
                margin: 30px auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                text-align: center;
            }

            .logo {
               "max-width: 150px; 
               height: auto; 
               display: block; 
               margin: 0 auto 20px;
            }

            .header {
                font-size: 22px;
                font-weight: bold;
                color: #2c3e50;
                margin-bottom: 10px;
            }

            .body-text {
                font-size: 16px;
                color: #555;
                margin-bottom: 20px;
            }

            .highlight {
                font-weight: bold;
                color: #27ae60;
            }
            /*=============================================*/
            .cta {
            min-width: 130px;
            height: 40px;
            color: #ffffff;
            padding: 5px 10px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            display: inline-block;
            outline: none;
            overflow: hidden;
            border-radius: 5px;
            border: none;
            background-color: #27ae60;
            }
            .cta:hover {
            border-radius: 5px;
            padding-right: 24px;
            padding-left:8px;
            }
            .cta:hover:after {
            opacity: 1;
            right: 10px;
            }
            .cta:after {
            content: "»";
            position: absolute;
            opacity: 0;
            font-size: 20px;
            line-height: 40px;
            top: 0;
            right: -20px;
            transition: 0.4s;
            }
            
            /*===========================================*/

            .footer {
                font-size: 14px;
                color: #777;
                margin-top: 20px;
            }
            
            .footer a {
                color: #3498db;
                text-decoration: none;
            }
        </style>
    </head>

    <body>
        <div class="container">
            <img class="logo" src="${logo}" alt="CodeNest Logo">
            <div class="header">🎉 Course Registration Successful! 🎉</div>
            <div class="body-text">
                <p>Dear <span class="highlight">${name}</span>,</p>
                <p>You have successfully registered for the course <span class="highlight">"${courseName}"</span>. We
                        are excited to have you as a participant!</p>
                <p>We are thrilled to have you on board! Click below to access your dashboard and start exploring.</p>
                <a class="cta" href="[DASHBOARD_LINK]">Go to Dashboard</a>
            </div>
            <div class="footer">
                Need help? Contact us at  
                <a href="mailto:support@example.com">support@example.com</a>
            </div>
        </div>
    </body>

</html>`;
  };

module.exports = courseEnrollmentEmail;