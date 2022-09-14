const twilio = require('twilio');

const sendOTP = async (phone, OTP) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  const client = twilio(accountSid, authToken);

  const message = await client.messages.create({
    body: `${OTP} is the OTP to reset password.`,
    from: '+15342482811',
    to: `+91${phone}`,
  });

  return message;
};

module.exports = sendOTP;
