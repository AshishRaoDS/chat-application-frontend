import React from "react";
import styles from "../app/page.module.css";
import { ViewState } from "@/app/page";
import 'animate.css';

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
    if (nameState && roomState) {
      setViewState(ViewState.MESSAGING_PAGE);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" && nameState && roomState) {
      submitHandler();
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className="aspect-square max-w-[600px p-[54px] bg-[#9c5fe4] rounded-md	shadow-[5px_7px_8px_rgba(128,128,128)]">
        <h1 className={`text-white text-center font-semibold animate__animated animate__backInDown text-2xl`}>Snap Skoot</h1>
        <p className={`mb-[30px] text-center mt-[100px] text-sub-title text-[21px] font-semibold animate__animated animate__flip`}>Where anonymity is valued the most</p>
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="Enter your secret name here"
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