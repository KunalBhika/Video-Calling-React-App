import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import peer from "../services/peer";
import ReactPlayer from "react-player";

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const handleUserJoin = (data) => {
    console.log("New User Joined : ", data.email);
    setRemoteSocketId(data.id);
  };

  const handleUserCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  };

  const handleIncomingCall = async (data) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
    setRemoteSocketId(data.from);
    const answer = await peer.getAnswer(data.offer);
    socket.emit("call:accepted", { to: data.from, answer });
    console.log("incoming call ", data.from, data.offer);
  };

  const sendStream = () => {
    for (const track of myStream.getTracks()) {
        peer.peer.addTrack(track, myStream);
      }
  }

  const handleCallAccepted = async (data) => {
    await peer.setLocalDescription(data.answer);
    console.log("call accepted : ", data.from, data.answer);
  };

  const handleNegoNeeded = async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  };

  const handleCreateNegoAns = async (data) => {
    const ans = await peer.getAnswer(data.offer);
    socket.emit("peer:nego:ans", { to: remoteSocketId, ans });
  };

  const handleNegoAns = async (data) => {
    await peer.setLocalDescription(data.ans);
  };

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoin);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleCreateNegoAns);
    socket.on("peer:nego:ans", handleNegoAns);
    return () => {
      socket.off("user:joined", handleUserJoin);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleCreateNegoAns);
      socket.off("peer:nego:ans", handleNegoAns);
    };
  }, [
    socket,
    handleUserJoin,
    handleIncomingCall,
    handleCallAccepted,
    handleCreateNegoAns,
    handleNegoAns,
  ]);

  return (
    <div>
      <h1>Room Page</h1>
      { myStream && <button onClick={sendStream}>Send Stream</button> }
      {remoteSocketId && <button onClick={handleUserCall}> Call </button>}
      {myStream && (
        <ReactPlayer
          playing
          muted
          height="150px"
          width="300px"
          url={myStream}
        />
      )}
      {remoteStream && (
        <>
          <h1>Remote Stream</h1>
          <ReactPlayer
            playing
            muted
            height="150px"
            width="300px"
            url={remoteStream}
          />
        </>
      )}
    </div>
  );
};

export default RoomPage;
