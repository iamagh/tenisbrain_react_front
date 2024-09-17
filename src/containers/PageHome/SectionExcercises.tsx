import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import Img1 from "images/excercises/technical.png";
import Img2 from "images/excercises/physical.png";
import Img3 from "images/excercises/tactical.png";
import Img4 from "images/excercises/mental.png";

import NcImage from "shared/NcImage/NcImage";
import VectorImg from "images/VectorHIW.svg";

export interface Props {
  className?: string;
}


export const EXCERCISES = [
  {
    id: 1,
    title: "TECHNICAL",
    desc: "Establishing the important building blocks to develop individual styles of play",
    img: Img1,
    imgDark: Img1
  },
  {
    id: 2,
    title: 'PHYSICAL',
    desc: "Building endurance and skill through specific fitness drills and exercises",
    img: Img2,
    imgDark: Img2,
  },
  {
    id: 3,
    title: "TACTICAL",
    desc: "Improving decision-making and reacting to in-game situations",
    img: Img3,
    imgDark: Img3,
  },
  {
    id: 4,
    title: "MENTAL",
    desc: "Developing mental and emotional resilience on and off the court",
    img: Img4,
    imgDark: Img4,
  },
];
  

const SectionExcercises: React.FC<Props> = ({
  className = "",
}) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState<boolean>(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 500 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.5, // Delay each section by 0.5s
        duration: 0.5,
      },
    }),
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect(); // Stop observing after the first intersection
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the component is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (observer && sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [sectionRef]);


  return (
    <div
      className={`nc-SectionHowItWork ${className}`}
      data-nc-id="SectionHowItWork"
      ref={sectionRef}
    >
      <div className="relative mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-16 xl:gap-20">
        <img
        className="hidden md:block absolute inset-x-0 top-5"
        src={VectorImg}
        alt="vector"
        />
        {
          inView && EXCERCISES.map((item: typeof EXCERCISES[number], index: number) => (
            <div
              key={index}
              className="relative flex flex-col justify-between items-end max-w-xs mx-auto"
            >
              <motion.div
                custom={index}
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
              <div className="text-center space-y-2 mb-4">
                <h3 className="text-red-500 font-semibold">{item.title}</h3>
                <span className="block text-sm leading-6">
                    {item.desc}
                </span>
              </div>
              <NcImage
                containerClassName=" mx-auto"
                className="rounded-full"
                src={item.img}
              />
              </motion.div>
            </div>
          ))
        }
      </div>
      <div className="relative z-[20] mt-10 space-y-5 text-left text-xl">
          Like every player every coach is different, and this is why the platform allows you to create bespoke exercises to utilise in classes, keeping things fresh, data driven, relevant and monitored. It is up to you what you deem important, and what you want to track for your student's development. Through a simple scoring system, you can directly assign and assess your students performance on specific exercises providing insights into their development and to your own coaching programs.
      </div>
    </div>
  );
};

export default SectionExcercises;
