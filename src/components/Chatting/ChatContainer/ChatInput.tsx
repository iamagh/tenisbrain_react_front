import { FC } from "react";

export interface ChatInputProps {
  inputRef: React.Ref<any>;
  sendMessage: () => void;
}

const ChatInput: FC<ChatInputProps> = ({ inputRef, sendMessage }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  }

  return (
    <div className="p-4 border-t flex">
      <input id="user-input"
        type="text"
        placeholder="Type a message"
        className="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ref={inputRef}
        onKeyDown={handleKeyDown}
      />
      <button id="send-button"
        className="bg-pink-500 text-white px-4 py-2 rounded-r-md hover:bg-pink-600 transition duration-300"
        onClick={sendMessage}
      >
        Send
      </button>
    </div>
  )
}

export default ChatInput;