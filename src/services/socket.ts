export const socketRoomInstance = (roomId: number, token: string) => new WebSocket(`${process.env.REACT_APP_SOCKET_SERVER_URL}/chat/${roomId}/?jwt_token=${token}`);
export const socketNotificationInstance = () => new WebSocket(`${process.env.REACT_APP_SOCKET_SERVER_URL}`);

// export const connect = socket.CONNECTING
// export const sendMessage = (message: any) => {
//     socket.send(message);
// }
