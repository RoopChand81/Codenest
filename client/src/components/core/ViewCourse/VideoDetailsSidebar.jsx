import { useEffect, useState } from "react"
import { BsChevronDown } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"

import IconBtn from "../../common/IconBtn"

export default function VideoDetailsSidebar({ setReviewModal }) {
  const [activeStatus, setActiveStatus] = useState("")
  const [videoBarActive, setVideoBarActive] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const { sectionId, SubSectionId } = useParams();

  const {
      courseSectionData,
      courseEntireData,
      completedLectures,
      totalNoOfLectures,
  } = useSelector((state) => state.viewCourse)

  useEffect(() => {
    ;(() => {
      if (!courseSectionData.length)
            return;
      //find current Section Index;
      const currentSectionIndx = courseSectionData.findIndex(
        (data) => data._id === sectionId
      )

      //find current SubSection Index;
      const currentSubSectionIndx = courseSectionData?.[
        currentSectionIndx
      ]?.SubSection.findIndex((data) => data._id === SubSectionId)

      //current Lecture id find from SubSection;
      const activeSubSectionId =
        courseSectionData[currentSectionIndx]?.SubSection?.[
          currentSubSectionIndx
      ]?._id;
      //mark active Section Id and active SubSection id;
      setActiveStatus(courseSectionData?.[currentSectionIndx]?._id)
      setVideoBarActive(activeSubSectionId)
    })()

    //location.pathname when change the location
  }, [courseSectionData, courseEntireData, location.pathname])


  return (
    <>
      <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
          <div className="flex w-full items-center justify-between ">
            <div
              onClick={() => {
                navigate(`/dashboard/enrolled-courses`)
              }}
              className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
              title="back"
            >
              <IoIosArrowBack size={30} />
            </div>

            <IconBtn
              text="Add Review"
              customClasses="ml-auto"
              onclick={() => setReviewModal(true)}
            />
          </div>

          <div className="flex flex-col">
            <p>{courseEntireData?.courseName}</p>
            <p className="text-sm font-semibold text-richblack-500">
              {completedLectures?.length} / {totalNoOfLectures}
            </p>
          </div>

        </div>
        

        <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
            
            
          {courseSectionData.map((section, index) => (
            <div
              className="mt-2 cursor-pointer text-sm text-richblack-5"
              onClick={() => setActiveStatus(section?._id)}
              key={index}
            >
              {/* Section */}
              <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                  
                <div className="w-[70%] font-semibold text-richblack-50">
                  
                  {section?.sectionName}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`${
                      activeStatus === section?._id
                        ? "rotate-0"
                        : "rotate-180"
                    } transition-all duration-500`}
                  >
                    <BsChevronDown />
                  </span>
                </div>
              </div>

              {/* Sub-Sections */}
              {activeStatus === section?._id && (
                <div className="transition-[height] duration-500 ease-in-out">
                  {section.SubSection.map((lecture, index) => (
                    <div
                      className={`flex gap-3  px-5 py-2 ${
                        //active Lecture bg change
                        videoBarActive === lecture._id
                          ? "bg-yellow-200 font-semibold text-richblack-800"
                          : "hover:bg-richblack-900"
                      } `}
                      key={index}

                      onClick={() => {
                        //when any new lecture open then path change according Lecture;
                        navigate(
                          `/dashboard/enrolled-courses/view-course/${courseEntireData?._id}/section/${section?._id}/Sub-Section/${lecture?._id}`
                        )
                        setVideoBarActive(lecture._id)
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={completedLectures.includes(lecture?._id)}
                        onChange={() => {}}
                      />
                      {lecture.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}