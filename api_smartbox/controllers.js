const prisma = require("../prisma/client");
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
