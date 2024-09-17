import { StarIcon } from "@heroicons/react/24/solid";
import React, { FC, useEffect } from "react";
import { useState } from "react";

export interface FiveStartIconForRateProps {
  className?: string;
  iconClass?: string;
  defaultPoint?: number;
  setFlag?: boolean;
  setScore?: (param: any) => void;
}

const FiveStartIconForRate: FC<FiveStartIconForRateProps> = ({
  className = "",
  iconClass = "w-4 h-4",
  defaultPoint = 5,
  setFlag = true,
  setScore = () => { },
}) => {
  const [point, setPoint] = useState(defaultPoint);
  const [currentHover, setCurrentHover] = useState(0);

  useEffect(() => {
    setPoint(defaultPoint);
  }, [defaultPoint]);

  useEffect(() => {
    setScore(point);
  }, [point]);

  return (
    <div
      className={`nc-FiveStartIconForRate flex items-center text-neutral-300 ${className}`}
      data-nc-id="FiveStartIconForRate"
    >
      {
        setFlag ? [1, 2, 3, 4, 5].map((item) => {
          return (
            <StarIcon
              key={item}
              className={`${point >= item || currentHover >= item ? "text-yellow-500" : ""
                } ${iconClass}`}
              onMouseEnter={() => setCurrentHover(() => item)}
              onMouseLeave={() => setCurrentHover(() => 0)}
              onClick={() => setPoint(() => item)}
            />
          );
        }) : <>
          <StarIcon className={`${point >= 1 ? "text-yellow-500" : ""} ${iconClass}`} />
          <StarIcon className={`${point >= 2 ? "text-yellow-500" : ""} ${iconClass}`} />
          <StarIcon className={`${point >= 3 ? "text-yellow-500" : ""} ${iconClass}`} />
          <StarIcon className={`${point >= 4 ? "text-yellow-500" : ""} ${iconClass}`} />
          <StarIcon className={`${point >= 5 ? "text-yellow-500" : ""} ${iconClass}`} />
        </>
      }
    </div>
  );
};

export default FiveStartIconForRate;
