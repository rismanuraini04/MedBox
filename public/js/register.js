const usernameForm = document.getElementById("username");
const emailForm = document.getElementById("email");
const phoneForm = document.getElementById("phone");
const passwordForm = document.getElementById("password");
const btn = document.getElementById("button");

btn.addEventListener("click", async (e) => {
    e.preventDefault();
    const usernameValue = usernameForm.value;
    const emailValue = emailForm.value;
    const passwordValue = passwordForm.value;
    const phoneValue = phoneForm.value;

    const resp = await httpRequest({
        url: "/api/v1/user/register",
        method: "POST",
        body: {
            username: usernameValue,
            email: emailValue,
            password: passwordValue,
            phone: phoneValue,
        },
    });

    if (resp.success === true) {
        return (window.location = "/");
    }
});
