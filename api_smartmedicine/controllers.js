const { getUser } = require("../services/auth");
const prisma = require("../prisma/client");
const { resError, resSuccess } = require("../services/responseHandler");
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

exports.detail = async (req, res) => {
    try {
        const data = await prisma.smartMedicine.findUnique({
            where: {
                userId: await getUser(req),
            },
            select: {
                smartBox: {
                    select: {
                        sensorBox: true,
                    },
                },
                smartBracelet: {
                    select: {
                        temperature: true,
                    },
                },
            },
        });
        return resSuccess({ res, title: "Sukses mendapatkan detail", data });
    } catch (error) {
        return resError({ res });
    }
};
