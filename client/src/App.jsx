import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Error from "./pages/Error";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import Navbar from "./components/common/Navbar";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./components/core/Dashboard/MyProfile";
import EnrolledCourse from "./components/core/Dashboard/EnrolledCourses";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Cart from "./components/core/Dashboard/Cart/index"
import AddCourse from  "./components/core/Dashboard/AddCourse/index"
import Index from "./components/core/Dashboard/Settings/Index";
import MyCourses from "./components/core/Dashboard/MyCourses/MyCourses";
function App() {
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter ">
      {/* Navbar is the menu bar Common component */}
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/> 
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/update-password/:id" element={<UpdatePassword/>}/>
        <Route path="/verify-email" element={<VerifyEmail/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>

        <Route element={
            <PrivateRoute><Dashboard/></PrivateRoute>
          }
        >
             <Route path="/dashboard/enrolled-courses" element={<EnrolledCourse/>} />
             <Route path="/dashboard/my-profile" element={<MyProfile/>} />
             <Route path="/dashboard/settings" element={<Index/>} />
             <Route path="/dashboard/cart" element={<Cart/>} />
            <Route path="/dashboard/add-course" element={<AddCourse/>}/> 
            <Route path="/dashboard/my-courses" element={<MyCourses/>}/>        
            

        </Route>
       
        <Route path="*" element={<Error/>}/>
      </Routes>
    </div>
  );
}

export default App;
