import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';


const RequirementField = ({name, label, register, errors, setValue, getValues}) => {
    const [requirement, setRequirement] = useState("");
    const [requirementList, setRequirementList] = useState([]);
    const {editCourse, course} = useSelector((state) => state.course);
    console.log("editCourse",typeof(requirementList));



    useEffect(()=> {
        register(name, {
            required:true,
            // validate: (value) => value.length > 0
        })
    },[])

    useEffect(() => {
        if (editCourse && course?.instruction) {
          setRequirementList(course.instruction);
          setValue(name, course.instruction);
        }
    }, [editCourse]); // only run this ONCE when editCourse is true

    useEffect(() => {
        setValue(name, requirementList);
    }, [requirementList]);
            
    
    //handle ADD the requirement
    const handleAddRequirement = () => {
        if(requirement.trim()) {
            setRequirementList([...requirementList, requirement.trim()]);
            setRequirement("");
        }
    }
    //Delete the rquirement when press clear
    const handleRemoveRequirement = (index) => {
        const updatedRequirementList = [...requirementList];
        updatedRequirementList.splice(index, 1);
        setRequirementList(updatedRequirementList);
    }

  return (
    <div className=''>

        <label className='text-sm text-richblack-5' htmlFor={name}>{label}<sup className='text-pink-200'>*</sup></label>
        <div>
            <input
                type='text'
                id={name}
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
            />

            <button
            type='button'
            onClick={handleAddRequirement}
            className='font-semibold text-yellow-50 mt-3'>
                Add
            </button>

        </div>
       {
        console.log("requireList",requirementList)
       }
        

        {/* for remove from list */}
        {
            requirementList.length > 0 && (
                
                <ul className='mt-2 list-inside list-disc'>
                    {
                        
                        

                        requirementList.map((requirement, index) => (
                            <li key={index} className='flex items-center text-richblack-5'>
                              
                                <span>{requirement}</span>
                                <button
                                type='button'
                                onClick={() => handleRemoveRequirement(index)}
                                className='ml-2 text-xs text-pure-greys-300 '>
                                    clear
                                </button>
                            </li>
                        ))
                    }
                </ul>
            )
        }
        {errors[name] && (
            <span className='ml-2 text-xs tracking-wide text-pink-200'>
                {label} is required
            </span>
        )}
      
    </div>
  )
}

export default RequirementField