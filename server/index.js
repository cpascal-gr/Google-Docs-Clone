const express = require("express");
const app = express();
const expressServer = require("http").createServer(app);
const io = require("socket.io")(expressServer);
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const documentRoute = require("./routes/documentRoute");

//Initial config

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT ,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(morgan("dev"));
app.use(express.json());
app.use("/api/v1/docu/", documentRoute);
//Socket Events

io.on("connection", (socket) => {
  //Connect
  console.log(`${socket.id} was connected`);

  //send data
  socket.on("send", (data) => {
    emitTo(data);
  });

  socket.on("documentRoom", (data) => {
    socket.join(data);
  });

  function emitTo(data) {
    socket.broadcast.emit("update", data);
  }

  //Disconnect
  socket.on("disconnect", () => {
    console.log(`${socket.id} was disconnected`);
  });
});

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE_LOCAL;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Datbase Connected"));

const port = process.env.port || 8000;

expressServer.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
