import { Routes, Route } from "react-router-dom";
import "./App.css";
import LobbyScreen from "./screens/Hompage/Lobby";
// import RoomPage  from "./Components/Main_Display/Room";
import RoomPage from './screens/RoomPage/Roompage'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LobbyScreen />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
      </Routes>
    </div>
  );
}

export default App;
