import { FC, useRef, useState, useCallback, useEffect } from "react";
import { socketRoomInstance } from "services/socket";
import ChatBox from "./ChatBox";
import ChatInput from "./ChatInput";
import { toast } from "react-toastify"; 
import Avatar from "shared/Avatar/Avatar";

export interface ChatContainerProps {
    roomInfo: any;
    setConnectedSocket: (param: any) => void;
}

const ChatContainer: FC<ChatContainerProps> = ({ roomInfo, setConnectedSocket }) => {
    const userId = localStorage.getItem("user");
    const accessToken: any = localStorage.getItem("access-token");
    const inputRef: any = useRef(null);
    const ws: any = useRef(null);
    const [messages, setMessages] = useState<any>([]);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [isNotMore, setIsNotMore] = useState(false);

    const initWebSocket: any = useCallback(() => {
        ws.current = socketRoomInstance(roomInfo.room, accessToken);
        setConnectedSocket(ws.current);
        ws.current.onmessage = (message: any) => {
            const data = JSON.parse(message.data);
            if (data.msg_type == 0) {
                setMessages((prevMessages: any) => [...prevMessages, data]);
                // if (data.user_id != userId) {
                //     toast(data.message, {
                //         icon: ({theme, type}) => <img className="w-10 rounded-full" src={process.env.REACT_APP_BACKEND_URL + data?.profile_image} />
                //     })
                // }
            }
            if (data.messages_payload) {
                if(data.messages == "None") {
                    setIsNotMore(true);
                } else {
                    setPageNumber(data.new_page_number);
                    const oldMessages = data.messages.sort((a: any, b: any) => a.msg_id - b.msg_id);
                    setMessages((prevMessages: any) => [...oldMessages, ...prevMessages]);
                }
            }
        }
        ws.current.onopen = (e: any) => {
            console.log('Socket was opened: ' + e)
            ws.current.send(JSON.stringify({
                "command": "join",
                "room": roomInfo.room
            }));
            ws.current.send(JSON.stringify({
                "command": "get_room_chat_messages",
                "room_id": roomInfo.room,
                "page_number": 1,
            }));
        }
        ws.current.onclose = () => {
            console.log('socket closed unexpectly')
        }
        ws.current.onerror = (e: any) => {
            console.log('socket made error', e)
        }
        if (ws.current.readyState == WebSocket.OPEN) {
            console.log("ChatSocket OPEN")
        } else if (ws.current.readyState == WebSocket.CONNECTING) {
            console.log("ChatSocket connecting..")
        }
    }, []);
    useEffect(() => {
        if (roomInfo.room > 0) {
            initWebSocket();
        }
    }, []);

    const loadMoreChatHistory = (page_number: number) => {
        ws.current.send(JSON.stringify({
            "command": "get_room_chat_messages",
            "room_id": roomInfo.room,
            "page_number": page_number,
        }));
    }

    const sendMessage = () => {
        ws.current.send(JSON.stringify({
            "command": "send",
            "message": inputRef.current.value,
            "room": roomInfo.room
        }));

        inputRef.current.value = "";
    }

    return (
        <div>
            <ChatBox
                room={roomInfo}
                messages={messages}
                pageNumber={pageNumber}
                loadMore={loadMoreChatHistory}
                isNotMore={isNotMore}
            />
            <ChatInput
                inputRef={inputRef}
                sendMessage={sendMessage}
            />
        </div>
    )
}

export default ChatContainer;