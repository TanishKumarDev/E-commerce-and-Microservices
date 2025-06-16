import express from "express"; // import express
import dotenv from "dotenv"; // import dotenv
import connectDB from "./utils/db.js";

// configure env
dotenv.config();

const app = express();

// middleware BEFORE your routes
app.use(express.json()); // Parses JSON bodies

const PORT = process.env.PORT || 5000;

// importing routes
import userRoutes from "./routes/user.js";

// using routes
app.use("/api", userRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
// connectDB();

