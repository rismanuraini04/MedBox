

// Put your controller code here
exports.login = (req, res) => {
    const data = {
        styles: ["/style/login.css"],
        scripts: [],
        layout: "layout/auth",
    };
    res.render("login", data);
}; 

exports.register = (req, res) => {
    const data = {
        styles: ["/style/signup.css"],
        scripts: [],
        layout: "layout/auth",
    };
    res.render("register", data);
};

exports.linkDevice = (req, res) => {
    const data = {
        styles: ["/style/page3.css"],
        scripts: [],
        title: "Medicine Box",
    };
    res.render("page3", data);
};

exports.dashboard = (req, res) => {
    const data = {
        styles: ["/style/page4.css"],
        scripts: [],
    };
    res.render("page4", data);
}

exports.pageOptions = (req, res) => {
    const id = req.params.id
    const data = {
        styles: ["/style/page5.css"],
        scripts: [],
        title: `Box ${id} options`,
    };
    res.render("page5", data);
}

exports.scheduleReminder = (req, res) => {
    const data = {
        styles: ["/style/page8.css", "/style/page6.css"],
        scripts: [],
        title: "Box 1 Schedule Reminder",
    };
    res.render("page6", data);
}

exports.profile = (req, res) => {
    const data = {
        styles: ["/style/page2.css"],
        scripts: [],
        layout: "layout/profile",
    };
    res.render("page2", data);
};

exports.history = (req, res) => {
    const data = {
        styles: ["/style/page12.css"],
        scripts: [],
        title: "Box 1 History",
    };
    res.render("page12", data);
}