if (process.env.NODE_ENV !== "PRODUCTION") require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const hbs = require("hbs");
const { MqttServer } = require("./mqttserver");
const nodeCron = require("./cron/cronWrapper");
const webpush = require("web-push");
const app = express();
const ROUTER = require("./router");
const http = require("http").Server(app);
const io = require("socket.io")(http);

MqttServer.createConnection();
MqttServer.setSocket(io);
MqttServer.use(ROUTER.mqttTopic);

io.on("connection", (socket) => {
    console.log("A client connected 🚀");
});

nodeCron;

const PORT = process.env.PORT || 8080;
const PUBLIC_VAPI_KEY = process.env.PUBLIC_VAPI_KEY;
const PRIVATE_VAPI_KEY = process.env.PRIVATE_VAPI_KEY;

webpush.setVapidDetails(
    "mailto:dimasauliafachrudin@gmail.com",
    PUBLIC_VAPI_KEY,
    PRIVATE_VAPI_KEY
);

app.mqttpublish = MqttServer.response;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.engine("hbs", hbs.__express);
app.set("views", "views");
app.set("view engine", "hbs");
app.set("view options", { layout: "layout/base" });
app.use(express.static("public"));
app.use("/static", express.static("public"));
app.use("/", ROUTER.router);

http.listen(PORT, () => {
    console.log(`🚀 SERVER RUNNING IN PORT ${PORT}`);
});
