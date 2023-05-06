if (process.env.NODE_ENV !== "PRODUCTION") require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const hbs = require("hbs");
const { MqttServer } = require("./mqttserver");
const webpush = require("web-push");
const app = express();

MqttServer.createConnection();
MqttServer.topiclistener("msg", (data, feedback) => {
    console.log(`Menerima sebuah data ${data}`);
    feedback.send("msg-feed", "Feedback diberikan");
});
MqttServer.topiclistener("msg-feed", (data, _) => {
    console.log(data);
});
MqttServer.topiclistener("reminder-A9Cac", (data, _) => {
    console.log(data);
});

const PORT = process.env.PORT || 8080;
const PUBLIC_VAPI_KEY = process.env.PUBLIC_VAPI_KEY;
const PRIVATE_VAPI_KEY = process.env.PRIVATE_VAPI_KEY;
const ROUTER = require("./router");

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
app.use("/", ROUTER);

app.listen(PORT, () => {
    console.log(`🚀 SERVER RUNNING IN PORT ${PORT}`);
});
