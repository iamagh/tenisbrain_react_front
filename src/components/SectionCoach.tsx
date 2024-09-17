import React, { FC } from "react";
import SectionExcercises from "containers/PageHome/SectionExcercises";

export interface SectionPromo3Props {
  className?: string;
}

const SectionPromo3: FC<SectionPromo3Props> = ({ className = "relative mt-5" }) => {
  return (
    <div className={`nc-SectionPromo3 ${className}`}>
      <div className="relative mb-10">
        <h2 className="font-semibold text-2xl md:text-4xl">
          For Coaches
        </h2>
        <span className="block mt-5 text-xl text-left">
          TennisBrain provides a unique scheduling and tracking system for coaches to manage their group and private training schedules. Students can access your availability and book times directly on your calendar, as well as access and book into any group classes you may be running throughout the week or training camps you maybe running during school holidays.
        </span>
        <span className="block mt-5 text-xl text-left">
          Tennis is not just about hitting balls over the net. Tennis is continuous with a wide range of educational areas to cover, so it is vitally important for a coach to stay on top of their schedule and content to maximise their students potential.
        </span>
      </div>
      <SectionExcercises />

             <span className="block mt-5 text-xl text-left">
          If you are a coach and looking for a way to help improve the way you navigate your student's development, TennisBrain was designed to do just that. No need to build, host and market costly websites, or even rely on your clubs website. It is super simple to get going, click on the video for the basic instructions and sign-up as a coach today.
        </span>






      <div className="flex justify-center items-center my-10">
        <video className="w-full sm:w-2/3" controls>
          <source src="/coach.mp4" type="video/mp4" />
        </video>
      </div>


    </div>
  );
};

export default SectionPromo3;
