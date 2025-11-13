import React, { useEffect, useState } from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogaPageData } from '../services/operations/pageAndComponentData';
import Course_Card from '../components/core/Catalog/Course_Card';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import { useDispatch, useSelector } from "react-redux"
import toast from 'react-hot-toast';
import Spinner from '../components/common/Loading';

const Catalog = () => {

  const { loading } = useSelector((state) => state.profile)
  const { catalogName } = useParams()
  const [active, setActive] = useState(1)
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const dispatch=useDispatch();
   //Fetch all categories
    useEffect(()=> {
        const getCategories = async() => {
            const res = await apiConnector("GET", categories.CATEGORIES_API);
            const category_id = 
            res?.data?.data?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
            setCategoryId(category_id);
        }
        getCategories();
    },[catalogName]);

    //fetch all category  page details
    useEffect(() => {
        const getCategoryDetails = async() => {
            try{
                const res = await getCatalogaPageData(categoryId,dispatch);
                //console.log("PRinting res: ", res);
                setCatalogPageData(res);
                
            }
            catch(error) {
               // console.log(error)
                toast.error("something server Error!")
            }
        }
        if(categoryId) {
            getCategoryDetails();
        }
        
    },[categoryId]);


    if (loading || !catalogPageData) {
        return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <Spinner/>
          </div>
        )
      }
      // if (!loading && !catalogPageData.success) {
      //   return <Error />
      // }
    
      return (
        <div>
          {/* Hero Section */}
          <div className=" box-content bg-richblack-800 px-4">
            <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
              <p className="text-sm text-richblack-300">
                {`Home / Catalog / `}
                <span className="text-yellow-25">
                  {catalogPageData?.data?.selectedCategory?.name}
                </span>
              </p>
              <p className="text-3xl text-richblack-5">
                {catalogPageData?.data?.selectedCategory?.name}
              </p>
              <p className="max-w-[870px] text-richblack-200">
                {catalogPageData?.data?.selectedCategory?.description}
              </p>
            </div>
          </div>
    
          {/* Section 1 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading ">Courses to get you started</div>
            <div className="my-4 flex border-b border-b-richblack-600 text-sm">
              <p
                className={`px-4 py-2 ${
                  active === 1
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(1)}
              >
                Most Populer
              </p>
              <p
                className={`px-4 py-2 ${
                  active === 2
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(2)}
              >
                New
              </p>
            </div>
            <div>
              {catalogPageData?.success && catalogPageData?.data?.selectedCategory?.courses?.length > 0 ? (
                <CourseSlider
                  Courses={catalogPageData.data.selectedCategory.courses}
                />
              ) : (
                <div className="flex flex-col items-center justify-center mt-16 space-y-6">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-amber-400 text-center">
                    🚫 No course added in this category
                  </h1>

                  <a
                    href="/"
                    className="px-6 py-3 bg-amber-400 text-richblack-900 font-semibold rounded-lg shadow-md hover:bg-amber-300 transition-all duration-200"
                  >
                    Go Home
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Section 2 */}
          {
            catalogPageData?.success &&<div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
              <div className="section_heading">
                Top courses in {catalogPageData?.data?.differentCategory?.name}
              </div>
              <div className="py-8">
                <CourseSlider
                  Courses={catalogPageData?.data?.differentCategory?.courses}
                />
              </div>
            </div>
          }
    
          {/* Section 3  only 6 card show in this section*/}
          {
            catalogPageData?.success &&<div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">Frequently Bought</div>
            <div className="py-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

                {/* only 6 course Card show not swiper use */}
                {catalogPageData?.data?.topSellingCourses
                  ?.slice(0, 6)
                  .map((course, i) => (
                    <Course_Card course={course} key={i} Height={"h-[400px]"} />
                  ))}

              </div>
            </div>
            </div>
          }
          <Footer />
        </div>
      )
    }
    
    export default Catalog