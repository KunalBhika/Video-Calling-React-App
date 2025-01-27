import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import LobbyPage from "./pages/LobbyPage";
import RoomPage from "./pages/RoomPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LobbyPage/>} />
        <Route path="/room/:roomId" element={<RoomPage/>} />
      </Routes>
    </>
  );
}

export default App;
