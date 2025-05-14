// https://github.com/getbrevo/brevo-node

const SibApiV3Sdk = require("@getbrevo/brevo");
import { env } from "~/config/environment";

/**
* You can see more configuration docs for different languages ​​depending on the project in Brevo Dashboard > Account >
SMTP & API > API Keys
* https://brevo.com
* With Nodejs, it's best to just go to their github repo for fastest results:
* https://github.com/getbrevo/brevo-node
*/

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
let apiKey = apiInstance.authentications["apiKey"];
apiKey.apiKey = env.BREVO_API_KEY;

const sendEmail = async (recipientEmail, customSubject, htmlContent) => {
  // Initial
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  // Account send email is the admin email when register
  sendSmtpEmail.sender = {
    email: env.ADMIN_EMAIL_ADDRESS,
    name: env.ADMIN_EMAIL_NAME,
  };
  // Email receiving account
  // 'to' : Array send email to many users
  sendSmtpEmail.to = [{ email: recipientEmail }];

  // Email title
  sendSmtpEmail.subject = customSubject;

  // Email content
  sendSmtpEmail.htmlContent = htmlContent;

  // Call to action send email return Promise
  return apiInstance.sendTransacEmail(sendSmtpEmail);
};

export const BrevoProvider = {
  sendEmail,
};
