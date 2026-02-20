import axios from "axios";

export const sendOtpEmail = async (to, otp) => {
  try {
    console.log("Sending email via Brevo API...");

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "CampusConnect",
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [{ email: to }],
        subject: "Verify your CampusConnect account",
        htmlContent: `<h1>Your OTP is ${otp}</h1>
                      <p>This code expires in 10 minutes.</p>`,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Brevo API success:", response.data);
  } catch (error) {
    console.error("BREVO API ERROR:", error.response?.data || error.message);
    throw new Error("Failed to send verification email");
  }
};
