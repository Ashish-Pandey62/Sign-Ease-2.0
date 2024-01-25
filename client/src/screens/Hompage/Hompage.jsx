import { useNavigate } from "react-router-dom";
import Hand from "../../../Assets/asking.png";
import VideoChat from "../../../Assets/video-chat.png";
import SVG from "../../../Assets/blob.svg";
import "./Hompage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("room/1");
  };

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
          <div className="h-button" onClick={handleClick}>
            Try Now
          </div>
        </div>
        <div className="h-right">
          <img src={VideoChat} />
          <img src={Hand} />
          <img className="h-svg" src={SVG} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
