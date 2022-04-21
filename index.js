// Modbus IO Instance
const Modbus = require("jsmodbus");
const net = require("net");
const socket = new net.Socket();
const client = new Modbus.client.TCP(socket, 1);
const options = {
  host: "10.10.10.10",
  port: 502,
};

// Express Instance
const express = require("express");
const app = express();
let retrying;

// Socket IO Instance
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Make Socket IO Connection
io.on("connection", (socket) => {
  console.log("A User Connected");

  socket.on("disconnect", () => {
    console.log("A User disconnected");
  });
});

// Make Modbus Connection
const connect = () => {
  try {
    retrying = false;
    console.log("Connected");
    io.emit("status", "connected");
    data();
    coils();
  } catch (error) {
    retrying = true;
  }
};

// Make a new Connection
function makeConnection() {
  socket.connect(options);
}

// Close a connection
socket.on("close", async () => {
  try {
    setTimeout(() => {
      if (retrying) {
        console.log("Connection closed");
        console.log("Reconnecting...");
        io.emit("status", "reconnecting...");
      }
      retrying = false;
      setTimeout(makeConnection(), 1000);
    }, 100);
  } catch (error) {
    console.error;
  }
  // Trying to reconnect
});

// Compile data and push it to front-end
function data() {
  setInterval(function () {
    client
      .readHoldingRegisters(1 - 1, 6)
      .then((result) => {
        io.emit("registers", result.response.body.values);
      })
      .catch((err) => {
        console.log(err);
      });
  }, 100);
}

function coils() {
  setInterval(() => {
    client
      .readCoils(1 - 1, 25)
      .then((result) => {
        io.emit("coils", result.response.body.valuesAsArray);

        // io.emit(
        //   "valve1",
        //   Boolean(result.response.body.valuesAsArray[17 - 1])
        // );
        // io.emit(
        //   "valve2",
        //   Boolean(result.response.body.valuesAsArray[18 - 1])
        // );
        // io.emit(
        //   "steam",
        //   Boolean(result.response.body.valuesAsArray[19 - 1])
        // );
        // console.log(result.response.body.valuesAsArray[20 - 1]);

        // io.emit("cw", result.response.body.valuesAsArray);
      })
      .catch((err) => {
        retrying = true;
        console.log("1");
        console.log(err);
      });
  }, 100);
}

// Connection ended
socket.on("end", async () => {
  console.log("Connection ended");
});

// Prevent app to close when error occured
process.on("uncaughtException", (err) => {
  retrying = true;
});

socket.connect(options);
connect();
coils();

server.listen(3000, () => {
  console.log("listening on *:3000");
});
