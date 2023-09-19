import React, { useEffect, useState } from "react";
import styles from "../styles/MessagingArea.module.css";
import { Socket } from "socket.io-client";
import { socketConnection } from "@/services/socket";
import { ViewState } from "@/app/page";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Skeleton } from "../../components/ui/skeleton";

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
  sender: any;
  message: any;
  time: string;
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

      newSocket?.on("chatHistory", (data) => {
        setAllMessages((prevState) => {
          const messages = [...prevState];
          messages.push(...data);

          return messages;
        }); 
      })

      newSocket?.on("users", (data) => {
        /* TODO: Find a better way to do this
        This breaks when you have two users with the same name 
        */
        const otherUsers = data.filter((user: AllUsers) => user.username !== nameState);
        otherUsers.unshift(...data.filter((user: AllUsers) => user.username === nameState));
        setAllUsers(otherUsers);
      });

      newSocket.on("connect_error", () => {
        console.log("socket connection error");
        setViewState(ViewState.LANDING_PAGE);
        newSocket.disconnect();
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
      <div className="flex h-[90%]">
        <div className="basis-[15%] bg-[#20006245] py-[20px] px-[10px]">
          <div>
            <h3 className="text-[#FFFF] mb-[6px]"><i className="fas fa-comments"></i> Room Name:</h3>
            <h2 className="py-[8px] px-[26px] bg-[#967fb0] text-[#ffff52bf] rounded-[3px] mb-[12px]">{allUsers.length > 0 && allUsers[0].room}</h2>
          </div>
          <h3 className="text-[#FFF] mb-[6px]"><i className="fas fa-users"></i> Users: {allUsers.length}</h3>
          <div className={styles.usersContainer}>
            {
              (allUsers.length > 0) && allUsers.map((user, i) => (
                <div className={`${styles.userWrapper}`} key={i}>
                  {/* TODO: Add random images as profile icon from a set of images */}
                  <Avatar className="h-full rounded-full overflow-hidden	ml-2">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback><Skeleton className="h-full w-10 bg-slate-200"></Skeleton></AvatarFallback>
                  </Avatar>
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
                    <div className={`${styles.messages} ${text.sender === nameState ? styles.ownMessage : ""}`}>
                      <p className={styles.sender}>{text.sender} <span className={styles.date}>{text.time}</span></p>
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