import "./Menu.css";
import Home from "../../Assets/home.png";
import Schedule from "../../Assets/schedule.png";
import Teams from "../../Assets/group.png";
import Chats from "../../Assets/chat.png";
import Settings from "../../Assets/gear.png";

const Menu = ({ items }) => {
  const icons = [Home, Schedule, Teams, Chats, Settings];
  return (
    <div className="main-menu r-wrapper">
      <h2 className="m-title">Sign Ease</h2>
      <ul className="m-list">
        {items.map((item, index) => (
          <li key={index}>
            <img src={icons[index]} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="m-button">Upgrade</div>
    </div>
  );
};

export default Menu;
