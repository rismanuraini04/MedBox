const prisma = require("../prisma/client");
const { resSuccess, resError } = require("../services/responseHandler");
const webpush = require("web-push");
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
            sensorBoxID,
        } = req.body;
        const taskList = [];
        const scheduleList = [];
        const userID = await getUser(req);

        // Save Reminder To DB
        const firstSave = await prisma.reminder.create({
            data: {
                name,
                startDate: new Date(startDate),
                finishDate: new Date(startDate),
                interval,
                reminder_type,
                reminder_status: true,
                sensorBoxId: sensorBoxID,
            },
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
                times.forEach(async (time, i) => {
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
                            const sensorBox = await prisma.sensorBox.findUnique(
                                {
                                    where: {
                                        id: sensorBoxID,
                                    },
                                    select: {
                                        SmartBox: {
                                            select: {
                                                uniqCode: true,
                                            },
                                        },
                                    },
                                }
                            );
                            await req.app.mqttpublish(
                                `reminder-${sensorBox.SmartBox.uniqCode}`,
                                "[MQTT]: Jangan Lupa Minum Obat"
                            ); // publish data for mqtt
                            console.log(
                                `Mqtt set reminder-${sensorBox.SmartBox.uniqCode}`
                            );
                            const payload = JSON.stringify({
                                title: "Medication Reminder",
                            });
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
                    // Jika Tanggal Terakhir dan waktu terakhir, update status reminder menjadi false
                    if (
                        i === 3 &&
                        String(day) == String(new Date(finishDate))
                    ) {
                        const taskId = Scheduler.setTask(schedule, async () => {
                            await prisma.reminder.update({
                                where: {
                                    id: firstSave.id,
                                },
                                data: {
                                    reminder_status: false,
                                },
                            });
                        });
                        taskList.push(taskId);
                    }
                    taskList.push(taskId);
                    scheduleList.push(schedule);
                });
            }
        }

        // Save Reminder To DB
        const data = await prisma.reminder.update({
            where: {
                id: firstSave.id,
            },
            data: {
                time: String(scheduleList),
                reminder_task_id: String(taskList),
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

exports.deleteSensorBoxRemider = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await prisma.reminder.delete({ where: { id } });
        const taskList = data.reminder_task_id.split(",");

        taskList.forEach((task) => {
            Scheduler.removeTask(task);
        });
        return resSuccess({
            res,
            title: "Success to get reminder detail",
            data: data,
        });
    } catch (error) {
        return resError({
            res,
            title: "Failed to delete reminder",
            errors: error,
        });
    }
};

exports.updateSensorBoxRemider = async (req, res) => {
    try {
        const {
            name,
            startDate,
            finishDate,
            interval,
            times,
            reminder_type,
            reminderId,
        } = req.body;
        const taskList = [];
        const scheduleList = [];

        const oldData = await prisma.reminder.findUnique({
            where: { id: reminderId },
        });
        const oldtaskList = oldData.reminder_task_id.split(",");

        const reminder = await prisma.reminder.findUnique({
            where: { id: reminderId },
            select: {
                SensorBox: {
                    select: {
                        SmartBox: {
                            select: {
                                uniqCode: true,
                            },
                        },
                    },
                },
            },
        });

        oldtaskList.forEach((task) => {
            Scheduler.removeTask(task);
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

                times.forEach(async (time, i) => {
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
                            await req.app.mqttpublish(
                                `reminder-${reminder.SensorBox.SmartBox.uniqCode}`,
                                "[MQTT]: Jangan Lupa Minum Obat"
                            ); // publish data for mqtt
                            console.log(
                                `Mqtt set reminder-${reminder.SensorBox.SmartBox.uniqCode}`
                            );
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
                    // Jika Tanggal Terakhir dan waktu terakhir, update status reminder menjadi false
                    if (
                        i === 3 &&
                        String(day) == String(new Date(finishDate))
                    ) {
                        const taskId = Scheduler.setTask(schedule, async () => {
                            await prisma.reminder.update({
                                where: {
                                    id: oldData.id,
                                },
                                data: {
                                    reminder_status: false,
                                },
                            });
                        });
                        taskList.push(taskId);
                    }
                    taskList.push(taskId);
                    scheduleList.push(schedule);
                });
            }
        }

        // Save Reminder To DB
        const data = await prisma.reminder.update({
            where: {
                id: oldData.id,
            },
            data: {
                name,
                startDate: new Date(startDate),
                finishDate: new Date(startDate),
                interval,
                reminder_type,
                reminder_status: true,
                time: String(scheduleList),
                reminder_task_id: String(taskList),
            },
        });
        return resSuccess({ res, title: "Sukses memperbaharui timer", data });
    } catch (error) {
        console.log(error);
        return resError({ res });
    }
};

exports.updateMedicineWeight = async (data, payload) => {
    try {
        const body = JSON.parse(data);

        const smartBox = await prisma.smartBox.findFirstOrThrow({
            where: {
                uniqCode: body.id,
            },
            select: {
                id: true,
                sensorBox: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        const sensorBox = smartBox.sensorBox.forEach(async (box, no) => {
            await prisma.sensorBox.update({
                where: {
                    id: box.id,
                },
                data: {
                    weight: body[`box${no + 1}`],
                },
            });
        });
        console.log(`Success update smart medicine ${body.id} weight`);
    } catch (error) {
        console.log(error);
    }
};

exports.updateMedicineHistory = async (data, payload) => {
    try {
        const body = JSON.parse(data);
        const userTakeMedicineOn = new Date().valueOf();
        console.log("NOW", userTakeMedicineOn);

        // mengambil reminder paling terakhir yang dibuat
        const smartBox = await prisma.smartBox.findFirstOrThrow({
            where: {
                uniqCode: body.id,
            },
            select: {
                id: true,
                sensorBox: {
                    where: {
                        name: body.userTakeMedicineFrom,
                    },
                    select: {
                        id: true,
                        name: true,
                        reminder: {
                            select: {
                                time: true,
                            },
                        },
                    },
                },
            },
        });
        const lastReminder = smartBox.sensorBox[0].reminder.at(-1);

        // Lakukan Looping Setiap Schedulnya
        lastReminder.time.split(",").forEach((time) => {
            const timeLimit = new Date(time); //15
            const before15Minutes = new Date(
                timeLimit.getTime() - 15 * 60000
            ).valueOf(); //00
            const after15Minutes = new Date(
                timeLimit.getTime() + 15 * 60000
            ).valueOf(); //20
            const after60Minutes = new Date(
                timeLimit.getTime() + 60 * 60000
            ).valueOf();
            // console.log("DB TIME", timeLimit);
            // console.log("DB TIME AFTER 15", after15Minutes);
            let timeMatch = false;
            // console.log(timeNow, before15Minutes, after15Minutes);
            // Lakukan Pengecekan Apakah Ketika User Mengambil Obat Masih Dalam Jangkauan waktu Yang Ditentukan
            // TEPAT WAKTU JIKA: Obat diambil 15 menit sebelum atau 15 menit sesudah jadwal
            console.log(
                before15Minutes,
                userTakeMedicineOn,
                after15Minutes,
                after60Minutes
            );
            if (
                before15Minutes < userTakeMedicineOn &&
                userTakeMedicineOn < after15Minutes
            ) {
                console.log("TEPAT WAKTU", userTakeMedicineOn);
                timeMatch = true;
            }
            // TERLAMBAT JIKA: Obat diambil lebih dari 15 menit hingga satu jam setelah jadwal
            if (
                userTakeMedicineOn > after15Minutes &&
                userTakeMedicineOn < after60Minutes
            ) {
                console.log("TERLAMBAT", userTakeMedicineOn);
                timeMatch = true;
            }

            // SELAIN DUA KRITERIA TERSEBUT DATA TIDAK AKAN DICATAT
            if (!timeMatch) {
                console.log("NOT TIME MATCH");
            }
        });
    } catch (error) {
        console.log(error);
    }
};
