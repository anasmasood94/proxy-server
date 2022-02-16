const express = require("express");
const net = require("net");
const cors = require("cors");
const server = net.createServer();
const mongoose = require("mongoose");
const User = require("./schemas/UserSchema");

const app = express();

app.use(cors());

server.on("connection", async (clientToProxySocket) => {
  console.log("Client connected to proxy");

  console.log("addresses:", server.address(), clientToProxySocket.address());

  const email = clientToProxySocket
    .address()
    .address.slice(
      server.address().address.indexOf("email:"),
      server.address().address.indexOf("password") + 1
    );

  const password = clientToProxySocket
    .address()
    .address.slice(server.address().address.indexOf("password"), -1);

  const data = await User.findOne({
    email: email,
    password: password,
  });

  if (true) {
    clientToProxySocket.once("data", (data) => {
      let isTLSConnection = data.toString().indexOf("CONNECT") !== -1;

      console.log("data is", data.toString());

      let serverPort = 80;
      let serverAddress;

      if (isTLSConnection) {
        serverPort = 443;
        serverAddress = data
          .toString()
          .split("CONNECT")[1]
          .split(" ")[1]
          .split(":")[0];
      } else {
        serverAddress = data.toString().split("Host:")[1].split("\r\n")[0];
      }

      // Creating a connection from proxy to destination server
      let proxyToServerSocket = net.createConnection(
        {
          host: serverAddress,
          port: serverPort,
        },
        () => {}
      );

      if (isTLSConnection) {
        clientToProxySocket.write("HTTP/1.1 200 OK\r\n\r\n");
      } else {
        proxyToServerSocket.write(data);
      }

      clientToProxySocket.pipe(proxyToServerSocket);
      proxyToServerSocket.pipe(clientToProxySocket);

      proxyToServerSocket.on("error", (err) => {
        console.log("Proxy to server error", err);
      });
    });
  }
});

mongoose.connect(
  "mongodb+srv://ibad:flourida123@cluster0.02mci.mongodb.net/forward-proxy?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

server.listen(process.env.PORT || 8080);
