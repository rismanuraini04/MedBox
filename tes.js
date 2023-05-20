const { MqttServer } = require("./mqttserver");
MqttServer.getInstance();
// console.log(MqttServer.client);
MqttServer.response("msg", "Call from script");
