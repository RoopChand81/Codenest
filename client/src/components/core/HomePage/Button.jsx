import React from "react";
import { Link } from "react-router-dom";

//CTA Button Component which Repersent All button Style
const Button = ({ children, active, linkto }) => {
  return (
    <Link to={linkto}>
      <div
        className={`text-center text-[13px] sm:text-[16px] px-6 py-3 rounded-md font-bold shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
            ${
              active ? "bg-yellow-25 text-black " : "bg-richblack-800"
            } hover:shadow-none hover:scale-95 transition-all duration-200 `}
      >
        {/* text  that show on button is show using children */}
        {children}
      </div>
    </Link>
  );
};

export default Button;