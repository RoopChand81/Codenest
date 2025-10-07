import React, { useEffect } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { createRating } from '../../../services/operations/courseDetailsAPI';
import StarRating from '../../common/StarRating';

const ReviewModal = ({ setReviewModal }) => {
  const { user } = useSelector(state => state.profile);
  const { token } = useSelector(state => state.auth);
  const { courseId } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();

  useEffect(() => {
    setValue('userExperience', '');
    setValue('userRating', 0);
  }, []);

  const onSubmit = async (data) => {
    const res = await createRating({
      courseId,
      review: data.userExperience,
      rating: data.userRating
    }, token);
    setReviewModal(false);
    console.log(res);
  };

  return (
    <>
      {/* Blurred background only */}
      <div
        className="fixed inset-0 z-40 bg-white-700/5 backdrop-blur-sm transition-all duration-300"
        onClick={() => setReviewModal(false)}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-11/12 max-w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-md border border-richblack-700 bg-richblack-900 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-md bg-richblack-800 px-6 py-4">
          <h2 className="text-lg font-semibold text-richblack-5">Add Review</h2>
          <button onClick={() => setReviewModal(false)}>
            <RxCross2 className="text-xl text-richblack-200 hover:text-pink-200 transition" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 flex flex-col items-center gap-6">
          {/* User Info */}
          <div className="flex flex-col items-center gap-2">
            <img
              src={user?.image}
              alt="user"
              className="w-14 h-14 rounded-full object-cover"
            />
            <div className="text-center">
              <p className="text-richblack-5 font-semibold">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-richblack-400">Posting publicly</p>
            </div>
          </div>

          {/* Stars */}
          <div className="w-full flex flex-col items-center gap-1">
            <StarRating onChange={(val) => setValue('userRating', val)} />
            <input
              type="hidden"
              value={getValues().userRating}
              {...register('userRating', { required: true })}
            />
            {errors.userRating && (
              <span className="text-xs text-pink-200">* Please provide a rating</span>
            )}
          </div>

          {/* Textarea */}
          <div className="w-full flex flex-col gap-1">
            <label
              htmlFor="userExperience"
              className="text-sm font-medium text-richblack-100"
            >
              Your Experience <span className="text-pink-200">*</span>
            </label>
            <textarea
              {...register('userExperience', { required: true })}
              placeholder="Share your experience..."
              className="min-h-[120px] w-full rounded-md border border-richblack-600 bg-richblack-800 px-4 py-3 text-sm text-richblack-5 placeholder:text-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-100"
            />
            {errors.userExperience && (
              <span className="text-xs text-pink-200">* Please provide your experience</span>
            )}
          </div>

          {/* Buttons */}
          <div className="w-full flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setReviewModal(false)}
              className="px-4 py-2 rounded-md bg-richblack-600 text-richblack-25 hover:bg-richblack-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="px-4 py-2 rounded-md bg-yellow-100 text-richblack-900 font-medium hover:brightness-105 transition"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewModal;
