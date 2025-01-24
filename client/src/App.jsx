import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import LobbyPage from "./pages/LobbyPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LobbyPage/>} />
      </Routes>
    </>
  );
}

export default App;
