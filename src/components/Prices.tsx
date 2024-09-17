import React, { FC } from "react";

export interface PricesProps {
  className?: string;
  price?: number;
  contentClass?: string;
}

const Prices: FC<PricesProps> = ({
  className = "",
  price = 33,
  contentClass = "py-1 px-2 md:py-1.5 md:px-2.5 font-medium",
}) => {
  return (
    <div className={`${className}`}>
      <div
        className={`flex items-center text-green-500 border-2 border-green-500 rounded-lg ${contentClass}`}
      >
        <span className="text-inherit !leading-none">
          £ {price.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default Prices;
