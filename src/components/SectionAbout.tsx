import React, { FC, useState, useEffect, useRef } from "react";
import { BACKGROUND_IMGS } from "data/data";
import { motion } from "framer-motion";
import SectionPlayer from "./SectionPlayer";
import SectionCoach from "./SectionCoach";

export interface SectionPromo1Props {
  className?: string;
}

const NUM_IMAGES = 22; // Total number of images


const SectionAbout: FC<SectionPromo1Props> = ({ className = "py-8 lg:py-20 " }) => {
  const [randomImage, setRandomImage] = useState<string>("");
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState<boolean>(false);

  const generateRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * NUM_IMAGES); // Random index from 0 to 22
    setRandomImage(BACKGROUND_IMGS[randomIndex]);
  };

  useEffect(() => {
    generateRandomImage();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
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
      className={`nc-SectionPromo1 relative ${className}]`}
      id="about"
      ref={sectionRef}
    >
      <div
        id="player-image"
        className="mt-0 absolute right-0 bottom-0 top-0 w-full bg-cover bg-no-repeat bg-left-top"
        style={{ backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 1) , rgba(255, 255, 255, 0.9) 100%), url(${randomImage})` }}
      >
      </div>
        <div className="flex flex-col lg:flex-row ">
          <div className="relative container mx-auto mb-10">
            {inView && (
              <>
                <motion.div
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  <h1 className="font-semibold text-4xl mb-5 md:text-5xl text-left">
                    About
                  </h1>
                  <div className="text-xl flex flex-col mb-5 justify-start gap-5">
                    <p>
                        Tennis is more than a sport; it’s a thrilling blend of physicality, technique, and mental grit. It boosts fitness, sharpens coordination, and builds resilience, all while offering a fun way to socialize and compete.
                    </p>
                    <p>
                        With every player and coach being unique, with distinct abilities, styles, and increasingly busy lives, TennisBrain makes it effortless to manage and monitor your training schedules. Whether you're a beginner learning the basics, an advanced player fine-tuning your skills, or a coach organizing your sessions, our intuitive system supports your journey every step of the way.
                    </p>
                  </div>
                </motion.div>
              </>
            )}
            <SectionPlayer />
            <SectionCoach />
          </div>
        </div>
    </div>
  );
};

export default SectionAbout;
