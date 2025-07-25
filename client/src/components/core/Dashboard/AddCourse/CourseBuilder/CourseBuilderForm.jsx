import React from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../../slices/courseSlice";
import NestedView from "./NestedView";
import toast from "react-hot-toast";
import {
  createSection,
  updateSection,
} from "../../../../../services/operations/courseDetailsAPI";

const CourseBuilderForm = () => {
  const { token } = useSelector((state) => state.auth);
  const [editSectionName, setEditSectionName] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {editCourse, course } = useSelector((state) => state.course);
  //console.log("CourseBuilderForm",course);

  //goNext buttton handle
  const gonext = () => {
  if (course.courseContent.length > 0) {
    const allSectionsHaveLessons = course.courseContent.every(
      (section) => section.SubSection && section.SubSection.length > 0
    );

    if (allSectionsHaveLessons) {
      dispatch(setStep(3));
    } else {
      toast.error("Please add at least one lesson to each section.");
    }
  } else {
    toast.error("Please add at least one section to continue.");
  }
};



  //form Data Handle
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    let result=null;
    setLoading(true);
    console.log("courseId when update the course ",course._id);
    if (editSectionName) {
      result = await updateSection(
        {
          sectionName: data.sectionName,
          courseId: course._id,
          sectionId: editSectionName,
        },
        token
      );
    } else {
      result = await createSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        },
        token
      );
    }
    if (result) {
      dispatch(setCourse(result));
      setValue("sectionName", "");
      setEditSectionName(false);
    }
    setLoading(false);
  };


  const handelChangeEditSectionName = (sectionId,sectionName) => {
    if (editSectionName===sectionId) {
      setEditSectionName(false);
      setValue("sectionName", "");
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  };

  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <label className="text-sm text-richblack-5" htmlFor="sectionName">
          Section Name<sup className="text-pink-200">*</sup>
        </label>
        <input
          id="sectionName"
          placeholder="Add a section to build your course"
          name="sectionName"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
          {...register("sectionName", { required: true })}
        />
        {errors.sectionName && (
          <p className="ml-2 text-xs tracking-wide text-pink-200">This field is required</p>
        )}
        <div className="flex items-end gap-x-4">
          <button
            type="submit"
            className="flex items-center border border-yellow-50 bg-transparent cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 undefined"
          >
            <span className="text-yellow-50">
              {editSectionName ? "Edit Section Name" : "Create Section"}
            </span>
            <AiOutlinePlusCircle size={20} className="text-yellow-50" />
          </button>
          {editSectionName && (
            <button
              onClick={() => {
                setEditSectionName(false);
                setValue("sectionName", "");
              }}
              type="button"
              className="text-sm text-richblack-300 underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {course.courseContent.length > 0 && <NestedView handelChangeEditSectionName={handelChangeEditSectionName} />}
      
      {/* Handle Back Button for step2 */}
      <div className="flex justify-end gap-x-3">
        <button
          onClick={() => {
            dispatch(setEditCourse(true));
            dispatch(setStep(1));
          }}
          className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
        >
          Back
        </button>

        <button
          onClick={gonext}
          className="flex items-center bg-yellow-50 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 undefined"
        >
          <span className="false">Next</span>
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CourseBuilderForm;