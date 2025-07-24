//this template work when we are change Password using old Password it send Notifation only just;

exports.passwordUpdated = (email, name) => {
	return `<!DOCTYPE html>
    <html>

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Password Updated Successfully</title>
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
                    max-width: 150px;
                    margin-bottom: 20px;
                }

                .header {
                    font-size: 24px;
                    font-weight: bold;
                    color: #2c3e50;
                    margin-bottom: 10px;
                }

                .body-text {
                    font-size: 16px;
                    color: #555;
                    margin-bottom: 20px;
                }

                .cta {
                    display: inline-block;
                    padding: 12px 20px;
                    background-color: #27ae60;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 16px;
                    font-weight: bold;
                    margin-top: 20px;
                }

                .warning {
                    font-size: 14px;
                    color: #e74c3c;
                    font-weight: bold;
                    margin-top: 20px;
                }

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
                <img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png" alt="Company Logo">
                <div class="header">🔐 Password Updated Successfully</div>
                <div class="body-text">
                    <p>Dear <span class="highlight">${name}</span>,</p>
                    <p>Your password has been successfully updated for the email <span class="highlight">${email}</span>.</p>
                    <p>If you did not request this change, please reset your password immediately.</p>
                    <a class="cta" href="[RESET_LINK]">Reset Password</a>
                </div>
                <div class="warning">
                    If you did not update your password, this may indicate unauthorized access to your account.
                </div>
                <div class="footer">
                    Need help? Contact us at  
                    <a href="mailto:support@example.com">support@example.com</a>
                </div>
            </div>
        </body>

    </html>`;
};