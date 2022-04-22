// Modbus IO Instance
const Modbus = require("jsmodbus");
const net = require("net");
const socket = new net.Socket();
const client = new Modbus.client.TCP(socket, 1);
client.setTimeout = 5000;
const options = {
  host: "10.10.10.10",
  port: 502,
};

// Express Instance
const express = require("express");
const app = express();
const cors = require("cors");
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

const db = require("./models");
const Role = db.role;

db.Sequelize.sync();

app.get("/", (req, res) => {
  res.json({ message: "Hello" });
});

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "moderator",
  });

  Role.create({
    id: 3,
    name: "admin",
  });
  Role.create({
    id: 4,
    name: "super_admin",
  });
}

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
        // console.log("Connection closed");
        // console.log("Reconnecting...");
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
  setInterval(() => {
    try {
      client
        .readHoldingRegisters(1 - 1, 6)
        .then((result) => {
          io.emit("registers", result.response.body.values);
        })
        .catch((err) => {
          console.log("registers");
          console.log(err);
          retrying = true;
        });

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
          console.log("coils");
          console.log(err);
          retrying = true;
        });
    } catch (error) {
      retrying = true;
      console.log(error);
    }
  }, 200);
}

// Connection ended
socket.on("end", async () => {
  retrying = true;
  console.log("Connection ended");
});

// Prevent app to close when error occured
process.on("uncaughtException", (err) => {
  retrying = true;
});

socket.connect(options);

server.listen(3000, () => {
  console.log("listening on *:3000");
});
initial();
connect();
