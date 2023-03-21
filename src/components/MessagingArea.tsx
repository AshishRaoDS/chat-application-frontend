import React, { useEffect, useState } from "react";
import styles from "../styles/MessagingArea.module.css";
import { io, Socket } from "socket.io-client";
import { socketConnection } from "@/services/socket";

type Props = {
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
  socket: Socket | null;
  setNameState: React.Dispatch<React.SetStateAction<string>>;
  nameState: string;
};

const MessagingArea: React.FC<Props> = ({
  setSocket,
  socket,
  nameState
}) => {
  const [messageState, setMessageState] = useState("");

  const getAllUsers = () => {
    socket?.emit("allUsers");
    socket?.on("users", (data) => {
      console.log("All users", data);
    });
  };

  const messageChangeHandler = (e: any) => {
    setMessageState(e.target.value);
  };

  const submitMessage = () => {
    socket?.emit("message", messageState);
  };

  useEffect(() => {
    if (nameState) {
      const newSocket = socketConnection(nameState);

      newSocket.on("message", (data) => {
        console.log("Messages", data);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    }

  }, [nameState]);

  return (
    <div className={styles.messagingAreaWrapper}>
      <header className={styles.header}>
        <h1>Place to unload your thoughts</h1>
      </header>
      <div className={styles.body}>
        <div className={styles.sideBar}></div>
        <div className={styles.messageDisplayWrapper}>
          <div className={styles.messageDisplay}></div>
          <div className={styles.inputContainer}>
            <input className={styles.input} type="text" value={messageState} onChange={messageChangeHandler} />
            <button type="button" className={styles.submitCta} onClick={submitMessage}>
              Submit Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingArea;