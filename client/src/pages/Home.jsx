import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import HighlightText from "../components/core/HomePage/HighlightText";
import CTAButton from "../components/core/HomePage/Button";
import videoBanner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import TimelineSection from "../components/core/HomePage/TimelineSection";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection"
import InstructorSection from "../components/core/HomePage/InstructorSection";
import ExploreMore from "../components/core/HomePage/ExploreMore";
import Footer from "../components/common/Footer";
import ReviewSlider from "../components/common/ReviewSlider";
import { useSelector } from "react-redux";
import auth from "../slices/authSlice"


function Home() {
  const {token}=useSelector((state)=>state.auth);
  return (
    <div className="HomePage">
      {/* {section 1} */}
      <div
        className="relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center
                   justify-between gap-8 text-white"
      >
        {/* Become a Instructor Button */}
        <Link to={token?"/dashboard/my-profile":"/signup"}>
          <div className="group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none">
            <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>


        <div className="text-center text-4xl font-semibold">
          Empower Your Future with
          <HighlightText text={"Coding Skills"} />
        </div>


        {/* Sub Heading  of Section 1*/}
        <div className="-mt-3 w-[90%] text-center text-lg font-bold text-richblack-300">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>


        {/*  Buttons reuseable component which render the button  active==true yellow background */}
        <div className="mt-8 flex flex-row gap-7">
          <CTAButton active={true} linkto={token?"/dashboard/my-profile":"/signup"}>
            Learn More
          </CTAButton>

          {/* CTA Button active== false means richblack backgraound */}
          <CTAButton active={false} linkto={token?"/dashboard/my-profile":"/login"}>
            Book a Demo
          </CTAButton>
        </div>


        {/* video Add on home Page  */}
        <div className="mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
          <video
            className="shadow-[20px_20px_rgba(255,255,255)]"
            muted
            loop
            autoPlay
          >
            <source src={videoBanner} type="video/mp4" />
          </video>
        </div>


        {/* CodeBlock (resuseble Component) first Section  */}
        <div>
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="text-4xl font-semibold">
                Unlock your
                <HighlightText text={"coding potential"} /> with our online
                courses.
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }

            // send the Button all Details
            ctabtn1={{
              btnText: "Try it Yourself",
              link: token?"/dashboard/my-profile":"/login",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              link: token?"/dashboard/my-profile":"/signup",
              active: false,
            }}

            // automatic  coding writing within Section 1 all  Details
            codeColor={"text-yellow-25"}
            codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
            backgroundGradient={
              "bg-[radial-gradient(circle,_rgba(255,214,10,0.3)_0%,_rgba(255,214,10,0)_80%)]"
            }
          />
        </div>


         {/* CodeBlock (resuseble Component) 2nd Section  */}
        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
                Start
                <HighlightText text={"coding in seconds"} />
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            // send the Button all Details in Section 2
            ctabtn1={{
              btnText: "Continue Lesson",
              link:token?"/dashboard/my-profile":"/login",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              link:token?"/dashboard/my-profile":"/signup",
              active: false,
            }}
            // automatic  coding writing within Section 2 all  Details
            codeColor={"text-blue-25"}
            codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
            backgroundGradient={
              "bg-[radial-gradient(circle,_rgba(63,55,171,100)_0%,_rgba(17,138,178,0)_80%)]"
            }
          />

        </div>
        {/* All tab Data rerender using the ExploreMore */}
        <ExploreMore/>
        {/* Section1 End       */}
      </div>


      {/* Section 2  */}
      <div className="bg-pure-greys-5 text-richblack-700">
        <div className="homepage_bg h-[310px]">
          {/* Explore Full Catagory Section */}
          <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
            <div className="lg:h-[150px]"></div>
            <div className="flex flex-row gap-7 text-white lg:mt-8">
              <CTAButton active={true} linkto={token?"/dashboard/my-profile":"/signup"}>
                <div className="flex items-center gap-2">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTAButton>

              <CTAButton active={false} linkto={token?"/dashboard/my-profile":"/signup"}>
                Learn More
              </CTAButton>
            </div>
          </div>
        </div>

        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-7 ">
          {/* Job that is in Demand - Section 1 */}
          <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
            <div className="text-4xl font-semibold lg:w-[45%] ">
              Get the skills you need for a{" "}
              <HighlightText text={"job that is in demand."} />
            </div>

            <div className="flex flex-col items-start gap-10 lg:w-[40%]">
              <div className="text-[16px]">
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>

              <CTAButton active={true} linkto={token?"/dashboard/my-profile":"/signup"}>
                <div className="">Learn More</div>
              </CTAButton>
            </div>
          </div>
          {/* Timeline Section - Section 2 */}
          <TimelineSection />

          {/* Learning Language Section - Section 3 */}
          <LearningLanguageSection />

        </div>

      </div>

      {/* Section 3 */}
      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        {/* Become a instructor section */}
        <InstructorSection />

        {/* Reviws from Other Learner */}
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
        <ReviewSlider />
      </div>
      

      {/* {fotter Data Show All } */}
      <Footer/>
    </div>
  );
}
//export this
export default Home;
