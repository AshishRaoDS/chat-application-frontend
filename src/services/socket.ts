import { io, Socket } from "socket.io-client";

type SocketDetails = {
    host: string,
    port: string,
    userName: string;
};

export const socketConnection = (username: string, room: string, setSocket: React.Dispatch<React.SetStateAction<Socket | null>>) => {
    const newSocket = io("http://localhost:3000");
    newSocket.connect();
    newSocket.on("connect", () => {
        setSocket(newSocket);
        newSocket.emit("joinRoom", { username, room });
        console.log(newSocket.id);
    });

    return newSocket;
};

export const socketReconnect = (socketDetails: SocketDetails) => {
    let socketConnection;
    socketConnection = io(`http://${socketDetails.host}:${socketDetails.port}`, {
        query: { username: socketDetails.userName }
    });
    console.log("socket reconnection attempt", socketConnection);

    return socketConnection;
}; 