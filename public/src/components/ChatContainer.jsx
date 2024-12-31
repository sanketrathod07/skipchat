import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import { FaArrowLeft } from "react-icons/fa";

export default function ChatContainer({ currentChat, socket, setCurrentChat }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const data = JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      const response = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: currentChat._id,
      });
      setMessages(response.data);
      setLoading(false);
    };

    fetchMessages();
  }, [currentChat]);


  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, [socket]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    if (!loading) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleBackClick = () => {
    setCurrentChat(undefined);
  };

  const username = currentChat.username || "guest";


  return (
    <>
      <Container>
        <div className="chat-header">
          <div className="user-details">
            <div onClick={handleBackClick} className="back-arrow">
              <FaArrowLeft />
            </div>
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                alt="Avtar Image"
              />
            </div>
            <div className="username">
              <h3>{username}</h3>
            </div>
          </div>
          <Logout />
        </div>
        <div className="chat-messages">
          {loading ? (
            <Loader>
              <div className="spinner"></div>
            </Loader>
          ) : (messages.map((message) => {
            return (
              <div ref={scrollRef} key={uuidv4()}>
                <div
                  className={`message ${message.fromSelf ? "sended" : "recieved"
                    }`}
                >
                  <div className="content ">
                    <p>{message.message}</p>
                  </div>
                </div>
              </div>
            );
          }))}
        </div>
        <ChatInput handleSendMsg={handleSendMsg} />
      </Container>
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100%;
  gap: 0.1rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 10% 84% 6%;
  }
  
  .container {
    height: 100%;
    width: 100vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media only screen and (max-width: 700px) {
      height: 100vh;
    }

    @media screen and (min-width: 720px){
      grid-template-columns: 5% 65%;
    }

    @media screen and (max-width: 700px) { // Mobile view
      grid-template-columns: 100%;
      grid-template-rows: ${(props) =>
    props.currentChat ? "1fr" : "1fr 0"};
    }

    .contacts {
      display: ${(props) => (props.currentChat ? "none" : "block")}; // Hide contacts when chat is selected on mobile
    }

    .chat-container {
      display: ${(props) => (props.currentChat ? "block" : "none")}; // Hide chat when no chat is selected on mobile
      width: 100%;
    }
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.16rem 2rem;
    background-color: #8c00ffc7;
    @media screen and (max-width: 700px) {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 10;
      padding: 0.4rem 1rem;
    }
    .back-arrow {
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      text-decoration: none;
      display: flex;
      align-items: center;
    }
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 2.7rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    @media screen and (max-width: 700px) {
      padding: 1rem 0.5rem;
      /* min-height: fit-content; */
      height: 90vh;
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff;
      }
    }
  }
`;

// Styled component for loading spinner
const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #ffffff39;
    border-top: 4px solid #4f04ff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;