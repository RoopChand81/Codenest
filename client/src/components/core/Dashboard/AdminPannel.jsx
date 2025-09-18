import React, { useState } from "react";
import { createCategory } from "../../../services/operations/courseDetailsAPI";
import { useSelector } from "react-redux";

const AdminPannel = () => {
  const { token } = useSelector((state) => state.auth);
  const [category, setCategory] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState({ name: "", description: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    let newErrors = { name: "", description: "" };
    let isValid = true;

    if (!category.name.trim()) {
      newErrors.name = "Category name is required";
      isValid = false;
    }
    if (!category.description.trim()) {
      newErrors.description = "Category description is required";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) return;

    // API Call
    const res = await createCategory(
      {
        name: category.name,
        description: category.description,
      },
      token
    );

    if (res) {
      // Reset form if success
      setCategory({ name: "", description: "" });
      setErrors({ name: "", description: "" });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-richblack-900 w-11/12 ">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-richblack-800 rounded-2xl shadow-lg p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-yellow-50 text-center">
          Create New Category
        </h2>

        {/* Category Name */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="category"
            className="text-sm font-semibold text-pure-greys-200"
          >
            Category Name <sup className="text-pink-200">*</sup>
          </label>
          <input
            value={category.name}
            onChange={(e) => {
              const value = e.target.value.replace(/\//g, "");
              setCategory({ ...category, name: value });
            }}
            type="text"
            id="category"
            placeholder="Enter category name"
            className={`w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5 border ${
              errors.name ? "border-red-500" : "border-transparent"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name}</p>
          )}
        </div>

        {/* Category Description */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="description"
            className="text-sm font-semibold text-pure-greys-200"
          >
            Category Description <sup className="text-pink-200">*</sup>
          </label>
          <textarea
            value={category.description}
            onChange={(e) =>
              setCategory({ ...category, description: e.target.value })
            }
            id="description"
            placeholder="Enter category description"
            className={`w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5 border ${
              errors.description ? "border-red-500" : "border-transparent"
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full mt-5 rounded-lg bg-yellow-50 px-6 py-3 font-semibold text-richblack-900 shadow-md transition-all duration-200 hover:scale-[0.98] hover:shadow-none disabled:bg-richblack-500"
        >
          Create Category
        </button>
      </form>
    </div>
  );
};

export default AdminPannel;
