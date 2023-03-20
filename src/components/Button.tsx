"use client"
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type Props = {};

const Button: React.FC<Props> = ({}) => {
  const [nameState, setNameState] = useState("");
  const [messageState, setMessageState] = useState("");
  const [socket, setSocket] = useState<Socket>();

  const getAllUsers = () => {
    socket?.emit("allUsers");
    socket?.on("users", (data) => {
      console.log("All users", data);
    });
  };

  const inputChangeHandler = (e: any) => {
    setNameState(e.target.value);
  };

  const submitNameHandler = () => {
    socket?.emit("userDetails", nameState);
  };

  const messageChangeHandler = (e: any) => {
    setMessageState(e.target.value);
  };

  const submitMessage = () => {
    socket?.emit("message", messageState);
  };

  useEffect(() => {
    const newSocket = io("http://localhost:3000");

    newSocket.connect();
    newSocket.on("connect", () => {
      console.log("connect log");
      console.log(newSocket.id);
    });

    newSocket.on("message", (data) => {
      console.log("Messages", data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <>
      <input type="text" value={nameState} onChange={inputChangeHandler} />
      <button type="button" onClick={submitNameHandler}>
        Submit Name
      </button>
      <button onClick={getAllUsers} type="button">
        Get all Users
      </button>
      <div>
        <input type="text" value={messageState} onChange={messageChangeHandler} />
        <button type="button" onClick={submitMessage}>
          Submit Message
        </button>
      </div>
    </>
  );
};

export default Button;
