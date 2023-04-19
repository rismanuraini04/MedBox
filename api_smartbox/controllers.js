const prisma = require("../prisma/client");
const { resSuccess, resError } = require("../services/responseHandler");
const alarm = require("alarm");
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
        const sensorBoxID = req.body.sensorBoxID;
        const {
            startDate,
            finishDate,
            interval,
            times,
            reminder_type,
            reminder_before,
            reminder_after,
        } = req.body;

        const sensorBox = await prisma.sensorBox.findUnique({
            where: { id: sensorBoxID },
        });

        // const reminder = await prisma.reminder.createMany({
        //     data: [
        //         {
        //             sensorBoxId: sensorBoxID,
        //             startDate: new Date(),
        //             finishDate: new Date(),
        //             interval: "0",
        //             time: "10:20",
        //             reminder_type: "X_TIME_DAY",
        //             reminder_before: "5",
        //             reminder_after: "5",
        //             reminder_status: true,
        //         },
        //     ],
        // });

        // Buat Alarm Selama Hari Yang Di atur
        for (
            // looping seluruh hari dari awal hingga akhir
            let day = new Date(startDate);
            day <= new Date(finishDate);
            day.setDate(day.getDate() + 1)
        ) {
            // Lopping semua data yang diberikan (terdapat 4 datanantinya)
            times.forEach((time) => {
                const schedule = new Date(
                    day.getFullYear(),
                    day.getMonth(),
                    day.getDate(),
                    time.split(":")[0],
                    time.split(":")[1],
                    0,
                    0
                );
                console.log(schedule);
                alarm(schedule, function () {
                    console.log("Notification goes here");
                });
            });
        }

        return resSuccess({ res, title: "Sukses membuat timer" });
    } catch (error) {
        console.log(error);
        return resError({ res });
    }
};
