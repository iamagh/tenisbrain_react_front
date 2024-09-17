import { _getImgRd, _getTagNameRd } from "contains/fakeData";
import React, { FC } from "react";
import { NavLink } from "react-router-dom";

export interface CardDashboardProps {
  className?: string;
  size?: "large" | "normal";
  featuredImage?: string;
  name?: string;
  desc?: string;
}

const CardDashboard: FC<CardDashboardProps> = ({
  className = "",
  size = "normal",
  name = "",
  desc = "",
  featuredImage = "",
}) => {
  return (
    <NavLink
      to={"#"}
      className={`nc-CardDashboard flex items-center justify-center bg-green-500 rounded-lg text-center p-4 ${className}`}
      data-nc-id="CardDashboard"
      style={{ width: '100%', backgroundColor: '#009688' }} // Control width here or through parent container
    >
      {/* Uncomment if using images */}
      {/* <NcImage
        containerClassName={`flex-shrink-0 ${
          size === "large" ? "w-20 h-20" : "w-12 h-12"
        } rounded-full mr-4 overflow-hidden`}
        src={featuredImage || _getImgRd()}
      /> */}
      <div>
        <h2
          className={`${
            size === "large" ? "text-lg" : "text-base"
          } nc-card-title text-white font-semibold`}
        >
          {name || _getTagNameRd()}
        </h2>
        <span
          className={`${
            size === "large" ? "text-sm" : "text-xs"
          } block mt-[2px] text-neutral-200`}
        >
          {desc || ``}
        </span>
      </div>
    </NavLink>
  );
};

export default CardDashboard;
