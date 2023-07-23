const prisma = require("../prisma/client");
const webpush = require("web-push");
const { sendWhatsappNotification } = require("../services/notification");
const TEMPRATURE_RULE_1 = 38; //Jika lebih dari 38 beri reminder untuk minum obat
const TEMPRATURE_RULE_2 = 41; //Jika lebih dari 41 beri notifikasi untuk pergi ke dokter
const HISTORY_INTERVAL = 10;

exports.generateId = async (req, res) => {
    try {
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        function generateString(length) {
            let result = "";
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(
                    Math.floor(Math.random() * charactersLength)
                );
            }

            return result;
        }

        const braceletid = generateString(5);
        const bracelet = await prisma.smartBracelet.create({
            data: {
                uniqCode: braceletid,
                temperature: "0",
            },
            select: {
                id: true,
                uniqCode: true,
            },
        });
        return res.status(200).json({ bracelet });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
};

exports.updateTemprature = async (data, feedback) => {
    const body = JSON.parse(data);
    feedback.socket.emit(`/temp/${body.id}`, body.temp);
    try {
        const bracelet = await prisma.smartBracelet.update({
            where: {
                uniqCode: body.id,
            },
            data: {
                temperature: body.temp,
            },
            select: {
                SmartMedicine: {
                    select: {
                        User: {
                            select: {
                                id: true,
                            },
                        },
                    },
                },
            },
        });

        // INFO: Temp History
        const lastTempHistory = await prisma.bodyTemperatureHistory.findFirst({
            where: {
                SmartBracelet: {
                    is: {
                        uniqCode: body.id,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Jika Belum Ada Data Yang tersimpan di history, maka simpan
        if (lastTempHistory === null) {
            console.log("History empty, Saving First Data");
            await prisma.bodyTemperatureHistory.create({
                data: {
                    temperature: body.temp,
                    SmartBracelet: {
                        connect: {
                            uniqCode: body.id,
                        },
                    },
                },
            });
        }

        if (lastTempHistory !== null) {
            const timeDiffInMinutes =
                (Date.now() - lastTempHistory.createdAt) / 1000 / 60;
            console.log(timeDiffInMinutes);

            // Save New DB
            if (timeDiffInMinutes > HISTORY_INTERVAL) {
                await prisma.bodyTemperatureHistory.create({
                    data: {
                        temperature: body.temp,
                        SmartBracelet: {
                            connect: {
                                uniqCode: body.id,
                            },
                        },
                    },
                });
            }
        }

        // INFO: Notification
        let notificiationData = {};
        let showNotif = false;
        const userId = bracelet.SmartMedicine.User.id;
        if (body.temp >= TEMPRATURE_RULE_1 && body.temp < TEMPRATURE_RULE_2) {
            showNotif = true;
            notificiationData["title"] = "Body temperature warning";
            notificiationData["body"] =
                "Are you feel sick! Your body temperature is high. Take immediate action to cool down and consider taking appropriate medication. Prioritize your health and well-being.";
        }

        if (body.temp > TEMPRATURE_RULE_2) {
            showNotif = true;
            notificiationData["title"] = "Body temperature warning";
            notificiationData["body"] =
                "Are you feel sick! Your body temperature is high. It is strongly advised to consult a doctor promptly for a through evaluation and appropriate medical guidance";
        }

        console.log("SHOW NOTIF STATUS: ", showNotif);
        if (showNotif) {
            console.log("Should Be Show Tempartue Notification");
            const payload = JSON.stringify(notificiationData);
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    phone: true,
                    subscription: {
                        select: {
                            subscriptionExpiredAt: true,
                            identifier: true,
                            subscriptionToken: true,
                        },
                    },
                },
            });

            user.subscription.forEach(async (subs) => {
                // Hanya user yang masih login yang bisa menerima notifikasi
                if (new Date() < new Date(subs.subscriptionExpiredAt)) {
                    const subscription = JSON.parse(subs.subscriptionToken);
                    console.log("Notification Wes Send");
                    webpush
                        .sendNotification(subscription, payload)
                        .catch((err) => console.error(`ERR: ${err}`));
                } else {
                    // Jika Token Sudah Kadaluarsa maka hapus dari database
                    console.log("User Subscription Expired");
                    await prisma.subscription.delete({
                        where: { identifier: subs.identifier },
                    });
                }
            });

            if (user?.phone) {
                console.log("Try To Send WA Notificaton");
                sendWhatsappNotification({
                    url: "https://api.fonnte.com/send",
                    body: {
                        target: user.phone,
                        message: `${notificiationData["title"]}\n\n${notificiationData["body"]}`,
                    },
                });
            }
        }

        console.log("Success Update Temprature");
    } catch (error) {
        console.log(error);
    }
};
