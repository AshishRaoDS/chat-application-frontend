import React, { useEffect, useState } from "react";
import styles from "../app/page.module.css";
import { io, Socket } from "socket.io-client";
import { ViewState } from "@/app/page";
import { socketConnection, socketReconnect } from "@/services/socket";

type Props = {
  setNameState: React.Dispatch<React.SetStateAction<string>>;
  nameState: string;
  setViewState: React.Dispatch<React.SetStateAction<ViewState>>;
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
};

const LandingPage: React.FC<Props> = ({
  setNameState,
  nameState,
  setViewState,
  setSocket
}) => {

  const inputChangeHandler = (e: any) => {
    setNameState(e.target.value);
  };

  const submitNameHandler = (e: any) => {
    setViewState(ViewState.MESSAGING_PAGE);
  };

  useEffect(() => {
    const socketInfo = localStorage.getItem('socket');

    if (socketInfo) {
      const parsedSocketDetails = JSON.parse(socketInfo);
      const socketReconnection = socketReconnect(parsedSocketDetails);
      if (socketReconnection.connected) {
        setViewState(ViewState.MESSAGING_PAGE);
        setSocket(socketReconnection);
      }
    }
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome to your general chat site</h1>
        <p className={styles.subTitle}>Where anonymity is valued the most</p>
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
  );
};

export default LandingPage;