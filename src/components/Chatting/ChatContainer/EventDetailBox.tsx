import { FC } from "react";
import Avatar from "shared/Avatar/Avatar";

interface Props {
  room: any;
}

const EventDetailBox: FC<Props> = ({ room }) => {
  return (
    <>
      <div className="flex-shrink-0 pt-0.5">
        <Avatar
          sizeClass="h-10 w-10 text-lg"
          radius="rounded-full"
          userName={room?.description}
          imgUrl={process.env.REACT_APP_BACKEND_URL + room?.coach_profile_image}
        />
      </div>

      <div className="flex-1 flex justify-between">
        <div className="text-sm sm:text-base">
          <span className="block font-semibold">{room?.coach_name}</span>
          <span className="block mt-0.5 text-slate-500 dark:text-slate-400 text-sm">
            {room?.start} {room?.start_time} <br />
            {room?.duration} <br />
          </span>
        </div>

        <div className="mt-0.5 flex text-pink-500">
          {room?.description}
        </div>
      </div>
    </>
  )
}

export default EventDetailBox;