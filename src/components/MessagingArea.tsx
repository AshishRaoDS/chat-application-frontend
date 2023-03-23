import React, { useEffect, useState } from "react";
import styles from "../styles/MessagingArea.module.css";
import { Socket } from "socket.io-client";
import { socketConnection } from "@/services/socket";
import { ViewState } from "@/app/page";

type Props = {
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
  socket: Socket | null;
  setNameState: React.Dispatch<React.SetStateAction<string>>;
  nameState: string;
  setViewState: React.Dispatch<React.SetStateAction<ViewState>>;
  roomState: string;
  setRoomState: React.Dispatch<React.SetStateAction<string>>;
};

type Message = {
  user: any;
  message: any;
  date: string;
};

type AllUsers = {
  username: any;
  id: string;
  room: any;
};

const MessagingArea: React.FC<Props> = ({
  setSocket,
  socket,
  nameState,
  setViewState,
  setNameState,
  roomState,
  setRoomState
}) => {
  const [messageState, setMessageState] = useState("");
  const [allUsers, setAllUsers] = useState<AllUsers[]>([]);
  const [allMessages, setAllMessages] = useState<Message[]>([]);

  const messageChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageState(e.target.value);
  };

  const submitMessage = () => {
    if (messageState) {
      socket?.emit("message", messageState);
      setMessageState("");
    }
  };

  const exitMessagingAreaHandler = () => {
    socket?.emit("removeUser");
    setViewState(ViewState.LANDING_PAGE);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter') {
      submitMessage();
    }
  };

  useEffect(() => {
    if (!socket) {
      const newSocket = socketConnection(nameState, roomState, setSocket);
      newSocket?.on("message", (data) => {
        setAllMessages((prevState) => {
          const messages = [...prevState];
          messages.push(data);

          return messages;
        });
      });

      newSocket?.on("users", (data) => {
        setAllUsers(data);
      });
    }

    return () => {
      socket?.disconnect();
      setNameState("");
      setRoomState("");
      setSocket(null);
    };
  }, []);

  useEffect(() => {
    if (socket && !socket.connected) {
      setViewState(ViewState.LANDING_PAGE);
      socket.disconnect();
      console.log("socket connection error");
    }
  }, [socket?.connected]);

  useEffect(() => {
    function confirmExit(event: any) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", confirmExit);

    return () => {
      window.removeEventListener("beforeunload", confirmExit);
    };
  }, []);

  return (
    <div className={styles.messagingAreaWrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>Snap Skoot</h1>
        <h2 className={styles.description}>Place to unload your thoughts</h2>
        <div className={styles.exitCtaWrapper}>
          <button className={styles.exitCta} type="button" onClick={exitMessagingAreaHandler}>Exit Chat</button>
        </div>
      </header>
      <div className={styles.body}>
        <div className={styles.sideBar}>
          <div>
            <h3 className={styles.sidebarLabel}><i className="fas fa-comments"></i> Room Name:</h3>
            <h2 className={styles.roomTitle}>{allUsers.length > 0 && allUsers[0].room}</h2>
          </div>
          <h3 className={styles.sidebarLabel}><i className="fas fa-users"></i> Users: {allUsers.length}</h3>
          <div className={styles.usersContainer}>
            {
              (allUsers.length > 0) && allUsers.map((user, i) => (
                <div className={styles.userWrapper} key={i}>
                  <p className={styles.userName}>
                    {user.username}
                    {user.username === nameState ? <span className={styles.youTag}>(You)</span> : ""}
                  </p>
                </div>
              ))
            }
          </div>
        </div>
        <div className={styles.messageDisplayWrapper}>
          <div className={styles.messageDisplay}>
            <div className={styles.messagesContainer}>
              {
                allMessages.length > 0 && allMessages.map((text, i) => (
                  <div className={styles.messageWrapper} key={i}>
                    <div className={`${styles.messages} ${text.user === nameState ? styles.ownMessage : ""}`}>
                      <p className={styles.sender}>{text.user} <span className={styles.date}>{text.date}</span></p>
                      <p >{text.message}</p>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
          <div className={styles.inputContainer}>
            <input className={styles.input} type="text" onKeyDown={handleKeyDown} value={messageState} onChange={messageChangeHandler} />
            <button type="button" className={styles.submitCta} onClick={submitMessage}>
              Submit Message
            </button>
          </div>
        </div>
      </div>
    </div >
  );
};

export default MessagingArea;