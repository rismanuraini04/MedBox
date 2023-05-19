const prisma = require("../prisma/client");
const webpush = require("web-push");
const TEMPRATURE_RULE_1 = 38; //Jika lebih dari 38 beri reminder untuk minum obat
const TEMPRATURE_RULE_2 = 41; //Jika lebih dari 41 beri notifikasi untuk pergi ke dokter

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

        let notificiationData = {};
        const userId = bracelet.SmartMedicine.User.id;
        if (body.temp >= TEMPRATURE_RULE_1 && body.temp < TEMPRATURE_RULE_2) {
            notificiationData["title"] = "Body temperature warning";
            notificiationData["body"] =
                "Are you feel sick! Your body temperature is high. Take immediate action to cool down and consider taking appropriate medication. Prioritize your health and well-being.";
        }

        if (body.temp > TEMPRATURE_RULE_2) {
            notificiationData["title"] = "Body temperature warning";
            notificiationData["body"] =
                "Are you feel sick! Your body temperature is high. It is strongly advised to consult a doctor promptly for a thorough evaluation and appropriate medical guidance";
        }

        const payload = JSON.stringify(notificiationData);
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
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

        console.log("Success Update Temprature");
    } catch (error) {
        console.log(error);
    }
};
