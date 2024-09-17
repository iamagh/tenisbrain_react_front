import { FC, useState, useEffect, useRef } from "react";
import TagCloud from "TagCloud";
import { motion } from "framer-motion";

import { BACKGROUND_IMGS, CLOUD_WORDS } from "data/data";
import ButtonPrimary from "shared/Button/ButtonPrimary";

interface Hero2DataType {
  image: string;
  heading: string;
  subHeading: string;
  btnText: string;
  btnLink: string;
}
export interface SectionHeroProps {
  className?: string;
}

let TIME_OUT: NodeJS.Timeout | null = null;
const NUM_IMAGES = 22; // Total number of images
const teamContainer: any = '#hero-image';


const SectionHero: FC<SectionHeroProps> = ({ className = "" }) => {
  const userRole = localStorage.getItem('user-role');
  const [randomImage, setRandomImage] = useState<string>("");
  const tagContainerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState<boolean>(false);

  // const options: any = {
  //   radius: Math.round(window.innerWidth / 4 - 50),
  //   // animation speed
  //   // slow, normal, fast
  //   maxSpeed: 'slow',
  //   initSpeed: 'slow',
  //   // 0 = top
  //   // 90 = left
  //   // 135 = right-bottom
  //   duration: 10000,
  //   // interact with cursor move on mouse out
  //   keep: true
  // };

  const createTagCloud = () => {
    if(tagContainerRef.current)
      tagContainerRef.current.innerHTML = "";
    const radius = window.innerWidth > window.innerHeight 
      ? Math.round(window.innerWidth / 2 - 50)
      : Math.round(window.innerHeight / 2 - 50);


    const options: any = {
      radius,
      maxSpeed: 'slow',
      initSpeed: 'slow',
      duration: 10000,
      keep: true
    };

    // Clear previous TagCloud instance if it exists
    if (document.querySelector(teamContainer)) {
      document.querySelector(teamContainer)!.innerHTML = '';
    }

    TagCloud(teamContainer, CLOUD_WORDS, options);
  };

  const generateRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * NUM_IMAGES); // Random index from 0 to 22
    setRandomImage(BACKGROUND_IMGS[randomIndex]);
  };

  useEffect(() => {
    generateRandomImage();
    createTagCloud();
    window.addEventListener('resize', createTagCloud);
    return () => window.removeEventListener('resize', createTagCloud);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: -100 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.5, // Delay each section by 0.5s
        duration: 0.5,
      },
    }),
  };

  const containerVariants1 = {
    hidden: { opacity: 0, x: -100 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.5, // Delay each section by 0.5s
        duration: 0.5,
      },
    }),
  };

  const containerVariants2 = {
    hidden: { opacity: 0, y: 100 },
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
      id="hero"
      className={`nc-SectionHeroItem nc-SectionHeroItem--animation flex flex-col-reverse lg:flex-col relative overflow-hidden ${className}`}
      ref={sectionRef}
    >
      <div className="absolute inset-0 bg-black">
        {/* <div className="absolute inset-0 bg-[#F7F0EA]"> */}
      </div>

      <div className="relative pb-0 pt-14 sm:pt-20 w-full h-[calc(100vh-5rem)] lg:py-44">
        <div
          className={`absolute z-[999] container w-full md:pl-20 h-[calc(100vh-100px)] absolute top-0 left-0 flex flex-col items-center sm:items-start justify-center gap-4 p-4`}
        >
          {
            inView && (
              <>
                <motion.div
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-white font-bold mb-4"><span className="font-thin">TENNIS</span>BRAIN</h1>
                </motion.div>
                <motion.div
                  custom={1}
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants1}
                  >
                  <div>
                    <p className="text-xl sm:text-2xl md:text-3xl xl:text-4xl text-center sm:text-left text-white">Streamline Your Tennis Coaching Journey</p>
                    <p className="text-xl sm:text-2xl md:text-3xl xl:text-4xl text-center sm:text-left text-white mb-4">A Dynamic Platform to Book, Schedule and Track Coach and Player Training</p>
                  </div>
                </motion.div>
                <motion.div
                  custom={2}
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants2}
                >
                  <ButtonPrimary
                    className="bg-none rounded-none"
                    sizeClass="py-3 px-6 border-4 border-solid border-green-300	hover:border-green-300"
                    href={userRole && userRole != "" ? (userRole == 'player' ? '/player-calendar' : '/calendar') : '/login' }
                  >
                    <span className="text-xl md:text-2xl xl:text-4xl text-green-300">{"Book A Training Session"}</span>
                  </ButtonPrimary>
                </motion.div>
              </>
            )
          }
        </div>
        <div
          id="hero-image"
          className="mt-10 flex justify-center z-5 items-center lg:mt-0 absolute right-0 bottom-0 top-0 color text-[#9ACD32] font-[Arimo] w-full sm:w-2/3 md:w-1/2 bg-cover bg-no-repeat bg-left-top text-center"
          style={{ backgroundImage: `linear-gradient(to left, transparent, transparent 10%, black 100%), url(${randomImage})` }}
          ref={tagContainerRef}
        >
        </div>
      </div>
    </div>
  );
};

export default SectionHero;
