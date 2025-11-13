// src/components/Spinner.jsx
import React from "react";

const Spinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm bg-white/20">
      <div
        className="
          w-12 h-12 
          border-[5px] border-white 
          border-b-[#FF3D00] 
          rounded-full 
          box-border 
          animate-spin
        "
      ></div>
    </div>
  );
};

export default Spinner;
