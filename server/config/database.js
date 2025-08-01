const mongoose = require('mongoose');
require('dotenv').config();


exports.connectDB = () => {
    mongoose
      .connect(process.env.MONGODB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // ssl: true,
      }
      )
      .then(() => {
        console.log("Database connected succcessfully");
      })
      .catch((error) => {
        console.log(`Error while connecting server with Database`);
        console.error(error);
        process.exit(1); //when DB connection Error stop all services
      });
};