const fullNameContainer = document.getElementById("fullName");
const usernameContainer = document.getElementById("username");
const emailContainer = document.getElementById("email");
const phoneContainer = document.getElementById("phone");

const view = async () => {
    const resp = await httpRequest({
        url: "/api/v1/user/",
        method: "GET",
    });

    emailContainer.textContent = resp.data.email;
    fullNameContainer.textContent = resp.data.profil.full_name;
    usernameContainer.textContent = resp.data.username;
    phoneContainer.textContent = resp.data.phone;
};

view();
