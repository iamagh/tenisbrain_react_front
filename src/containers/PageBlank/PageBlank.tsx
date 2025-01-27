import ButtonPrimary from "shared/Button/ButtonPrimary";
import React from "react";
import { Helmet } from "react-helmet-async";
import NcImage from "shared/NcImage/NcImage";
import I404Png from "images/404.png";

const PageBlank: React.FC = () => (
  <div className="nc-PageBlank">
    <Helmet>
      <title>Blank page || Tennisbrain</title>
    </Helmet>
    <div className="container relative pt-5 pb-16 lg:pb-20 lg:pt-5">
      {/* HEADER */}
      <header className="text-center max-w-2xl mx-auto space-y-2">
        <NcImage src={I404Png} />
        <span className="block text-sm text-neutral-800 sm:text-base dark:text-neutral-200 tracking-wider font-medium">
          COMMING SOON.{" "}
        </span>
      </header>
      <div className="container">
        <div className="pt-8">
          <ButtonPrimary href="/">Return Home Page</ButtonPrimary>
        </div>
      </div>
    </div>
  </div>
);

export default PageBlank;
