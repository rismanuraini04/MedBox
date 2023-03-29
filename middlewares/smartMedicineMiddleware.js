const { resError } = require("../services/responseHandler");
const prisma = require("../prisma/client");
const { getUser } = require("../services/auth");

/** Fungsi yang akan memeriksa apakah pengguna sudah memiliki perangkat, hanya pengguna yang SUDAH memiliki perangkat yang diperbolehkan untuk lanjut hingga proses akhir */
const isUserHaveDevice = async (req, res, next) => {
    try {
        const device = await prisma.smartMedicine.findUnique({
            where: {
                userId: await getUser(req),
            },
        });
        if (!device) throw "User not have device";
        return next();
    } catch (error) {
        return res.redirect("/link-device");
    }
};

/** Fungsi yang akan memeriksa apakah pengguna sudah memiliki perangkat, hanya pengguna yang BELUM memiliki perangkat yang diperbolehkan untuk lanjut hingga proses akhir */
const isUserNOTHaveDevice = async (req, res, next) => {
    try {
        const device = await prisma.smartMedicine.findUnique({
            where: {
                userId: await getUser(req),
            },
        });
        if (device) throw "User not have device";
        return next();
    } catch (error) {
        return res.redirect("/");
    }
};

module.exports = {
    isUserHaveDevice,
    isUserNOTHaveDevice,
};
