import React from "react";
import { Link } from "react-router-dom";
import logoImg from "images/logo.png";
import whiteLogoImg from "images/logo_white.png";
import logoLightImg from "images/logo.png"; // logo-right.png

export interface LogoProps {
  img?: string;
  imgLight?: string;
  className?: string;
  isWhite?: string;
}

const Logo: React.FC<LogoProps> = ({
  img = logoImg,
  imgLight = logoLightImg,
  className = "flex-shrink-0",
  isWhite = "black"
}) => {
  return (
    <Link
      to="/"
      className={`ttnc-logo inline-block text-slate-600 ${className}`}
    >
      {/* THIS USE FOR MY CLIENT */}
      {/* PLEASE UN COMMENT BELLOW CODE AND USE IT */}
      {img ? (
        <img
          className={`block max-h-[50px] sm:max-h-[70px] ${
            imgLight ? "dark:hidden" : ""
          }`}
          src={isWhite == "black" ? img : whiteLogoImg }
          alt="Logo"
        />
      ) : (
        "Logo Here"
      )}
      {imgLight && (
        <img
          className="hidden max-h-8 sm:max-h-10 dark:block"
          src={imgLight}
          alt="Logo-Light"
        />
      )}
    </Link>
  );
};

export default Logo;
