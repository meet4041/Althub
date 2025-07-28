import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ChatUser from "./ChatUser";
import ChatMessage from "./ChatMessage";
import axios from "axios";
import { WEB_URL } from "../baseURL";
// import { io } from "socket.io-client";

export default function Message({ socket }) {
  const userid = localStorage.getItem("Althub_Id");
  const [conversationID, setConversationID] = useState([]);
  const [currentId, setCurrentId] = useState("");
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("");
  const [profilepic, setProfilepic] = useState("");
  const [user, setUser] = useState({});
  const [newMsg, setNewMsg] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const location = useLocation();
  const width = window.innerWidth < 1200;
  const msgBoxRef = useRef(null);
  const [searchName, setSearchName] = useState("");

  const getConversation = () => {
    axios({
      url: `${WEB_URL}/api/getConversations/${userid}`,
      method: "get",
    })
      .then((response) => {
        setConversationID(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getUser = () => {
    if (userid !== "") {
      axios({
        method: "get",
        url: `${WEB_URL}/api/searchUserById/${userid}`,
      })
        .then((Response) => {
          setUser(Response.data.data[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const searchConversation = () => {
    axios({
      url: `${WEB_URL}/api/searchConversations`,
      method: "post",
      data: {
        person1: location.state._id,
        person2: userid,
      },
    }).then((Response) => {
      setCurrentId(Response.data.data[0]._id);
    });
  };

  useEffect(() => {
    socket.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        time: data.time,
        createdAt: Date.now(),
      });
    });

    if (location.state !== null) {
      setName(location.state.fname + " " + location.state.lname);
      setReceiverId(location.state._id);
      setProfilepic(location.state.profilepic);
      searchConversation();
    }
    getConversation();
    getUser();
  }, [getConversation, getUser, location.state, searchConversation, socket]);

  useEffect(() => {
    arrivalMessage &&
      arrivalMessage.sender === receiverId &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, receiverId]);

  const getMessages = () => {
    if (currentId !== "") {
      axios({
        url: `${WEB_URL}/api/getMessages/${currentId}`,
        method: "get",
      })
        .then((response) => {
          setMessages(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    getMessages();
  }, [currentId, getMessages]);

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("sendMessage", {
      senderId: userid,
      receiverId: receiverId,
      text: newMsg,
      time: new Date()
    });

    if (newMsg !== "") {
      axios({
        method: "post",
        url: `${WEB_URL}/api/newMessage`,
        data: {
          conversationId: currentId,
          sender: userid,
          text: newMsg,
          time: new Date(),
        },
      })
        .then((response) => {
          getMessages();
          setNewMsg("");
          scrollToEnd();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleBack = () => {
    setCurrentId("");
    getConversation();
  };

  useEffect(() => {
    scrollToEnd();
  }, [messages]);

  const scrollToEnd = () => {
    if (msgBoxRef.current) {
      const msgBox = msgBoxRef.current;
      msgBox.scrollTop = msgBox.scrollHeight;
    }
  }

  return (
    <>
      <div className="container-fluid">
        {!width || currentId === "" ? (
          <div className="chat-user-list-box">
            <div className="chat-profile-box">
              <Link to="/home">
                <div className="chat-profile-back">
                  <i className="fa-solid fa-arrow-left"></i>
                </div>
              </Link>
              <img src={`${WEB_URL}${user.profilepic}`} alt="" />
              <div className="chat-profile-name">{`${user.fname} ${user.lname}`}</div>
              <div className="chat-profile-option">
                <i className="fa-solid fa-ellipsis-vertical"></i>
              </div>
            </div>
            <div className="chat-search-box">
              <i
                className="fa-sharp fa-solid fa-magnifying-glass"
                style={{ color: "#787878" }}
              ></i>
              <input type="text" placeholder="search" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
            </div>
            {conversationID.length > 0 ? (
              <div className="chat-user-list">
                {conversationID.map((elem) => (
                  <ChatUser
                    userid={elem}
                    setCurrentId={setCurrentId}
                    setName={setName}
                    setProfilepic={setProfilepic}
                    setReceiverId={setReceiverId}
                  />
                ))}
              </div>
            ) : (
              ""
            )}
          </div>
        ) : null}
        {currentId !== "" ? (
          <div className="chat-box">
            <div className="chat-user-profile">
              <i
                className="fa-solid fa-arrow-left"
                onClick={
                  handleBack
                }
              ></i>
              <img src={`${WEB_URL}${profilepic}`} alt="" />
              <div className="chat-name">{name}</div>
            </div>
            <div className="user-chat">
              {messages.length > 0 ? (
                <div className="msg-box" ref={msgBoxRef}>
                  {messages.map((elem) => (
                    <ChatMessage
                      msg={elem}
                      own={userid === elem.sender ? "send" : "received"}
                    />
                  ))}
                </div>
              ) : (
                ""
              )}

              <div className="send-msg">
                <div className="send-msg-box">
                  <input
                    type="text"
                    placeholder="Write a message"
                    onChange={(e) => {
                      setNewMsg(e.target.value);
                    }}
                    value={newMsg}
                  />
                </div>
                <div className="send-btn" onClick={sendMessage}>
                  Send
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-chat">
            <img src="images/Messaging-bro.png" alt="" />
            <span>Open a conversation to start a chat</span>
          </div>
        )}
      </div>
    </>
  );
}