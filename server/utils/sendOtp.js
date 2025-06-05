import { createTransport } from "nodemailer";

const sendOtp = async ({ email, subject, otp }) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        h1 {
            color: #2c3e50;
            font-size: 28px;
            margin-bottom: 20px;
        }
        p {
            margin-bottom: 20px;
            color: #34495e;
            font-size: 16px;
            line-height: 1.6;
        }
        .otp {
            font-size: 42px;
            color: #3498db;
            margin: 30px 0;
            font-weight: bold;
            letter-spacing: 4px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 8px;
            display: inline-block;
        }
        .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #7f8c8d;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>OTP Verification</h1>
        <p>Hello ${email},</p>
        <p>Your One-Time Password (OTP) for account verification is:</p>
        <div class="otp">${otp}</div>
        <p class="footer">This OTP will expire in 5 minutes. Please do not share this code with anyone.</p>
    </div>
</body>
</html>`;

  await transport.sendMail({
    from: process.env.Gmail,
    to: email,
    subject,
    html,
  });
};

export default sendOtp;
