import { io, Socket } from "socket.io-client";

export const socketConnection = (userName: string) => {
    const newSocket = io("http://localhost:3000", {
        query: {
            username: userName
        }
    });

    newSocket.connect();
    newSocket.on("connect", () => {
        console.log("connect log");
        console.log(newSocket.id);
    });

    return newSocket;
};