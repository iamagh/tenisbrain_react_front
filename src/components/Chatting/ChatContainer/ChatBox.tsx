import { FC, useEffect, useRef } from "react";
import Avatar from "shared/Avatar/Avatar";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import EventDetailBox from "./EventDetailBox";

export interface ChatboxProps {
  messages: any[];
  room: any;
  pageNumber: number;
  loadMore: (param: number) => void;
  isNotMore: boolean;
}

const ChatBox: FC<ChatboxProps> = ({ messages, room, pageNumber, loadMore, isNotMore }) => {
  const userId = localStorage.getItem("user");
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const Message = ({ text, time }: any) => (
    <div className="text-sm sm:text-base">
      <span className="block font-semibold">{text}</span>
      <span className="block mt-0.5 text-slate-500 text-sm">
        {time}
      </span>
    </div>
  );

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div id="chatbox" className="p-4 h-96 overflow-y-auto" ref={chatBoxRef}>
      {/* <!-- Event Detail will be displayed here --> */}
      <div
        className=" flex space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg py-2 px-4 cursor-pointer mb-2"
      >
        <EventDetailBox room={room} />
      </div>
      {/* <!-- Chat messages will be displayed here --> */}
      <div className="flex justify-center">
        {!isNotMore && <ButtonSecondary
          onClick={() => loadMore(pageNumber)}
          className="border border-slate-300 dark:border-slate-700 p-2 mb-2"
        >
          Load More ...
        </ButtonSecondary>}
      </div>
      {
        messages?.map((message: any, key: number) => (
          message.user_id == userId ? <div className="mb-2 text-right" key={key}>
            <div className="bg-pink-500 text-white rounded-lg py-2 px-4 inline-block">
              <Avatar
                sizeClass="h-10 w-10 text-lg"
                radius="rounded-full"
                userName={message?.username}
                imgUrl={process.env.REACT_APP_BACKEND_URL + message?.profile_image}
              />
              <Message text={message?.message} time={message?.natural_timestamp} />
            </div>
          </div> : <div className="mb-2" key={key}>
            <div className="bg-gray-200 text-gray-700 rounded-lg py-2 px-4 inline-block">
              <Avatar
                sizeClass="h-10 w-10 text-lg"
                radius="rounded-full"
                userName={message?.username}
                imgUrl={process.env.REACT_APP_BACKEND_URL + message?.profile_image}
              />
              <Message text={message?.message} time={message?.natural_timestamp} />
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default ChatBox;
