import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const StarRating = ({ totalStars = 5, onChange }) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(null);

  const handleClick = (value) => {
    setRating(value);
    onChange(value); // Send to parent
  };

  return (
    <div className="flex gap-1 text-yellow-400">
      {Array.from({ length: totalStars }, (_, index) => {
        const value = index + 1;
        return (
          <button
            key={value}
            type="button"
            onClick={() => handleClick(value)}
            onMouseEnter={() => setHovered(value)}
            onMouseLeave={() => setHovered(null)}
            className="focus:outline-none transition-transform duration-200 hover:scale-110"
          >
            <FaStar
              size={24}
              className={
                value <= (hovered || rating) ? "fill-yellow-100" : "fill-gray-400"
              }
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;