import React, { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, FreeMode, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "../../App.css"

import { apiConnector } from "../../services/apiconnector"
import { ratingsEndpoints } from "../../services/apis"
import DisplayRatingStars from "./DisplayRatingStars"
import RatingStars from './RatingStars'

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const truncateWords = 15

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiConnector("GET", ratingsEndpoints.REVIEWS_DETAILS_API)
        if (data?.success) setReviews(data?.data)
      } catch (err) {
        console.error("Error fetching reviews:", err)
      }
    })()
  }, [])

  return (
    <div className="text-white w-full px-4 sm:px-8 lg:px-16">
      <div className="my-10 md:my-14">
        <Swiper
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="w-full"
          spaceBetween={20}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 12,
            },
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          }}
        >
          {reviews.map((review, i) => (
            <SwiperSlide key={i}>
              <div className="flex flex-col gap-3 rounded-md bg-richblack-800 p-4 text-[14px] text-richblack-25 shadow-md h-full min-h-[200px]">
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={
                      review?.user?.image
                        ? review?.user?.image
                        : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                    }
                    alt="user"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-richblack-5 text-sm md:text-base">
                      {review?.user?.firstName} {review?.user?.lastName}
                    </p>
                    <p className="text-xs text-richblack-500">
                      {review?.course?.courseName}
                    </p>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-richblack-25 text-sm mt-[1rem]">
                  {review?.review.split(" ").length > truncateWords
                    ? review?.review.split(" ").slice(0, truncateWords).join(" ") + " ..."
                    : review?.review}
                </p>

                {/* Rating */}
                  
                  <div className="mt-[1rem]">
                        <div className="flex items-center gap-2">
                              <p className="font-semibold text-yellow-100">{review?.rating.toFixed(1)}</p>
                              {/* <DisplayRatingStars rating={review.rating} /> */}
                              <RatingStars Review_Count={review.rating}  Star_Size={30}/>
                        </div>
                        
                  </div>
                 
            
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider
