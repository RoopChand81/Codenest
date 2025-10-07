import { useEffect, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import IconBtn from "../../common/IconBtn";
import { RxCross2 } from "react-icons/rx";
import { GiHamburgerMenu } from "react-icons/gi";

export default function VideoDetailsSidebar({ setReviewModal }) {
  
  const [activeStatus, setActiveStatus] = useState("");
  const [videoBarActive, setVideoBarActive] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile toggle
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionId, SubSectionId } = useParams();

  const {
    courseSectionData,
    courseEntireData,
    completedLectures,
    totalNoOfLectures,
  } = useSelector((state) => state.viewCourse);

  useEffect(() => {
    if (!courseSectionData.length) return;

    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );

    const currentSubSectionIndx = courseSectionData?.[currentSectionIndx]?.SubSection.findIndex(
      (data) => data._id === SubSectionId
    );

    const activeSubSectionId =
      courseSectionData[currentSectionIndx]?.SubSection?.[
        currentSubSectionIndx
      ]?._id;

    setActiveStatus(courseSectionData?.[currentSectionIndx]?._id);
    setVideoBarActive(activeSubSectionId);
  }, [courseSectionData, courseEntireData, location.pathname]);

  return (
    <>
      {/* Hamburger menu only visible on small screens */}
      <div className="md:hidden flex items-start justify-between p-4 bg-richblack-800">
        <button onClick={() => setSidebarOpen(true)} className="text-richblack-50">
          <GiHamburgerMenu size={24} />
        </button>
        <p className="text-richblack-25 font-semibold">{courseEntireData?.courseName}</p>
      </div>

      {/* Sidebar for medium and larger screens */}
      <div className="hidden md:flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r border-richblack-700 bg-richblack-800">
        <SidebarContent
          {...{
            navigate,
            courseEntireData,
            completedLectures,
            totalNoOfLectures,
            courseSectionData,
            activeStatus,
            videoBarActive,
            setActiveStatus,
            setVideoBarActive,
            setReviewModal,
          }}
        />
      </div>

      {/* Responsive Drawer Sidebar for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div className="relative w-[80%] max-w-[300px] h-full bg-richblack-800 shadow-lg">
            {/* Close button */}
            <div className="flex justify-end p-4">
              <button onClick={() => setSidebarOpen(false)} className="text-white">
                <RxCross2 size={24} />
              </button>
            </div>
            <SidebarContent
              {...{
                navigate,
                courseEntireData,
                completedLectures,
                totalNoOfLectures,
                courseSectionData,
                activeStatus,
                videoBarActive,
                setActiveStatus,
                setVideoBarActive,
                setReviewModal,
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

function SidebarContent({
  navigate,
  courseEntireData,
  completedLectures,
  totalNoOfLectures,
  courseSectionData,
  activeStatus,
  videoBarActive,
  setActiveStatus,
  setVideoBarActive,
  setReviewModal,
}) {
  return (
    <>
      <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
        <div className="flex w-full items-center justify-between ">
          <div
            onClick={() => {
              navigate(`/dashboard/enrolled-courses`);
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
            {/* Section Header */}
            <div className="flex justify-between bg-richblack-600 px-5 py-4">
              <div className="w-[70%] font-semibold text-richblack-50">
                {section?.sectionName}
              </div>
              <span
                className={`${
                  activeStatus === section?._id ? "rotate-0" : "rotate-180"
                } transition-all duration-500`}
              >
                <BsChevronDown />
              </span>
            </div>

            {/* Sub-Sections */}
            {activeStatus === section?._id && (
              <div className="transition-[height] duration-500 ease-in-out">
                {section.SubSection.map((lecture, idx) => (
                  <div
                    className={`flex items-center gap-3 px-5 py-2 ${
                      videoBarActive === lecture._id
                        ? "bg-yellow-200 font-semibold text-richblack-800"
                        : "hover:bg-richblack-900"
                    }`}
                    key={idx}
                    onClick={() => {
                      navigate(
                        `/dashboard/enrolled-courses/view-course/${courseEntireData?._id}/section/${section?._id}/Sub-Section/${lecture?._id}`
                      );
                      setVideoBarActive(lecture._id);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={completedLectures.map(item => item._id).includes(lecture._id)}
                      readOnly
                    />
                    {lecture.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
