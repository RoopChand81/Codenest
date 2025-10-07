import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getUserEnrolledCourses } from '../../../services/operations/EnrolledCoursesAPI';
import ProgressBar from "@ramonak/react-progress-bar"
import { useNavigate } from 'react-router-dom';

const EnrolledCourse = () => {
  const { token } = useSelector((state) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState(null);
  const [progressData,setProgressData]=useState([]);
  const dispatch=useDispatch();
  const navigate=useNavigate();

  
  const getEnrolledCourses = async () => {
    try {
      const response = await dispatch(getUserEnrolledCourses(token));
      console.log("enrolment Course:",response);
      const courses=response.data.enrolledCourses.courses;
      if (response) {
        setEnrolledCourses(courses);
        setProgressData(response.data.progress)
        //   console.log("print all enrolledCourse: ",courses);
        //   console.log("single course id ",courses[0]._id);
        //   console.log("single Section id ",courses[0].courseContent[0]._id);
        //   console.log("single Sub-Seciton id ",courses[0].courseContent[0].SubSection[0]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to Fetch Enrolled Courses");
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, []);

  const totalNoOfLectures=(course)=>{
    let totalLecture=0;
    course.courseContent.forEach((section)=>{
        totalLecture+=section.SubSection.length;
    })
    return totalLecture;
  };


  

  return (
    <div className='mx-auto w-11/12 max-w-[1000px] py-10'>

        <div className='text-3xl text-richblack-50'>Enrolled Courses</div>
        {
            !enrolledCourses ? (<div>
                Loading...
            </div>)
            : !enrolledCourses.length ? (<p className='grid h-[10vh] w-full place-content-center text-richblack-5'>You have not enrolled in any course yet</p>)
            : (
                //heading of enrolled page
                <div className='my-8 text-richblack-5'>
                    <div className='flex rounded-t-lg bg-richblack-500 '>
                        <p className='w-[45%] px-5 py-3'>Course Name</p>
                        <p className='w-1/4 px-2 py-3'></p>
                        <p className='flex-1 px-2 py-3'>Progress</p>
                    </div>

                    {/* Cards shure hote h ab */}
                    {
                        enrolledCourses.map((course,index)=> (                           
                            <div key={index} onClick={()=>{
                                    navigate(`view-course/${course?._id}/section/${course.courseContent[0]?._id}/Sub-Section/${course.courseContent[0]?.SubSection[0]}`

                                    )
                                }}
                                className='flex items-center border border-richblack-700 rounded-none'
                            >
                                <div className='flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3'>
                                    <img className='h-14 w-14 rounded-lg object-cover'  src={course.thumbnail}/>
                                    <div className='flex max-w-xs flex-col gap-2'>
                                        <p className='font-semibold'>{course.courseName}</p>
                                        <p className='text-xs text-richblack-300 hidden md:block'>{
                                            //description with max 50 characters
                                            course.courseDescription.length > 50 ? course.courseDescription.slice(0,50) + '....' : course.courseDescription
                                        }</p>
                                    </div>
                                </div>

                                <div className='w-1/4 px-2 py-3'>
                                    {course?.totalDuration}
                                </div>

                                <div className='flex w-1/5 flex-col gap-2 px- py-3'>
                                    {
                                        progressData?.map((progress,index)=> {
                                            //show 0 progress if no progress data is available
                                            <p className='text-amber-500'>progress Bar</p>
                                            if(progress?.courseID === course?._id) {
                                                return (
                                                    <div key={index}>
                                                        <p className='text-amber-300'>Completed: {progress?.completedVideos?.length} / {totalNoOfLectures(course)}</p>
                                                        <ProgressBar
                                                            completed={progress?.completedVideos?.length/totalNoOfLectures(course)*100}
                                                            total={progress?.total}
                                                            height='15px'
                                                            isLabelVisible={true}
                                                            bgColor="#22C55E"  
                                                        />
                                                    </div>
                                                )
                                            }                                            
                                        }
                                        )
                                    }
                                </div> 
                            </div>
                        ))
                    }
                </div>
            )
        }
      
    </div>
  )
};

export default EnrolledCourse;
