const prisma = require("../prisma/client");
const { resSuccess, resError } = require("../services/responseHandler");
const webpush = require("web-push");
const alarm = require("alarm");
const Scheduler = require("../services/scheduler");
const { getUser } = require("../services/auth");
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

        const boxid = generateString(5);
        const box = await prisma.smartBox.create({
            data: {
                uniqCode: boxid,
                sensorBox: {
                    create: [
                        {
                            name: "sensor 1",
                        },
                        {
                            name: "sensor 2",
                        },
                    ],
                },
            },
            select: {
                id: true,
                uniqCode: true,
                sensorBox: {
                    select: { id: true, name: true },
                },
            },
        });
        return res.status(200).json({ box });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
};

exports.setSensorBoxRemider = async (req, res) => {
    try {
        const {
            name,
            startDate,
            finishDate,
            interval,
            times,
            reminder_type,
            reminder_before,
            reminder_after,
            sensorBoxID,
        } = req.body;
        const taskList = [];
        const scheduleList = [];

        const sensorBox = await prisma.sensorBox.findUnique({
            where: { id: sensorBoxID },
        });

        if (reminder_type === "X_TIME_DAY") {
            // Buat Alarm Selama Hari Yang Di atur
            for (
                // looping seluruh hari dari awal hingga akhir
                let day = new Date(startDate);
                day <= new Date(finishDate);
                day.setDate(day.getDate() + 1)
            ) {
                // Lopping semua data yang diberikan (terdapat 4 data nantinya)
                times.forEach(async (time) => {
                    const schedule = new Date(
                        day.getFullYear(),
                        day.getMonth(),
                        day.getDate(),
                        time.split(":")[0],
                        time.split(":")[1],
                        0,
                        0
                    );
                    console.log(`Schedule set at ${schedule}`);
                    const taskId = Scheduler.setTask(
                        schedule,
                        async function () {
                            const payload = JSON.stringify({
                                title: "Medication Reminder",
                            });
                            const userID = await getUser(req);
                            const user = await prisma.user.findUnique({
                                where: { id: userID },
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
                                if (
                                    new Date() <
                                    new Date(subs.subscriptionExpiredAt)
                                ) {
                                    const subscription = JSON.parse(
                                        subs.subscriptionToken
                                    );
                                    console.log("Notification Wes Send");
                                    webpush
                                        .sendNotification(subscription, payload)
                                        .catch((err) =>
                                            console.error(`ERR: ${err}`)
                                        );
                                } else {
                                    // Jika Token Sudah Kadaluarsa maka hapus dari database
                                    console.log("User Subscription Expired");
                                    await prisma.subscription.delete({
                                        where: { identifier: subs.identifier },
                                    });
                                }
                            });
                        }
                    );
                    taskList.push(taskId);
                    scheduleList.push(schedule);
                });
            }
        }

        // Save Reminder To DB
        const data = await prisma.reminder.create({
            data: {
                startDate: new Date(startDate),
                finishDate: new Date(startDate),
                interval,
                time: String(scheduleList),
                reminder_task_id: String(taskList),
                reminder_type,
                reminder_before,
                reminder_after,
                reminder_status: true,
                sensorBoxId: sensorBoxID,
            },
        });
        return resSuccess({ res, title: "Sukses membuat timer", data });
    } catch (error) {
        console.log(error);
        return resError({ res });
    }
};

exports.getSensorBoxRemider = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await prisma.reminder.findFirst({
            where: {
                sensorBoxId: id,
                reminder_status: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return resSuccess({
            res,
            title: "Success to get reminder detail",
            data: data,
        });
    } catch (error) {
        return resError({ res, title: "Failed to get reminder detail" });
    }
};
