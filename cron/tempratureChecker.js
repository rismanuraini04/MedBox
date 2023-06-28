const prisma = require("../prisma/client");
const webpush = require("web-push");
const { sendWhatsappNotification } = require("../services/notification");

const checkTime = async () => {
  const threeDaysBefore = new Date();
  threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);
  const threeDaysBeforeObj = new Date(
    threeDaysBefore.toISOString().split("T")[0]
  );

  const allUserBracelet = await prisma.smartBracelet.findMany({
    select: {
      id: true,
      uniqCode: true,
      SmartMedicine: {
        select: {
          userId: true,
        },
      },
    },
  });

  allUserBracelet.forEach(async (bracelet) => {
    const data = await prisma.bodyTemperatureHistory.findMany({
      where: {
        SmartBracelet: {
          is: {
            uniqCode: bracelet.uniqCode,
          },
        },
        createdAt: {
          gte: threeDaysBeforeObj,
        },
      },
    });
    const userId = bracelet?.SmartMedicine?.userId;
    const tempSum = data.reduce((a, b) => a + Number(b.temperature), 0);
    const tempLen = data.length;
    if (userId) {
      let tempAvg;
      if (tempLen > 0) {
        tempAvg = tempSum / tempLen;
      }

      if (tempAvg >= 41) {
        const payload = JSON.stringify({
          title: "Body temperature warning",
          body: "Are you feel sick! Your body temperature is high in 3 day. It is strongly advised to consult a doctor promptly for a thorough evaluation and appropriate medical guidance",
        });

        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            username: true,
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

        console.log(`NOTIFIKASI DIKIRIM KE USER ${user.username}`);

        user.subscription.forEach(async (subs) => {
          // Hanya user yang masih login yang bisa menerima notifikasi
          if (new Date() < new Date(subs.subscriptionExpiredAt)) {
            const subscription = JSON.parse(subs.subscriptionToken);
            webpush
              .sendNotification(subscription, payload)
              .catch((err) => console.error(`ERR: ${err}`));
          } else {
            // Jika Token Sudah Kadaluarsa maka hapus dari database
            await prisma.subscription.delete({
              where: { identifier: subs.identifier },
            });
          }
        });

        // WA NOTIFIKASI
        if (user?.phone) {
          sendWhatsappNotification({
            url: "https://api.fonnte.com/send",
            body: {
              target: user.phone,
              message:
                "Body temperature warning!\nAre you feel sick! Your body temperature is high in 3 day. It is strongly advised to consult a doctor promptly for a thorough evaluation and appropriate medical guidance",
            },
          });
        }
      }
    }
  });
};

module.exports = { checkTime };
