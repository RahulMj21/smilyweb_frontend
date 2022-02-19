const showConcentScreen = () => {
  const url = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
    redirect_uri: process.env.NEXT_PUBLIC_CALLBACK_URL as string,
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options);

  return `${url}?${qs.toString()}`;
};

export default showConcentScreen;
