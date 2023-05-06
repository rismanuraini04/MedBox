const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://127.0.0.1:1883", {
    clean: true,
    connectTimeout: 4000,
    username: "dimasaulia",
    password: "t4np454nd1",
    reconnectPeriod: 1000,
});

const topic = "msg";
client.on("connect", function () {
    console.log("Connected");
});
client.subscribe([topic, "test"], () => {
    console.log(`Subscribe to topic '${topic}'`);
});

client.on("message", function (topic, message) {
    // message is Buffer
    console.log(message.toString());
});
