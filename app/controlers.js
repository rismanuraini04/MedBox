// Put your controller code here
exports.login = (req, res) => {
    const data = {
        styles: ["/style/login.css"],
        scripts: [],
        layout: "layout/auth",
    };
    res.render("login", data);
};

exports.linkDevice = (req, res) => {
    const data = {
        styles: ["/style/page3.css"],
        scripts: [],
    };
    res.render("page3", data);
};
