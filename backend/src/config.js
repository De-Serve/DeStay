import dotenv from "dotenv";
import path from "path";

if (process.env.NODE_ENV !== "production") {
  try {
    dotenv.config({
      path: path.resolve(__dirname, "../.env"),
      silent: true,
    });
  } catch (e) {
    console.error(e.message);
  }
}

module.exports = {
  jwt_secret: process.env.JWT_SECRET || "JWT_SECRET",
  mongoose: {
    uri: process.env.MONGODB_URI || "mongodb://root:qwerasdf@191.101.232.122:27017/hotel_booking?retryWrites=true&w=majority&authSource=admin",
  },
};
