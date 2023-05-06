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
        await prisma.smartBracelet.update({
            where: {
                uniqCode: body.id,
            },
            data: {
                temperature: body.temp,
            },
        });
        console.log("Success Update Temprature");
    } catch (error) {
        console.log(error);
    }
};
