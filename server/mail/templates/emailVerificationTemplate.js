//this template work when signup it send for Otp ;
const { eventNames } = require("../../models/section");

const otpTemplate = (otp, name) => {
  const logo =
    "https://res.cloudinary.com/dgyljotfp/image/upload/v1744370877/IMAGE/folof84kwix6fnn2bn1x.png";
  return `<!DOCTYPE html>
	<html>

		<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>OTP Verification</title>
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
				max-width: 200px;
				margin-bottom: 20px;
				max-height:100px;
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

			.otp-code {
				font-size: 28px;
				font-weight: bold;
				color: #27ae60;
				background-color: #f4f4f4;
				padding: 10px 20px;
				border-radius: 5px;
				display: inline-block;
				margin: 15px 0;
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
			<div class="header">🔐 OTP Verification</div>
			<div class="body-text">
				<p>Dear <span class="highlight">${name}</span>,</p>
				<p>Thank you for registering with CodeNest. To complete your registration, please use the following OTP
					(One-Time Password) to verify your account:</p>
				<p>Your OTP for verification is:</p>
				<div class="otp-code">${otp}</div>
				<p>This OTP is valid for **10 minutes**. Do not share it with anyone.</p>
			</div>
			<div class="footer">
				Need help? Contact us at  
				<a href="mailto:support@example.com">support@example.com</a>
			</div>
		</div>
		</body>

	</html> `;
};
module.exports = otpTemplate;
