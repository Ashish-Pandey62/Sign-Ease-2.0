import "./Roompage.css";
import { useState } from "react";
import { menuItems } from "../../Data/data";
import Menu from "../../Components/Menu/Menu";
import MainDisplay from "../../Components/Main_Display/Room";
import InfoBox from "../../Components/Information/InfoBox";

const Roompage = () => {
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  
  return (
    <div className="main-wrapper">
      <div className="content-wrapper">
        <Menu items={menuItems} />
        <MainDisplay
          isMicOn={isMicOn}
          isVideoOn={isVideoOn}
          setIsMicOn={setIsMicOn}
          setIsVideoOn={setIsVideoOn}
        />
        <InfoBox
          isMicOn={isMicOn}
          isVideoOn={isVideoOn}
          setIsMicOn={setIsMicOn}
          setIsVideoOn={setIsVideoOn}
        />
      </div>
    </div>
  );
};

export default Roompage;
