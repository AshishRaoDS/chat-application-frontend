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
  const [allUsers, setAllUsers] = useState<String[] | null>(null);

  const getAllUsers = () => {
    socket?.emit("allUsers");
    socket?.on("users", (data) => {
      console.log("All users", data);
      setAllUsers(data);
    });
  };

  socket?.on("users", (data) => {
    console.log("All users", data);
    setAllUsers(data);
  });

  const messageChangeHandler = (e: any) => {
    setMessageState(e.target.value);
  };

  const submitMessage = () => {
    socket?.emit("message", messageState);
  };

  useEffect(() => {
    if (nameState) {
      const newSocket = socketConnection(nameState);

      newSocket.emit("userDetails", nameState);
      newSocket.on("message", (data) => {
        console.log("Messages", data);
      });

      setSocket(newSocket);

      return () => {
        newSocket.emit("userDetails", nameState, true);
        newSocket.disconnect();
        setSocket(null);
      };
    }

  }, [nameState]);

  useEffect(() => {
    if (socket) {
      getAllUsers();
    }
  }, [socket]);


  return (
    <div className={styles.messagingAreaWrapper}>
      <header className={styles.header}>
        <h1>Place to unload your thoughts</h1>
      </header>
      <div className={styles.body}>
        <div className={styles.sideBar}>
          {
            allUsers && allUsers.map((user, i) => (
              <div className={styles.userWrapper} key={i}><p className={styles.userName}>{user}</p></div>
            ))
          }
        </div>
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