import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketProvider";
import Hand from "../../Assets/asking.png";
import VideoChat from "../../Assets/video-chat.png";
import SVG from "../../Assets/blob.svg";
import "./Hompage.css";

const LobbyScreen = () => {
  const [email, setEmail] = useState("email1@gmail.com");
  const [room, setRoom] = useState("1");

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div className="home-wrapper">
      <div className="h-main-wrapper r-wrapper">
        <div className="h-left">
          <div className="blur-div1"></div>
          <div className="blur-div2"></div>
          <h1>Sign Ease</h1>
          <p>
            Bridging Communication Through Hand Signs for Enhanced Health and
            <br /> Wellbeing
          </p>
          <div className="h-button" onClick={handleSubmitForm}>
            Try Now
          </div>
        </div>
        <div className="h-right">
          <img src={VideoChat} alt="video-icon" />
          <img src={Hand} alt="hand" />
          <img className="h-svg" src={SVG} alt="background" />
        </div>
      </div>
    </div>
  );
};

export default LobbyScreen;
