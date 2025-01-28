import React , { useEffect , useState } from "react";
import { useSocket } from "../context/SocketProvider";
import ReactPlayer from 'react-player'

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
        setMyStream(stream);
    }
    
    useEffect(() => {
        socket.on("user:joined" , handleUserJoin);
        return () => {
            socket.off("user:joined" , handleUserJoin);
        }
    } , [socket , handleUserJoin])

    return (
        <div>
            <h1>Room Page</h1>
            { remoteSocketId && <button onClick={handleUserCall}> Call </button> }
            {/* { myStream && <ReactPlayer playing muted height="150px" width="300px" url={myStream} /> } */}
        </div>
    );
}

export default RoomPage;