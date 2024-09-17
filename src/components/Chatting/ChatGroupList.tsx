import React, { FC, useState, useEffect } from "react";
import Avatar from "shared/Avatar/Avatar";
import EventDetailBox from "./ChatContainer/EventDetailBox";

export interface ChatGroupListProps {
  rooms: any[];
  setSection: (param: string) => void;
  setRoomInfo: (param: any) => void;
}

const ChatGroupList: FC<ChatGroupListProps> = ({
  rooms,
  setSection,
  setRoomInfo,
}) => {

  const handleClick = (roomInfo: any) => {
    setRoomInfo(roomInfo);
  }

  return (
    <div id="chatbox" className="p-4 h-96 overflow-y-auto">
      {/* <!-- Chat messages will be displayed here --> */}
      {
        rooms.length === 0 ? <div className="mb-2">
          <p className="bg-gray-200 text-gray-700 w-full text-white rounded-lg py-2 px-4 inline-block">
            There is not scheduled events
          </p>
        </div> : rooms?.map((room: any, key: number) => (
          <div className="mb-2" key={key}>
            <div
              onClick={() => handleClick(room)}
              className=" flex space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg py-2 px-4 cursor-pointer"
            >
              <EventDetailBox room={room} />
            </div>
            {/* <p className="bg-gray-200 text-gray-700 w-full text-white rounded-lg py-2 px-4 inline-block">{`${room?.description} (${room?.start}:${room?.start_time})`}</p> */}
          </div>
        ))
      }
    </div>
  )
}

export default ChatGroupList;