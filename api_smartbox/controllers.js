const prisma = require("../prisma/client");
const { resSuccess, resError } = require("../services/responseHandler");
const webpush = require("web-push");
const Scheduler = require("../services/scheduler");
const ITEM_LIMIT = 20;
const WEIGHT_LIMIT = 8;
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
              name: "Box 1",
              weight: 0,
            },
            {
              name: "Box 2",
              weight: 0,
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
          const taskId = Scheduler.setTask(schedule, async function () {
            const sensorBox = await prisma.sensorBox.findUnique({
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
            });
            await req.app.mqttpublish(
              `reminder-${sensorBox.SmartBox.uniqCode}`,
              "[MQTT]: Jangan Lupa Minum Obat"
            ); // publish data for mqtt
            console.log(`Mqtt set reminder-${sensorBox.SmartBox.uniqCode}`);
            const payload = JSON.stringify({
              title: "Medication Reminder",
              body: "Don't forget to take your medication on time. Stay on top of your health and wellness by following your prescribed regimen.",
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
          });
          // Jika Tanggal Terakhir dan waktu terakhir, update status reminder menjadi false
          if (
            i === times.length - 1 &&
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
          const taskId = Scheduler.setTask(schedule, async function () {
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
          });
          // Jika Tanggal Terakhir dan waktu terakhir, update status reminder menjadi false
          if (
            i === times.length - 1 &&
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

exports.medicineHistory = async (req, res) => {
  try {
    const { cursor, sensorBoxId } = req.query;
    let history;

    if (!cursor) {
      history = await prisma.medicineHistory.findMany({
        where: {
          SensorBox: {
            id: sensorBoxId,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: ITEM_LIMIT,
      });
    }

    if (cursor) {
      history = await prisma.medicineHistory.findMany({
        where: {
          SensorBox: {
            id: sensorBoxId,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: ITEM_LIMIT,
        skip: 1,
        cursor: {
          id: cursor,
        },
      });
    }

    return resSuccess({
      res,
      title: "Success get history list",
      data: history,
    });
  } catch (error) {
    return resError({ res, title: "Failed to get medicine history" });
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
            SmartBox: {
              select: {
                SmartMedicine: {
                  select: {
                    userId: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Give User Notification If Weight less then the limit
    if (body["Box 1"] < WEIGHT_LIMIT || body["Box 2"] < WEIGHT_LIMIT) {
      const userId = smartBox.sensorBox[0].SmartBox.SmartMedicine.userId;
      const payload = JSON.stringify({
        title: "Low Medicene Stock",
        body: "Low on medicine? Time to refill! Your stock is running low, don't forget to restock soon.",
      });
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
    }

    // Update Sensor Box Data
    const sensorBox = smartBox.sensorBox.forEach(async (box, no) => {
      await prisma.sensorBox.update({
        where: {
          id: box.id,
        },
        data: {
          weight: body[`Box ${no + 1}`],
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
    const smartBox = await prisma.smartBox.findFirst({
      where: {
        uniqCode: body.id,
      },
      select: {
        id: true,
        sensorBox: {
          where: {
            name: body.box,
          },
          select: {
            id: true,
            name: true,
            reminder: {
              where: {
                reminder_status: true,
              },
              orderBy: {
                createdAt: "desc",
              },
              select: {
                id: true,
                time: true,
                name: true,
              },
            },
          },
        },
      },
    });
    if (smartBox == null) {
      console.log("Cant Find Active Reminder");
      return;
    }
    const lastReminder = smartBox.sensorBox[0].reminder.at(0);
    // Lakukan Looping Setiap Schedulnya
    const reminderArray = lastReminder.time.split(",");
    // let i = 1;
    reminderArray.forEach(async (time, i) => {
      i += 1;
      console.log(`----------------${i}----------------`);
      const timeLimit = new Date(time); //15
      const nextTimeLimit = new Date(reminderArray[i + 1]);
      const before1Minutes = new Date(
        timeLimit.getTime() - 1 * 60000
      ).valueOf(); //60
      const after120Minutes = new Date(
        timeLimit.getTime() + 120 * 60000
      ).valueOf(); //120
      const after150Minutes = new Date(
        timeLimit.getTime() + 150 * 60000
      ).valueOf(); //120
      const before1MinutesOfNextTimeLimit = new Date(
        nextTimeLimit.getTime() - 1 * 60000
      ).valueOf(); //120
      let timeMatch = false;

      // Lakukan Pengecekan Apakah Ketika User Mengambil Obat Masih Dalam Jangkauan waktu Yang Ditentukan
      // TEPAT WAKTU JIKA: Obat diambil 60 menit sebelum atau 120 menit sesudah jadwal
      // console.log(before60Minutes, userTakeMedicineOn, after120Minutes);
      // console.log(userTakeMedicineOn, after120Minutes, timeLimit);
      if (
        userTakeMedicineOn >= before1Minutes &&
        userTakeMedicineOn < after120Minutes
      ) {
        console.log(`JADWAL ${i}: TEPAT WAKTU`);
        timeMatch = true;
        await prisma.medicineHistory.create({
          data: {
            schedule: `SCHEDULE ${i}@${lastReminder.name}`,
            status: "ONTIME",
            SensorBox: {
              connect: {
                id: smartBox.sensorBox[0].id,
              },
            },
          },
        });
      }

      // TERLAMBAT JIKA: Obat diambil lebih dari 120 menit setelah jadwal
      if (
        userTakeMedicineOn >= after120Minutes &&
        userTakeMedicineOn < before1MinutesOfNextTimeLimit
      ) {
        console.log(`JADWAL ${i}: TERLAMBAT`);
        timeMatch = true;
        await prisma.medicineHistory.create({
          data: {
            schedule: `SCHEDULE ${i}@${lastReminder.name}`,
            status: "LATE",
            SensorBox: {
              connect: {
                id: smartBox.sensorBox[0].id,
              },
            },
          },
        });

        // Lakukan Pengecekan Apakah User Sebelumnya Sudah Melakukan Pengambilan Obat
        // const prevReminder = await prisma.medicineHistory.findMany({
        //     where: {
        //         sensorBoxId: smartBox.sensorBox[0].id,
        //     },
        // });
        // console.log(prevReminder);
        // Ambil data terakhir yang tersimpan di database

        // Jika Belum Melakukan Pengambilan Maka User Dihitung Terlambat

        // Jika Sudah, Maka Tidak ada aksi lanjutan
      }

      // SELAIN DUA KRITERIA TERSEBUT DATA TIDAK AKAN DICATAT
      if (!timeMatch) {
        console.log(`JADWAL ${i}: TIDAK MASUK KATEGORI WAKTU`);
      }
      // i = i + 1;
    });
  } catch (error) {
    console.log(error);
  }
};
