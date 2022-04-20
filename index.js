// Modbus IO Instance
const Modbus = require("jsmodbus");
const net = require("net");
const socket = new net.Socket();
const client = new Modbus.client.TCP(socket, 1);
client.setTimeout = 2000;
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
      setTimeout(makeConnection(), 1000);
    }, 2000);
  } catch (error) {
    console.error;
  }
  // Trying to reconnect
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

var lock = false;
// Compile data and push it to front-end
async function data() {
  retrying = false;
  try {
    setInterval(function () {
      if (lock === false) {
        lock = true;
        // client.writeSingleRegister(1 - 1, inc);
        client
          .readCoils(17 - 1, 1)
          .then((result) => {
            // console.log(Boolean(result.response.body.values[0]));
            io.emit("valve1", Boolean(result.response.body.values[0]));
          })
          .catch((err) => {
            retrying = true;
            console.log("read plc");
            console.log(err);
          });
        client
          .readCoils(18 - 1, 1)
          .then((result) => {
            console.log(Boolean(result.response.body.values[0]));
            io.emit("valve2", Boolean(result.response.body.values[0]));
          })
          .catch((err) => {
            retrying = true;
          });

        client.readHoldingRegisters(1 - 1, 6).then(function (resp) {
          // console.log(resp.response.body.values[0]);
          io.emit("data", resp.response.body.values);
          io.emit("data1", resp.response.body.values[0]);
          io.emit("data2", resp.response.body.values[1]);
          io.emit("status", "connected");
        });
        lock = false;
      }
    }, 100);
  } catch (error) {
    retrying = true;
    console.log(error);
  }
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

server.listen(3000, () => {
  console.log("listening on *:3000");
});
