"use client";
import LandingPage from "@/components/LandingPage";
import MessagingArea from "@/components/MessagingArea";
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import styles from './page.module.css';

type Props = {};

export enum ViewState {
  LANDING_PAGE = "landing_page",
  MESSAGING_PAGE = "messaging_page"
}

const Home: React.FC<Props> = ({ }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [nameState, setNameState] = useState("");
  const [viewState, setViewState] = useState<ViewState>(ViewState.LANDING_PAGE);

  return (
    <>
      {
        viewState === ViewState.LANDING_PAGE &&
        <LandingPage
          setNameState={setNameState}
          nameState={nameState}
          setViewState={setViewState}
        />
      }
      {
        viewState === ViewState.MESSAGING_PAGE &&
        <MessagingArea
          setSocket={setSocket}
          socket={socket}
          setNameState={setNameState}
          nameState={nameState}
        />
      }


    </>
  );
};

export default Home;
