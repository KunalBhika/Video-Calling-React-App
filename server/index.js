import { Server } from "socket.io";

const io = new Server(3000, {
    cors: true
});

const userEmailToSocketIdMap = new Map();
const socketIdToUserEmailMap = new Map();

io.on("connection", (socket) => {
    console.log(socket.id + " Connected!");
    socket.on("room:join", (data) => {
        userEmailToSocketIdMap.set(data.email, socket.id);
        socketIdToUserEmailMap.set(socket.id, data.email);
        io.to(data.roomId).emit("user:joined", { email : data.email , id : socket.id });
        socket.join(data.roomId);
        io.to(socket.id).emit("room:join", data);
        console.log(data);
    })
});