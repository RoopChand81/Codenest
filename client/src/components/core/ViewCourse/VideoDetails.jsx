import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { BiSkipPreviousCircle, BiSkipNextCircle } from 'react-icons/bi'
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI'
import { setCompletedLectures } from '../../../slices/viewCourseSlice'
import {MdOutlineReplayCircleFilled} from 'react-icons/md'

const VideoDetails = () => {
  const { courseId, sectionId, SubSectionId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const {
    courseSectionData,
    completedLectures,
  } = useSelector((state) => state.viewCourse)

  const playerRef = useRef(null)
  const [videoData, setVideoData] = useState(null)
  const [videoEnd, setVideoEnd] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (courseSectionData.length === 0) return
    if (!courseId || !sectionId || !SubSectionId) {
      navigate("/dashboard/enrolled-courses")
      return
    }

    const filteredSection = courseSectionData.find(section => section._id === sectionId)
    const filteredSubsection = filteredSection?.SubSection?.find(sub => sub._id === SubSectionId)
    setVideoData(filteredSubsection)
    setVideoEnd(false)
  }, [courseSectionData, sectionId, SubSectionId])
  
  
  const isFirstLecture = () => {
    const sectionIndex = courseSectionData.findIndex(sec => sec._id === sectionId)
    const subIndex = courseSectionData[sectionIndex]?.SubSection.findIndex(sub => sub._id === SubSectionId)
    return sectionIndex === 0 && subIndex === 0
  }

  const isLastLecture = () => {
    const sectionIndex = courseSectionData.findIndex(sec => sec._id === sectionId)
    const subIndex = courseSectionData[sectionIndex]?.SubSection.findIndex(sub => sub._id === SubSectionId)
    return sectionIndex === courseSectionData.length - 1 &&
      subIndex === courseSectionData[sectionIndex]?.SubSection.length - 1
  }

  const nextLecture = () => {
    if (isLastLecture()) return
    const sectionIndex = courseSectionData.findIndex(sec => sec._id === sectionId)
    const subIndex = courseSectionData[sectionIndex]?.SubSection.findIndex(sub => sub._id === SubSectionId)

    if (subIndex === courseSectionData[sectionIndex].SubSection.length - 1) {
      const nextSectionId = courseSectionData[sectionIndex + 1]._id
      const nextSubId = courseSectionData[sectionIndex + 1]?.SubSection[0]._id
      navigate(`/dashboard/enrolled-courses/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubId}`)
    } else {
      const nextSubId = courseSectionData[sectionIndex].SubSection[subIndex + 1]._id
      navigate(`/dashboard/enrolled-courses/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubId}`)
    }
  }

  const previousLecture = () => {
    if (isFirstLecture()) return
    const sectionIndex = courseSectionData.findIndex(sec => sec._id === sectionId)
    const subIndex = courseSectionData[sectionIndex]?.SubSection.findIndex(sub => sub._id === SubSectionId)

    if (subIndex === 0) {
      const prevSection = courseSectionData[sectionIndex - 1]
      const prevSubId = prevSection.SubSection[prevSection.SubSection.length - 1]._id
      navigate(`/dashboard/enrolled-courses/view-course/${courseId}/section/${prevSection._id}/sub-section/${prevSubId}`)
    } else {
      const prevSubId = courseSectionData[sectionIndex].SubSection[subIndex - 1]._id
      navigate(`/dashboard/enrolled-courses/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubId}`)
    }
  }

  const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await markLectureAsComplete({
      userId: user._id,
      courseId,
      SubSectionId
    }, token)

    if (res) {
      dispatch(setCompletedLectures([...completedLectures, videoData._id]))
    }

    setLoading(false)
  }

  
  const handleVideoEnd = () => {
    setVideoEnd(true)
  }

  //handle reply logic
  const handleReplay = () => {
    if (playerRef.current) {
      playerRef.current.currentTime = 0
      playerRef.current.play()
      setVideoEnd(false)
    }
  }

  return (
    <div className='w-full md:w-[calc(100vw-320px)] px-4 py-6'>
      {
        !videoData ? (
          <h1 className="text-white text-lg">Loading...</h1>
        ) : (
          <div className='relative w-full aspect-video bg-black rounded-lg shadow-md overflow-hidden'>
            <video
              ref={playerRef}
              controls
              controlsList="nodownload"
              className="w-full h-full object-contain"
              src={videoData.videoUrl}
              onEnded={handleVideoEnd}
            >
              Your browser does not support the video tag.
            </video>

            {/* Video End Overlay */}
            {videoEnd && (
              <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/60 gap-4 z-10">
                {
                  !completedLectures.map(item => item._id).includes(videoData._id) && (
                    <button
                      onClick={handleLectureCompletion}
                      disabled={loading}
                      className="bg-yellow-100 text-richblack-900 font-semibold px-6 py-2 rounded-md hover:scale-95 transition"
                    >
                      {loading ? "Marking..." : "Mark as Completed"}
                    </button>
                  )
                }

                {/* Controls */}
                <div className='flex items-center justify-center gap-6 mt-2'>
                  {!isFirstLecture() && (
                    <BiSkipPreviousCircle
                      onClick={previousLecture}
                      className="text-5xl text-richblack-300 hover:text-white cursor-pointer"
                    />
                  )}
                  <button
                    onClick={handleReplay}
                    className="bg-blue-600 text-white px-5 py-2 rounded-full text-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
                  >
                    <MdOutlineReplayCircleFilled className='text-2xl' />
                    Replay
                  </button>
                  {!isLastLecture() && (
                    <BiSkipNextCircle
                      onClick={nextLecture}
                      className="text-5xl text-richblack-300 hover:text-white cursor-pointer"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )
      }

      {/* Video Info */}
      {videoData && (
        <div className="mt-6">
          <h1 className='text-2xl font-bold text-richblack-25'>{videoData.title}</h1>
          <p className='text-richblack-100 mt-2'>{videoData.description}</p>
        </div>
      )}
    </div>
  )
}

export default VideoDetails
