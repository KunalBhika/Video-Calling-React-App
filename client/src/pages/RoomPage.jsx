import React , { useEffect , useState } from "react";
import { useSocket } from "../context/SocketProvider";
import peer from "../services/peer";
import ReactPlayer from 'react-player';

const RoomPage = () => {
    const socket = useSocket();
    const [remoteSocketId , setRemoteSocketId] = useState(null);
    const [myStream , setMyStream] = useState(null);

    const handleUserJoin = (data) => {
        console.log("New User Joined : " , data.email);
        setRemoteSocketId(data.id);
    }

    const handleUserCall = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio : true , video : true });
        const offer = await peer.getOffer();
        socket.emit("user:call" , { to : remoteSocketId , offer });
        setMyStream(stream);
    }

    const handleIncomingCall = async (data) => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio : true , video : true });
        setMyStream(stream);
        setRemoteSocketId(data.from);
        const answer = await peer.getAnswer(data.offer);
        socket.emit("call:accepted" , { to : data.from , answer });
        console.log("incoming call " , data.from , data.offer);
    }

    const handleCallAccepted = async (data) => {
        await peer.setLocalDescription(data.answer);
        console.log("call accepted : " , data.from , data.answer);
    }
    
    useEffect(() => {
        socket.on("user:joined" , handleUserJoin);
        socket.on("incoming:call" , handleIncomingCall);
        socket.on("call:accepted" , handleCallAccepted);
        return () => {
            socket.off("user:joined" , handleUserJoin);
            socket.off("incoming:call" , handleIncomingCall);
            socket.off("call:accepted" , handleCallAccepted);
        }
    } , [socket , handleUserJoin , handleIncomingCall , handleCallAccepted])

    return (
        <div>
            <h1>Room Page</h1>
            { remoteSocketId && <button onClick={handleUserCall}> Call </button> }
            { myStream && <ReactPlayer playing muted height="150px" width="300px" url={myStream} /> }
        </div>
    );
}

export default RoomPage;