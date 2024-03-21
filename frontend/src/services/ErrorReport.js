import ApiUrl from "../ApiUrl";

export async function ErrorReport(error, uid) {
  error = error.toString();
  console.log("received error", error);
  fetch(
    `https://canary.discord.com/api/webhooks/1216838788211408927/ty1KJ8mVXzIpOUntK71i4_PobRbCkxnwQf0Iedgf4OVC4qNwHH8b643yOpdEcCWoqDiD`,
    {
      method: "POST",
      body: JSON.stringify({
        content: error,
        username: "Ananas Reporter",
        avatar_url:
          "https://i.seadn.io/gcs/files/f0d501cb75b56715e4f3e604765ebbe6.png?auto=format&dpr=1&w=1400&fr=1",
      }),
      headers: {
        "Content-type": "application/json",
      },
    }
  ).catch((err) => {
    console.log("ErrorReport", err.message);
  });
  fetch(`${ApiUrl}/api/error`, {
    method: "POST",
    body: JSON.stringify({
      uid,
      error,
    }),
    headers: {
      "Content-type": "application/json",
    },
  }).catch((err) => {
    console.log("ErrorReport", err.message);
  });
}
