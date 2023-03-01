import dotenv from "dotenv";
import Express from "express";
import mongoose from "mongoose";
// api routes
const authRoutes = require("./api/routes/auth.routes");
const app = Express();
dotenv.config();

// connect DB
const URI = process.env.URI;

const connectDB = async () => {
  await mongoose
    .connect(URI!, {
      autoIndex: false,
      family: 4,
    })
    .then(() => {
      console.log("DB connection successful!");
    })
    .catch((error) => {
      console.log("DB connection failed!", error);
    });
};
mongoose.set("strictQuery", false);
connectDB();

// middlewares
app.use(Express.urlencoded({ extended: false }));
app.use(Express.json());

// api routes middleware
app.use("/api/auth", authRoutes);

app.listen(8000);
