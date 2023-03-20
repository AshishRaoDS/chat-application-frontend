"use client"
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import styles from './page.module.css'

type Props = {};

const Home: React.FC<Props> = ({}) => {
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
    const newSocket = io("http://localhost:3000", {
      query: {
        username: 'john_doe'
      }
    });

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
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        <h1>Welcome to your general chat site</h1>
        <p>Where anonymity is valued the most</p>
        <div className={styles.inputContainer}>
          <input 
          type="text" 
          placeholder="Enter to secret name here" 
          value={nameState} 
          className={styles.input}
          onChange={inputChangeHandler}
          />
          <button 
          type="button" 
          className={styles.submitNameCta}
          onClick={submitNameHandler}
          >Submit your name</button>
        </div>
      </div>
    </div>
      {/* <input type="text" value={nameState} onChange={inputChangeHandler} />
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
      </div> */}
    </>
  );
};

export default Home;