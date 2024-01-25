import "./InfoBox.css";
import Mic from "../../Assets/microphone.png";
import Video from "../../Assets/video.png";
import Send from "../../Assets/send.png";
import Avatar from "../../Assets/Ellipse 10.png";
import Mute_Mic from "../../Assets/mute.png";
import No_Video from "../../Assets/no-video-h.png";
import { useEffect, useState } from "react";

const InfoBox = ({ isVideoOn, setIsVideoOn, isMicOn, setIsMicOn }) => {
  const [allChats, setAllChats] = useState(["Hello Everyone!"]);
  const [msg, setMsg] = useState("");
  const [activeDots, setActiveDots] = useState([]);
  const [intervalId, setIntervalId] = useState(null);

  // const addGreenDots = () => {
  //   for (let i = 0; i < 4; i++) {
  //     setTimeout((i) => {
  //       if (i == 0) {
  //         setActiveDots([]);
  //       }
  //       setActiveDots((prev) => [...prev, "."]);
  //     }, 1000);
  //   }
  // };

  // if (isVideoOn && intervalId == null) {
  //   addGreenDots();
  //   let myintervalId = setInterval(addGreenDots, 5000);
  //   setIntervalId(myintervalId);
  // }

  // if (!isVideoOn && intervalId) {
  //   clearInterval(intervalId);
  //   setIntervalId(null);
  // }

  const handleSumbit = (e) => {
    e.preventDefault();
    setAllChats((prev) => [...prev, msg]);
    setMsg("");
  };
  // if (isMicOn) {
  //   console.log("mic on");
  //   for (let i = 0; i < 5; i++) {
  //     setTimeout(() => {
  //       console.log(activeDots);
  //       setActiveDots((prev) => [...prev, "."]);
  //     }, 1000 * (i + 1));
  //   }
  // }
  return (
    <div className="info-content">
      <div className="i-participants r-wrapper">
        <span className="i-title">Participants</span>
        <hr />
        <div className="all-participants">
          <div className="s-participant">
            <div className="p-iname">
              <img src={Avatar} />
              <span>You</span>
              <div className="fiveDots">
                {/* insert above html into fiveDots from mainDisplay */}
              </div>
            </div>
            <div className="i-icons">
              <img src={isMicOn ? Mic : Mute_Mic} />
              <img src={isVideoOn ? Video : No_Video} />
            </div>
          </div>
        </div>
      </div>
      <div className="i-chats r-wrapper">
        <span className="i-title">Chats</span>
        <hr />
        <div className="chat-box">
          <img src={Avatar} />
          <div className="chats">
            {allChats.map((chat, index) => (
              <span key={index}>{chat}</span>
            ))}
          </div>
        </div>
        <div className="send-chat">
          <form onSubmit={handleSumbit}>
            <input
              type="text"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Type something here..."
            ></input>
          </form>
          <img src={Send} onClick={handleSumbit} />
        </div>
      </div>
    </div>
  );
};

export default InfoBox;
