import React from 'react'
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { ControlBar, Player } from 'video-react';
// import '~video-react/dist/video-react.css'; // import css
import { BigPlayButton, LoadingSpinner, PlaybackRateMenuButton, ForwardControl, ReplayControl, CurrentTimeDisplay, TimeDivider } from 'video-react';
import {BiSkipPreviousCircle} from 'react-icons/bi';
import {BiSkipNextCircle} from 'react-icons/bi';
import {MdOutlineReplayCircleFilled} from 'react-icons/md';
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { setCompletedLectures } from '../../../slices/viewCourseSlice';
import { useDispatch } from 'react-redux';



const VideoDetails = () => {
  const {courseId,sectionId,SubSectionId} = useParams();
  const dispatch = useDispatch();
  const {token} = useSelector(state => state.auth);
  const {user}= useSelector(state => state.profile);
  // console.log("user",user._id);
  const {courseSectionData, courseEntireData, completedLectures, totalNoOfLectures} = useSelector(state => state.viewCourse);
  const navigate = useNavigate();
  const playerRef = React.useRef(null);

  const [videoData, setVideoData] = useState([]);
  const [videoEnd, setVideoEnd] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect (() => {
    if (courseSectionData.length === 0) {
      return;
    }
    if(!courseId || !sectionId ||!SubSectionId){
      navigate("/dashboard/enrolled-course");
    }
    else{

    
      const filteredSection = courseSectionData?.filter((section) => section._id === sectionId);
      const filteredSubsection = filteredSection[0]?.SubSection?.filter((subsection) => subsection._id === SubSectionId);
      setVideoData(filteredSubsection?.[0]);
      // console.log(filteredSubsection[0]);
      setVideoEnd(false);
    }
  }, [courseSectionData, sectionId, SubSectionId]);


  const isLastLecture = () => {
     const currentSectionIndex = courseSectionData?.findIndex((section) => section._id === sectionId);
      const currentSubsectionIndex = courseSectionData[currentSectionIndex]?.SubSection.findIndex((subsection) => subsection._id === SubSectionId);
      if (currentSubsectionIndex === courseSectionData[currentSectionIndex]?.SubSection?.length - 1  && currentSectionIndex === courseSectionData?.length - 1) {
        // console.log("last lecture");
        return true;
      }else {
        // console.log("not last lecture");
        return false;
      }
  }
  
  
  const isFirstLecture = () => {
    const currentSectionIndex = courseSectionData?.findIndex((section) => section._id === sectionId);
    const currentSubsectionIndex = courseSectionData[currentSectionIndex]?.SubSection.findIndex((subsection) => subsection._id === SubSectionId);
    if (currentSubsectionIndex === 0  && currentSectionIndex === 0) {
      // console.log("first lecture");
      return true;
    }else {
      // console.log("not first lecture");
      return false;
    }
  }

  const nextLecture = () => {
    if (isLastLecture()) {
      return;
    }
    const currentSectionIndex = courseSectionData?.findIndex((section) => section._id === sectionId);
    const currentSubsectionIndex = courseSectionData[currentSectionIndex]?.SubSection.findIndex((subsection) => subsection._id === SubSectionId);
    //if current subSection us section ki last lecture hai then
    if (currentSubsectionIndex === courseSectionData[currentSectionIndex]?.SubSection.length - 1) {
      const nextSectionId = courseSectionData[currentSectionIndex + 1]?._id;
      const nextSubsectionId = courseSectionData[currentSectionIndex + 1]?.SubSection[0]._id;
      navigate(`/dashboard/enrolled-courses/view-course/${courseId}/section/${nextSectionId}/Sub-Section/${nextSubsectionId}`);
    }else {
      //current SubSection us section ki last video nahi hai then  go new lecture  in that section;
      const currentSectionId = courseSectionData[currentSectionIndex]._id;
      const nextSubsectionId = courseSectionData[currentSectionIndex].SubSection[currentSubsectionIndex + 1]._id;
      navigate(`/dashboard/enrolled-courses/view-course/${courseId}/section/${currentSectionId}/sub-section/${nextSubsectionId}`);
    }
  }

  const previousLecture = () => {
    if (isFirstLecture()) {
      return;
    }
    const currentSectionIndex = courseSectionData?.findIndex((section) => section._id === sectionId);
    const currentSubsectionIndex = courseSectionData[currentSectionIndex]?.SubSection.findIndex((subsection) => subsection._id === SubSectionId);
    if (currentSubsectionIndex === 0) {
      //differnt Section go it's last video 
      const previousSectionId = courseSectionData[currentSectionIndex - 1]._id;//previous section access;
      const previousSubsectionId = courseSectionData[currentSectionIndex - 1]?.SubSection[courseSectionData[currentSectionIndex - 1].SubSection.length - 1]._id;//previous section ke last video pe jana hai;
      navigate(`/dashboard/enrolled-courses/view-course/${courseId}/section/${previousSectionId}/sub-section/${previousSubsectionId}`);
    }else {
      //same Sectio me ek lecture piche jao only subSectio change;
      const previousSectionId = courseSectionData[currentSectionIndex]?._id;
      const previousSubsectionId = courseSectionData[currentSectionIndex]?.SubSection[currentSubsectionIndex - 1]._id;
      navigate(`/dashboard/enrolled-courses/view-course/${courseId}/section/${previousSectionId}/sub-section/${previousSubsectionId}`);
    }
  }

  //isko create karan hai ;
  const handleLectureCompletion = async () => {
    setLoading(true);
    const res = await markLectureAsComplete({
      userId: user._id,
      courseId: courseId,
      SubSectionId: SubSectionId,
    }, token);
    if(res){
      dispatch(setCompletedLectures([...completedLectures, videoData._id]));
    }
    
    setLoading(false);
    console.log("lecture completed", completedLectures);
  }

  //set video end to false when .play() is called
 
   
  return (
    <div className='md:w-[calc(100vw-320px)] w-screen p-3'>
      {
        !videoData ? <h1>Loading...</h1> :
        (
          <div>
            <Player className="w-full relative"
              ref={playerRef}
              src={videoData.videoUrl}
              aspectRatio="16:9"
              fluid={true}
              autoPlay={false}
              onEnded={() => setVideoEnd(true)}
            >
              
              <BigPlayButton position="center" />

              <LoadingSpinner />
              <ControlBar>
              <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} order={7.1} />
              <ReplayControl seconds={5} order={7.1} />
              <ForwardControl seconds={5} order={7.2} />
              <TimeDivider order={4.2} />
              <CurrentTimeDisplay order={4.1} />
              <TimeDivider order={4.2} />
              </ControlBar>
              {
                videoEnd && (
                  <div className='flex justify-center items-center'>
                    <div className='flex justify-center items-center'>
                      {
                        !completedLectures.includes(videoData._id) && (
                          <button onClick={()=>{handleLectureCompletion()}} className='bg-yellow-100 text-richblack-900 absolute top-[20%] hover:scale-90 z-20 font-medium md:text-sm px-4 py-2 rounded-md'>Mark as Completed</button>
                        )
                      }
                    </div>
                    {
                      !isFirstLecture() && (
                        <div className=' z-20 left-0 top-1/2 transform -translate-y-1/2 absolute m-5'>
                          <BiSkipPreviousCircle onClick={previousLecture} className=" text-2xl md:text-5xl bg-richblack-600 rounded-full cursor-pointer hover:scale-90"/>
                          {/* <button onClick={previousLecture} className='bg-blue-500 text-white px-4 py-2 rounded-md'>Previous Lecture</button> */}
                        </div>
                      )

                    }
                    {
                      !isLastLecture() && (
                        <div className=' z-20 right-4 top-1/2 transform -translate-y-1/2 absolute m-5'>
                          <BiSkipNextCircle onClick={nextLecture} className="text-2xl md:text-5xl bg-richblack-600 rounded-full cursor-pointer hover:scale-90"/>
                          {/* <button onClick={nextLecture} className='bg-blue-500 text-white px-4 py-2 rounded-md'>Next Lecture</button> */}
                          </div>
                      )
                    }
                    {/* ReWatch the lecture */}
                    {
                      <MdOutlineReplayCircleFilled onClick={() =>{ playerRef.current.seek(0);playerRef.current.play();setVideoEnd(false)}} className="text-2xl md:text-5xl bg-richblack-600 rounded-full cursor-pointer hover:scale-90 absolute top-1/2 z-20"/>
                    }
                  </div>
                )
              }
            </Player>
          </div>
        )
      }
      {/* video title and desc */}
      <div className='mt-5'>
        <h1 className='text-2xl font-bold text-richblack-25'>{videoData?.title}</h1>
        <p className='text-gray-500 text-richblack-100'>{videoData?.description}</p>
        </div>
    </div>
  )
}

export default VideoDetails