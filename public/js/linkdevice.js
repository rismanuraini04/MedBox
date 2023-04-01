const boxidform = document.getElementById("boxid");
const braceletidform = document.getElementById("braceletid");
const nameform = document.getElementById("name");
const btn = document.getElementById("btn");

btn.addEventListener("click", async (e) => {
  e.preventDefault();
  const boxidValue = boxidform.value;
  const braceletValue = braceletidform.value;
  const nameValue = nameform.value;

  const resp = await httpRequest({
    url: "/api/v1/smartmedicine/link-to-device",
    method: "POST",
    body: {
      name: nameValue,
      smartboxid: boxidValue,
      smartbraceletid: braceletValue,
    },
  });

  if (resp.success === true) {
    window.location = "/";
  }

  console.log(resp);
});
