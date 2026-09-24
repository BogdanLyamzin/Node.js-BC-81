import mongoose from "mongoose";

const connectDatababse = async()=> {
  try {
    await mongoose.connect(process.env.DB_HOST);
    console.log("Successfully connect database");
  }
  catch(error) {
    console.log("Failed connect database", error.message);
    throw error;
  }
}

export default connectDatababse;
