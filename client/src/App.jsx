import "./App.css";
import { lazy ,Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Error from "./pages/Error";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import Navbar from "./components/common/Navbar";
const About = lazy(() => import("./pages/About")); // Lazy-loaded component
import Spinner from "./components/common/Loading";
const Contact=lazy(()=>import("./pages/Contact"));
import Dashboard from "./pages/Dashboard";
const Catalog= lazy(()=>import("./pages/Catalog"));
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse";
import MyProfile from "./components/core/Dashboard/MyProfile";
import EnrolledCourse from "./components/core/Dashboard/EnrolledCourses";
import AdminPannel from "./components/core/Dashboard/AdminPannel";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Cart from "./components/core/Dashboard/Cart/index"
import AddCourse from  "./components/core/Dashboard/AddCourse/index"
import Index from "./components/core/Dashboard/Settings/Index";
import MyCourses from "./components/core/Dashboard/MyCourses/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse/EditCourse";
import Instructor from "./components/core/Dashboard/instructorDashboard/Instructor";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import { ACCOUNT_TYPE } from "./utils/constants";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLocation} from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setToken } from "./slices/authSlice";
import { setUser } from "./slices/profileSlice";



function App() {
   const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  //check user login sestion expire or not when change url
  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("tokenExpiry");
    //today time is more then sestion time 
    if (!token || !expiry || Date.now() > Number(expiry)) {
      // Clear localStorage and Redux state
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("tokenExpiry");
      dispatch(setToken(null));
      dispatch(setUser(null));
    }
  }, [location.pathname]);

  const {user}=useSelector((state)=>state.profile);
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter ">
      {/* Navbar is the menu bar Common component for all pages */}
      <Navbar/>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/> 
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/update-password/:id" element={<UpdatePassword/>}/>
        <Route path="/verify-email" element={<VerifyEmail/>}/>
        {/* <Route path="/about" element={<About/>}/> */}
        <Route
            path="/about"
            element={
              <Suspense fallback={
                <Spinner/>}
              >
                <About />
              </Suspense>
            }
        />
        <Route
            path="/contact"
            element={
              <Suspense fallback={
                <Spinner/>}
              >
                <Contact />
              </Suspense>
            }
        />
        <Route
            path="/catalog/:catalogName"
            element={
              <Suspense fallback={
                <Spinner/>}
              >
                < Catalog/>
              </Suspense>
            }
        />
        <Route path="/courses/:courseId" element={<CourseDetails/>}/>

        {/* private route Access  check conditions */}
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
            <Route path="/dashboard/edit-course/:courseId" element={<EditCourse/>}/>
            <Route path="/dashboard/instructor" element={<Instructor/>}/>   
            <Route path="/dashboard/create-category" element={<AdminPannel/>}/>     
        </Route>

        <Route element={
          <PrivateRoute><ViewCourse/></PrivateRoute>
          }
        >
          {
            user?.accountType===ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="/dashboard/enrolled-courses/view-course/:courseId/section/:sectionId/Sub-Section/:SubSectionId" element={<VideoDetails/>}/> 
              </>
            )
          }
        </Route>
        <Route path="*" element={<Error/>}/>

      </Routes>
    </div>
  );
}

export default App;
