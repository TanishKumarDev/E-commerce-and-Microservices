import express from "express";
import connectDB from "./utils/db.js";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// using middleware to parse json - always use this before routes; because we are using json in the body of the request
app.use(express.json());

// using routes
app.use("/api", userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});


