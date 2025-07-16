import React from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import { useState } from "react";
import HighlightText from "./HighlightText";
import CourseCard from "./CourseCard";

//Tab Part Component  which perform Card rerendering according the Selected Tab;
const tabName = [
      "Free",
      "New to coding",
      "Most popular",
      "Skills paths",
      "Career paths",
];
const ExploreMore = () => {
            const [currentTab, setCurrentTab] = useState(tabName[0]);//Tab Value which Selected at the time
            const [courses, setCourses] = useState(HomePageExplore[0].courses);//all Course(Array ) which store all Card Data
            const [currentCard, setCurrentCard] = useState(
            HomePageExplore[0].courses[0].heading
            );//Selected Card Data Store

      //A/c Tab Value  Perform the Action
     const setMyCards = (value) => {
            setCurrentTab(value);
            const result = HomePageExplore.filter((course) => course.tag === value);
            setCourses(result[0].courses);
            setCurrentCard(result[0].courses[0].heading);
      };

      return(
            <div>
                  {/* Explore more section */}
                  <div>
                        <div className="text-4xl font-semibold text-center my-10">
                              Unlock the
                              <HighlightText text={"Power of Code"} />

                              <p className="text-center text-richblack-300 text-lg font-semibold mt-1">
                                    Learn to Build Anything You Can Imagine
                              </p>
                        </div>
                  </div>
                  {/* Selected Tab telwind Css perform */}
                  <div className="sm:flex gap-3 sm:gap-4 lg:gap-5 -mt-2 sm:-mt-3 lg:-mt-5 mx-auto w-max
                         bg-richblack-800 text-richblack-200 py-1 sm:px-3 sm:py-1.5 
                              lg:rounded-full font-medium drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]
                        "
                  >
                        {
                              tabName.map((ele,index)=>{
                                    return(
                                         <div className={` text-[16px] flex flex-row items-center gap-2 
                                                ${
                                                      currentTab === ele
                                                      ? "bg-richblack-900 text-richblack-5 font-medium"
                                                      : "text-richblack-200"
                                                } px-7 py-[7px] rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5`}
                                                key={index}
                                                onClick={() => setMyCards(ele)}
                                          >     
                                                {ele}
                                          </div>
                                    )
                              })

                              
                        }

                  </div>


                  <div className="hidden lg:block lg:h-[200px]"></div>

                  {/* all Card that Coures Repersent */}
                  <div className="lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3">
                  {courses.map((ele, index) => {
                        return (

                              //course Card Component 
                              <CourseCard
                                    key={index}
                                    cardData={ele}//One By One all Card Deatails
                                    currentCard={currentCard}//selected Card Data 
                                    setCurrentCard={setCurrentCard}//function that set the Card
                              />
                        );
                        })}
                  </div>
            </div>

      );
}
export default ExploreMore