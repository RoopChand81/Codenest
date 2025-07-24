const resetPasswordTemplate = (name, resetLink) => {
 const logo =
   "https://res.cloudinary.com/dgyljotfp/image/upload/v1744370877/IMAGE/folof84kwix6fnn2bn1x.png";

  return `<!DOCTYPE html>
  <html>

    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Reset Password</title>
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
          max-height: 100px;
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
          background-color: #e67e22;
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
        <div class="header">🔐 Reset Your Password</div>
        <div class="body-text">
          <p>Dear <span class="highlight">${name}</span>,</p>
          <p>We received a request to reset your CodeNest account password. Click the button below to proceed:</p>
          <a class="cta" href="${resetLink}">Reset Password</a>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          Need help? Contact us at 
          <a href="mailto:support@example.com">support@example.com</a>
        </div>
      </div>
    </body>

  </html>`;
};

module.exports = resetPasswordTemplate;
