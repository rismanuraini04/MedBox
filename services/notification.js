async function sendWhatsappNotification({ url, body = null, method = "POST" }) {
  let response;
  if (body) {
    response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "!KAk@q1ID#+0bbIA4hZQ",
      },
      method,
      body: JSON.stringify(body),
      redirect: "follow",
    });
  }

  if (!body) {
    response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method,
    });
  }

  const data = await response.json();
  return data;
}

module.exports = { sendWhatsappNotification };
