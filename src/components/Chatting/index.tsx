import React, { FC, useState, useEffect } from "react"
import { ChatBubbleLeftRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import ChatContainer from "./ChatContainer";
import ChatGroupList from "./ChatGroupList";

export interface ChattingProps {
  className?: string;
  isOpen: boolean;
  roomInfo: any;
  setRoomInfo: (param: any) => void;
  rooms: any[];
  setRooms: (param: any) => void;
  oldRooms: any[];
  setIsOpen: (param: boolean) => void;
}

const Chatting: FC<ChattingProps> = ({ rooms, oldRooms, setRooms, isOpen, setIsOpen, roomInfo, setRoomInfo }) => {
  // const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [connectedSocket, setConnectedSocket] = useState<any>(null);
  const [section, setSection] = useState('group-list');

  useEffect(() => {
    return () => {
      // Clean up WebSocket connection on component unmount
      if (connectedSocket) {
        connectedSocket.close();
      }
  };
  }, []);

  useEffect(() => {
    if(roomInfo) {
      setSection('chat-container');
    } else {
      setSection('group-list');
    }
  }, [roomInfo]);

  const handleClose = (param: boolean) => {
    if (!param && connectedSocket && roomInfo) {
      try {
        connectedSocket.send(JSON.stringify({
          "command": "leave",
          "room": roomInfo.room
        }));
        connectedSocket.close();
      } catch (err) {
        console.log(err, '---> err')
      }
      setRooms(oldRooms);
    }
    setSection('group-list');
    setIsOpen(param);
    setRoomInfo(null);
  }

  return (
    <div>
      <div className="fixed bottom-0 right-0 mb-4 mr-4 z-[1000]">
        <button
          className="bg-pink-500 text-white p-4 rounded-full hover:bg-pink-600 transition duration-300 flex items-center"
          onClick={() => handleClose(!isOpen)}
        >
          {isOpen ? <XMarkIcon className="w-8 h-8" /> : <ChatBubbleLeftRightIcon className="w-8 h-8" />}
        </button>
      </div>
      <div id="chat-container" className={`${isOpen ? '' : 'hidden'} fixed bottom-24 right-0 w-full xs:right-4 xs:w-96 z-[1001]`}>
        <div className="bg-white shadow-md rounded-lg max-w-lg w-full">
          <div className="p-4 border-b bg-pink-500 text-white rounded-t-lg flex justify-between items-center">
            <p className="text-lg font-semibold">
              { section === "group-list" && "Scheduled Events" }
              { section === "chat-container" && roomInfo?.description + ' ' + roomInfo?.start }
            </p>
            <button
              onClick={() => handleClose(false)}
              className="text-gray-300 hover:text-gray-400 focus:outline-none focus:text-gray-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          {section === "group-list" && <ChatGroupList
            rooms={rooms}
            setSection={setSection}
            setRoomInfo={setRoomInfo}
          />}
          {section === "chat-container" && <ChatContainer
            roomInfo={roomInfo}
            setConnectedSocket={setConnectedSocket}
          />}
          {/* <ChatBox messages={[]} /> */}
        </div>
      </div>
    </div>
  )
}

export default Chatting;