const usernameForm = document.getElementById("username");
const passwordForm = document.getElementById("password");
const btn = document.getElementById("btn");

btn.addEventListener("click", async (e) => {
  e.preventDefault();
  const usernameValue = usernameForm.value;
  const passwordValue = passwordForm.value;

  const resp = await httpRequest({
    url: "/api/v1/user/login",
    method: "POST",
    body: { username: usernameValue, password: passwordValue },
  });

  if (resp.success === true) {
    return (window.location = "/");
  }

  if (resp.success !== true) {
    let errorDescription;
    if (resp.errors?.username) {
      errorDescription = resp.errors?.username?.detail;
    }
    if (resp.errors?.password) {
      errorDescription = resp.errors?.password?.detail;
    }
    Swal.fire(resp.message, errorDescription, "error");
  }
});
