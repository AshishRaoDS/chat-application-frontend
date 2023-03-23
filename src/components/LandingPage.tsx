import React from "react";
import styles from "../app/page.module.css";
import { ViewState } from "@/app/page";

type Props = {
  setNameState: React.Dispatch<React.SetStateAction<string>>;
  nameState: string;
  setViewState: React.Dispatch<React.SetStateAction<ViewState>>;
  setRoomState: React.Dispatch<React.SetStateAction<string>>;
  roomState: string;
};

enum StateType {
  NAME = "name",
  ROOM = "room"
}

const LandingPage: React.FC<Props> = ({
  setNameState,
  nameState,
  setViewState,
  setRoomState,
  roomState
}) => {
  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>, inputType: StateType) => {
    if (inputType === StateType.NAME) {
      setNameState(e.target.value);
    } else {
      setRoomState(e.target.value);
    }
  };

  const submitHandler = () => {
    setViewState(ViewState.MESSAGING_PAGE);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" && nameState && roomState) {
      submitHandler();
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Snap Skoot</h1>
        <p className={styles.subTitle}>Where anonymity is valued the most</p>
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="Enter to secret name here"
              value={nameState}
              required
              className={styles.input}
              onChange={(e) => inputChangeHandler(e, StateType.NAME)}
            />
          </div>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="The room you want to enter"
              value={roomState}
              className={styles.input}
              required
              onKeyDown={handleKeyDown}
              onChange={(e) => inputChangeHandler(e, StateType.ROOM)}
            />
          </div>
          <button
            type="button"
            className={styles.enterChatCta}
            onClick={submitHandler}
          >Enter Chat Room</button>
        </div>
      </div>
    </div >
  );
};

export default LandingPage;