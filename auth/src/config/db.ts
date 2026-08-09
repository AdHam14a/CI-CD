import mongoose from "mongoose";

const DBconnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
    console.log("DB connected");
  } catch (error) {
    console.error("DB error : ", error);
  }
};

export default DBconnect;
