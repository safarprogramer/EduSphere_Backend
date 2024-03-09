import nodemailer from "nodemailer";
import config from "../config";
import httpStatus from "http-status";
import path from "path";
import ErrorHandler from "./ErrorHandler";
import ejs from "ejs";

export type TMailOptions = {
  subject: string;
  email: string;
  template: string;
  data: { [key: string]: any };
};

export type TMailInfo = {
  from: string;
  to: string | undefined;
  subject: string;
  html: string;
};

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: Number(config.smtp.port),
  auth: {
    user: config.smtp.mail,
    pass: config.smtp.password,
  },
});

const sendEmail = async (options: TMailOptions) => {
  try {
    const { email, subject, template, data } = options;
    const templatePath = path.join(__dirname, "../ejs", template);

    const html: string = await ejs.renderFile(templatePath, data);

    const mailInfo: TMailInfo = {
      from: config.smtp.mail as string,
      to: email,
      subject,
      html,
    };

    transporter.sendMail(mailInfo);
  } catch (error) {
    throw new ErrorHandler(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to send email"
    );
  }
};

export const nodemailerHelper = {
  sendEmail,
};
