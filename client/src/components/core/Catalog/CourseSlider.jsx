// CourseSlider component to display a slider of course cards using Swiper library
// It accepts a list of courses as props and renders them in a responsive slider format
import React from 'react'
import {Swiper, SwiperSlide} from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import {FreeMode,Pagination}  from 'swiper/modules'
import Course_Card from './Course_Card'

const CourseSlider = ({Courses}) => {
  console.log("start");
  
  return (
    <>
      {Courses?.length ? (
        <Swiper
        // CSS imports → include Swiper’s default styles, free-mode, and pagination styles.
        // FreeMode, Pagination → Swiper modules for extra functionality:
        // FreeMode → lets users swipe freely without snapping to slides.
        // Pagination → adds dots under the slider for navigation.
          slidesPerView={1}
          spaceBetween={25}
          loop={Courses.length>3}
          modules={[FreeMode, Pagination]}
          pagination={true}
          breakpoints={{
            1024: {
              slidesPerView: 3,
            },
          }}
          className="max-h-[30rem]"
        >
          {Courses?.map((course, i) => (
            <SwiperSlide key={i}>
              <Course_Card course={course} Height={"h-[250px]"} />
            </SwiperSlide>
          ))}
          
        </Swiper>
      ) : (
        <p className="text-xl text-richblack-5">No Course Found</p>
      )}
    </>
  )
}

export default CourseSlider