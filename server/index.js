import express from "express"; // import express
import dotenv from "dotenv"; // import dotenv
import connectDB from "./utils/db.js";

// configure env
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// app.get("/", (req, res) => {
//     res.send("Hello from server");
// });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
// connectDB();

