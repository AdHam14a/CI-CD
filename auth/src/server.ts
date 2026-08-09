import express from "express";
import dotenv from "dotenv";
import DBconnect from "./config/db";
import authRoutes  from "./routes/auth.route";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
DBconnect();

//Middleware
app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log("Port in use is : ", port);
});
