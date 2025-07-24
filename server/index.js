const express =require('express')
const app = express()

//package
const fileUpload=require('express-fileupload');
const cookieParser= require('cookie-parser');
const cors = require('cors');//use for frentend and backend run on both on machine and backend intertain the frentend request

const dotenv=require("dotenv");

//config Part 
const {connectDB}=require('./config/database');
const {cloudinaryConnect}=require('./config/cloudinary');

//routes Import
const userRoutes = require('./routers/user');
const profileRoutes = require('./routers/profile');
const paymentRoutes = require('./routers/payments');
const courseRoutes = require('./routers/course')

//midleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://codenest-edtech.netlify.app",
      "https://codenest-cz7r.vercel.app/",
    ], //jo requrest frentend se ayega use entertain karana hai
    credentials: true,
  })
);

app.use(
      fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
      })
)

const PORT=process.env.PORT ||4000;

//conecting the DataBase and cloudinary
connectDB();
cloudinaryConnect();

//mount route (add prefix in routes)
app.use('/api/v1/auth',userRoutes);
app.use('/api/v1/profile',profileRoutes);
app.use('/api/v1/payment',paymentRoutes);
app.use('/api/v1/course',courseRoutes);

//Defalt Routes(Home page)
app.get('/',(req,res)=>{
      res.send(`<h1>This is Default Route Everything OK (Home)</h1>`);

})

app.listen(PORT,()=>{
      console.log(`server is running on port ${PORT}`);
});