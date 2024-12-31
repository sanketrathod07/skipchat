import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import backgroundImage from '../assets/chatImg/15-15.png';

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  useEffect(async () => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    } else {
      setCurrentUser(
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )
      );
    }
  }, []);
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(async () => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);
      } else {
        navigate("/setAvatar");
      }
    }
  }, [currentUser]);
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  return (
    <>
      <Container currentChat={currentChat}>
        <div className="container">
          <div className={`contacts ${currentChat === undefined ? "showSidebarContact" : "hideSidebarContact"}`}>
            <Contacts contacts={contacts} changeChat={handleChatChange} />
          </div>
          <div className={`chat-container ${currentChat === undefined ? "chatMobileStyleSHOW" : "chatMobileStyleHide"}`}>
            {currentChat === undefined ? (
              <Welcome />
            ) : (
              <ChatContainer currentChat={currentChat} socket={socket} setCurrentChat={setCurrentChat} />
            )}
          </div>
        </div>
      </Container >
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #1a1a2e;
  @media only screen and (max-width: 700px) {
    justify-content: start;
  }
  .container {
    height: 90vh;
    width: 95vw;
    display: grid;
    grid-template-columns: 25% 75%;
    background: url(${backgroundImage});
    background-color: #00000076;

    .chat-container{
      overflow: hidden;
    }

    @media only screen and (max-width: 850px) {
      height: 100%;
      width: 100vw;
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }

    @media only screen and (max-width: 700px) {
      .showSidebarContact{
        width: 100vw;
        height: 100vh;
      }
      .chatMobileStyleSHOW{
        display: none;
      }
      .hideSidebarContact{
        display: none;
      }
      .chatMobileStyleHide{
        width: 100vw;
        height: 100vh
      }
  }
}
`;