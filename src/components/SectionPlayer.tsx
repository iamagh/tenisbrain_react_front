import { FC, useState, useEffect, useRef } from "react";
import CalendarImg from "images/sections/calendar-icon-png-2.jpg";
import ReportImg from "images/sections/reporting.jpg";
import { motion } from "framer-motion";

import { STAGE_DATA } from "data/data";

export interface SectionPromo2Props {
  className?: string;
}

const NUM_IMAGES = 22; // Total number of images

const SectionPlayer: FC<SectionPromo2Props> = ({ className = "relative mt-5" }) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState<boolean>(false);

  const containerVariants = {
    hidden: { opacity: 0, x: 200 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.5, // Delay each section by 0.5s
        duration: 0.5,
      },
    }),
  };

  const containerVariants1 = {
    hidden: { opacity: 0, x: -200 },
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

    <div className={`nc-SectionPromo2 ${className}`} ref={sectionRef}>
      <div className="relative mb-5">
        <h2 className="font-semibold text-2xl md:text-4xl">
          For Players
        </h2>
      </div>

      <div className="relative mb-5">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10">
          <p className=" md:max-w-md text-xl text-left leading-8">Tennis is an exhilarating and challenging sport that encompasses physical, technical, and mental demands. It bolsters fitness, coordination, and resilience while providing an enjoyable avenue for socializing, forming new connections and competing. Everyone is unique, having different abilities, personalities, styles and preferences. No matter your age there will always be areas to improve, and your coach will play a crucial role in your development.</p>
          <div className="player-stage min-w-[400px] text-left">
            <table className="min-w-full divide-y bg-[rgba(255,255,255,.7)] px-2 divide-gray-300">
              <thead className="border-b-2 border-solid border-gray-300">
                <tr>
                  <th
                    className="px-2 py-4 text-left text-sm font-medium text-purple-700 uppercase tracking-wider"
                    style={{ width: "30%" }}
                  >
                    Stage
                  </th>
                  <th className="px-2 py-4 text-left text-sm font-medium text-purple-700 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {
                  STAGE_DATA.map((item, index) => (
                    <tr key={index}>
                      <td className="px-2 py-4 whitespace-normal text-xs font-semibold text-gray-900">
                        {item.stage}
                      </td>
                      <td className="px-2 py-4 whitespace-normal text-xs text-gray-700">
                        {item.description}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="relative space-y-5">
      {
        inView && (
          <>
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={containerVariants1}
            >
              <div className="flex sm:flex-row flex-col justify-between items-center gap-10">
                <p className="text-left md:text-center text-xl order-2 sm:order-1">
                  TennisBrain adds simplicity and intelligence into how players (or parents) manage, plan and track their tennis training sessions. It provides a simple interface that allows players to build a flexible training schedule by directly accessing your coaches availability for private training or to join in on one of their group classes.
                </p>
                <img src={CalendarImg} className="w-[300px] sm:w-[150px] order-1 sm:order-2" />
              </div>          
            </motion.div>
            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <div className="flex sm:flex-row flex-col justify-between items-center gap-10">
                <p className="text-left sm:text-right md:text-center text-xl order-2">
                The platform allows you to book directly with your coach at his given venue or club, track your sessions and gives transparency into your progress. Coaches can provide direct performance feedback and reporting on your training, providing valuable insights into your tennis development.
                </p>
                <img src={ReportImg} className="w-[300px] sm:w-[150px] order-1" />
              </div>          
            </motion.div>
          </>
        )
      }
      </div>
      <div className="flex justify-center items-center my-10">
        <video className="w-full sm:w-2/3" controls>
          <source src="/player.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default SectionPlayer;
