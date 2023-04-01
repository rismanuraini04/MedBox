const { getUser } = require("../services/auth");
const prisma = require("../prisma/client");

exports.linkToDevice = async (req, res) => {
  try {
    const nameInput = req.body.name;
    const smartboxid = req.body.smartboxid;
    const smartbraceletid = req.body.smartbraceletid;
    const userId = await getUser(req);
    const smartmedicine = await prisma.smartMedicine.create({
      data: {
        name: nameInput,
        userId: userId,
        smartBox: {
          connect: {
            uniqCode: smartboxid,
          },
        },
        smartBracelet: {
          connect: {
            uniqCode: smartbraceletid,
          },
        },
      },
    });
    return res.status(200).json({ data: smartmedicine, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
