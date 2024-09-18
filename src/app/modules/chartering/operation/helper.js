export const generateFileUrl = (fileId) => {
  return fileId
    ? `https://erp.ibos.io/domain/Document/DownlloadFile?id=${fileId}`
    : "";
};


export function getEmailInfoandSendMail(name) {
  let emailInfoUrl = "";
  let sendEmailUrl = "";

  switch (name) {
    case "VESSEL NOMINATION":
      emailInfoUrl = "/automation/vessel_nomitaion_mail_format";
      sendEmailUrl = "/automation/vessel_nomitaion_mail_sent";
      break;
    case "EDPA LOADPORT":
      emailInfoUrl = "/automation/";
      sendEmailUrl = "/automation/";
      break;
    case "PRE STOWAGE":
      emailInfoUrl = "/automation/";
      sendEmailUrl = "/automation/";
      break;
    case "ON HIRE BUNKER SURVEY":
      emailInfoUrl = "/automation/";
      sendEmailUrl = "/automation/";
      break;
    case "VOYAGE INSTRUCTION":
      emailInfoUrl = "/automation/voyage_instruction_mail_format";
      sendEmailUrl = "/automation/voyage_instruction_mail_sent";
      break;
    case "PI SURVEY":
      emailInfoUrl = "/automation/P_n_I_surveyor_mail_format";
      sendEmailUrl = "/automation/P_n_I_surveyor_mail_sent";
      break;
    case "VOYAGE LICENSE/FLAG WAIVER":
      emailInfoUrl = "/automation/";
      sendEmailUrl = "/automation/";
      break;
    case "TCL":
      emailInfoUrl = "/automation/";
      sendEmailUrl = "/automation/";
      break;
    case "WEATHER ROUTING COMPANY":
      emailInfoUrl = "/automation/";
      sendEmailUrl = "/automation/";
      break;
    case "DEPARTURE DOCUMENT LOADPORT":
      emailInfoUrl = "/automation/";
      sendEmailUrl = "/automation/";
      break;
    case "EPDA DISCHARGE PORT":
      emailInfoUrl = "/automation/";
      sendEmailUrl = "/automation/";
      break;
    case "OFFHIRE BUNKER SURVEY":
      emailInfoUrl = "/automation/";
      sendEmailUrl = "/automation/";
      break;
    default:
      emailInfoUrl = "/automation/";
      sendEmailUrl = "/automation/";
      break;
  }

  return { emailInfoUrl: emailInfoUrl, sendEmailUrl: sendEmailUrl };
}




