import React, { FC, useState, useEffect } from "react";
import Checkbox from "shared/Checkbox/Checkbox";
import FiveStartIconForRate from "components/FiveStartIconForRate";

interface ReviewItemDataType {
  content: string;
  content_type: string;
  description: string;
  score: number; // score system
  id: number;
}

export interface ReviewItemProps {
  className?: string;
  coachFlag?: boolean; // coach flag
  data?: ReviewItemDataType;
  defaultChecked?: boolean;
  handleContent: (ck: any, id: any, score: any) => void;
}

const DEMO_DATA: ReviewItemDataType = {
  content: "Cody Fisher",
  content_type: "May 20, 2021",
  description:
    "Very nice feeling sweater. I like it better than a regular hoody because it is tailored to be a slimmer fit. Perfect for going out when you want to stay comfy. The head opening is a little tight which makes it a little.",
  score: 5,
  id: 0,
};

const ContentReviewItem: FC<ReviewItemProps> = ({
  className = "",
  coachFlag = false,
  data = DEMO_DATA,
  defaultChecked = false,
  handleContent
}) => {
  const [scoreEnable, setScoreEnable] = useState(defaultChecked);
  const [score, setScore] = useState(0);
  
  useEffect(() => {
    setScore(data.score);
  }, [data]);
  
  useEffect(() => {
    handleContent(scoreEnable, data.id, score);
  }, [score, scoreEnable])

  return (
    <div
      className={`nc-ReviewItem flex flex-col ${className}`}
      data-nc-id="ReviewItem"
    >
      <div className=" flex space-x-4 flex-start">
        {/* --- showed checkbox for coach */}
        {
          coachFlag && <div className="flex-shrink-0 pt-0.5">
            <Checkbox
              name="checked"
              defaultChecked={scoreEnable}
              onChange={(checked) => setScoreEnable(checked)}
              className="mr-1"
            />
          </div>
        }

        <div className="flex-1 flex justify-between">
          <div className="text-sm sm:text-base">
            <span className="block font-semibold">{data.content}</span>
            {/* --- show content_type for player */}
            {/* { !coachFlag && <span className="block mt-0.5 text-slate-500 dark:text-slate-400 text-sm">
              {data.content_type}
            </span> }   */}
          </div>

          <div className="mt-0.5 flex">
            <FiveStartIconForRate defaultPoint={score} setFlag={!coachFlag ? coachFlag : scoreEnable} setScore={setScore} />
          </div>
        </div>
      </div>
      <div className="mt-4 prose prose-sm sm:prose dark:prose-invert sm:max-w-2xl">
        <p className="text-slate-600 dark:text-slate-300">{data.description}</p>
      </div>
    </div>
  );
};

export default ContentReviewItem;
