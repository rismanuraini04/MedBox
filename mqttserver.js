const mqtt = require("mqtt");

class MqttServer {
    static client;
    static clientConnect;

    constructor() {
        console.log("Starting MQTT Connection");
        MqttServer.createConnection();
        this.connected = false;
        this.client;
    }

    static getInstance() {
        if (!MqttServer.client) {
            console.log("Not instance");
            this.connectPromise = new Promise((resolve) => {
                MqttServer.client = new MqttServer();
                resolve();
            });
        }
        console.log("Client", MqttServer.client);
        return MqttServer.client;
    }

    static async createConnection() {
        this.connected = false;
        this.connectPromise = new Promise((resolve) => {
            this.client = mqtt.connect(
                `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`,
                {
                    clean: true,
                    connectTimeout: 4000,
                    username: process.env.MQTT_USERNAME,
                    password: process.env.MQTT_PASSWORD,
                    reconnectPeriod: 1000,
                }
            );

            this.client.on("connect", () => {
                console.log(`👾 Success to connect mqtt server `);
                this.connected = true;
                MqttServer.client = this.client;
                MqttServer.clientConnect = true;
                resolve();
            });
        });
    }

    static async topiclistener(route, fn) {
        await this.connectPromise;
        try {
            if (await !this.clientConnect)
                throw "Connection to server not established yet";

            const client = this.client;
            const response = {
                send: function (topic, payload) {
                    client.publish(
                        topic,
                        payload,
                        // { qos: 0, retain: false },
                        (error) => {
                            if (error) {
                                console.error(error);
                            }
                        }
                    );
                },
            };

            this.client.subscribe(route, () => {
                console.log(`Subscribe to topic '${route}'`);
            });

            this.client.on("message", function (topic, message) {
                if (topic === route) {
                    fn(message.toString(), response);
                }
            });
        } catch (error) {
            console.log(error);
            return {
                susccess: false,
                message: error,
            };
        }
    }

    static async response(topic, payload) {
        try {
            if (!MqttServer.clientConnect)
                throw "Connection to server not established yet";
            await MqttServer.client.publish(
                topic,
                payload,
                { qos: 1, retain: false },
                (error) => {
                    if (error) {
                        console.error(error);
                    }
                }
            );
        } catch (error) {
            console.log(error);
        }
    }
}

class MqttTopic {}

module.exports = { MqttServer };
