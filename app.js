const express = require("express");
const http = require("http");


const PORT = process.env.PORT || 3000;



const app = express();

const server = http.createServer(app);

app.use(express.static("public"));

const io = require("socket.io")(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html");

});

let connectedPeers = [];
let notAvailable = []
io.on("connection", (socket) => {
    connectedPeers.push(socket.id);


    socket.on("calling-offer", (calling_code) => {
        
        notAvailable.push(socket.id);

        const f1 = notAvailable.find((element) =>
            calling_code === element);

        if (f1) {
            const index = notAvailable.indexOf(socket.id);

            notAvailable.splice(index, 1);

            io.to(socket.id).emit("user_busy");
        }

        const f = connectedPeers.find((element) =>
            calling_code === element);

        if (f && !f1) {
            notAvailable.push(calling_code);
            io.to(socket.id).emit("call-successful", calling_code);
            io.to(calling_code).emit("call-successful", socket.id);
            io.to(socket.id).emit("rtcForCaller", calling_code);
        } else if (!f1) {
            const index = notAvailable.indexOf(socket.id);

            notAvailable.splice(index, 1);
            io.to(socket.id).emit("code_wrong")
        }

    });
    socket.on("webRTC-offer-to-server", (data) => {
       
        const p = data.peerSocketId;

        const f = connectedPeers.find((element) =>
            p === element);

        if (f) {
            io.to(p).emit("webRTC-offer-from-server", (data.offer));
        }
    });

    socket.on("webRTC-answer-to-server", (data) => {
      
        const p = data.peerSocketId;

        const f = connectedPeers.find((element) =>
            p === element);

        if (f) {
            io.to(p).emit("webRTC-answer-from-server", (data.answer));
        }
    });

    socket.on("webRTC-ice-to-server", (data) => {
    
        const p = data.peerSocketId;

        const f = connectedPeers.find((element) =>
            p === element);


        if (f) {
          
            io.to(p).emit("webRTC-ice-from-server", (data.ice));
        }
    });

    socket.on("disconnect", () => {

        const newconnectedPeers = [];

        connectedPeers.forEach((x) => {
            if (x != (socket.id)) {
                newconnectedPeers.push(x);
            }
        })
        connectedPeers = newconnectedPeers;
    })


    socket.on('chat', function(data) {
        const p = data.peerId;

        io.to(p).emit('chat', data);

    });

    socket.on('leave', function(p) {
        io.to(p).emit('leave');

    });

    socket.on('start-videocall', function(p) {
        io.to(p).emit("start-videocall");

    });
})

server.listen(PORT);
