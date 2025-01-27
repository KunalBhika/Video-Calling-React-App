import React , { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";

const LobbyPage = () => {
  const [userDetails , setUserDetails] = useState({email : "" , roomId : ""});
  const socket = useSocket();
  const navigate = useNavigate();

  const handleRoomJoin = (data) => {
    navigate(`/room/${data.roomId}`);
    console.log(data);
  }

  useEffect(() => {
    socket.on("room:join" , handleRoomJoin);
    return() => {
      socket.off("room:join" , handleRoomJoin);
    }
  } ,[socket , handleRoomJoin])

  const onChange = (e) => {
    setUserDetails({...userDetails , [e.target.name] : e.target.value});
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("room:join" , userDetails);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email ID</label>
        <input name="email" type="email" onChange={onChange} value={userDetails.email} />
        <br />
        <label htmlFor="room">Room ID</label>
        <input name="roomId" type="text" onChange={onChange} value={userDetails.roomId} />
        <br />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default LobbyPage;
