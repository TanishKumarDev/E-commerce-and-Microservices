import express from 'express';
import dotenv from 'dotenv';
import connectDB from "./utils/db.js";

// Load environment variables from .env file
dotenv.config();
const app = express();

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Dark Mode</title>
      <style>
        body {
          background-color: #121212;
          color: #e0e0e0;
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
      </style>
    </head>
    <body>
      <h1>Hello, World!</h1>
    </body>
    </html>
  `);
});
