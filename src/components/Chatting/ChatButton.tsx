import { FC } from "react";
import { ChatBubbleLeftRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

interface Props {
  setIsOpen: (param: boolean) => void;
  setRoomInfo: (param: any) => void;
  rooms: any;
  eventId: any;
}

const ChatButton: FC<Props> = ({ setIsOpen, rooms, eventId, setRoomInfo }) => {
  const handleOpen = () => {
    const selectedRoom = rooms.find((room: any) => room.event == eventId);
    if(selectedRoom){
      setRoomInfo(selectedRoom)
    } else {
      toast.warning("You can not chat because you did not apply for this Event");
      // setRooms([])
    }
    setIsOpen(true);
  }

  return (
    <div className="ml-2">
      <button
        className="bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 transition duration-300 flex items-center"
        onClick={() => handleOpen()}
      >
        <ChatBubbleLeftRightIcon className="w-8 h-8" />
      </button>
    </div>
  )
}

export default ChatButton;
