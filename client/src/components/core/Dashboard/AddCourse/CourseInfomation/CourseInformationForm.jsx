import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { addCourseDetails, editCourseDetails, fetchCourseCategories } from '.././../../../../services/operations/courseDetailsAPI';
import { HiOutlineCurrencyRupee } from 'react-icons/hi';
import { BiUpload } from 'react-icons/bi';
import RequirementField from './RequirementField';
import { setStep, setCourse, setEditCourse} from '../../../../../slices/courseSlice';
import IconBtn from '../../../../common/IconBtn';
import { COURSE_STATUS } from '../../../../../utils/constants';
import { toast } from 'react-hot-toast';
import Upload from './Upload'
import ChipInput from './ChipInput';

const CourseInformationForm = () => {
    //store all form Data that filled using useForm hook;
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState:{errors},
        reset
    } = useForm();

    

    const dispatch = useDispatch();
    const {token} = useSelector((state)=>state.auth);
    //Take Course Details and editable mode true or creation moode on 
    const {course, editCourse} = useSelector((state)=>state.course);
    const [loading, setLoading] = useState(false);
    const [courseCategories, setCourseCategories] = useState([]);
    const [formUpdate,setFormUpdate]=useState(false);

    //access categories from backend 
    useEffect(()=> {
        //fetch all category under that course create
        const getCategories = async() => {
            setLoading(true);
            const categories = await fetchCourseCategories();
            if(categories.length > 0) {
                setCourseCategories(categories);
            }
            setLoading(false);
        }
        //if course open in editable mood then set these value in fields 
        //these Data take from the courseSlice 
        if(editCourse) {
            setValue("courseTitle", course.courseName);
            setValue("courseShortDesc", course.courseDescription);
            setValue("coursePrice", course.price);
            setValue("courseTags", course.tag);
            setValue("courseBenefits", course.whatYouWillLearn);
            setValue("courseCategory", course.category);
            setValue("courseRequirements", course.instructions);
            setValue("courseImage", course.thumbnail);
        }
        getCategories();
    },[])

    //check the form Update any field is updated or not
    const isFormUpdated = () => {
        const currentValues = getValues();
        if(currentValues.courseTitle !== course.courseName ||
            currentValues.courseShortDesc !== course.courseDescription ||
            currentValues.coursePrice !== course.price ||
            currentValues.courseTitle !== course.courseName ||
            currentValues.courseTags.toString() !== course.tag.toString() ||
            currentValues.courseBenefits !== course.whatYouWillLearn ||
            currentValues.courseCategory._id !== course.category._id ||
            currentValues.courseImage !== course.thumbnail ||
            currentValues.courseRequirements.toString() !== course.instruction.toString() )
            return true;
        else
            return false;
    }

    //handles next button click 
    const onSubmit = async(data) => {
        //editable mood on then check form updated or not
        if(editCourse) { 
            //check form updated or not according that update form datat
            if(isFormUpdated()) {
                const currentValues = getValues();
                const formData = new FormData();
                console.log("current ",currentValues);
                console.log("course.id",course);

                formData.append("courseId", course._id);
                if(currentValues.courseTitle !== course.courseName) {
                    formData.append("courseName", data.courseTitle);
                }

                if(currentValues.courseShortDesc !== course.courseDescription) {
                    formData.append("courseDescription", data.courseShortDesc);
                }

                if(currentValues.coursePrice !== course.price) {
                    formData.append("price", data.coursePrice);
                }

                if(currentValues.courseBenefits !== course.whatYouWillLearn) {
                    formData.append("whatYouWillLearn", data.courseBenefits);
                }

                if(currentValues.courseCategory._id !== course.category._id) {
                    formData.append("category", data.courseCategory);
                }

                if(currentValues.courseRequirements.toString() !== course.instruction.toString()) {
                    formData.append("instruction", JSON.stringify(data.courseRequirements));
                }
                console.log("Edit Course",formData);

                setLoading(true);
                //make backend call for save the data in DB.
                const result = await editCourseDetails(formData, token);
                setLoading(false);
                if(result) {
                    //update the course Slice
                    dispatch(setEditCourse(false));
                    dispatch(setStep(2));
                    dispatch(setCourse(result)); 
                }
            } 
            else {
                toast.error("NO Changes made so far");
            }
            
            return;
        }

        //create a new course
        const formData = new FormData();
        formData.append("courseName", data.courseTitle);
        formData.append("courseDescription", data.courseShortDesc);
        formData.append("price", data.coursePrice);
        formData.append("whatYouWillLearn", data.courseBenefits);
        formData.append("category", data.courseCategory);
        formData.append("instruction", JSON.stringify(data.courseRequirements));
        formData.append("status", COURSE_STATUS.DRAFT);
        formData.append("tag", JSON.stringify(data.courseTags));
        formData.append("thumbnailImage", data.courseImage);

        setLoading(true);
        //new Course update in DB.
        const result = await addCourseDetails(formData,token);
        if(result) {
            //update the CourseSlice 
            dispatch(setCourse(result.course));
            dispatch(setEditCourse(true));
            dispatch(setStep(2));

        }
        setLoading(false);
        

    }

  return (
    <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6'
    >
        <div className='flex flex-col space-y-2'>
            <label className='text-sm text-richblack-5'  htmlFor='courseTitle'>Course Title<sup className='text-pink-200'>*</sup></label>
            <input
                id='courseTitle'
                placeholder='Enter Course Title'
                {...register("courseTitle", {required:true})}
                style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
            />
            {
                errors.courseTitle && (
                    <span className='ml-2 text-xs tracking-wide text-pink-200'>Course Title is Required**</span>
                )
            }
        </div>

        <div className='flex flex-col space-y-2'>
            <label className='text-sm text-richblack-5'  htmlFor='courseShortDesc'>Course Short Description<sup className='text-pink-200'>*</sup></label>
            <textarea
                id='courseShortDesc'
                placeholder='Enter Description'
                {...register("courseShortDesc", {required:true})}
                
                style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] min-h-[130px] w-full bg-richblack-700 p-[12px] text-richblack-5"
                />
            {
                errors.courseShortDesc && (<span className='ml-2 text-xs tracking-wide text-pink-200'>
                    Course Description is required**
                </span>)
            }
        </div>

        <div className='relative flex flex-col space-y-2'>
            <label className='text-sm text-richblack-5' htmlFor='coursePrice'>Course Price<sup className='text-pink-200'>*</sup></label>
            <input
                id='coursePrice'
                placeholder='Enter Course Price'
                {...register("coursePrice", {
                    required:true,
                    valueAsNumber:true
                })}
                style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
            />
            {/* <HiOutlineCurrencyRupee size={30}  className='absolute top-9 left-1 text-richblack-400'/> */}
            {
                errors.coursePrice && (
                    <span className='ml-2 text-xs tracking-wide text-pink-200'>Course Price is Required**</span>
                )
            }
        </div>

        <div className='flex flex-col space-y-2'>
            <label className='text-sm text-richblack-5' htmlFor='courseCategory'>Course Category<sup className='text-pink-200'>*</sup></label>
            <select disabled={editCourse}  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
            defaultValue=""
            {...register("courseCategory", {required:true})}
            >
                <option value="" disabled>Choose a Category</option>

                {
                    !loading && courseCategories.map((category, index) => (
                        <option key={index} value={category?._id}>
                            {category?.name}
                        </option>
                    ))
                }

            </select>
            {errors.courseCategory && (
                <span className='ml-2 text-xs tracking-wide text-pink-200'>
                    Course Category is Required
                </span>
            )}
        </div>

        {/* custom component for handling tags input */}
        <ChipInput
            label="Tags"
            name="courseTags"
            placeholder="Enter tags and press enter"
            register={register}
            errors={errors}
            setValue={setValue}
            getValues = {getValues}
        />

        {/*component for uploading and showing preview of media  thumnail */}
        <Upload
            name={"courseImage"}
            label={"CourseImage"}
            register={register}
            errors={errors}
            setValue={setValue}
        />
        
        {/*     Benefits of the Course */}
        <div className='flex flex-col space-y-2'>
            <label className='text-sm text-richblack-5'>Benefits of the course<sup className='text-pink-200'>*</sup></label>
            <textarea
            id='coursebenefits'
            placeholder='Enter Benefits of the course'
            {...register("courseBenefits", {required:true})}
            style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5 resize-x-none min-h-[130px] w-full"
            />
            {errors.courseBenefits && (
                <span className='ml-2 text-xs tracking-wide text-pink-200'>
                    Benefits of the course are required**
                </span>
            )}
        </div>

        <RequirementField
            name="courseRequirements"
            label="Requirements/Instructions"
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
        />
        <div className='flex justify-end gap-x-2'>
            {
                editCourse && (
                    <button
                    onClick={() => dispatch(setStep(2))}
                    className=' text-[10px] md:text-sm p-2 px-1 font-semibold rounded-md flex items-center gap-x-2 bg-richblack-300'
                    >
                        Continue Without Saving
                    </button>
                )
            }

            <IconBtn type={"submit"}
                text={!editCourse ? "Next" : "Save Changes"}
            />
        </div>
    </form>
  )
}
export default CourseInformationForm