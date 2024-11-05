import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState("Guest");
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  useEffect(() => {
    const fetchData = async () => {
      const data = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
      if (data) {
        setCurrentUserName(data.username);
        setCurrentUserImage(data.avatarImage);
      } else {
        setCurrentUserName("Guest");
      }
    };
    fetchData();
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  return (
    <>
      {(currentUserImage && currentUserName) && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3 className="brandLogoName">Skip Chat</h3>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => (
              <div
                key={contact._id}
                className={`contact ${index === currentSelected ? "selected" : ""}`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div className="avatar">
                  <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="" />
                </div>
                <div className="username">
                  <h3>{contact.username}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="avatar" />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #000000;
  height: 100%;
  @media screen and (max-width: 700px){
    grid-template-rows: 10% 78% 12%;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
      font-family: 'Kenjo', sans-serif;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #1f1f1f;
      min-height: 4rem;
      cursor: pointer;
      width: 90%;
      padding: 0.4rem 0.5rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.2s ease-in-out;
      border-radius: 7px;
      &:hover{
        background-color: #4f04ff;
      }
      .avatar {
        img {
          height: 2.5rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
    .selected {
      background-color: #775af8;
    }
  }

    .Container {
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #1e1e2f;
      border-radius: 8px;
      padding: 1.5rem;
      max-width: 300px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .brand img {
    height: 2rem;
  }

  .brandLogoName {
    color: #fff;
    font-size: 1.2rem;
    font-weight: bold;
  }

  .contacts {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: 100%;
    overflow-y: auto;
    margin-bottom: 1rem;
    padding-right: 0.5rem;
  }

  .contact {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .contact:hover,
  .contact.selected {
    background-color: #2a2a3d;
  }

  .avatar img {
    height: 3rem;
    border-radius: 50%;
  }

  .username h3 {
    color: #b3b3c6;
    font-size: 1rem;
  }

  .current-user {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1rem 1rem 2rem;
    border-top: 2px solid #5d5d5d;
    background-color: #000000;
  }

  .current-user .avatar img {
    height: 4rem;
  }

  .current-user .username h2 {
    color: white;
    font-size: 1.2rem;
  }

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    .username h2 {
      font-size: 1rem;
    }
  }

`;
