import React, { useEffect, useState } from 'react'
import RatingStars from '../../common/RatingStars'
import GetAvgRating from '../../../utils/avgRating';
import { Link } from 'react-router-dom';

const Course_Card = ({course, Height}) => {


    const [avgReviewCount, setAvgReviewCount] = useState(0);

    useEffect(()=> {
      
        const count = GetAvgRating(course.ratingAndReviews);//average of rating
        console.log("Average Count",count);
        setAvgReviewCount(count);
    },[course])
    console.log("Course Details",course);


    
  return (
    <>
      <Link to={`/courses/${course._id}`}>
        <div className="">
          <div className="rounded-lg">
            <img
              src={course?.thumbnail}
              alt={course?.courseName}
              className={`${Height} w-full rounded-xl object-cover `}
            />
          </div>
          <div className="flex flex-col gap-2 px-1 py-3">
            <p className="text-xl text-richblack-5">{course?.courseName}</p>
            {
                  (course?.instructor?.firstName || course?.instructor?.lastName) && (
                  <p className="text-sm text-richblack-50">
                        <span className="mr-2 text-richblack-500">By</span>
                        {course?.instructor?.firstName} {course?.instructor?.lastName}
                  </p>
                  )
            }

            <div className="flex items-center gap-2">
              <span className="text-yellow-5">{avgReviewCount || 0}</span>
              {/* show all rating star */}
              <RatingStars Review_Count={avgReviewCount} />
              <span className="text-richblack-400">
                {course?.ratingAndReviews?.length} Ratings
              </span>
            </div>
            <p className="text-xl text-richblack-5">Rs. {course?.price}</p>
          </div>
        </div>
      </Link>
    </>
  )
}

export default Course_Card