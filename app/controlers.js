const { getUser } = require("../services/auth");
const prisma = require("../prisma/client");

// Put your controller code here
exports.login = (req, res) => {
    const data = {
        styles: ["/style/login.css"],
        scripts: ["/js/login.js"],
        layout: "layout/auth",
    };
    res.render("login", data);
};

module.exports.logout = async (req, res) => {
    // Ketika user logout hapus subscription terhadap push notificiation
    // Ambil cookie identifier
    const identifier = req.cookies?.Identifier;
    // Hapus data di DB berdasarkan identifier
    try {
        await prisma.subscription.delete({ where: { identifier } });
    } catch (error) {}
    res.cookie("Authorization", "", { maxAge: 1 });
    res.redirect("/login");
};

exports.register = (req, res) => {
    const data = {
        styles: ["/style/signup.css"],
        scripts: ["/js/register.js"],
        layout: "layout/auth",
    };
    res.render("register", data);
};

exports.linkDevice = (req, res) => {
    const data = {
        styles: ["/style/page3.css"],
        scripts: ["/js/linkdevice.js"],
        title: "Medicine Box",
    };
    res.render("page3", data);
};

exports.dashboard = async (req, res) => {
    const data = {
        styles: ["/style/page4.css"],
        scripts: ["/js/page4.js"],
    };
    res.render("page4", data);
};

exports.pageOptions = async (req, res) => {
    const id = req.params.id;
    const { name } = await prisma.sensorBox.findUnique({
        where: {
            id,
        },
        select: {
            name: true,
        },
    });
    const data = {
        styles: ["/style/page5.css"],
        scripts: [],
        title: `${name} Options`,
        id: id,
    };
    res.render("page5", data);
};

exports.scheduleReminder = async (req, res) => {
    const id = req.params.id;
    const { name } = await prisma.sensorBox.findUnique({
        where: {
            id,
        },
        select: {
            name: true,
        },
    });
    const data = {
        styles: ["/style/page8.css", "/style/page6.css"],
        scripts: ["/js/page6.js"],
        title: `${name} Schedule Reminder`,
    };
    res.render("page6", data);
};

exports.profile = (req, res) => {
    const data = {
        styles: ["/style/page2.css"],
        scripts: ["/js/profile.js"],
        layout: "layout/profile",
    };
    res.render("page2", data);
};

exports.history = (req, res) => {
    const id = req.params.id;
    const data = {
        styles: ["/style/page12.css"],
        scripts: [],
        title: `Box ${id} History`,
    };
    res.render("page12", data);
};
